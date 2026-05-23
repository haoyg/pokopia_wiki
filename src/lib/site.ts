export const BASE_URL = 'https://pokopia.wiki'

export function canonicalUrl(path = '/') {
  return `${BASE_URL}${path}`
}
