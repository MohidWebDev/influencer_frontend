import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faChevronDown, faGlobe } from '@fortawesome/free-solid-svg-icons'
import { useDismiss } from '../../hooks/useDismiss'
import { LANGUAGES, changeLanguage } from '../../i18n'

interface LanguageMenuProps {
  // 'dropdown' = desktop navbar ka popup (button ke neeche, end ki taraf)
  // 'inline'   = mobile menu ke andar: list menu ke flow mein khulti hai, popup nahi,
  //              taake scroll hone wala mobile menu use kaate nahi
  variant?: 'dropdown' | 'inline'
}

// English, Urdu (RTL) aur Arabic (RTL). Chunne pe poori site ki zaban badalti hai
function LanguageMenu({ variant = 'dropdown' }: LanguageMenuProps) {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)
  const inline = variant === 'inline'
  const listRef = useRef<HTMLUListElement>(null)

  // Lamba mobile menu ho to khuli list ko scroll karke nazar mein lao
  useEffect(() => {
    if (open && inline) listRef.current?.scrollIntoView({ block: 'nearest' })
  }, [open, inline])

  return (
    // Inline mein wrapper "contents" hai: list parent row ki poori chaurai le sakti hai
    <div ref={ref} className={inline ? 'contents' : 'relative'}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t('site.nav.language')}
        aria-expanded={open}
        aria-haspopup="true"
        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 text-sm text-gray-700 hover:bg-gray-100 ${
          inline ? 'min-h-11 border border-gray-300 px-3' : 'min-h-11 lg:min-h-0 lg:py-1.5'
        }`}
      >
        <FontAwesomeIcon icon={faGlobe} />
        <span className="uppercase">{i18n.language}</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          className={`text-[10px] text-gray-500 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <ul
          ref={listRef}
          className={`overflow-hidden rounded-xl border border-gray-200 bg-white py-1 text-gray-900 shadow-lg ${
            inline
              ? 'order-last basis-full'
              : 'absolute end-0 top-full z-50 mt-2 w-44 max-w-[calc(100vw-2rem)]'
          }`}
        >
          {LANGUAGES.map((language) => {
            const active = i18n.language === language.code
            return (
              <li key={language.code}>
                <button
                  type="button"
                  lang={language.code}
                  onClick={() => {
                    setOpen(false)
                    changeLanguage(language.code)
                  }}
                  className={`flex min-h-11 w-full items-center justify-between gap-3 px-4 text-start text-sm hover:bg-gray-100 ${
                    active ? 'bg-gray-50 font-semibold' : ''
                  }`}
                >
                  <span>{language.label}</span>
                  {active && <FontAwesomeIcon icon={faCheck} className="text-xs text-gray-900" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default LanguageMenu
