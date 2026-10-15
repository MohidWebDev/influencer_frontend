import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faChartLine,
  faCircleCheck,
  faEarthAsia,
  faEnvelope,
  faHandshake,
  faLayerGroup,
  faMagnifyingGlass,
  faMicrophone,
  faNewspaper,
  faRocket,
  faUserGraduate,
  faUserPlus,
  faUsers,
  faVideo,
} from '@fortawesome/free-solid-svg-icons'
import { homeStatsQuery, peopleQuery } from '../api/queries'
import type { HomeCategoryKey } from '../api/stats'
import FeaturedCarousel from '../components/home/FeaturedCarousel'
import FeatureBlocks from '../components/home/FeatureBlocks'
import FaqSection from '../components/home/FaqSection'
import TestimonialsSlider from '../components/home/TestimonialsSlider'
import SearchBar from '../components/SearchBar'
import { CONTACT_EMAIL } from '../constants/config'
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
// Categories cards ka icon aur rang (kaun si professions = backend ka src/constants/homeCategories.ts)
const CATEGORY_LOOK: Record<HomeCategoryKey, { icon: IconDefinition; tint: string }> = {
  journalists: { icon: faNewspaper, tint: 'bg-blue-50 text-blue-700' },
  creators: { icon: faVideo, tint: 'bg-violet-50 text-violet-700' },
  speakers: { icon: faMicrophone, tint: 'bg-amber-50 text-amber-700' },
  experts: { icon: faUserGraduate, tint: 'bg-green-50 text-green-700' },
}
const CATEGORY_ORDER: HomeCategoryKey[] = ['journalists', 'creators', 'speakers', 'experts']
const SLIDE_MS = 4000
const FEATURED_COUNT = 10
const INDUSTRY_LIMIT = 8

