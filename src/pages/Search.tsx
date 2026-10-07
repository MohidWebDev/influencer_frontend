import { useTranslation } from 'react-i18next'
import { useEffect, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
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
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
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
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{t('search.city')}</span>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => onChange(draft.trim())}
        onKeyDown={(e) => e.key === 'Enter' && onChange(draft.trim())}
        placeholder={t('search.cityPlaceholder')}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
      />
    </label>
  )
}

function Search() {
  const { t } = useTranslation()
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

  let results: ReactNode
  if (isLoading) {
    results = <p className="text-gray-500">{t('common.loading')}</p>
  } else if (isError) {
    results = <p className="text-red-600">{t('search.loadError')}</p>
  } else if (data && data.people.length === 0) {
    results = (
      <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center">
        <p className="font-medium">{t('search.noResults')}</p>
        <button onClick={clearFilters} className="mt-3 text-sm underline">
          {t('search.clearFilters')}
        </button>
      </div>
    )
  } else {
    results = (
      <>
        <div className="grid gap-4 lg:grid-cols-2">
          {data?.people.map((person) => (
            <PersonCard key={person._id} person={person} />
          ))}
        </div>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </>
    )
  }

  return (
    <div>
      <SearchBar key={get('q')} initialValue={get('q')} />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          {data ? t('search.found', { count: total }) : ' '}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters((open) => !open)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm md:hidden"
          >
            {t('search.filters')}
            {activeFilters > 0 && ` (${activeFilters})`}
          </button>
          <select
            aria-label={t('search.sortBy')}
            value={get('sort') || 'followers'}
            onChange={(e) => setFilter('sort', e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 grid gap-6 md:grid-cols-[240px_1fr]">
        <aside
          className={`${showFilters ? 'block' : 'hidden'} space-y-4 rounded-2xl bg-white p-4 shadow-sm md:block md:self-start`}
        >
          <FilterSelect label={t('search.profession')} name="profession" value={get('profession')} options={toOptions(professions)} onChange={setFilter} />
          <FilterSelect label={t('search.industry')} name="industry" value={get('industry')} options={toOptions(industries)} onChange={setFilter} />
          <FilterSelect label={t('search.topic')} name="topic" value={get('topic')} options={toOptions(topics)} onChange={setFilter} />
          <FilterSelect
            label={t('search.country')}
            name="country"
            value={get('country')}
            options={COUNTRY_OPTIONS.map((code) => ({ value: code, label: countryName(code) }))}
            onChange={setFilter}
          />
          <CityFilter key={get('city')} value={get('city')} onChange={(value) => setFilter('city', value)} />
          <FilterSelect
            label={t('search.language')}
            name="language"
            value={get('language')}
            options={LANGUAGE_OPTIONS.map((code) => ({ value: code, label: languageName(code) }))}
            onChange={setFilter}
          />
          <FilterSelect label={t('search.followers')} name="minFollowers" value={get('minFollowers')} options={FOLLOWER_OPTIONS} onChange={setFilter} />
          <FilterSelect
            label={t('search.availability')}
            name="status"
            value={get('status')}
            options={Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))}
            onChange={setFilter}
          />
          {activeFilters > 0 && (
            <button onClick={clearFilters} className="w-full text-sm underline">
              {t('search.clearAllFilters')}
            </button>
          )}
        </aside>

        <section>{results}</section>
      </div>
    </div>
  )
}

export default Search
