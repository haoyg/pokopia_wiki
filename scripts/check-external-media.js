const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')
const dataFiles = ['news.json', 'guides.json', 'pokemon.json', 'habitats.json', 'recipes.json']
const timeoutMs = 15_000
const userAgent = 'PokopiaPortal-MediaCheck/1.0 (+https://pokopia.cloud/source-policy/)'

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, 'src/data', file), 'utf8'))
}

async function request(url, method) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, {
      method,
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': userAgent,
        ...(method === 'GET' ? { range: 'bytes=0-0' } : {}),
      },
    })
  } finally {
    clearTimeout(timeout)
  }
}

async function checkImage(url) {
  let response = await request(url, 'HEAD')
  if (response.status === 405 || response.status === 501) response = await request(url, 'GET')

  const contentType = response.headers.get('content-type') || ''
  return {
    ok: response.ok && contentType.startsWith('image/'),
    status: response.status,
    contentType,
  }
}

async function main() {
  const imageUrls = new Map()

  for (const file of dataFiles) {
    for (const item of readJson(file)) {
      if (!/^https:\/\//i.test(item.image_url || '')) continue
      const label = `${file}:${item.id || item.slug || item.name || 'unknown'}`
      const labels = imageUrls.get(item.image_url) || []
      labels.push(label)
      imageUrls.set(item.image_url, labels)
    }
  }

  const failures = []

  for (const [url, labels] of imageUrls) {
    try {
      const result = await checkImage(url)
      if (!result.ok) {
        failures.push(`${result.status} ${result.contentType || 'unknown content type'}: ${url} (${labels.join(', ')})`)
        continue
      }
      console.log(`OK ${result.status} ${result.contentType}: ${url}`)
    } catch (error) {
      failures.push(`${error.name || 'RequestError'}: ${url} (${labels.join(', ')})`)
    }
  }

  if (failures.length > 0) {
    console.error('External media check failed:')
    for (const failure of failures) console.error(`- ${failure}`)
    process.exitCode = 1
    return
  }

  console.log(`External media check passed for ${imageUrls.size} unique image URLs.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
