import i18n from './index'

// { talent: 'Talent', ... } jaisa object jiska har label parhte waqt
// chuni hui zaban mein aata hai (getter). Object.entries bhi kaam karta hai
export function translatedLabels<K extends string>(keys: readonly K[], prefix: string) {
  const labels = {} as Record<K, string>
  for (const key of keys) {
    Object.defineProperty(labels, key, {
      get: () => i18n.t(`${prefix}.${key}`),
      enumerable: true,
    })
  }
  return labels
}

// Kisi bhi translation key ka getter (arrays ke andar labels ke liye)
export const tr = (key: string) => i18n.t(key)
