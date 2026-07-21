const fs = require('fs')
const path = require('path')

const root = process.cwd()
const reportPath = path.join(root, 'docs/ADSENSE_FINAL_AUDIT.md')
const requiredIds = [
  'ADS-ELIG-01', 'ADS-ELIG-02', 'ADS-ELIG-03', 'ADS-ELIG-04',
  'ADS-OWN-01', 'ADS-OWN-02', 'ADS-OWN-03', 'ADS-SITE-01', 'ADS-SITE-02', 'ADS-TXT-01', 'ADS-TXT-02',
  'ADS-CONTENT-01', 'ADS-CONTENT-02', 'ADS-CONTENT-03', 'ADS-CONTENT-04', 'ADS-CONTENT-05', 'ADS-CONTENT-06', 'ADS-CONTENT-07', 'ADS-CONTENT-08',
  'ADS-UX-01', 'ADS-UX-02', 'ADS-UX-03', 'ADS-UX-04', 'ADS-UX-05', 'ADS-UX-06',
  'ADS-CRAWL-01', 'ADS-CRAWL-02', 'ADS-CRAWL-03', 'ADS-CRAWL-04', 'ADS-CRAWL-05', 'ADS-CRAWL-06', 'ADS-CRAWL-07',
  'ADS-PROG-01', 'ADS-PROG-02', 'ADS-PROG-03', 'ADS-PROG-04', 'ADS-PROG-05', 'ADS-PROG-06', 'ADS-PROG-07',
  'ADS-PUB-01', 'ADS-PUB-02', 'ADS-PUB-03', 'ADS-PUB-04', 'ADS-PUB-05', 'ADS-PUB-06', 'ADS-PUB-07', 'ADS-PUB-08', 'ADS-PUB-09', 'ADS-PUB-10', 'ADS-PUB-11', 'ADS-PUB-12', 'ADS-PUB-13', 'ADS-PUB-14', 'ADS-PUB-15', 'ADS-PUB-16',
  'ADS-REST-01', 'ADS-REST-02', 'ADS-REST-03', 'ADS-REST-04', 'ADS-REST-05', 'ADS-REST-06', 'ADS-REST-07', 'ADS-REST-08',
  'ADS-PRIV-01', 'ADS-PRIV-02', 'ADS-PRIV-03', 'ADS-PRIV-04', 'ADS-PRIV-05', 'ADS-PRIV-06', 'ADS-PRIV-07', 'ADS-PRIV-08', 'ADS-PRIV-09', 'ADS-PRIV-10',
]
const validStatuses = new Set(['Pass', 'Fail', 'Unknown', 'N/A'])
const issues = []

if (!fs.existsSync(reportPath)) {
  console.error('AdSense audit completeness check failed: final audit report is missing.')
  process.exit(1)
}

