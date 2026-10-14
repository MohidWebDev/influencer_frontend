import { useTranslation } from 'react-i18next'
import { CONTACT_EMAIL, PLATFORM_NAME } from '../constants/config'

// Kanooni safhe ki aakhri tabdeeli (likhai badle to ye tareekh bhi)
const UPDATED_AT = '2026-10-14'

interface LegalSection {
  title: string
  body: string
}

// /privacy aur /terms: likhai i18n mein (legal.<page>.sections), teeno zabanon mein
function LegalPage({ page }: { page: 'privacy' | 'terms' }) {
  const { t, i18n } = useTranslation()
  const vars = { platform: PLATFORM_NAME, email: CONTACT_EMAIL }
  const sections = t(`legal.${page}.sections`, { returnObjects: true, ...vars }) as LegalSection[]
  const updated = new Intl.DateTimeFormat(i18n.language, { dateStyle: 'long' }).format(new Date(UPDATED_AT))

  return (
    <article className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm md:p-10">
      <h1 className="text-3xl font-bold tracking-tight">{t(`legal.${page}.title`)}</h1>
      <p className="mt-2 text-sm text-gray-500">{t('legal.updated', { date: updated })}</p>
      <p className="mt-6 leading-relaxed text-gray-700">{t(`legal.${page}.intro`, vars)}</p>
      <ol className="mt-8 space-y-7">
        {Array.isArray(sections) &&
          sections.map((section, i) => (
            <li key={section.title}>
              <h2 className="text-lg font-semibold">
                {i + 1}. {section.title}
              </h2>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-gray-700">{section.body}</p>
            </li>
          ))}
      </ol>
      <p className="mt-10 border-t border-gray-100 pt-6 text-sm text-gray-600">
        {t('legal.questions')}{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} dir="ltr" className="font-medium underline">
          {CONTACT_EMAIL}
        </a>
      </p>
    </article>
  )
}

export default LegalPage
