import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBuilding,
  faCalendarDays,
  faCircleCheck,
  faEnvelope,
  faGlobe,
  faLocationDot,
  faMoneyBillWave,
  faPhone,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import Avatar from '../Avatar'
import Stars from '../agreements/Stars'
import StatusPill from '../admin-panel/StatusPill'
import type { HireRequest } from '../../types/business'
import { formatDate } from '../../utils/adminFormat'
import { countryName } from '../../utils/format'

// Talent ko: kis business ne bheji (verified, kya karti hai, kahan hai, website)
function BusinessInfo({
  business,
  rating,
}: {
  business: NonNullable<HireRequest['businessProfile']>
  rating?: HireRequest['businessRating']
}) {
  const { t } = useTranslation()
  const location = [business.city, countryName(business.country)].filter(Boolean).join(', ')
  return (
    <div className="mt-1 space-y-1">
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-700">
        <span className="font-medium">{t('hire.from', { business: business.companyName })}</span>
        {business.status === 'approved' && (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
            <FontAwesomeIcon icon={faCircleCheck} />
            {t('hire.verifiedBusiness')}
          </span>
        )}
        {rating ? (
          <span className="inline-flex items-center gap-1 text-xs text-gray-600">
            <Stars value={rating.average} size="text-xs" />
            {t('agreements.ratingSummary', { average: rating.average, count: rating.count })}
          </span>
        ) : (
          <span className="text-xs text-gray-500">{t('agreements.noRatings')}</span>
        )}
      </p>
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
        {business.industry && (
          <span>
            <FontAwesomeIcon icon={faBuilding} className="me-1.5" />
            {business.industry}
            {business.companySize &&
              ` · ${t('business.fields.employees', { size: business.companySize })}`}
          </span>
        )}
        {location && (
          <span>
            <FontAwesomeIcon icon={faLocationDot} className="me-1.5" />
            {location}
          </span>
        )}
        <a
          href={business.websiteUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="underline hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faGlobe} className="me-1.5" />
          {t('profile.website')}
        </a>
      </p>
      {business.description && (
        <p className="text-xs text-gray-500">{business.description}</p>
      )}
    </div>
  )
}

// Accept ke baad: ek doosre ka raabta aur aage kya karna hai
function ContactPanel({ contact, who }: { contact: NonNullable<HireRequest['contact']>; who: 'talent' | 'business' }) {
  const { t } = useTranslation()
  return (
    <div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-3 text-sm">
      <p className="font-medium text-green-800">
        {who === 'business' ? t('hire.nextStepsTalent') : t('hire.nextStepsBusiness')}
      </p>
      <ul className="mt-2 space-y-1 text-gray-800">
        <li>
          <FontAwesomeIcon icon={faUser} className="me-2 w-3.5 text-gray-500" />
          {contact.name}
        </li>
        <li>
          <FontAwesomeIcon icon={faEnvelope} className="me-2 w-3.5 text-gray-500" />
          <a href={`mailto:${contact.email}`} className="break-all underline">
            {contact.email}
          </a>
        </li>
        {contact.phone && (
          <li>
            <FontAwesomeIcon icon={faPhone} className="me-2 w-3.5 text-gray-500" />
            <a href={`tel:${contact.phone.replace(/[^\d+]/g, '')}`} dir="ltr" className="underline">
              {contact.phone}
            </a>
          </li>
        )}
      </ul>
    </div>
  )
}

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
    <li
      className={`rounded-2xl border bg-white p-4 md:p-5 ${
        who === 'business' && hire.status === 'pending' ? 'border-amber-300' : 'border-gray-200'
      }`}
    >
      <div className="flex flex-wrap items-start gap-3">
        {who === 'talent' ? (
          <Avatar name={hire.person?.name ?? '?'} photoUrl={hire.person?.photoUrl} />
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{hire.title}</h3>
            <StatusPill status={hire.status} label={t(`hireStatus.${hire.status}`)} />
          </div>
          {who === 'talent' ? (
            <p className="mt-0.5 text-sm text-gray-600">
              {hire.person ? (
                <Link to={`/people/${hire.person.slug}`} className="underline">
                  {hire.person.name}
                </Link>
              ) : (
                t('claims.deletedProfile')
              )}
              {hire.serviceTitle && <> · {hire.serviceTitle}</>}
            </p>
          ) : (
            <>
              {hire.businessProfile ? (
                <BusinessInfo business={hire.businessProfile} rating={hire.businessRating} />
              ) : (
                <p className="mt-0.5 text-sm text-gray-600">{t('hire.from', { business: '—' })}</p>
              )}
              {hire.serviceTitle && (
                <p className="mt-1 text-sm text-gray-600">
                  {t('hire.forService', { service: hire.serviceTitle })}
                </p>
              )}
            </>
          )}
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
            {hire.respondedAt && (
              <span>{t('hire.repliedOn', { date: formatDate(hire.respondedAt) })}</span>
            )}
          </div>
          {hire.responseNote && (
            <p className="mt-3 rounded-xl bg-gray-50 px-3 py-2 text-sm text-gray-700">
              {t('hire.responseNote', { note: hire.responseNote })}
            </p>
          )}
          {hire.status === 'accepted' && hire.contact && (
            <ContactPanel contact={hire.contact} who={who} />
          )}
        </div>
      </div>
      {children && <div className="mt-4 flex flex-wrap justify-end gap-2">{children}</div>}
    </li>
  )
}

export default HireRequestCard