// User ne "kam harkat" chuni ho to slides khud na chalein
function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function Home() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { data: industries } = useTaxonomy('industries')

  const [slide, setSlide] = useState(0)
  const [autoPlay] = useState(() => !prefersReducedMotion())

  const {
    data: featured,
    isLoading,
    isError,
  } = useQuery(
    peopleQuery(new URLSearchParams({ limit: String(FEATURED_COUNT), sort: 'followers' })),
  )

  // Har 4 second baad agli tasveer, mouse upar ho tab bhi. Sirf tab chhupa ho to ruk jao
  useEffect(() => {
    if (!autoPlay) return
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        setSlide((prev) => (prev + 1) % HERO_IMAGES.length)
      }
    }, SLIDE_MS)
    return () => window.clearInterval(id)
  }, [autoPlay])

  // Platform ke asal numbers (sirf public profiles)
  const { data: homeStats } = useQuery(homeStatsQuery)
  const count = (value?: number) => (value === undefined ? '–' : formatCount(value))
  const stats: { icon: IconDefinition; value: string; label: string }[] = [
    { icon: faUsers, value: count(homeStats?.profiles), label: t('home.statProfiles') },
    { icon: faUserPlus, value: count(homeStats?.newThisWeek), label: t('home.statNewWeek') },
    { icon: faEarthAsia, value: count(homeStats?.countries), label: t('home.statCountries') },
    { icon: faCircleCheck, value: count(homeStats?.verified), label: t('home.statVerified') },
  ]
  const categories = CATEGORY_ORDER.map((key) => ({
    key,
    ...CATEGORY_LOOK[key],
    data: homeStats?.categories.find((c) => c.key === key),
  }))

  // Har qadam ke saath us ka agla kaam (link)
  const startTo = user ? '/dashboard' : '/register'
  const steps: { icon: IconDefinition; title: string; body: string; link: string; to: string }[] = [
    {
      icon: faMagnifyingGlass,
      title: t('home.step1Title'),
      body: t('home.step1Body'),
      link: t('home.step1Link'),
      to: '/search',
    },
    {
      icon: faChartLine,
      title: t('home.step2Title'),
      body: t('home.step2Body'),
      link: t('home.step2Link'),
      to: '/search?sort=followers',
    },
    {
      icon: faHandshake,
      title: t('home.step3Title'),
      body: t('home.step3Body'),
      link: user ? t('home.ctaDashboard') : t('home.step3Link'),
      to: startTo,
    },
  ]
  const demoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t('home.demoSubject'))}`

  const chip =
    'rounded-full border border-white/25 bg-white px-3 py-1.5 backdrop-blur transition hover:bg-white/20 hover:text-white'

  return (
    /* ✅ Background white — poore page par */
    <div className="space-y-16 bg-white">
      {/* Hero: tasveeron ka carousel, search aur platform ke numbers */}
      <section
        aria-label={t('home.heroLabel')}
        className="keep-dark relative isolate overflow-hidden bg-gray-950"
      >
        {/* Tasveerein peeche; dheere zoom ke saath badalti hain */}
        <div className="absolute inset-0 -z-10">
          {HERO_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1200ms] ease-out ${
                i === slide ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
              }`}
            />
          ))}
          {/* Likhai wali taraf (start) gehra, doosri taraf tasveer saaf dikhe */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/60 to-gray-950/10 rtl:bg-gradient-to-l" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
        </div>

        {/* Likhai navbar ki seedh mein: andar max-w-6xl, tasveer poori chaurai */}
        <div className="relative mx-auto flex min-h-[34rem] max-w-6xl flex-col justify-between gap-10 px-4 py-12 sm:py-14 md:min-h-[38rem] md:py-20">
          <div className="max-w-2xl text-center md:text-start">
            <h1 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-6xl">
              {t('home.title')}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/80 md:mx-0 md:text-lg">
              {t('home.subtitle')}
            </p>

            <div className="mx-auto mt-7 max-w-xl md:mx-0">
              <SearchBar size="lg" tone="onDark" />
            </div>

            {/* Do bare raste: dhoondo, ya account bana kar shuru karo */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <Link
                to="/search"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xs" />
                {t('home.heroFind')}
              </Link>
              <Link
                to={startTo}
                className="inline-flex items-center gap-2 rounded-xl border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                {user ? t('home.ctaDashboard') : t('home.heroStart')}
                <FontAwesomeIcon icon={faArrowRight} className="text-xs rtl:rotate-180" />
              </Link>
            </div>

            {/* Jaldi wale links: sab se zyada followers + pehli chand industries */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-white/80 md:justify-start">
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

          {/* Platform ke numbers: hero ke andar sheeshe jaisi patti */}
          <dl className="grid grid-cols-2 overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/15 backdrop-blur-md md:grid-cols-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col-reverse gap-1 p-4 md:p-5 ${
                  i % 2 === 1 ? 'border-s border-white/10' : ''
                } ${i >= 2 ? 'border-t border-white/10 md:border-t-0' : ''} ${
                  i === 2 ? 'md:border-s' : ''
                }`}
              >
                <dt className="flex items-center gap-1.5 text-xs text-white/70">
                  <FontAwesomeIcon icon={stat.icon} className="text-[11px] text-white/50" />
                  {stat.label}
                </dt>
                <dd className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ✅ PEHLA CONTAINER: categories, industries, featured */}
      <div className="mx-auto max-w-6xl space-y-16 px-4">
        {/* Categories: journalists, creators, speakers, experts (ginti ke saath) */}
        <section>
          <div className="text-center">
            <h2 className="text-xl font-semibold md:text-2xl">{t('home.categoriesTitle')}</h2>
            <p className="mx-auto mt-1 max-w-xl text-sm text-gray-500">
              {t('home.categoriesSubtitle')}
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.key}
                to={
                  category.data
                    ? `/search?profession=${category.data.slugs.join(',')}`
                    : '/search'
                }
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-900 hover:shadow-md"
              >
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${category.tint}`}
                >
                  <FontAwesomeIcon icon={category.icon} className="text-lg" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">
                  {t(`home.categories.${category.key}.title`)}
                </h3>
                <p className="mt-1 flex-1 text-sm text-gray-600">
                  {t(`home.categories.${category.key}.body`)}
                </p>
                <span className="mt-4 flex items-center justify-between text-sm">
                  {category.data ? (
                    <span className="font-semibold">
                      {t('home.categoryCount', { count: formatCount(category.data.count) })}
                    </span>
                  ) : (
                    <span className="h-4 w-20 animate-pulse rounded bg-gray-200/70" />
                  )}
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="text-xs text-gray-400 transition group-hover:text-gray-900 rtl:rotate-180"
                  />
                </span>
              </Link>
            ))}
          </div>
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

        {/* Sab se zyada followers wale log: swipe hone wala carousel */}
        <section>
          {isError && !featured ? (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {t('home.loadError')}
            </p>
          ) : featured && featured.people.length === 0 ? (
            <p className="text-gray-500">{t('home.noProfiles')}</p>
          ) : (
            <FeaturedCarousel people={featured?.people} isLoading={isLoading} />
          )}
        </section>
      </div>

      {/* ✅ FULL WIDTH SECTION — container ke bahar, background edge-to-edge.
          Andar max-w-6xl rakha hai taake 3 cards ki width pehle jaisi rahe. */}
      <section
        id="how-it-works"
        className="scroll-mt-24 w-full bg-white py-12 shadow-sm ring-1 ring-gray-100 md:py-16"
      >
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-bold">{t('home.howTitle')}</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-gray-500">
            {t('home.howSubtitle')}
          </p>

          <ol className="mt-8 grid gap-6 md:grid-cols-3 md:gap-8">
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="relative flex flex-col rounded-2xl bg-gray-50 p-5 md:p-6"
              >
                {/* Qadam ka number aur icon */}
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white">
                    <FontAwesomeIcon icon={step.icon} />
                  </span>
                  <span
                    className="text-3xl font-extrabold tabular-nums text-gray-200"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-4 font-semibold">
                  <span className="sr-only">{t('home.stepNumber', { number: i + 1 })} </span>
                  {step.title}
                </h3>
                <p className="mt-1 flex-1 text-sm text-gray-600">{step.body}</p>
                <Link
                  to={step.to}
                  className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-medium text-gray-900 underline-offset-4 hover:underline"
                >
                  {step.link}
                  <FontAwesomeIcon icon={faArrowRight} className="text-[10px] rtl:rotate-180" />
                </Link>
                {/* Agle qadam ki taraf teer (sirf desktop) */}
                {i < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute -end-6 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm ring-1 ring-gray-200 md:flex"
                  >
                    <FontAwesomeIcon icon={faArrowRight} className="text-xs rtl:rotate-180" />
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <FeatureBlocks />

      {/* ✅ DOOSRA CONTAINER: Testimonials, FAQ, CTA */}
      <div className="mx-auto max-w-6xl space-y-16 px-4">
        {/* Asal logon ki baatein (list khali ho to ye hissa nahi dikhta) */}
        <TestimonialsSlider />

        {/* Aksar pooche jane wale sawal */}
        <FaqSection />

        {/* Aakhri dawat: muft shuru karo ya demo mango. Talent ke liye profile claim ka chhota rasta */}
        <section className="keep-dark relative isolate overflow-hidden rounded-3xl bg-gray-900 px-6 py-10 text-center text-white md:px-12 md:py-14">
          <div
            aria-hidden="true"
            className="absolute -top-24 start-1/2 -z-10 h-64 w-64 -translate-x-1/2 rounded-full bg-white/10 blur-3xl rtl:translate-x-1/2"
          />
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
            <FontAwesomeIcon icon={faRocket} />
          </span>
          <h2 className="mx-auto mt-5 max-w-2xl text-2xl font-bold tracking-tight md:text-4xl">
            {t('home.finalTitle')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/75 md:text-base">
            {t('home.finalBody')}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={startTo}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100"
            >
              {user ? t('home.ctaDashboard') : t('home.startFree')}
              <FontAwesomeIcon icon={faArrowRight} className="text-xs rtl:rotate-180" />
            </Link>
            <a
              href={demoHref}
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
              {t('home.requestDemo')}
            </a>
          </div>
          {!user && (
            <p className="mt-6 text-xs text-white/60">
              {t('home.ctaTalentTitle')}{' '}
              <Link to="/search" className="font-medium text-white underline underline-offset-4">
                {t('home.claimLink')}
              </Link>
            </p>
          )}
        </section>
      </div>
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