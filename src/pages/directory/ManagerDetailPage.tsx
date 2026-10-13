import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserTie, faUsers } from '@fortawesome/free-solid-svg-icons'
import { getDirectoryReviews } from '../../api/directory'
import { directoryReviewsQuery, managerDetailQuery } from '../../api/queries'
import Avatar from '../../components/Avatar'
import VerifiedBadge from '../../components/VerifiedBadge'
import { ReviewsSection } from '../../components/agreements/PublicReviews'
import { BackLink, DetailState, DirectoryHeader } from '../../components/directory/DirectoryDetail'
import { fromTalent } from '../../components/directory/directoryUtils'
import { PLATFORM_ICONS, PLATFORM_LABELS } from '../../constants/people'
import { formatCount } from '../../utils/format'

// /managers/:id -> ek manager / agent ki public tafseel aur jin talents ko represent karta hai
function ManagerDetailPage() {
  const { t } = useTranslation()
  const { id = '' } = useParams()
  const { data, isLoading } = useQuery(managerDetailQuery(id))
  const { data: reviews } = useQuery({ ...directoryReviewsQuery('managers', id), retry: false })

  if (!data) return <DetailState loading={isLoading} backTo="/managers" />
  const { manager, talents } = data

  return (
    <div className="space-y-6">
      <BackLink to="/managers" label={t('directory.backToManagers')} />
      <DirectoryHeader
        entry={manager}
        icon={faUserTie}
        subtitle={manager.agencyName || t('manager.independent')}
        facts={
          <span>
            <FontAwesomeIcon icon={faUsers} className="me-1.5 text-gray-400" />
            {t('directory.talents', { count: manager.talents })}
          </span>
        }
      />

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {manager.bio && (
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">{t('directory.aboutManager')}</h2>
              <p className="mt-3 whitespace-pre-line text-gray-700">{manager.bio}</p>
            </section>
          )}

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">{t('directory.representedTalents')}</h2>
            {talents.length === 0 ? (
              <p className="mt-2 text-sm text-gray-500">{t('directory.noRepresentedTalents')}</p>
            ) : (
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {talents.map((person) => (
                  <li key={person._id}>
                    <Link
                      to={`/people/${person.slug}`}
                      className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 transition hover:border-gray-400"
                    >
                      <Avatar name={person.name} photoUrl={person.photoUrl} size="sm" />
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5 font-medium text-gray-900">
                          <span className="truncate">{person.name}</span>
                          {person.verified && <VerifiedBadge />}
                        </span>
                        <span className="block truncate text-xs text-gray-500">
                          {[
                            person.headline,
                            person.totalFollowers
                              ? t('site.followers', { value: formatCount(person.totalFollowers) })
                              : null,
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <ReviewsSection
            title={t('directory.reviewsFromTalent')}
            firstPage={
              reviews && { rating: reviews.rating, reviews: reviews.reviews.map(fromTalent) }
            }
            allKey={['directory', 'managers', id, 'reviews', 'all']}
            loadPage={async (page, limit) => {
              const result = await getDirectoryReviews('managers', id, page, limit)
              return { ...result, reviews: result.reviews.map(fromTalent) }
            }}
          />
          {reviews?.rating.count === 0 && (
            <section className="rounded-2xl bg-white p-6 text-sm text-gray-500 shadow-sm">
              <h2 className="mb-1 text-lg font-semibold text-gray-900">
                {t('directory.reviewsFromTalent')}
              </h2>
              {t('directory.noReviewsManager')}
            </section>
          )}
        </div>

        <aside className="space-y-4">
          {manager.socialAccounts.length > 0 && (
            <section className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="font-semibold">{t('personForm.social')}</h2>
              <ul className="mt-3 space-y-2">
                {manager.socialAccounts.map((account) => (
                  <li key={account.url}>
                    <a
                      href={account.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FontAwesomeIcon
                        icon={PLATFORM_ICONS[account.platform]}
                        className="w-4 text-gray-500"
                      />
                      {PLATFORM_LABELS[account.platform]}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}

export default ManagerDetailPage
