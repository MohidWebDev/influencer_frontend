import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faBuilding,
  faCircleCheck,
  faHourglassHalf,
  faPen,
} from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { myBusinessQuery } from '../../api/queries'
import { formatDate } from '../../utils/adminFormat'
import { countryName } from '../../utils/format'

const box = 'rounded-2xl border bg-white p-5 shadow-sm md:p-6'
const primary =
  'inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800'
const outline =
  'inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100'

// Business dashboard ka sab se upar wala hissa: company ki verification ki halat
function BusinessVerificationSection() {
  const { t } = useTranslation()
  const { data: business, isLoading } = useQuery(myBusinessQuery)

  if (isLoading) return <div className="h-28 animate-pulse rounded-2xl bg-white shadow-sm" />

  // 1. Abhi details nahi bheji
  if (!business) {
    return (
      <section className={`${box} border-gray-200`}>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          {t('business.label')}
        </p>
        <h2 className="mt-2 text-lg font-semibold">{t('business.startTitle')}</h2>
        <p className="mt-1 text-sm text-gray-600">{t('business.startBody')}</p>
        <Link to="/dashboard/business" className={`${primary} mt-4`}>
          {t('business.startButton')}
          <FontAwesomeIcon icon={faArrowRight} className="ms-1 rtl:rotate-180" />
        </Link>
      </section>
    )
  }

  const location = [business.city, countryName(business.country)].filter(Boolean).join(', ')
  const header = (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
        <FontAwesomeIcon icon={faBuilding} />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-lg font-semibold">{business.companyName}</h2>
        <p className="truncate text-sm text-gray-600">
          {[business.industry, location].filter(Boolean).join(' · ')}
        </p>
      </div>
      <Link to="/dashboard/business" className={outline}>
        <FontAwesomeIcon icon={faPen} className="text-xs" />
        {business.status === 'rejected' ? t('business.fixAndResubmit') : t('business.edit')}
      </Link>
    </div>
  )

  // 2. Verified: ab hire kar sakta hai
  if (business.status === 'approved') {
    return (
      <section className={`${box} border-green-200`}>
        <p className="text-xs font-medium uppercase tracking-wide text-green-700">
          <FontAwesomeIcon icon={faCircleCheck} className="me-1.5" />
          {t('business.verifiedLabel')}
        </p>
        <div className="mt-3">{header}</div>
        <p className="mt-4 text-sm text-gray-600">{t('business.verifiedBody')}</p>
        <Link to="/search" className={`${primary} mt-3`}>
          {t('business.findTalents')}
          <FontAwesomeIcon icon={faArrowRight} className="ms-1 rtl:rotate-180" />
        </Link>
      </section>
    )
  }

  // 3. Reject: wajah dikhao, theek kar ke dobara bhejo
  if (business.status === 'rejected') {
    return (
      <section className={`${box} border-red-200`}>
        <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {t('business.rejected', { reason: business.rejectionReason })}
        </p>
        {header}
      </section>
    )
  }

  // 4. Pending: admin dekh raha hai
  return (
    <section className={`${box} border-amber-200`}>
      <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
        <FontAwesomeIcon icon={faHourglassHalf} className="me-1.5" />
        {t('business.pendingLabel')}
      </p>
      <div className="mt-3">{header}</div>
      <p className="mt-4 text-sm text-gray-600">
        {t('business.pendingBody', { date: formatDate(business.submittedAt) })}
      </p>
    </section>
  )
}

export default BusinessVerificationSection
