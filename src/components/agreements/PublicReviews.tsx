import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { personReviewsQuery } from '../../api/queries'
import { formatDate } from '../../utils/adminFormat'
import Stars from './Stars'

// Profile page: mukammal kaam ke baad businesses ki di hui reviews (koi na ho to kuch nahi)
function PublicReviews({ slug }: { slug: string }) {
  const { t } = useTranslation()
  const { data } = useQuery({ ...personReviewsQuery(slug), retry: false })
  if (!data || data.rating.count === 0) return null

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold">{t('agreements.publicReviews')}</h2>
        <span className="inline-flex items-center gap-1.5 text-sm text-gray-600">
          <Stars value={data.rating.average ?? 0} />
          {t('agreements.ratingSummary', { average: data.rating.average, count: data.rating.count })}
        </span>
      </div>
      <ul className="mt-4 divide-y divide-gray-100">
        {data.reviews.map((review, index) => (
          <li key={index} className="py-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-medium">{review.business ?? '—'}</span>
              <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
            </div>
            <Stars value={review.rating} size="text-xs" />
            {review.comment && <p className="mt-1 text-sm text-gray-700">{review.comment}</p>}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default PublicReviews
