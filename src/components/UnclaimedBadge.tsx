import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserClock } from '@fortawesome/free-solid-svg-icons'

// Public profile jo abhi us shakhs ne khud claim nahi ki
function UnclaimedBadge() {
  const { t } = useTranslation()
  return (
    <span
      title={t('site.unclaimedTitle')}
      className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-gray-600"
    >
      <FontAwesomeIcon icon={faUserClock} className="me-1" />
      {t('site.unclaimed')}
    </span>
  )
}

export default UnclaimedBadge
