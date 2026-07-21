const fs = require('fs')
const path = require('path')

const root = process.cwd()
const traffic = JSON.parse(
  fs.readFileSync(path.join(root, 'config/adsense-traffic-integrity.json'), 'utf8'),
)
const account = JSON.parse(
  fs.readFileSync(path.join(root, 'config/adsense-account-readiness.json'), 'utf8'),
)
const consent = JSON.parse(
  fs.readFileSync(path.join(root, 'config/consent-management.json'), 'utf8'),
)
const issues = []

function filesUnder(directory, extensions) {
  if (!fs.existsSync(directory)) return []
  const files = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...filesUnder(fullPath, extensions))
    else if (entry.isFile() && extensions.some((extension) => entry.name.endsWith(extension))) files.push(fullPath)
  }
  return files
}

const implementationFiles = [
  ...filesUnder(path.join(root, 'src'), ['.js', '.jsx', '.ts', '.tsx']),
  ...filesUnder(path.join(root, 'public'), ['.html', '.js']),
]
const adHosts = ['pagead2.googlesyndication.com', 'googleads.g.doubleclick.net']
const clickPrompts = [
  'click our ads',
  'click the ads',
  'support us by clicking',
  'refresh to support us',
]
const detectedAdCode = []
const detectedPrompts = []

for (const file of implementationFiles) {
  const content = fs.readFileSync(file, 'utf8').toLowerCase()
  for (const host of adHosts) {
    if (content.includes(host)) detectedAdCode.push(`${path.relative(root, file)} -> ${host}`)
  }
  for (const prompt of clickPrompts) {
    if (content.includes(prompt)) detectedPrompts.push(`${path.relative(root, file)} -> ${prompt}`)
  }
}

if (detectedPrompts.length > 0) {
  issues.push(`ad-click encouragement was detected: ${detectedPrompts.join(', ')}`)
}

if (!traffic.ad_code_enabled) {
  if (detectedAdCode.length > 0) {
    issues.push(`ad code is present while ad_code_enabled is false: ${detectedAdCode.join(', ')}`)
  }
  if (traffic.placement_scope !== 'none' || traffic.adsense_code_modified !== false) {
    issues.push('disabled ad code requires placement_scope none and adsense_code_modified false')
  }
} else {
  const requiredConfirmations = [
    'owner_will_not_click_own_ads',
    'owner_will_not_request_ad_clicks',
    'artificial_traffic_prohibited',
    'paid_to_click_or_traffic_exchange_prohibited',
    'spam_promotion_prohibited',
    'traffic_partners_reviewed',
  ]
  for (const field of requiredConfirmations) {
    if (traffic[field] !== true) issues.push(`ad code cannot be enabled before ${field} is confirmed`)
  }
  if (account.adsense_site_status !== 'ready') {
    issues.push('ad code cannot be enabled before AdSense reports the site as ready')
  }
  if (consent.status !== 'configured') {
    issues.push('ad code cannot be enabled before a documented consent management implementation is configured')
  }
  if (traffic.adsense_code_modified !== false) {
    issues.push('this readiness profile does not allow modified AdSense code')
  }
  if (traffic.placement_scope !== 'content-pages-only') {
    issues.push('enabled ad code requires placement_scope content-pages-only')
  }
}

if (issues.length > 0) {
  console.error('AdSense program policy check failed:')
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}

const unresolved = [
  'owner_will_not_click_own_ads',
  'owner_will_not_request_ad_clicks',
  'artificial_traffic_prohibited',
  'paid_to_click_or_traffic_exchange_prohibited',
  'spam_promotion_prohibited',
  'traffic_partners_reviewed',
].filter((field) => traffic[field] !== true)

console.log(
  `AdSense program policy check passed: ad code is ${traffic.ad_code_enabled ? 'enabled' : 'disabled'} and no click-encouragement copy was found. ` +
  (unresolved.length ? `Owner traffic confirmations remain unresolved: ${unresolved.join(', ')}.` : 'Owner traffic confirmations are recorded.'),
)
