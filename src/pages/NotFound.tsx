import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

function NotFound() {
  const { t } = useTranslation()
  return (
    <section className="text-center">
      <h1 className="text-3xl font-bold">{t('notFound.title')}</h1>
      <Link to="/" className="mt-4 inline-block text-blue-600 underline">
        {t('notFound.goHome')}
      </Link>
    </section>
  )
}

export default NotFound
