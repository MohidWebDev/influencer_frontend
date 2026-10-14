import { useTranslation } from 'react-i18next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { CONTACT_EMAIL } from '../../constants/config'

// Sawal ki keys (home.faq.<key>.q / .a). Jawab platform ke asal kaam ke mutabiq
const QUESTIONS = ['agency', 'data', 'free', 'verification', 'claim', 'hiring', 'manager', 'payments'] as const

// Home page: aksar pooche jane wale sawal. Native <details>: keyboard aur screen reader muft,
// ek se zyada khul sakte hain
function FaqSection() {
  const { t } = useTranslation()
  return (
    <section className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-12">
      <div>
        <h2 className="text-xl font-semibold md:text-2xl">{t('home.faqTitle')}</h2>
        <p className="mt-2 text-sm text-gray-500">{t('home.faqSubtitle')}</p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
        >
          <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
          {t('home.faqContact')}
        </a>
      </div>
      <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
        {QUESTIONS.map((key) => (
          <details key={key} className="group px-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="-mx-2 flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg px-2 py-4 font-medium">
              {t(`home.faq.${key}.q`)}
              <FontAwesomeIcon
                icon={faChevronDown}
                className="shrink-0 text-xs text-gray-400 transition group-open:rotate-180"
              />
            </summary>
            <p className="-mt-1 pb-5 text-sm leading-relaxed text-gray-600">{t(`home.faq.${key}.a`)}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export default FaqSection
