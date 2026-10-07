import i18n from '../i18n'

// 1250000 -> "1.3M" (chuni hui zaban ke andaaz mein)
export function formatCount(value: number) {
  return new Intl.NumberFormat(i18n.language, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

const countryNames = () => new Intl.DisplayNames([i18n.language], { type: 'region' })
const languageNames = () => new Intl.DisplayNames([i18n.language], { type: 'language' })

// "PK" -> "Pakistan" / "پاکستان"
export function countryName(code?: string) {
  if (!code) return ''
  try {
    return countryNames().of(code) ?? code
  } catch {
    return code
  }
}

// "ur" -> "Urdu"
export function languageName(code: string) {
  try {
    return languageNames().of(code) ?? code
  } catch {
    return code
  }
}

// "Sana Rafiq" -> "SR"
export function initials(name: string) {
  return name
    .replace(/^(dr|mr|mrs|ms)\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}
