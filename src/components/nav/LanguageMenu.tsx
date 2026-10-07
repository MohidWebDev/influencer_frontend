import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { useDismiss } from '../../hooks/useDismiss'
import { LANGUAGES, changeLanguage } from '../../i18n'

// English, Urdu (RTL) aur Arabic (RTL). Chunne pe poori site ki zaban badalti hai
function LanguageMenu() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={t('site.nav.language')}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
      >
        <FontAwesomeIcon icon={faGlobe} />
        <span className="uppercase">{i18n.language}</span>
      </button>
      {open && (
        <ul className="absolute end-0 z-30 mt-2 w-40 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
          {LANGUAGES.map((language) => (
            <li key={language.code}>
              <button
                onClick={() => {
                  setOpen(false)
                  changeLanguage(language.code)
                }}
                className="flex w-full items-center justify-between px-4 py-2 text-start text-sm hover:bg-gray-50"
              >
                <span>{language.label}</span>
                {i18n.language === language.code && (
                  <FontAwesomeIcon icon={faCheck} className="text-xs text-gray-900" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LanguageMenu
