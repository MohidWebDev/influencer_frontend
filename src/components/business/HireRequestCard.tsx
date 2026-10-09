import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'
import Avatar from '../Avatar'
import StatusPill from '../admin-panel/StatusPill'
import type { HireRequest } from '../../types/business'
import { formatDate } from '../../utils/adminFormat'

// Ek hire request: business aur talent dono ke dashboard pe.
// "who" = card pe kis ka naam (business ko talent dikhta hai, talent ko business)
function HireRequestCard({
  hire,
  who,
  children,
}: {
  hire: HireRequest
  who: 'talent' | 'business'
  children?: ReactNode
}) {
  const { t, i18n } = useTranslation()
  const budget =
    hire.budget &&
    new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: hire.budget.currency,
      maximumFractionDigits: 0,
    }).format(hire.budget.amount)

  return (
    <li className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
      <div className="flex flex-wrap items-start gap-3">
        {who === 'talent' ? (
          <Avatar name={hire.person?.name ?? '?'} photoUrl={hire.person?.photoUrl} />
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{hire.title}</h3>
            <StatusPill status={hire.status} label={t(`hireStatus.${hire.status}`)} />
          </div>
          <p className="mt-0.5 text-sm text-gray-600">
            {who === 'talent' ? (
              hire.person ? (
                <Link to={`/people/${hire.person.slug}`} className="underline">
                  {hire.person.name}
                </Link>
              ) : (
                t('claims.deletedProfile')
              )
            ) : (
              t('hire.from', { business: hire.businessProfile?.companyName ?? '—' })
            )}
            {hire.serviceTitle && <> · {hire.serviceTitle}</>}
          </p>
          <p className="mt-2 whitespace-pre-line text-sm text-gray-700">{hire.message}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            {budget && (
              <span>
                <FontAwesomeIcon icon={faMoneyBillWave} className="me-1.5" />
                {budget}
              </span>
            )}
            {hire.startDate && (
              <span>
                <FontAwesomeIcon icon={faCalendarDays} className="me-1.5" />
                {t('hire.startsOn', { date: formatDate(hire.startDate) })}
              </span>
            )}
            <span>{t('hire.sentOn', { date: formatDate(hire.createdAt) })}</span>
          </div>
          {hire.responseNote && (
            <p className="mt-3 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-700">
              {t('hire.responseNote', { note: hire.responseNote })}
            </p>
          )}
        </div>
      </div>
      {children && <div className="mt-4 flex flex-wrap justify-end gap-2">{children}</div>}
    </li>
  )
}

export default HireRequestCard
