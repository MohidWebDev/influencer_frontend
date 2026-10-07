import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faBriefcase,
  faChevronRight,
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

// Har hissa ek safed panel: upar icon, naam, chhoti tafseel aur ginti
function Panel({
  id,
  icon,
  title,
  description,
  count,
  children,
}: {
  id: SectionId
  icon: IconDefinition
  title: string
  description: string
  count: number
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/70"
    >
      <header className="flex items-start gap-4 border-b border-gray-100 px-5 py-5 sm:px-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-sm text-white">
          <FontAwesomeIcon icon={icon} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          <p className="mt-0.5 text-sm text-gray-500">{description}</p>
        </div>
        <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold tabular-nums text-gray-600">
          {count}
        </span>
      </header>
      <div className="p-3 sm:p-4">{children}</div>
    </section>
  )
}

// Ek qatar wala link: icon/jhanda, naam, aur hover pe teer
function RowLink({ item, lead }: { item: Item; lead: ReactNode }) {
  return (
    <Link
      to={item.to}
      className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-gray-50"
    >
      {lead}
      <span className="min-w-0 flex-1 text-sm font-medium text-gray-800 group-hover:text-gray-950">
        {item.label}
      </span>
      <FontAwesomeIcon
        icon={faChevronRight}
        className="text-[10px] text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-gray-900 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
      />
    </Link>
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
  const nothingFound = !!term && Object.values(counts).every((count) => count === 0)

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

      <div className="space-y-6">
        {/* Industries: icon ke saath qataarein */}
        {(loadingIndustries || industryItems.length > 0) && (
          <Panel
            id="industries"
            icon={faIndustry}
            title={t('browse.industries')}
            description={t('browse.industriesDesc')}
            count={counts.industries}
          >
            <div className="grid gap-x-2 sm:grid-cols-2 lg:grid-cols-3">
              {loadingIndustries
                ? skeleton(9, 'm-1 h-12')
                : industryItems.map((item) => (
                    <RowLink
                      key={item.key}
                      item={item}
                      lead={
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-700 transition group-hover:bg-gray-900 group-hover:text-white">
                          <FontAwesomeIcon icon={iconFor(item.key)} />
                        </span>
                      }
                    />
                  ))}
            </div>
          </Panel>
        )}

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Professions: directory jaisi columns */}
          {(loadingProfessions || professionItems.length > 0) && (
            <div className="lg:col-span-3">
              <Panel
                id="professions"
                icon={faBriefcase}
                title={t('browse.professions')}
                description={t('browse.professionsDesc')}
                count={counts.professions}
              >
                <ul className="columns-2 gap-x-4 px-2 py-1 sm:columns-3">
                  {loadingProfessions
                    ? skeleton(12, 'mb-2 h-6 break-inside-avoid')
                    : professionItems.map((item) => (
                        <li key={item.key} className="break-inside-avoid">
                          <Link
                            to={item.to}
                            className="block rounded-lg px-2 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50 hover:text-gray-950"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                </ul>
              </Panel>
            </div>
          )}

          {/* Mulk: jhande ke saath */}
          {countryItems.length > 0 && (
            <div className="lg:col-span-2">
              <Panel
                id="countries"
                icon={faEarthAsia}
                title={t('browse.countries')}
                description={t('browse.countriesDesc')}
                count={counts.countries}
              >
                <div className="grid sm:grid-cols-2 lg:grid-cols-1">
                  {countryItems.map((item) => (
                    <RowLink
                      key={item.key}
                      item={item}
                      lead={
                        <span className="text-xl leading-none" aria-hidden="true">
                          {flag(item.key)}
                        </span>
                      }
                    />
                  ))}
                </div>
              </Panel>
            </div>
          )}
        </div>

        {/* Topics: halke tag */}
        {(loadingTopics || topicItems.length > 0) && (
          <Panel
            id="topics"
            icon={faHashtag}
            title={t('browse.topics')}
            description={t('browse.topicsDesc')}
            count={counts.topics}
          >
            <div className="flex flex-wrap gap-2 px-2 py-1">
              {loadingTopics
                ? skeleton(12, 'h-8 w-24 rounded-full')
                : topicItems.map((item) => (
                    <Link
                      key={item.key}
                      to={item.to}
                      className="rounded-full border border-gray-200 px-3.5 py-1.5 text-sm text-gray-700 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                    >
                      <span className="me-0.5 text-gray-400">#</span>
                      {item.label}
                    </Link>
                  ))}
            </div>
          </Panel>
        )}
      </div>

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
