const fs = require('fs')
const path = require('path')

const root = process.cwd()
const outputDir = path.join(root, 'out')
const policy = JSON.parse(
  fs.readFileSync(path.join(root, 'config/publisher-content-policy.json'), 'utf8'),
)
const issues = new Set()
const siteOrigin = 'https://pokopia.cloud'

const prohibitedTextRules = [
  {
    id: 'ADS-PUB-01',
    pattern: /\b(?:promote illegal activity|pirated software|pirated download|counterfeit goods?|stolen credentials?)\b/gi,
  },
  {
    id: 'ADS-PUB-03',
    pattern: /\b(?:hate groups?|terroris(?:m|t|ts)|drug cartels?|promote suicide|self[- ]harm methods?|extortion|blackmail)\b/gi,
  },
  {
    id: 'ADS-PUB-04',
    pattern: /\b(?:animal cruelty|cockfighting|dogfighting|ivory for sale|rhino horns? for sale|shark fins? for sale)\b/gi,
  },
  {
    id: 'ADS-PUB-06',
    pattern: /\b(?:phishing|steal (?:personal information|credentials)|quick[- ]rich schemes?|get rich quick)\b/gi,
  },
  {
    id: 'ADS-PUB-07',
    pattern: /\b(?:fake (?:passports?|diplomas?|certificates?)|academic cheating|drug[- ]test evasion|keyloggers?|spyware|cracked builds?|rom hacks?|bypass (?:drm|authorization))\b/gi,
  },
  {
    id: 'ADS-PUB-08',
    pattern: /\b(?:pornography|pornographic|prostitution|paid sexual acts?|mail[- ]order brides?|sexual services?|rape|incest)\b/gi,
  },
  {
    id: 'ADS-PUB-13',
    pattern: /\b(?:election fraud|fake voting information|anti[- ]vaccine claims?|climate change denial|harmful health claims?)\b/gi,
  },
  {
    id: 'ADS-PUB-14',
    pattern: /\b(?:political deepfakes?|manipulated political media|deceptive manipulated media)\b/gi,
  },
  {
    id: 'ADS-PUB-15',
    pattern: /\b(?:child grooming|child sextortion|sexualization of minors?|child trafficking|child sexual abuse material|csam)\b/gi,
  },
  {
    id: 'ADS-PUB-16',
    pattern: /\b(?:exploit(?:ing|s)? (?:a |the )?(?:crisis|mass shooting|natural disaster)|deny(?:ing|ies)? (?:a |the )?(?:crisis|mass shooting|natural disaster))\b/gi,
  },
]

function collectHtmlFiles(directory) {
  const files = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...collectHtmlFiles(file))
    if (entry.isFile() && entry.name.endsWith('.html') && entry.name !== 'og-image-template.html') files.push(file)
  }
  return files
}

function routeForFile(file) {
  const relative = path.relative(outputDir, file).split(path.sep).join('/')
  if (relative === 'index.html') return '/'
  if (relative === '404.html') return '/404.html'
  return `/${relative.replace(/\/index\.html$/, '')}`
}

function visibleText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:nbsp|amp|quot|#39|apos);/g, ' ')
    .replace(/\s+/g, ' ')
}

function isExplicitlyProhibitiveContext(text, index) {
  const before = text.slice(Math.max(0, index - 100), index).toLowerCase()
  return /(?:\bno\b|\bnot\b|\bnever\b|\bwithout\b|\bprohibit(?:ed|s)?\b|\bavoid\b|\bdoes not\b|\bdo not\b)[^.!?]{0,90}$/.test(before)
}

function decodeHref(value) {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
}

if (!fs.existsSync(outputDir)) {
  console.error('Publisher content policy check failed: out directory does not exist. Run next build first.')
  process.exit(1)
}

if (
  policy.user_generated_content_enabled !== false ||
  policy.account_registration_enabled !== false ||
  policy.commerce_enabled !== false ||
  policy.software_downloads_enabled !== false
) {
  issues.add('the current readiness profile only permits a static information site without UGC, accounts, commerce, or downloads')
}

const permittedHosts = new Set(policy.permitted_external_hosts)
const legalContextRoutes = new Set(policy.legal_context_routes)
const htmlFiles = collectHtmlFiles(outputDir)

for (const file of htmlFiles) {
  const relative = path.relative(root, file)
  const route = routeForFile(file)
  const html = fs.readFileSync(file, 'utf8')
  const text = visibleText(html)

  if (!legalContextRoutes.has(route)) {
    for (const rule of prohibitedTextRules) {
      rule.pattern.lastIndex = 0
      let match
      while ((match = rule.pattern.exec(text))) {
        if (!isExplicitlyProhibitiveContext(text, match.index)) {
          issues.add(`${rule.id}: ${relative} requires manual review for phrase "${match[0]}"`)
        }
      }
    }
  }

  for (const match of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)) {
    const href = decodeHref(match[1].trim())
    if (!href || href.startsWith('#') || /^(?:mailto|tel):/i.test(href)) continue
    let url
    try {
      url = new URL(href, siteOrigin)
    } catch {
      issues.add(`${relative} contains an invalid link: ${href}`)
      continue
    }
    if (url.origin !== siteOrigin && !permittedHosts.has(url.hostname)) {
      issues.add(`${relative} links to an unreviewed external host: ${url.hostname}`)
    }
    if (/(?:^|[?&])(?:aff|affiliate|ref|tag|clickid|gclid)=/i.test(url.search)) {
      issues.add(`${relative} contains an affiliate or campaign-tracking link: ${href}`)
    }
  }

  if (/<input\b[^>]*type=["'](?:password|file)["']/i.test(html)) {
    issues.add(`${relative} contains a password or file-upload field`)
  }
  if (/<form\b[^>]*method=["']post["']/i.test(html)) {
    issues.add(`${relative} contains a POST form outside the approved static-site scope`)
  }
  if (/<(?:a|button)\b[^>]*\bdownload(?:\s|=|>)/i.test(html)) {
    issues.add(`${relative} contains a download control`)
  }
  if (/<iframe\b/i.test(html)) issues.add(`${relative} contains embedded third-party content`)
  if (/<script\b[^>]*src=["']https?:\/\//i.test(html)) {
    issues.add(`${relative} contains an unreviewed external script`)
  }
}

if (issues.size > 0) {
  console.error('Publisher content policy check failed:')
  for (const issue of [...issues].sort()) console.error(`- ${issue}`)
  process.exit(1)
}

console.log(
  `Publisher content policy check passed for ${htmlFiles.length} exported pages: no prohibited-content signals, unreviewed external hosts, credential/upload/payment flows, downloads, embeds, or external scripts were found.`,
)
