import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faBriefcase,
  faChartLine,
  faChevronDown,
  faCircleCheck,
  faEye,
  faIdBadge,
  faLanguage,
  faLock,
  faUserCheck,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { peopleQuery } from '../api/queries'
import { useAuth } from '../hooks/useAuth'
import { useTaxonomy } from '../hooks/useTaxonomy'
import { formatCount } from '../utils/format'

// Upar wale card ki tasveer (Unsplash, Home hero wali mein se ek)
const ABOUT_IMAGE =
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80'

// About: platform kya hai, kis ke liye hai, aur kin usoolon pe chalta hai
function About() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { data: industries } = useTaxonomy('industries')
  const { data: professions } = useTaxonomy('professions')
  // Sirf ginti chahiye: 1 profile mangwa kar meta.total
  const { data: people } = useQuery(peopleQuery(new URLSearchParams({ limit: '1' })))

  const stats: { icon: IconDefinition; value: string; label: string }[] = [
    {
      icon: faUsers,
      value: people ? formatCount(people.meta.total) : '–',
      label: t('home.statProfiles'),
    },
    {
      icon: faBriefcase,
      value: industries ? String(industries.length) : '–',
      label: t('home.statIndustries'),
    },
    {
      icon: faIdBadge,
      value: professions ? String(professions.length) : '–',
      label: t('home.statProfessions'),
    },
    { icon: faLanguage, value: '3', label: t('home.statLanguages') },
  ]

  const values: { icon: IconDefinition; title: string; body: string }[] = [
    { icon: faChartLine, title: t('about.value1Title'), body: t('about.value1Body') },
    { icon: faUserCheck, title: t('about.value2Title'), body: t('about.value2Body') },
    { icon: faLock, title: t('about.value3Title'), body: t('about.value3Body') },
    { icon: faLanguage, title: t('about.value4Title'), body: t('about.value4Body') },
  ]

  const audiences: { title: string; points: string[] }[] = [
    {
      title: t('about.forTalentTitle'),
      points: [t('about.forTalent1'), t('about.forTalent2'), t('about.forTalent3')],
    },
    {
      title: t('about.forBusinessTitle'),
      points: [t('about.forBusiness1'), t('about.forBusiness2'), t('about.forBusiness3')],
    },
  ]

  const faqs = [1, 2, 3, 4].map((n) => ({ q: t(`about.faq${n}Q`), a: t(`about.faq${n}A`) }))

  return (
    <div className="space-y-16">
      {/* Upar: tasveer wala card, Explore jaisa andaaz */}
      <section className="keep-dark relative isolate overflow-hidden rounded-3xl bg-gray-900 px-5 py-14 text-white sm:px-10 md:py-20">
        <img
          src={ABOUT_IMAGE}
          alt=""
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-950/95 via-gray-950/75 to-gray-950/25 rtl:bg-gradient-to-l" />
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-wider text-white/60">
            {t('about.eyebrow')}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
            {t('about.title')}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/80 md:text-lg">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Mission + numbers */}
      <section className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl">{t('about.missionTitle')}</h2>
          <p className="mt-4 leading-relaxed text-gray-600">{t('about.mission1')}</p>
          <p className="mt-3 leading-relaxed text-gray-600">{t('about.mission2')}</p>
        </div>
        <dl className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col-reverse gap-1 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
            >
              <dt className="flex items-center gap-1.5 text-xs text-gray-500">
                <FontAwesomeIcon icon={stat.icon} className="text-[11px] text-gray-400" />
                {stat.label}
              </dt>
              <dd className="text-3xl font-bold tracking-tight">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Usool */}
      <section>
        <h2 className="text-center text-2xl font-bold">{t('about.valuesTitle')}</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-gray-500">
          {t('about.valuesSubtitle')}
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <li
              key={value.title}
              className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white">
                <FontAwesomeIcon icon={value.icon} />
              </span>
              <h3 className="mt-4 font-semibold">{value.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600">{value.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Kis ke liye */}
      <section className="grid gap-4 md:grid-cols-2">
        {audiences.map((audience, i) => (
          <div
            key={audience.title}
            className={`rounded-3xl p-6 md:p-8 ${
              i === 0 ? 'keep-dark bg-gray-900 text-white' : 'bg-white shadow-sm ring-1 ring-gray-100'
            }`}
          >
            <h2 className="text-xl font-semibold">{audience.title}</h2>
            <ul className="mt-5 space-y-3">
              {audience.points.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-relaxed">
                  <FontAwesomeIcon
                    icon={faCircleCheck}
                    className={`mt-1 shrink-0 ${i === 0 ? 'text-emerald-400' : 'text-emerald-600'}`}
                  />
                  <span className={i === 0 ? 'text-white/80' : 'text-gray-600'}>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Aksar pooche jane wale sawal */}
      <section className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-bold">{t('about.faqTitle')}</h2>
        <div className="mt-8 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 open:ring-gray-300"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                {faq.q}
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className="shrink-0 text-xs text-gray-400 transition group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Aakhri dawat */}
      <section className="keep-dark flex flex-col items-start justify-between gap-6 rounded-3xl bg-gray-900 p-6 text-white md:flex-row md:items-center md:p-10">
        <div className="max-w-xl">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/60">
            <FontAwesomeIcon icon={faEye} />
            {t('about.ctaEyebrow')}
          </p>
          <h2 className="mt-2 text-2xl font-bold">{t('about.ctaTitle')}</h2>
          <p className="mt-2 text-sm text-white/75">{t('about.ctaBody')}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100"
          >
            {t('about.ctaExplore')}
            <FontAwesomeIcon icon={faArrowRight} className="text-xs rtl:rotate-180" />
          </Link>
          {!user && (
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white ring-1 ring-white/30 hover:bg-white/10"
            >
              {t('about.ctaJoin')}
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default About
