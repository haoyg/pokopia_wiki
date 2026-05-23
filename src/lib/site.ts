export const BASE_URL = 'https://pokopia.cloud'

export function canonicalUrl(path = '/') {
  return `${BASE_URL}${path}`
}
