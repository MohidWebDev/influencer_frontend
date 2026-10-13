import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faBullhorn, faFileSignature, faUsers } from '@fortawesome/free-solid-svg-icons'
import { getDirectoryReviews } from '../../api/directory'
import { businessDetailQuery, directoryReviewsQuery } from '../../api/queries'
import { ReviewsSection } from '../../components/agreements/PublicReviews'
import { useCampaignFormat } from '../../components/campaigns/campaignFormat'
import { BackLink, DetailState, DirectoryHeader } from '../../components/directory/DirectoryDetail'
import { categoryIcon } from '../../constants/services'
import { fromTalent } from '../../components/directory/directoryUtils'

// /businesses/:id -> ek business / organization ki public tafseel
function BusinessDetailPage() {
  const { t } = useTranslation()
  const { id = '' } = useParams()
  const format = useCampaignFormat()
  const { data, isLoading } = useQuery(businessDetailQuery(id))
  const { data: reviews } = useQuery({ ...directoryReviewsQuery('businesses', id), retry: false })

  if (!data) return <DetailState loading={isLoading} backTo="/businesses" />
  const { business, campaigns } = data
  const subtitle = [
    business.organizationType && t(`orgType.${business.organizationType}`),
    business.industry,
    business.companySize && t('directory.employees', { size: business.companySize }),
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="space-y-6">
      <BackLink to="/businesses" label={t('directory.backToBusinesses')} />
      <DirectoryHeader
        entry={business}
        icon={faBuilding}
        subtitle={subtitle}
        facts={
          business.completedWork > 0 && (
            <span>
              <FontAwesomeIcon icon={faFileSignature} className="me-1.5 text-gray-400" />
              {t('directory.completedWork', { count: business.completedWork })}
            </span>
          )
        }
      />

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {business.description && (
            <section className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold">{t('directory.aboutBusiness')}</h2>
              <p className="mt-3 whitespace-pre-line text-gray-700">{business.description}</p>
            </section>
          )}

          <ReviewsSection
            title={t('directory.reviewsFromTalent')}
            firstPage={
              reviews && { rating: reviews.rating, reviews: reviews.reviews.map(fromTalent) }
            }
            allKey={['directory', 'businesses', id, 'reviews', 'all']}
            loadPage={async (page, limit) => {
              const result = await getDirectoryReviews('businesses', id, page, limit)
              return { ...result, reviews: result.reviews.map(fromTalent) }
            }}
          />
          {reviews?.rating.count === 0 && (
            <section className="rounded-2xl bg-white p-6 text-sm text-gray-500 shadow-sm">
              <h2 className="mb-1 text-lg font-semibold text-gray-900">
                {t('directory.reviewsFromTalent')}
              </h2>
              {t('directory.noReviewsBusiness')}
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 font-semibold">
              <FontAwesomeIcon icon={faBullhorn} className="text-sm text-gray-400" />
              {t('directory.openCampaigns')}
            </h2>
            {campaigns.length === 0 ? (
              <p className="mt-2 text-sm text-gray-500">{t('directory.noOpenCampaigns')}</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {campaigns.map((campaign) => (
                  <li key={campaign._id}>
                    <Link
                      to={`/campaigns/${campaign._id}`}
                      className="block rounded-xl border border-gray-200 p-3 transition hover:border-gray-400"
                    >
                      <p className="font-medium text-gray-900">{campaign.title}</p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
                        <span>
                          <FontAwesomeIcon
                            icon={categoryIcon(campaign.category)}
                            className="me-1 text-gray-400"
                          />
                          {t(`services.category.${campaign.category}`)}
                        </span>
                        {format.budget(campaign) && <span>{format.budget(campaign)}</span>}
                        <span>
                          <FontAwesomeIcon icon={faUsers} className="me-1 text-gray-400" />
                          {t('campaigns.slots', { count: campaign.slots })}
                        </span>
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}

export default BusinessDetailPage
