const fs = require('fs')
const path = require('path')

const root = process.cwd()
const outputDir = path.join(root, 'out')
const restrictions = JSON.parse(
  fs.readFileSync(path.join(root, 'config/restricted-inventory.json'), 'utf8'),
)
const publisherPolicy = JSON.parse(
  fs.readFileSync(path.join(root, 'config/publisher-content-policy.json'), 'utf8'),
)
const traffic = JSON.parse(
  fs.readFileSync(path.join(root, 'config/adsense-traffic-integrity.json'), 'utf8'),
)
const issues = new Set()

const restrictedTextRules = [
  {
    id: 'ADS-REST-01',
    pattern: /\b(?:pornography|pornographic|erotic content|sexual entertainment|sex toys?|sexual supplements?|sexual advice)\b/gi,
  },
  {
    id: 'ADS-REST-02',
    pattern: /\b(?:graphic violence|graphic gore|gory images?|dismemberment|decapitation|bloodbath|prominent obscene language)\b/gi,
  },
  {
    id: 'ADS-REST-03',
    pattern: /\b(?:firearms?|handguns?|rifles?|shotguns?|ammunition|gun parts?|weapon sales?|bomb[- ]making|build (?:a |an )?(?:bomb|explosive))\b/gi,
  },
  {
    id: 'ADS-REST-04',
    pattern: /\b(?:tobacco|cigarettes?|cigars?|vaping|vape products?|marijuana|cannabis|cocaine|heroin|methamphetamine|drug paraphernalia|recreational drugs?)\b/gi,
  },
  {
    id: 'ADS-REST-05',
    pattern: /\b(?:buy alcohol|alcohol delivery|beer sales?|wine sales?|liquor sales?|drinking games?|binge drinking)\b/gi,
  },
  {
    id: 'ADS-REST-06',
    pattern: /\b(?:online gambling|sports betting|casino games?|real[- ]money poker|roulette betting|slot machines?|paid games? of chance|wagering)\b/gi,
  },
  {
    id: 'ADS-REST-07',
    pattern: /\b(?:prescription[- ]drug sales?|online pharmac(?:y|ies)|unapproved drugs?|unapproved supplements?|steroid sales?|weight[- ]loss pills?)\b/gi,
  },
]

const profileFields = [
  'sexual_content_enabled',
  'graphic_or_shocking_content_enabled',
  'weapons_or_explosives_content_enabled',
  'tobacco_or_recreational_drug_content_enabled',
  'alcohol_sales_or_irresponsible_promotion_enabled',
  'gambling_content_enabled',
  'prescription_or_unapproved_drug_content_enabled',
  'video_content_enabled',
  'video_ads_enabled',
]

function collectFiles(directory, predicate) {
  const files = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...collectFiles(file, predicate))
    if (entry.isFile() && predicate(file)) files.push(file)
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

if (!fs.existsSync(outputDir)) {
  console.error('Publisher restrictions check failed: out directory does not exist. Run next build first.')
  process.exit(1)
}

for (const field of profileFields) {
  if (restrictions[field] !== false) {
    issues.add(`${field} must remain false for the current AdSense readiness profile`)
  }
}

if (traffic.ad_code_enabled || traffic.placement_scope !== 'none') {
  issues.add('ADS-REST-08: advertising cannot be enabled until responsive overlap and video-ad placement review is completed')
}
if (restrictions.ad_layout_review_status !== 'not-applicable-ads-disabled') {
  issues.add('ad_layout_review_status must remain not-applicable-ads-disabled while advertising is disabled')
}

const legalContextRoutes = new Set(publisherPolicy.legal_context_routes)
const htmlFiles = collectFiles(
  outputDir,
  (file) => file.endsWith('.html') && path.basename(file) !== 'og-image-template.html',
)

for (const file of htmlFiles) {
  const relative = path.relative(root, file)
  const route = routeForFile(file)
  const html = fs.readFileSync(file, 'utf8')

  if (!legalContextRoutes.has(route)) {
    const text = visibleText(html)
    for (const rule of restrictedTextRules) {
      rule.pattern.lastIndex = 0
      const match = rule.pattern.exec(text)
      if (match) issues.add(`${rule.id}: ${relative} requires review for phrase "${match[0]}"`)
    }
  }

  if (/<(?:video|audio|iframe|object|embed)\b/i.test(html)) {
    issues.add(`ADS-REST-08: ${relative} contains embedded or playable media`)
  }
  if (/\bautoplay\b/i.test(html)) {
    issues.add(`ADS-REST-08: ${relative} contains autoplay behavior`)
  }
  if (/\b(?:adsbygoogle|ad-slot|ad-container|video-ad|outstream-ad)\b/i.test(html)) {
    issues.add(`ADS-REST-08: ${relative} contains an advertising or video-ad container`)
  }
}

const mediaFiles = collectFiles(
  path.join(root, 'public'),
  (file) => /\.(?:mp4|webm|mov|m3u8|avi|mkv)$/i.test(file),
)
for (const file of mediaFiles) {
  issues.add(`ADS-REST-08: unreviewed video asset found at ${path.relative(root, file)}`)
}

if (issues.size > 0) {
  console.error('Publisher restrictions check failed:')
  for (const issue of [...issues].sort()) console.error(`- ${issue}`)
  process.exit(1)
}

console.log(
  `Publisher restrictions check passed for ${htmlFiles.length} exported pages: no sexual, graphic, weapon-sales, tobacco/drug, alcohol-sales, gambling, prescription-drug, video, or ad-obstruction inventory was found.`,
)
