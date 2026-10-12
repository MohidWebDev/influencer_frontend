import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faHandshake } from '@fortawesome/free-solid-svg-icons'
import { incomingHiresQuery, myHiresQuery, myManagerQuery, myRepresentationsQuery } from '../../api/queries'

// Overview pe chhota sa banner: jin hire requests pe abhi kuch karna hai.
// Poori list "Hire requests" wale page pe hai
function HireRequestsNotice({ role }: { role: 'talent' | 'business' | 'representative' }) {
  if (role === 'talent') return <TalentNotice />
  if (role === 'representative') return <ManagerNotice />
  return <BusinessNotice />
}

function TalentNotice() {
  const { data: hires } = useQuery(incomingHiresQuery)
  const { data: manager } = useQuery({ ...myManagerQuery, retry: false })
  const count = hires?.filter((hire) => hire.status === 'pending').length ?? 0
  const requests = manager?.pending.filter((rep) => rep.status === 'requested').length ?? 0
  return (
    <>
      <Notice count={count} textKey="dashNav.pendingHires" />
      {/* Kisi manager ne represent karne ki darkhwast ki */}
      <Notice count={requests} textKey="manager.requestsNotice" to="/dashboard/my-manager" />
    </>
  )
}

// Manager: apne talents ki nayi hire requests, aur talents ki dawat
function ManagerNotice() {
  const { data: hires } = useQuery(incomingHiresQuery)
  const { data: reps } = useQuery(myRepresentationsQuery)
  const count = hires?.filter((hire) => hire.status === 'pending').length ?? 0
  const invites = reps?.filter((rep) => rep.status === 'invited').length ?? 0
  return (
    <>
      <Notice count={invites} textKey="manager.invitesNotice" to="/talents" />
      <Notice count={count} textKey="manager.hiresNotice" />
    </>
  )
}

function BusinessNotice() {
  const { data: hires } = useQuery(myHiresQuery)
  const count = hires?.filter((hire) => hire.status === 'accepted' && !hire.agreement).length ?? 0
  return <Notice count={count} textKey="dashNav.acceptedHires" />
}

function Notice({ count, textKey, to = '/dashboard/hire-requests' }: { count: number; textKey: string; to?: string }) {
  const { t } = useTranslation()
  if (!count) return null
  return (
    <Link
      to={to}
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
