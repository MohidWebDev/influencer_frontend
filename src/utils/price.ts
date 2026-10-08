import i18n from '../i18n'
import type { Pricing } from '../types/services'

function money(value: number, currency: string) {
  try {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    return `${currency} ${value.toLocaleString()}`
  }
}

// "Rs 250,000 / event", "$500 – $1,000 / post", "Price on request"
export function formatPrice(pricing: Pricing) {
  const unit = i18n.t(`services.unitShort.${pricing.unit}`)
  if (pricing.type === 'fixed' && pricing.amount !== undefined) {
    return `${money(pricing.amount, pricing.currency)} / ${unit}`
  }
  if (pricing.type === 'range' && pricing.min !== undefined && pricing.max !== undefined) {
    return `${money(pricing.min, pricing.currency)} – ${money(pricing.max, pricing.currency)} / ${unit}`
  }
  return i18n.t('services.priceOnRequest')
}
