const fs = require('fs')
const path = require('path')

const mode = process.argv[2] || 'source'
const root = process.cwd()
const configPath = path.join(root, 'config/consent-management.json')
const trackers = [
  'pagead2.googlesyndication.com',
  'google-analytics.com',
  'googletagmanager.com',
  'doubleclick.net',
]

if (!fs.existsSync(configPath)) {
  console.error('Consent management check failed: config/consent-management.json is missing.')
  process.exit(1)
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
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

const files = mode === 'rendered'
  ? filesUnder(path.join(root, 'out'), ['.html'])
  : [
      ...filesUnder(path.join(root, 'src'), ['.js', '.jsx', '.ts', '.tsx']),
      ...filesUnder(path.join(root, 'public'), ['.html', '.js']),
    ]

const detected = []
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8').toLowerCase()
  for (const tracker of trackers) {
    if (content.includes(tracker)) detected.push(`${path.relative(root, file)} -> ${tracker}`)
  }
}

if (config.status === 'not-configured') {
  if (config.ads_enabled !== false || config.analytics_enabled !== false || config.privacy_message_enabled !== false) {
    issues.push('not-configured status requires ads, analytics, and privacy messaging flags to be false')
  }
  if (detected.length > 0) {
    issues.push(`tracking or advertising tags are present before CMP configuration: ${detected.join(', ')}`)
  }
} else if (config.status === 'configured') {
  if (!config.provider || !config.privacy_message_enabled) {
    issues.push('configured status requires a CMP provider and an enabled privacy message')
  }
  if (config.tcf_version !== '2.3') {
    issues.push('configured status requires IAB TCF v2.3')
  }
  if (!/^https:\/\//i.test(config.certification_evidence_url || '')) {
    issues.push('configured status requires an HTTPS Google CMP certification evidence URL')
  }
} else {
  issues.push(`unsupported consent management status: ${config.status}`)
}

if (issues.length > 0) {
  console.error(`Consent management ${mode} check failed:`)
  for (const issue of issues) console.error(`- ${issue}`)
  process.exit(1)
}

console.log(
  config.status === 'not-configured'
    ? `Consent management ${mode} check passed: no advertising or analytics tags are active before CMP configuration.`
    : `Consent management ${mode} check passed: configured CMP evidence is present.`,
)
