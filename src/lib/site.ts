export const BASE_URL = 'https://pokopia.cloud'

export function canonicalUrl(path = '/') {
  const trailingSlash = path.endsWith('/') ? '' : '/'
  return `${BASE_URL}${path}${trailingSlash}`
}
