const fs = require('fs')
const path = require('path')

const root = process.cwd()
const config = JSON.parse(
  fs.readFileSync(path.join(root, 'config/adsense-account-readiness.json'), 'utf8'),
)
const adsTxt = fs.readFileSync(path.join(root, 'public/ads.txt'), 'utf8').trim()
const siteSource = fs.readFileSync(path.join(root, 'src/lib/site.ts'), 'utf8')
const issues = []

const expectedAdsTxt = `google.com, ${config.publisher_id}, ${config.ads_txt_relationship}, ${config.ads_txt_certification_authority_id}`

if (!/^pub-\d{16}$/.test(config.publisher_id || '')) {
  issues.push('publisher_id must use the pub-################ format')
}

if (adsTxt !== expectedAdsTxt) {
  issues.push(`public/ads.txt does not exactly match the account-readiness record: expected "${expectedAdsTxt}"`)
}

if (!siteSource.includes(`https://${config.domain}`)) {
  issues.push('src/lib/site.ts does not match the AdSense readiness domain')
}

if (config.adsense_site_status === 'ready') {
  const confirmations = [
    ['applicant_age_eligible', config.applicant_age_eligible],
    ['duplicate_account_checked', config.duplicate_account_checked],
    ['publisher_id_ownership_confirmed', config.publisher_id_ownership_confirmed],
    ['domain_control_confirmed_by_owner', config.domain_control_confirmed_by_owner],
  ]
  for (const [name, value] of confirmations) {
    if (value !== true) issues.push(`adsense_site_status cannot be ready while ${name} is not confirmed`)
  }
  if (!config.account_evidence_reviewed_at) {
    issues.push('adsense_site_status ready requires an account_evidence_reviewed_at date')
  }
} else if (!['unknown', 'needs-attention', 'getting-ready'].includes(config.adsense_site_status)) {
  issues.push(`unsupported adsense_site_status: ${config.adsense_site_status}`)
}

if (issues.length > 0) {
  console.error('AdSense identity check failed:')
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}

const unresolved = [
  'applicant_age_eligible',
  'duplicate_account_checked',
  'publisher_id_ownership_confirmed',
  'domain_control_confirmed_by_owner',
].filter((field) => config[field] !== true)

console.log(
  `AdSense identity check passed for ${config.domain} and ${config.publisher_id}. ` +
  (unresolved.length ? `Private account evidence remains unresolved: ${unresolved.join(', ')}.` : 'Private account evidence is recorded.'),
)
