export const CLEARED_MEDIA_RIGHTS_STATUSES = new Set([
  'owned-original',
  'licensed',
  'open-license',
  'public-domain',
])

export type MediaRightsRecord = {
  image_url?: string
  image_rights_status?: string
  image_rights_evidence_url?: string
}

export function hasClearedMediaRights<T extends MediaRightsRecord>(
  item: T | null | undefined,
): item is T & { image_url: string; image_rights_status: string } {
  if (!item?.image_url || !item.image_rights_status) return false
  return CLEARED_MEDIA_RIGHTS_STATUSES.has(item.image_rights_status)
}
