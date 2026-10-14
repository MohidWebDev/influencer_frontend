import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faArrowUpRightFromSquare,
  faCalendar,
  faCircleCheck,
  faHourglassHalf,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons'
import RatingBadge from '../agreements/RatingBadge'
import type { DirectoryBusiness, DirectoryManager } from '../../types/directory'
import { countryName, initials } from '../../utils/format'
import { hostOf, imageOf } from './directoryUtils'

// Business / manager ke page ka upar wala hissa: naam, tasdeeq, sitare, jagah, website
export function DirectoryHeader({
  entry,
  icon,
  subtitle,
  facts,
  actions,
}: {
  entry: DirectoryBusiness | DirectoryManager
  icon: IconDefinition
  subtitle?: string
  facts?: ReactNode
  actions?: ReactNode
}) {
  const { t, i18n } = useTranslation()
  const location = [entry.city, countryName(entry.country)].filter(Boolean).join(', ')
  const joined = new Date(entry.joinedAt).toLocaleDateString(i18n.language, {
    month: 'short',
    year: 'numeric',
  })
  const badge = entry.verified
    ? { tone: 'bg-blue-50 text-blue-700', icon: faCircleCheck, label: t('site.verified') }
    : entry.inReview
      ? {
          tone: 'bg-amber-50 text-amber-800',
          icon: faHourglassHalf,
          label: t('directory.inReview'),
        }
      : {
          tone: 'bg-gray-100 text-gray-600',
          icon: faHourglassHalf,
          label: t('directory.notVerified'),
        }

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {imageOf(entry) ? (
          <img
            src={imageOf(entry)}
            alt=""
            loading="lazy"
            className="h-20 w-20 shrink-0 rounded-2xl bg-gray-100 object-cover ring-1 ring-gray-200"
          />
        ) : (
          <span
            aria-hidden="true"
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gray-900 text-2xl font-semibold text-white"
          >
            {initials(entry.name)}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold md:text-3xl">{entry.name}</h1>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.tone}`}
            >
              <FontAwesomeIcon icon={badge.icon} className="text-[10px]" />
              {badge.label}
            </span>
          </div>
          {subtitle && (
            <p className="mt-1 flex items-center gap-2 text-gray-600">
              <FontAwesomeIcon icon={icon} className="text-sm text-gray-400" />
              {subtitle}
            </p>
          )}
          {entry.rating && (
            <a href="#reviews" className="mt-2 inline-flex rounded-md hover:opacity-80">
              <RatingBadge rating={entry.rating} size="md" />
            </a>
          )}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
            {location && (
              <span>
                <FontAwesomeIcon icon={faLocationDot} className="me-1.5 text-gray-400" />
                {location}
              </span>
            )}
            <span>
              <FontAwesomeIcon icon={faCalendar} className="me-1.5 text-gray-400" />
              {t('directory.joined', { date: joined })}
            </span>
            {facts}
            {entry.websiteUrl && (
              <a
                href={entry.websiteUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex items-center gap-1 font-medium text-gray-700 hover:text-gray-950 hover:underline"
              >
                {hostOf(entry.websiteUrl)}
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
              </a>
            )}
          </div>
        </div>
        {actions && <div className="flex flex-col gap-2 sm:w-48">{actions}</div>}
      </div>
    </section>
  )
}

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900"
    >
      <FontAwesomeIcon icon={faArrowLeft} className="text-xs rtl:rotate-180" />
      {label}
    </Link>
  )
}

export function DetailState({ loading, backTo }: { loading: boolean; backTo: string }) {
  const { t } = useTranslation()
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 animate-pulse rounded-2xl bg-gray-200/70" />
        <div className="h-64 animate-pulse rounded-2xl bg-gray-200/70" />
      </div>
    )
  }
  return (
    <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-sm ring-1 ring-gray-200/70">
      <p className="font-semibold">{t('directory.notFound')}</p>
      <Link to={backTo} className="mt-4 inline-block text-sm font-medium underline">
        {t('directory.backToList')}
      </Link>
    </div>
  )
}
