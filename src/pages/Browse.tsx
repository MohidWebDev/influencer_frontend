import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faBriefcase,
  faBuilding,
  faCar,
  faChartLine,
  faEarthAsia,
  faFilm,
  faFutbol,
  faGamepad,
  faGavel,
  faGraduationCap,
  faHandHoldingHeart,
  faHashtag,
  faIndustry,
  faLandmark,
  faLayerGroup,
  faMagnifyingGlass,
  faMicrochip,
  faMusic,
  faNewspaper,
  faPalette,
  faPersonPraying,
  faPlane,
  faSeedling,
  faShirt,
  faStethoscope,
  faUtensils,
  faFlask,
  faXmark,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import { COUNTRY_OPTIONS } from '../constants/people'
import { useTaxonomy } from '../hooks/useTaxonomy'
import { countryName } from '../utils/format'

// Upar wale card ki tasveer (Unsplash)
const HEADER_IMAGE =
  'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80'

// Industry ke slug mein ye lafz ho to ye icon (database ke naam badlein to bhi chale)
const INDUSTRY_ICONS: [string, IconDefinition][] = [
  ['tech', faMicrochip],
  ['media', faNewspaper],
  ['entertain', faFilm],
  ['music', faMusic],
  ['sport', faFutbol],
  ['health', faStethoscope],
  ['business', faChartLine],
  ['education', faGraduationCap],
  ['fashion', faShirt],
  ['food', faUtensils],
  ['travel', faPlane],
  ['gaming', faGamepad],
  ['politic', faLandmark],
  ['non-profit', faHandHoldingHeart],
  ['religion', faPersonPraying],
  ['real-estate', faBuilding],
  ['automotive', faCar],
  ['agri', faSeedling],
  ['art', faPalette],
  ['science', faFlask],
  ['law', faGavel],
]
const iconFor = (slug: string) =>
  INDUSTRY_ICONS.find(([key]) => slug.includes(key))?.[1] ?? faLayerGroup

// Har card ka apna halka rang (baari baari)
const TINTS = [
  'bg-sky-50 text-sky-700',
  'bg-violet-50 text-violet-700',
  'bg-amber-50 text-amber-700',
  'bg-emerald-50 text-emerald-700',
  'bg-rose-50 text-rose-700',
  'bg-indigo-50 text-indigo-700',
]

// "PK" -> 🇵🇰
const flag = (code: string) =>
  String.fromCodePoint(...[...code.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)))

interface Item {
  key: string
  label: string
  to: string
}

const SECTIONS = ['industries', 'professions', 'topics', 'countries'] as const
type SectionId = (typeof SECTIONS)[number]

function SectionHeader({
  id,
  icon,
  title,
  count,
}: {
  id: SectionId
  icon: IconDefinition
  title: string
  count: number
}) {
  return (
    <div id={id} className="flex scroll-mt-24 items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white">
        <FontAwesomeIcon icon={icon} />
      </span>
      <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
      <span className="rounded-full bg-gray-200/70 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
        {count}
      </span>
    </div>
  )
}

const skeleton = (count: number, className: string) =>
  Array.from({ length: count }, (_, i) => (
    <div key={i} className={`animate-pulse rounded-2xl bg-gray-200/70 ${className}`} />
  ))

