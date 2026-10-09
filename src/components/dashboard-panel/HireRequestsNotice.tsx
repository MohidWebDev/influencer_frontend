import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faHandshake } from '@fortawesome/free-solid-svg-icons'
import { incomingHiresQuery, myHiresQuery } from '../../api/queries'

// Overview pe chhota sa banner: jin hire requests pe abhi kuch karna hai.
// Poori list "Hire requests" wale page pe hai
function HireRequestsNotice({ role }: { role: 'talent' | 'business' }) {
  return role === 'talent' ? <TalentNotice /> : <BusinessNotice />
}

function TalentNotice() {
  const { data: hires } = useQuery(incomingHiresQuery)
  const count = hires?.filter((hire) => hire.status === 'pending').length ?? 0
  return <Notice count={count} textKey="dashNav.pendingHires" />
}

function BusinessNotice() {
  const { data: hires } = useQuery(myHiresQuery)
  const count = hires?.filter((hire) => hire.status === 'accepted' && !hire.agreement).length ?? 0
  return <Notice count={count} textKey="dashNav.acceptedHires" />
}

function Notice({ count, textKey }: { count: number; textKey: string }) {
  const { t } = useTranslation()
  if (!count) return null
  return (
    <Link
      to="/dashboard/hire-requests"
      className="flex items-center gap-4 rounded-2xl border border-violet-200 bg-violet-50 p-4 text-violet-800 transition hover:bg-violet-100"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white">
        <FontAwesomeIcon icon={faHandshake} />
      </span>
      <span className="flex-1 text-sm font-medium">{t(textKey, { count })}</span>
      <span className="whitespace-nowrap text-sm font-semibold">
        {t('dashNav.review')} <FontAwesomeIcon icon={faArrowRight} className="ms-1 rtl:rotate-180" />
      </span>
    </Link>
  )
}

export default HireRequestsNotice
