export type ThemePreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'

export function getStoredTheme(): ThemePreference {
  const value = localStorage.getItem(STORAGE_KEY)
  return value === 'light' || value === 'dark' ? value : 'system'
}

const systemPrefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches

// <html> pe "dark" class lagao/hatao. animate = rang aaraam se badlein
export function applyTheme(preference: ThemePreference, animate = false) {
  const dark = preference === 'dark' || (preference === 'system' && systemPrefersDark())
  const root = document.documentElement
  if (animate) {
    root.classList.add('theme-transition')
    window.setTimeout(() => root.classList.remove('theme-transition'), 250)
  }
  root.classList.toggle('dark', dark)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', dark ? '#0b0f19' : '#111827')
}

export function saveTheme(preference: ThemePreference) {
  if (preference === 'system') localStorage.removeItem(STORAGE_KEY)
  else localStorage.setItem(STORAGE_KEY, preference)
}
