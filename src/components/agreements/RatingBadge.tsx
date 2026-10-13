import { useTranslation } from 'react-i18next'
import type { PersonRating } from '../../types/person'
import Stars from './Stars'

// Card / profile pe: ★★★★☆ 4.3 (12). Koi review na ho to kuch nahi
function RatingBadge({
  rating,
  size = 'sm',
}: {
  rating?: PersonRating | null
  size?: 'sm' | 'md'
}) {
  const { t, i18n } = useTranslation()
  if (!rating?.count) return null
  const average = rating.average.toLocaleString(i18n.language, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${size === 'md' ? 'text-sm' : 'text-xs'}`}
      title={t('reviews.ratingTitle', { average, count: rating.count })}
    >
      <Stars value={rating.average} size={size === 'md' ? 'text-sm' : 'text-xs'} />
      <span className="font-semibold text-gray-900">{average}</span>
      <span className="text-gray-500">({rating.count})</span>
    </span>
  )
}

export default RatingBadge
