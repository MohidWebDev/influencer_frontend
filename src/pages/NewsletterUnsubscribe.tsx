import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { unsubscribeNewsletter } from '../api/newsletter'

// /newsletter/unsubscribe?token=... -> email ke link se newsletter band (login ke baghair)
function NewsletterUnsubscribe() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const { mutate, data, isError, isPending, isIdle } = useMutation({
    mutationFn: () => unsubscribeNewsletter(token),
  })

  // Page khulte hi ek dafa
  useEffect(() => {
    if (token) mutate()
  }, [token, mutate])

  const failed = !token || isError
  return (
    <section className="mx-auto max-w-md rounded-2xl bg-white px-6 py-12 text-center shadow-sm">
      {isPending || (isIdle && token) ? (
        <p className="text-gray-500">{t('common.loading')}</p>
      ) : failed ? (
        <>
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-3xl text-amber-500" />
          <h1 className="mt-4 text-xl font-bold">{t('legal.unsubscribeFailedTitle')}</h1>
          <p className="mt-2 text-sm text-gray-500">{t('legal.unsubscribeFailedText')}</p>
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faCircleCheck} className="text-3xl text-green-600" />
          <h1 className="mt-4 text-xl font-bold">{t('legal.unsubscribedTitle')}</h1>
          <p className="mt-2 text-sm text-gray-500">
            {t('legal.unsubscribedText', { email: data?.email ?? '' })}
          </p>
        </>
      )}
      <Link to="/" className="mt-6 inline-block text-sm font-medium underline">
        {t('notFound.goHome')}
      </Link>
    </section>
  )
}

export default NewsletterUnsubscribe