const report = fs.readFileSync(reportPath, 'utf8')
const checklist = report.match(/## Exhaustive Checklist([\s\S]*?)## Completeness Check/)?.[1] || ''
if (!checklist) issues.push('could not locate the exhaustive checklist section')

const rows = [...checklist.matchAll(/^\| (ADS-[A-Z]+-\d{2}) \| ([^|]+) \|/gm)].map((match) => ({
  id: match[1],
  status: match[2].trim(),
}))
const counts = new Map()
for (const row of rows) counts.set(row.id, (counts.get(row.id) || 0) + 1)

for (const id of requiredIds) {
  if (!counts.has(id)) issues.push(`missing checklist row ${id}`)
  if ((counts.get(id) || 0) > 1) issues.push(`duplicate checklist row ${id}`)
}
for (const row of rows) {
  if (!requiredIds.includes(row.id)) issues.push(`unexpected checklist row ${row.id}`)
  if (!validStatuses.has(row.status)) issues.push(`${row.id} has invalid status ${row.status}`)
}
if (rows.length !== requiredIds.length) issues.push(`expected ${requiredIds.length} checklist rows but found ${rows.length}`)

const statuses = new Map(rows.map((row) => [row.id, row.status]))
const account = JSON.parse(fs.readFileSync(path.join(root, 'config/adsense-account-readiness.json'), 'utf8'))
const traffic = JSON.parse(fs.readFileSync(path.join(root, 'config/adsense-traffic-integrity.json'), 'utf8'))
const consent = JSON.parse(fs.readFileSync(path.join(root, 'config/consent-management.json'), 'utf8'))
const audience = JSON.parse(fs.readFileSync(path.join(root, 'config/privacy-audience.json'), 'utf8'))

const expectStatus = (id, expected, reason) => {
  if (statuses.get(id) !== expected) issues.push(`${id} must be ${expected}: ${reason}`)
}

expectStatus('ADS-ELIG-01', account.applicant_age_eligible ? 'Pass' : 'Unknown', 'account age evidence changed')
expectStatus('ADS-ELIG-02', account.duplicate_account_checked ? 'Pass' : 'Unknown', 'duplicate-account evidence changed')
expectStatus('ADS-OWN-02', account.domain_control_confirmed_by_owner ? 'Pass' : 'Unknown', 'domain-control evidence changed')
expectStatus('ADS-SITE-01', account.adsense_site_status === 'ready' ? 'Pass' : 'Fail', 'AdSense site status changed')

const prog01Confirmed = [
  'owner_will_not_click_own_ads',
  'owner_will_not_request_ad_clicks',
  'artificial_traffic_prohibited',
].every((field) => traffic[field] === true)
const prog04Confirmed = [
  'paid_to_click_or_traffic_exchange_prohibited',
  'spam_promotion_prohibited',
  'traffic_partners_reviewed',
].every((field) => traffic[field] === true)
expectStatus('ADS-PROG-01', prog01Confirmed ? 'Pass' : 'Unknown', 'owner invalid-traffic confirmations changed')
expectStatus('ADS-PROG-04', prog04Confirmed ? 'Pass' : 'Unknown', 'owner traffic-source confirmations changed')
expectStatus('ADS-PRIV-04', consent.status === 'configured' ? 'Pass' : 'Unknown', 'CMP configuration changed')
expectStatus(
  'ADS-PRIV-06',
  audience.audience_classification === 'owner-confirmation-required' ? 'Unknown' : 'Pass',
  'audience classification changed',
)

const rightsFiles = ['news.json', 'guides.json', 'pokemon.json', 'habitats.json', 'recipes.json']
const unresolvedRights = rightsFiles.flatMap((file) =>
  JSON.parse(fs.readFileSync(path.join(root, 'src/data', file), 'utf8'))
    .filter((item) => item.image_rights_status === 'rights-review-required'),
)
expectStatus('ADS-PUB-02', unresolvedRights.length ? 'Unknown' : 'Pass', 'media-rights inventory changed')

const unresolvedCriticalIds = ['ADS-SITE-01', 'ADS-PROG-01', 'ADS-PROG-04', 'ADS-PUB-02', 'ADS-PRIV-04', 'ADS-PRIV-06']
const expectedDecision = unresolvedCriticalIds.some((id) => statuses.get(id) === 'Fail' || statuses.get(id) === 'Unknown')
  ? 'Not ready'
  : 'Ready'
if (!new RegExp(`## Decision\\s+\\*\\*${expectedDecision}\\*\\*`).test(report)) {
  issues.push(`decision must be ${expectedDecision} for the recorded checklist statuses`)
}

if (issues.length > 0) {
  console.error('AdSense audit completeness check failed:')
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}

const totals = [...validStatuses].map((status) => `${status}=${rows.filter((row) => row.status === status).length}`)
console.log(`AdSense audit completeness check passed: ${rows.length}/${requiredIds.length} unique requirement IDs; ${totals.join(', ')}.`)
