import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../hooks/useAuth'

// Claim ke saath jaane wali email: wohi jis se talent login hai. Dikhti hai, badal nahi sakti
function AccountEmailField({ id = 'accountEmail' }: { id?: string }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {t('claimForm.accountEmail')}
      </label>
      <div className="relative">
        <input
          id={id}
          type="email"
          value={user?.email ?? ''}
          disabled
          readOnly
          dir="ltr"
          aria-describedby={`${id}-hint`}
          className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 py-2 ps-3 pe-10 text-gray-700"
        />
        <FontAwesomeIcon
          icon={faLock}
          className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-sm text-gray-400"
        />
      </div>
      <p id={`${id}-hint`} className="mt-1 text-xs text-gray-500">
        {t('claimForm.accountEmailHint')}
      </p>
    </div>
  )
}

export default AccountEmailField
