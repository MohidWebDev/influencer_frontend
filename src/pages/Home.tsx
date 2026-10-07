import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faBriefcase,
  faChartLine,
  faHandshake,
  faIdBadge,
  faLanguage,
  faLayerGroup,
  faMagnifyingGlass,
  faPause,
  faPlay,
  faUsers,
  faWandMagicSparkles,
} from '@fortawesome/free-solid-svg-icons'
import { peopleQuery } from '../api/queries'
import PersonCard from '../components/PersonCard'
import SearchBar from '../components/SearchBar'
import { useAuth } from '../hooks/useAuth'
import { useTaxonomy } from '../hooks/useTaxonomy'
import { formatCount } from '../utils/format'

// Hero ki tasveerein (sirf sajawat, is liye alt khali)
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=1600&q=80',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80',
]
const SLIDE_MS = 6000
const FEATURED_COUNT = 6
const INDUSTRY_LIMIT = 8

// User ne "kam harkat" chuni ho to slides khud na chalein
function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function Home() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { data: industries } = useTaxonomy('industries')
  const { data: professions } = useTaxonomy('professions')

  const [slide, setSlide] = useState(0)
  const [playing, setPlaying] = useState(() => !prefersReducedMotion())
  const [hovered, setHovered] = useState(false)

  const { data: featured, isLoading, isError } = useQuery(
    peopleQuery(new URLSearchParams({ limit: String(FEATURED_COUNT), sort: 'followers' })),
  )

  // Har 6 second baad agli tasveer. Mouse upar ho, pause dabaya ho ya tab chhupa ho to ruk jao
  useEffect(() => {
    if (!playing || hovered) return
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        setSlide((prev) => (prev + 1) % HERO_IMAGES.length)
      }
    }, SLIDE_MS)
    return () => window.clearInterval(id)
  }, [playing, hovered])

  const stats: { icon: IconDefinition; value: string; label: string }[] = [
    { icon: faUsers, value: featured ? formatCount(featured.meta.total) : '–', label: t('home.statProfiles') },
    { icon: faBriefcase, value: industries ? String(industries.length) : '–', label: t('home.statIndustries') },
    { icon: faIdBadge, value: professions ? String(professions.length) : '–', label: t('home.statProfessions') },
    { icon: faLanguage, value: '3', label: t('home.statLanguages') },
  ]

  const steps: { icon: IconDefinition; title: string; body: string }[] = [
    { icon: faMagnifyingGlass, title: t('home.step1Title'), body: t('home.step1Body') },
    { icon: faChartLine, title: t('home.step2Title'), body: t('home.step2Body') },
    { icon: faHandshake, title: t('home.step3Title'), body: t('home.step3Body') },
  ]

  const chip =
    'rounded-full border border-white/25 bg-white/10 px-3 py-1.5 backdrop-blur transition hover:bg-white/20 hover:text-white'

  return (
    <div className="space-y-16">
      {/* Hero: tasveeron ka carousel + search */}
      <section
        aria-label={t('home.heroLabel')}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className="relative overflow-hidden rounded-3xl bg-gray-900 shadow-lg"
      >
        {/* Tasveerein peeche (absolute), likhai normal flow mein: height content ke hisaab se */}
        <div className="absolute inset-0">
          {HERO_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1500ms] ease-in-out ${
                i === slide ? 'scale-105 opacity-100' : 'scale-100 opacity-0'
              }`}
            />
          ))}
        </div>

        {/* Andhera parda taake safed likhai saaf parhi jaye */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />

        {/* pb-36: neeche stats card hero pe chadhta hai, us ke upar dots ki jagah */}
        <div className="relative px-5 pb-36 pt-14 md:px-10 md:pb-40 md:pt-20">
          <div className="mx-auto w-full max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/20 backdrop-blur">
              <FontAwesomeIcon icon={faWandMagicSparkles} className="text-[10px]" />
              {t('home.badge')}
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              {t('home.title')}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/80 md:text-lg">
              {t('home.subtitle')}
            </p>

            <div className="mx-auto mt-7 max-w-2xl">
              <SearchBar size="lg" tone="onDark" />
            </div>

            {/* Jaldi wale links: sab se zyada followers + pehli chand industries */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-white/80">
              <span className="hidden sm:inline">{t('home.popular')}</span>
              <Link to="/search?sort=followers" className={chip}>
                {t('home.mostFollowed')}
              </Link>
              {industries?.slice(0, 3).map((industry) => (
                <Link key={industry._id} to={`/search?industry=${industry.slug}`} className={chip}>
                  {industry.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Slide ke dots + rokne/chalane ka button */}
        {/* Stats card (-mt-24) ke bilkul upar */}
        <div className="absolute inset-x-0 bottom-[7.25rem] flex items-center justify-center gap-2">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSlide(i)}
              aria-label={t('home.goToSlide', { n: i + 1 })}
              aria-current={i === slide}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === slide ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? t('home.pauseSlides') : t('home.playSlides')}
            className="ms-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-[10px] text-white backdrop-blur hover:bg-white/25"
          >
            <FontAwesomeIcon icon={playing ? faPause : faPlay} />
          </button>
        </div>
      </section>

      {/* Platform ke numbers: hero ke neeche thoda upar chadh kar */}
      <section className="relative z-10 -mt-24 px-2 sm:px-6">
        <dl className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-gray-100 md:grid-cols-4 md:p-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 rounded-xl p-2">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-white">
                <FontAwesomeIcon icon={stat.icon} />
              </span>
              {/* dt pehle (sahi HTML), dikhne mein number upar */}
              <div className="flex min-w-0 flex-col-reverse">
                <dt className="text-xs leading-tight text-gray-500">{stat.label}</dt>
                <dd className="text-xl font-bold leading-tight">{stat.value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </section>

      {/* Industry ke hisaab se */}
      <section>
        <SectionHeader title={t('home.browseByIndustry')} to="/browse" />
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {industries
            ? industries.slice(0, INDUSTRY_LIMIT).map((industry) => (
                <Link
                  key={industry._id}
                  to={`/search?industry=${industry.slug}`}
                  className="group flex items-center justify-between gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-3.5 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:border-gray-900 hover:shadow-md sm:px-4 sm:py-4"
                >
                  <span className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700 group-hover:bg-gray-900 group-hover:text-white">
                      <FontAwesomeIcon icon={faLayerGroup} className="text-xs" />
                    </span>
                    <span className="leading-snug">{industry.name}</span>
                  </span>
                  <span className="hidden sm:inline">
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="text-xs text-gray-400 transition group-hover:text-gray-900 rtl:rotate-180"
                    />
                  </span>
                </Link>
              ))
            : Array.from({ length: INDUSTRY_LIMIT }, (_, i) => (
                <div key={i} className="h-16 animate-pulse rounded-2xl bg-gray-200/70" />
              ))}
        </div>
      </section>

      {/* Sab se zyada followers wale log */}
      <section>
        <SectionHeader title={t('home.mostFollowed')} to="/search?sort=followers" />
        {isError && (
          <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {t('home.loadError')}
          </p>
        )}
        {featured && featured.people.length === 0 && (
          <p className="mt-5 text-gray-500">{t('home.noProfiles')}</p>
        )}
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {isLoading
            ? Array.from({ length: FEATURED_COUNT }, (_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-200/70" />
              ))
            : featured?.people.map((person) => <PersonCard key={person._id} person={person} />)}
        </div>
      </section>

      {/* Kaise kaam karta hai */}
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 md:p-10">
        <h2 className="text-center text-2xl font-bold">{t('home.howTitle')}</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-gray-500">
          {t('home.howSubtitle')}
        </p>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="relative rounded-2xl bg-gray-50 p-5">
              <span className="absolute end-4 top-4 text-3xl font-bold text-gray-200">{i + 1}</span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white">
                <FontAwesomeIcon icon={step.icon} />
              </span>
              <h3 className="mt-4 font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Aakhri dawat: guest ke liye sign up, login wale ke liye dashboard */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-gray-900 p-6 text-white md:p-8">
          <h2 className="text-xl font-semibold">{t('home.ctaTalentTitle')}</h2>
          <p className="mt-2 text-sm text-white/75">{t('home.ctaTalentBody')}</p>
          <Link
            to={user ? '/dashboard' : '/register'}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100"
          >
            {user ? t('home.ctaDashboard') : t('home.ctaTalentButton')}
            <FontAwesomeIcon icon={faArrowRight} className="text-xs rtl:rotate-180" />
          </Link>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 md:p-8">
          <h2 className="text-xl font-semibold">{t('home.ctaBusinessTitle')}</h2>
          <p className="mt-2 text-sm text-gray-600">{t('home.ctaBusinessBody')}</p>
          <Link
            to="/search"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            {t('home.ctaBusinessButton')}
            <FontAwesomeIcon icon={faArrowRight} className="text-xs rtl:rotate-180" />
          </Link>
        </div>
      </section>
    </div>
  )
}

function SectionHeader({ title, to }: { title: string; to: string }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-xl font-semibold md:text-2xl">{title}</h2>
      <Link
        to={to}
        className="inline-flex shrink-0 items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
      >
        {t('home.seeAll')}
        <FontAwesomeIcon icon={faArrowRight} className="text-[10px] rtl:rotate-180" />
      </Link>
    </div>
  )
}

export default Home
