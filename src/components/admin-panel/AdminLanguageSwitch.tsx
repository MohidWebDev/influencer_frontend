import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'
import { LANGUAGES, changeLanguage } from '../../i18n'

function AdminLanguageSwitch() {
  const { t, i18n } = useTranslation()

  return (
    <label className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm shadow-sm">
      <FontAwesomeIcon icon={faGlobe} className="text-gray-500" />
      <span className="sr-only">{t('nav.language')}</span>
      <select
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
        className="flex-1 bg-transparent outline-none"
      >
        {LANGUAGES.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default AdminLanguageSwitch
