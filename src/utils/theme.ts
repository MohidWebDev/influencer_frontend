export type ThemePreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'

export function getStoredTheme(): ThemePreference {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : 'system'
  } catch {
    return 'system'
  }
}

export function saveTheme(preference: ThemePreference) {
  try {
    if (preference === 'system') localStorage.removeItem(STORAGE_KEY)
    else localStorage.setItem(STORAGE_KEY, preference)
  } catch {
    // Private mode waghera: is session ke liye theme phir bhi lag jata hai
  }
}

export const DARK_QUERY = '(prefers-color-scheme: dark)'

// Pasand + device ki setting -> asal mein dark hai ya nahi
export const resolveDark = (preference: ThemePreference, systemDark: boolean) =>
  preference === 'dark' || (preference === 'system' && systemDark)

// <html> pe "dark" class aur mobile browser ki upar wali patti ka rang
export function applyDark(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', dark ? '#0b0f19' : '#111827')
}

// Rang badalna bina jhatke ke:
// - View Transitions wale browser: purani aur nayi screen ki tasveer ka halka fade (GPU pe)
// - Baqi: rang foran badlo, us lamhe har element ka transition band (warna hazaron
//   elements ek saath animate ho kar page atak jata hai)
export function switchDark(dark: boolean) {
  const root = document.documentElement
  if (root.classList.contains('dark') === dark) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduceMotion && typeof document.startViewTransition === 'function') {
    document.startViewTransition(() => applyDark(dark))
    return
  }

  root.classList.add('theme-switching')
  applyDark(dark)
  // Reflow karwa kar naye rang foran lagao, phir transitions wapas
  void root.offsetHeight
  requestAnimationFrame(() => root.classList.remove('theme-switching'))
}
