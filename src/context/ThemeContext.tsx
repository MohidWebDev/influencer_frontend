import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'
import type { ReactNode } from 'react'
import {
  DARK_QUERY,
  getStoredTheme,
  resolveDark,
  saveTheme,
  switchDark,
  type ThemePreference,
} from '../utils/theme'

export interface ThemeContextValue {
  // Light / dark / system: har user (aur guest) ki apni pasand, is device pe
  theme: ThemePreference
  // Is waqt asal mein dark hai? ("system" mein device ki setting se)
  isDark: boolean
  setTheme: (theme: ThemePreference) => void
  toggleTheme: () => void
}

// eslint-disable-next-line react/only-export-components
export const ThemeContext = createContext<ThemeContextValue | null>(null)

// Device ki dark/light setting pe nazar
function subscribeSystem(onChange: () => void) {
  const media = window.matchMedia(DARK_QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}
const getSystemDark = () => window.matchMedia(DARK_QUERY).matches

// Theme ka apna context: badalne pe sirf theme wale components dobara render hote hain,
// poori app (jo AuthContext istemal karti hai) nahi
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(getStoredTheme)
  const systemDark = useSyncExternalStore(subscribeSystem, getSystemDark)
  const isDark = resolveDark(theme, systemDark)

  // Pehli class index.html ka script lagata hai; yahan sirf jab badle
  useEffect(() => {
    switchDark(isDark)
  }, [isDark])

  const setTheme = useCallback((next: ThemePreference) => {
    saveTheme(next)
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark')
  }, [setTheme])

  const value = useMemo(
    () => ({ theme, isDark, setTheme, toggleTheme }),
    [theme, isDark, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
