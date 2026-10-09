import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

// 1-5 sitare. onChange ho to click kar ke rating chunte hain, warna sirf dikhate hain
function Stars({
  value,
  onChange,
  size = 'text-sm',
}: {
  value: number
  onChange?: (value: number) => void
  size?: string
}) {
  const { t } = useTranslation()
  const stars = [1, 2, 3, 4, 5]

  if (!onChange) {
    return (
      <span className={`inline-flex gap-0.5 ${size}`} aria-label={t('agreements.stars', { count: value })}>
        {stars.map((star) => (
          <FontAwesomeIcon
            key={star}
            icon={faStar}
            className={star <= Math.round(value) ? 'text-amber-400' : 'text-gray-300'}
          />
        ))}
      </span>
    )
  }

  return (
    <span role="radiogroup" aria-label={t('agreements.rating')} className={`inline-flex gap-1 ${size}`}>
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={t('agreements.stars', { count: star })}
          onClick={() => onChange(star)}
          className="rounded p-0.5 hover:scale-110"
        >
          <FontAwesomeIcon
            icon={faStar}
            className={star <= value ? 'text-amber-400' : 'text-gray-300'}
          />
        </button>
      ))}
    </span>
  )
}

export default Stars
