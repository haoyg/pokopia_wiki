const noIndexFlags = [
  'draft',
  'placeholder',
  'thin',
  'unreviewed',
  'ai draft',
  'needs review',
  'review',
  'noindex',
]

export function shouldNoIndex(status?: string | null, indexStatus?: string | null) {
  const indexValue = indexStatus?.trim().toLowerCase()

  if (indexValue === 'indexable' || indexValue === 'index') return false
  if (indexValue) return noIndexFlags.some((flag) => indexValue.includes(flag))

  if (!status) return false

  const normalized = status.trim().toLowerCase()
  return noIndexFlags.some((flag) => normalized.includes(flag))
}

export const noIndexMetadata = {
  index: false,
  follow: true,
  googleBot: {
    index: false,
    follow: true,
  },
} as const
