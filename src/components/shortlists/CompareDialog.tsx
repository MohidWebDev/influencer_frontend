import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import Avatar from '../Avatar'
import Stars from '../agreements/Stars'
import VerifiedBadge from '../VerifiedBadge'
import HiringStatus from './HiringStatus'
import { PLATFORM_LABELS } from '../../constants/people'
import type { SocialPlatform } from '../../types/person'
import type { ShortlistItem } from '../../types/shortlist'
import { countryName, formatCount } from '../../utils/format'
import { formatPrice } from '../../utils/price'

// 2-4 log aamne saamne: followers, services ki keemat, availability, rating, hire ki halat
function CompareDialog({ items, onClose }: { items: ShortlistItem[]; onClose: () => void }) {
  const { t } = useTranslation()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // Jin platforms pe kisi ek ka bhi account hai
  const platforms = [
    ...new Set(items.flatMap((item) => item.person?.socialAccounts?.map((a) => a.platform) ?? [])),
  ] as SocialPlatform[]

  const row = (label: string, cell: (item: ShortlistItem) => ReactNode) => (
    <tr className="border-t border-gray-100 align-top">
      <th scope="row" className="sticky start-0 bg-white py-3 pe-4 text-start text-xs font-medium text-gray-500">
        {label}
      </th>
      {items.map((item) => (
        <td key={item.personId} className="min-w-44 px-3 py-3 text-sm">
          {cell(item)}
        </td>
      ))}
    </tr>
  )
  const dash = <span className="text-gray-400">—</span>

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-5xl flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 id="compare-title" className="text-lg font-semibold">
            {t('shortlists.compareTitle', { count: items.length })}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('settings.close')}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
        <div className="overflow-auto px-5 pb-5">
          <table className="w-full">
            <thead>
              <tr>
                <th className="sticky start-0 bg-white" />
                {items.map((item) => (
                  <th key={item.personId} className="px-3 py-4 text-start align-top">
                    <Avatar name={item.person?.name ?? '?'} photoUrl={item.person?.photoUrl} />
                    <Link to={`/people/${item.person?.slug}`} className="mt-2 block font-semibold underline">
                      {item.person?.name}
                    </Link>
                    {item.person?.headline && (
                      <p className="mt-0.5 line-clamp-2 text-xs font-normal text-gray-500">
                        {item.person.headline}
                      </p>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {row(t('shortlists.compare.verified'), (item) =>
                item.person?.verified ? <VerifiedBadge /> : <span className="text-gray-500">{t('shortlists.compare.notVerified')}</span>,
              )}
              {row(t('shortlists.compare.location'), (item) =>
                [item.person?.city, countryName(item.person?.country)].filter(Boolean).join(', ') || dash,
              )}
              {row(t('shortlists.compare.totalFollowers'), (item) =>
                item.person?.totalFollowers ? (
                  <span className="font-semibold">{formatCount(item.person.totalFollowers)}</span>
                ) : (
                  dash
                ),
              )}
              {platforms.map((platform) =>
                row(PLATFORM_LABELS[platform], (item) => {
                  const account = item.person?.socialAccounts?.find((a) => a.platform === platform)
                  return account?.followers !== undefined ? formatCount(account.followers) : dash
                }),
              )}
              {row(t('shortlists.compare.services'), (item) =>
                item.person?.services?.length ? (
                  <ul className="space-y-1">
                    {item.person.services.map((service) => (
                      <li key={service._id}>
                        <span className="block">{service.title}</span>
                        <span className="text-xs text-gray-500">{formatPrice(service.pricing)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  dash
                ),
              )}
              {row(t('shortlists.compare.availability'), (item) => {
                const availability = item.person?.availability
                if (!availability?.isOpen) return <span className="text-gray-500">{t('shortlists.compare.notOpen')}</span>
                return (
                  <div>
                    <span className="font-medium text-green-700">{t('services.availableShort')}</span>
                    {availability.openTo.length > 0 && (
                      <span className="block text-xs text-gray-500">
                        {availability.openTo.map((o) => t(`services.openToOption.${o}`)).join(', ')}
                      </span>
                    )}
                    {availability.responseTime && (
                      <span className="block text-xs text-gray-500">
                        {t(`services.response.${availability.responseTime}`)}
                      </span>
                    )}
                  </div>
                )
              })}
              {row(t('shortlists.compare.rating'), (item) =>
                item.rating ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Stars value={item.rating.average} size="text-xs" />
                    <span className="text-xs text-gray-600">
                      {t('agreements.ratingSummary', item.rating)}
                    </span>
                  </span>
                ) : (
                  <span className="text-gray-500">{t('agreements.noRatings')}</span>
                ),
              )}
              {row(t('shortlists.compare.note'), (item) =>
                item.note ? <span className="whitespace-pre-line">{item.note}</span> : dash,
              )}
              {row(t('shortlists.compare.hiring'), (item) => <HiringStatus item={item} />)}
            </tbody>
          </table>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default CompareDialog
