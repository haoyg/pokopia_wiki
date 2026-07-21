const fs = require('fs')
const path = require('path')

const root = process.cwd()
const privacy = JSON.parse(fs.readFileSync(path.join(root, 'config/privacy-audience.json'), 'utf8'))
const traffic = JSON.parse(fs.readFileSync(path.join(root, 'config/adsense-traffic-integrity.json'), 'utf8'))
const issues = []

function filesUnder(directory) {
  if (!fs.existsSync(directory)) return []
  const files = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...filesUnder(fullPath))
    else if (entry.isFile() && /\.(js|jsx|ts|tsx)$/.test(entry.name)) files.push(fullPath)
  }
  return files
}

const implementation = filesUnder(path.join(root, 'src'))
  .map((file) => fs.readFileSync(file, 'utf8'))
  .join('\n')

if (/navigator\s*\.\s*geolocation|watchPosition\s*\(|getCurrentPosition\s*\(/i.test(implementation)) {
  issues.push('precise-location browser APIs are present in the application')
}

if (/document\s*\.\s*cookie[\s\S]{0,160}(?:google\.com|doubleclick\.net)/i.test(implementation)) {
  issues.push('application code appears to modify cookies on a Google domain')
}

if (privacy.precise_location_collected !== false) {
  issues.push('this readiness profile does not permit precise-location collection')
}
if (privacy.google_domain_cookies_modified !== false) {
  issues.push('google_domain_cookies_modified must remain false')
}
if (privacy.sensitive_audience_lists_enabled !== false) {
  issues.push('sensitive audience lists must remain disabled')
}
if (privacy.housing_employment_credit_targeting_enabled !== false) {
  issues.push('restricted housing, employment, or credit targeting must remain disabled')
}

const classifications = new Set([
  'owner-confirmation-required',
  'general-audience',
  'teen-directed',
  'child-directed',
  'mixed-audience',
])
if (!classifications.has(privacy.audience_classification)) {
  issues.push(`unsupported audience classification: ${privacy.audience_classification}`)
}

if (traffic.ad_code_enabled) {
  if (privacy.audience_classification === 'owner-confirmation-required' || !privacy.owner_classification_confirmed_at) {
    issues.push('ad code cannot be enabled before the owner confirms the audience classification')
  }

  const restrictedAgeTreatment = ['teen-directed', 'child-directed', 'mixed-audience'].includes(privacy.audience_classification)
  if (restrictedAgeTreatment) {
    if (privacy.personalized_ads_enabled || privacy.remarketing_enabled) {
      issues.push('personalized ads and remarketing must be disabled for restricted-age treatment')
    }
    if (!['teen', 'child', 'per-section'].includes(privacy.age_treatment)) {
      issues.push('restricted-age content requires a documented age treatment')
    }
    if (!/google_tag_for_age_treatment|data-tag-for-age-treatment|tagForAgeTreatment/i.test(implementation)) {
      issues.push('restricted-age content requires an age-treatment signal before ad requests')
    }
  }
}

if (issues.length > 0) {
  console.error('Privacy audience check failed:')
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}

console.log(
  `Privacy audience check passed: ads are ${traffic.ad_code_enabled ? 'enabled' : 'disabled'}, precise location and restricted targeting are disabled, audience classification is ${privacy.audience_classification}.`,
)