// /browse -> industry, profession, topic aur mulk ke hisaab se dhoondo
function Browse() {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('')
  const { data: professions, isLoading: loadingProfessions } = useTaxonomy('professions')
  const { data: industries, isLoading: loadingIndustries } = useTaxonomy('industries')
  const { data: topics, isLoading: loadingTopics } = useTaxonomy('topics')

  // Upar wale box mein likha lafz har list pe lagao
  const term = filter.trim().toLowerCase()
  const match = (label: string) => !term || label.toLowerCase().includes(term)
  const toItems = (items: { _id: string; name: string; slug: string }[] = [], param: string) =>
    items
      .map((item) => ({ key: item.slug, label: item.name, to: `/search?${param}=${item.slug}` }))
      .filter((item) => match(item.label))

  const industryItems = toItems(industries, 'industry')
  const professionItems = toItems(professions, 'profession')
  const topicItems = toItems(topics, 'topic')
  const countryItems: Item[] = COUNTRY_OPTIONS.map((code) => ({
    key: code,
    label: countryName(code),
    to: `/search?country=${code}`,
  })).filter((item) => match(item.label))

  const counts: Record<SectionId, number> = {
    industries: industryItems.length,
    professions: professionItems.length,
    topics: topicItems.length,
    countries: countryItems.length,
  }
  const nothingFound =
    !!term && Object.values(counts).every((count) => count === 0)

  return (
    <div className="space-y-12">
      {/* Upar: tasveer, heading aur categories mein dhoondne ka box */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-gray-900 px-5 py-12 text-white sm:px-10 md:py-16">
        <img
          src={HEADER_IMAGE}
          alt=""
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-950/95 via-gray-950/75 to-gray-950/20 rtl:bg-gradient-to-l" />
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-wider text-white/60">
            {t('browse.eyebrow')}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-5xl">
            {t('browse.title')}
          </h1>
          <p className="mt-3 text-sm text-white/75 md:text-base">{t('browse.subtitle')}</p>

          <label className="relative mt-6 block max-w-lg">
            <span className="sr-only">{t('browse.filterLabel')}</span>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder={t('browse.filterPlaceholder')}
              className="w-full rounded-xl bg-white py-3.5 pe-10 ps-11 text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-white/60"
            />
            {filter && (
              <button
                type="button"
                onClick={() => setFilter('')}
                aria-label={t('browse.clearFilter')}
                className="absolute end-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faXmark} className="text-xs" />
              </button>
            )}
          </label>
        </div>

        {/* Section pe chhalang: tabs ki tarah */}
        <nav aria-label={t('browse.jumpTo')} className="mt-8 flex flex-wrap gap-2">
          {SECTIONS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white ring-1 ring-white/20 backdrop-blur transition hover:bg-white hover:text-gray-900"
            >
              {t(`browse.${id}`)}
              <span className="text-xs opacity-70">{counts[id]}</span>
            </a>
          ))}
        </nav>
      </section>

      {nothingFound && (
        <p className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-gray-500">
          {t('browse.nothingFound', { term: filter.trim() })}
        </p>
      )}

      {/* Industries: icon wale cards */}
      {(loadingIndustries || industryItems.length > 0) && (
        <section className="space-y-5">
          <SectionHeader
            id="industries"
            icon={faIndustry}
            title={t('browse.industries')}
            count={counts.industries}
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {loadingIndustries
              ? skeleton(8, 'h-28')
              : industryItems.map((item, i) => (
                  <Link
                    key={item.key}
                    to={item.to}
                    className="group flex flex-col justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-gray-900 sm:p-5"
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${TINTS[i % TINTS.length]} transition group-hover:bg-gray-900 group-hover:text-white`}
                    >
                      <FontAwesomeIcon icon={iconFor(item.key)} />
                    </span>
                    <span className="flex items-end justify-between gap-2">
                      <span className="font-semibold leading-snug">{item.label}</span>
                      <span className="hidden shrink-0 sm:inline">
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="text-xs text-gray-300 transition group-hover:text-gray-900 rtl:rotate-180"
                        />
                      </span>
                    </span>
                  </Link>
                ))}
          </div>
        </section>
      )}

      {/* Professions: saaf chips */}
      {(loadingProfessions || professionItems.length > 0) && (
        <section className="space-y-5">
          <SectionHeader
            id="professions"
            icon={faBriefcase}
            title={t('browse.professions')}
            count={counts.professions}
          />
          <div className="flex flex-wrap gap-2 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100 md:p-6">
            {loadingProfessions
              ? skeleton(12, 'h-10 w-28 rounded-full')
              : professionItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.to}
                    className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
          </div>
        </section>
      )}

      {/* Topics: #hashtag andaaz */}
      {(loadingTopics || topicItems.length > 0) && (
        <section className="space-y-5">
          <SectionHeader
            id="topics"
            icon={faHashtag}
            title={t('browse.topics')}
            count={counts.topics}
          />
          <div className="flex flex-wrap gap-2">
            {loadingTopics
              ? skeleton(10, 'h-9 w-24 rounded-full')
              : topicItems.map((item) => (
                  <Link
                    key={item.key}
                    to={item.to}
                    className="rounded-full bg-gray-900 px-4 py-2 text-sm text-white/90 transition hover:bg-gray-700 hover:text-white"
                  >
                    <span className="text-white/50">#</span>
                    {item.label}
                  </Link>
                ))}
          </div>
        </section>
      )}

      {/* Mulk: jhande ke saath */}
      {countryItems.length > 0 && (
        <section className="space-y-5">
          <SectionHeader
            id="countries"
            icon={faEarthAsia}
            title={t('browse.countries')}
            count={counts.countries}
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {countryItems.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                className="group flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-gray-900"
              >
                <span className="text-2xl leading-none" aria-hidden="true">
                  {flag(item.key)}
                </span>
                <span className="min-w-0 font-medium leading-snug">{item.label}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Aakhir mein: seedha Explore */}
      <section className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-gray-900 p-6 text-white sm:flex-row sm:items-center md:p-8">
        <div>
          <h2 className="text-xl font-semibold">{t('browse.ctaTitle')}</h2>
          <p className="mt-1 text-sm text-white/70">{t('browse.ctaBody')}</p>
        </div>
        <Link
          to="/search"
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100"
        >
          {t('browse.ctaButton')}
          <FontAwesomeIcon icon={faArrowRight} className="text-xs rtl:rotate-180" />
        </Link>
      </section>
    </div>
  )
}

export default Browse
