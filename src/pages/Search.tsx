import { useTranslation } from 'react-i18next'
import { useEffect, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChevronDown,
  faMagnifyingGlass,
  faPlus,
  faSliders,
  faUserGroup,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { peopleQuery } from '../api/queries'
import Pagination from '../components/Pagination'
import PersonCard from '../components/PersonCard'
import SearchBar from '../components/SearchBar'
import {
  COUNTRY_OPTIONS,
  FOLLOWER_OPTIONS,
  LANGUAGE_OPTIONS,
  SORT_OPTIONS,
  STATUS_LABELS,
} from '../constants/people'
import { useTaxonomy } from '../hooks/useTaxonomy'
import { countryName, languageName } from '../utils/format'

const PAGE_SIZE = 12
// Explore ke upar wale card ki tasveer (Unsplash)
const HEADER_IMAGE =
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80'
const FILTER_KEYS = [
  'profession',
  'industry',
  'topic',
  'country',
  'city',
  'language',
  'minFollowers',
  'status',
]

interface Option {
  value: string
  label: string
}

function FilterSelect({
  label,
  name,
  value,
  options,
  onChange,
}: {
  label: string
  name: string
  value: string
  options: Option[]
  onChange: (name: string, value: string) => void
}) {
  const { t } = useTranslation()
  return (
    <label className="block min-w-0">
      <span className="mb-1 block text-xs font-medium text-gray-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className={`w-full truncate rounded-xl border bg-white px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-gray-900 ${
          value ? 'border-gray-900 font-medium' : 'border-gray-200 hover:border-gray-400'
        }`}
      >
        <option value="">{t('search.any')}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

// City likhte waqt har harf pe search na ho: Enter ya bahar click pe lagao
function CityFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState(value)

  return (
    <label className="block min-w-0">
      <span className="mb-1 block text-xs font-medium text-gray-500">{t('search.city')}</span>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => onChange(draft.trim())}
        onKeyDown={(e) => e.key === 'Enter' && onChange(draft.trim())}
        placeholder={t('search.cityPlaceholder')}
        className={`w-full rounded-xl border bg-white px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-gray-900 ${
          value ? 'border-gray-900 font-medium' : 'border-gray-200 hover:border-gray-400'
        }`}
      />
    </label>
  )
}

function Search() {
  const { t } = useTranslation()
  const { user } = useAuth()
  // Saare filters URL mein: /search?q=ai&country=PK&page=2
  // Is se link share ho sakta hai aur back button kaam karta hai
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const { data: professions } = useTaxonomy('professions')
  const { data: industries } = useTaxonomy('industries')
  const { data: topics } = useTaxonomy('topics')

  const page = Number(searchParams.get('page')) || 1
  const params = new URLSearchParams(searchParams)
  params.set('limit', String(PAGE_SIZE))
  if (!params.get('sort')) params.set('sort', 'followers')

  const queryClient = useQueryClient()
  const { data, isLoading, isError } = useQuery({
    ...peopleQuery(params),
    // Naya page load hote waqt purane results dikhate raho (khali screen nahi)
    placeholderData: keepPreviousData,
  })

  // Agla page pehle se cache mein la kar rakho, taake "Next" foran khule
  const paramsKey = params.toString()
  const hasNextPage = data ? page * PAGE_SIZE < data.meta.total : false
  useEffect(() => {
    if (!hasNextPage) return
    const nextParams = new URLSearchParams(paramsKey)
    nextParams.set('page', String(page + 1))
    queryClient.prefetchQuery(peopleQuery(nextParams))
  }, [hasNextPage, paramsKey, page, queryClient])

  // Functional updates: hamesha taaza URL params se shuru karo
  function setFilter(name: string, value: string) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) next.set(name, value)
      else next.delete(name)
      next.delete('page') // filter badla to pehle page pe wapas
      return next
    })
  }

  function setPage(nextPage: number) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('page', String(nextPage))
      return next
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function clearFilters() {
    setSearchParams((prev) => {
      const next = new URLSearchParams()
      const q = prev.get('q')
      if (q) next.set('q', q)
      return next
    })
  }

  const get = (name: string) => searchParams.get(name) ?? ''
  const toOptions = (items?: { slug: string; name: string }[]): Option[] =>
    items?.map((item) => ({ value: item.slug, label: item.name })) ?? []
  const activeFilters = FILTER_KEYS.filter((key) => searchParams.get(key)).length
  const total = data?.meta.total ?? 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  // Lagaye gaye filters ke chips: "Industry: Technology ×"
  const optionLabel = (options: Option[], value: string) =>
    options.find((o) => o.value === value)?.label ?? value
  const countryOptions = COUNTRY_OPTIONS.map((code) => ({ value: code, label: countryName(code) }))
  const languageOptions = LANGUAGE_OPTIONS.map((code) => ({
    value: code,
    label: languageName(code),
  }))
  const statusOptions = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))
  const filterDefs: { key: string; label: string; options?: Option[] }[] = [
    { key: 'profession', label: t('search.profession'), options: toOptions(professions) },
    { key: 'industry', label: t('search.industry'), options: toOptions(industries) },
    { key: 'topic', label: t('search.topic'), options: toOptions(topics) },
    { key: 'country', label: t('search.country'), options: countryOptions },
    { key: 'city', label: t('search.city') },
    { key: 'language', label: t('search.language'), options: languageOptions },
    { key: 'minFollowers', label: t('search.followers'), options: FOLLOWER_OPTIONS },
    { key: 'status', label: t('search.availability'), options: statusOptions },
  ]
  const chips = filterDefs
    .filter((f) => get(f.key))
    .map((f) => ({
      key: f.key,
      text: `${f.label}: ${f.options ? optionLabel(f.options, get(f.key)) : get(f.key)}`,
    }))

  // Sirf guest (login ke baad) aur talent khud profile bhej sakte hain
  const canCreateProfile = !user || user.role === 'talent'

  let results: ReactNode
  if (isLoading) {
    results = (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-2xl bg-gray-200/70" />
        ))}
      </div>
    )
  } else if (isError) {
    results = (
      <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{t('search.loadError')}</p>
    )
  } else if (data && data.people.length === 0) {
    results = (
      <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
          <FontAwesomeIcon icon={faUserGroup} />
        </span>
        <p className="mt-4 font-semibold">{t('search.noResults')}</p>
        <p className="mt-1 text-sm text-gray-500">{t('search.noResultsHint')}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {activeFilters > 0 && (
            <button
              onClick={clearFilters}
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              {t('search.clearFilters')}
            </button>
          )}
          {canCreateProfile && (
            <Link
              to="/my-profile/new"
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100"
            >
              {t('newProfile.ctaLong')}
            </Link>
          )}
        </div>
      </div>
    )
  } else {
    results = (
      <>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data?.people.map((person) => (
            <PersonCard key={person._id} person={person} />
          ))}
        </div>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        {/* Talent ko apni profile na mile to khud bheje */}
        {canCreateProfile && (
          <div className="mt-8 flex flex-col items-start justify-between gap-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:flex-row sm:items-center">
            <div>
              <p className="font-semibold">{t('newProfile.bannerTitle')}</p>
              <p className="mt-0.5 text-sm text-gray-500">{t('newProfile.bannerBody')}</p>
            </div>
            <Link
              to="/my-profile/new"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              <FontAwesomeIcon icon={faPlus} className="text-xs" />
              {t('newProfile.cta')}
            </Link>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="space-y-6">
      {/* Upar: heading + search */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-gray-900 px-5 py-10 text-white sm:px-8 md:py-14">
        {/* Peeche tasveer; likhai wali taraf gehra parda taake text saaf parha jaye */}
        <img
          src={HEADER_IMAGE}
          alt=""
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-950/95 via-gray-950/75 to-gray-950/20 rtl:bg-gradient-to-l" />
        <div className="relative max-w-2xl">
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/60">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            {t('search.eyebrow')}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
            {t('search.title')}
          </h1>
          <p className="mt-1 text-sm text-white/70">{t('search.subtitle')}</p>
          <div className="mt-5">
            <SearchBar key={get('q')} initialValue={get('q')} tone="onDark" />
          </div>
        </div>
      </section>

      {/* Filters: ek horizontal patti. Phone pe button se khulti hai */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowFilters((open) => !open)}
            aria-expanded={showFilters}
            className="inline-flex items-center gap-2 text-sm font-semibold md:pointer-events-none"
          >
            <FontAwesomeIcon icon={faSliders} className="text-gray-500" />
            {t('search.filters')}
            {activeFilters > 0 && (
              <span className="rounded-full bg-gray-900 px-2 py-0.5 text-[11px] font-semibold text-white">
                {activeFilters}
              </span>
            )}
            <span className="md:hidden">
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-[10px] text-gray-400 transition ${showFilters ? 'rotate-180' : ''}`}
              />
            </span>
          </button>
          {activeFilters > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-medium text-gray-500 underline-offset-2 hover:text-gray-900 hover:underline"
            >
              {t('search.clearAllFilters')}
            </button>
          )}
        </div>

        <div
          className={`${showFilters ? 'grid' : 'hidden'} mt-4 grid-cols-2 gap-3 sm:grid-cols-3 md:grid lg:grid-cols-4 xl:grid-cols-8`}
        >
          <FilterSelect
            label={t('search.profession')}
            name="profession"
            value={get('profession')}
            options={toOptions(professions)}
            onChange={setFilter}
          />
          <FilterSelect
            label={t('search.industry')}
            name="industry"
            value={get('industry')}
            options={toOptions(industries)}
            onChange={setFilter}
          />
          <FilterSelect
            label={t('search.topic')}
            name="topic"
            value={get('topic')}
            options={toOptions(topics)}
            onChange={setFilter}
          />
          <FilterSelect
            label={t('search.country')}
            name="country"
            value={get('country')}
            options={countryOptions}
            onChange={setFilter}
          />
          <CityFilter
            key={get('city')}
            value={get('city')}
            onChange={(value) => setFilter('city', value)}
          />
          <FilterSelect
            label={t('search.language')}
            name="language"
            value={get('language')}
            options={languageOptions}
            onChange={setFilter}
          />
          <FilterSelect
            label={t('search.followers')}
            name="minFollowers"
            value={get('minFollowers')}
            options={FOLLOWER_OPTIONS}
            onChange={setFilter}
          />
          <FilterSelect
            label={t('search.availability')}
            name="status"
            value={get('status')}
            options={statusOptions}
            onChange={setFilter}
          />
        </div>

        {chips.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
            {chips.map((chip) => (
              <li key={chip.key}>
                <button
                  type="button"
                  onClick={() => setFilter(chip.key, '')}
                  aria-label={t('search.removeFilter', { name: chip.text })}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-800 transition hover:bg-gray-900 hover:text-white"
                >
                  {chip.text}
                  <FontAwesomeIcon icon={faXmark} className="text-[10px]" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Natije: ginti + tarteeb */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          {data ? (
            <>
              <span className="font-semibold text-gray-900">{total}</span>{' '}
              {t('search.peopleFound', { count: total })}
            </>
          ) : (
            ' '
          )}
        </p>
        <label className="flex items-center gap-2 text-sm text-gray-500">
          {t('search.sortBy')}
          <select
            value={get('sort') || 'followers'}
            onChange={(e) => setFilter('sort', e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 hover:border-gray-400"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section>{results}</section>
    </div>
  )
}

export default Search
