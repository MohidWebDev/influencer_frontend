import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from '../../hooks/useTheme'

// Navbar ka chand / suraj button: ek click mein light <-> dark
function ThemeToggle({ className = '' }: { className?: string }) {
  const { t } = useTranslation()
  const { isDark, toggleTheme } = useTheme()
  const label = isDark ? t('settings.switchToLight') : t('settings.switchToDark')

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={label}
      aria-label={label}
      className={`relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 ${className}`}
    >
      <FontAwesomeIcon
        icon={faMoon}
        className={`absolute transition duration-300 ${isDark ? 'translate-y-6 rotate-90 opacity-0' : 'translate-y-0 rotate-0 opacity-100'}`}
      />
      <FontAwesomeIcon
        icon={faSun}
        className={`absolute transition duration-300 ${isDark ? 'translate-y-0 rotate-0 opacity-100' : '-translate-y-6 -rotate-90 opacity-0'}`}
      />
    </button>
  )
}

export default ThemeToggle
