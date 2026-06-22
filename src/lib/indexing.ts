export function isEditorialContent(status?: string | null) {
  return Boolean(status && /^editorial\b/i.test(status.trim()))
}

export const noIndexMetadata = {
  index: false,
  follow: true,
  googleBot: {
    index: false,
    follow: true,
  },
} as const
