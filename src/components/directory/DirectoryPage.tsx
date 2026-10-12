import { useState, type FormEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowUpRightFromSquare,
  faCalendar,
  faCircleCheck,
  faHourglassHalf,
  faLocationDot,
  faMagnifyingGlass,
  faUserPlus,
  faUsers,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import Pagination from '../Pagination'
import { directoryQuery } from '../../api/queries'
import { useAuth } from '../../hooks/useAuth'
import type { DirectoryBusiness, DirectoryManager } from '../../types/directory'
import { countryName, initials } from '../../utils/format'

const PAGE_SIZE = 12

type Kind = 'businesses' | 'managers'

// Kis account type se sign up (register page pe pehle se chuna hua)
const SIGNUP_TYPE: Record<Kind, string> = { businesses: 'business', managers: 'representative' }

function Badge({
  tone,
  icon,
  children,
}: {
  tone: string
  icon: IconDefinition
  children: ReactNode
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${tone}`}
    >
      <FontAwesomeIcon icon={icon} className="text-[10px]" />
      {children}
    </span>
  )
}

// "https://www.acme.com/about" -> "acme.com"
const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

// Ek business ya manager ka card
function EntryCard({
  name,
  subtitle,
  description,
  entry,
  extra,
}: {
  name: string
  subtitle?: string
  description?: string
  entry: DirectoryBusiness | DirectoryManager
  extra?: ReactNode
}) {
  const { t, i18n } = useTranslation()
  const location = [entry.city, countryName(entry.country)].filter(Boolean).join(', ')
  const joined = new Date(entry.joinedAt).toLocaleDateString(i18n.language, {
    month: 'short',
    year: 'numeric',
  })

  return (
    <article className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-sm">
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-base font-semibold text-white"
        >
          {initials(name)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate font-semibold text-gray-900">{name}</h3>
            {entry.verified ? (
              <Badge tone="bg-blue-50 text-blue-700" icon={faCircleCheck}>
                {t('site.verified')}
              </Badge>
            ) : entry.inReview ? (
              <Badge tone="bg-amber-50 text-amber-800" icon={faHourglassHalf}>
                {t('directory.inReview')}
              </Badge>
            ) : (
              <Badge tone="bg-gray-100 text-gray-600" icon={faHourglassHalf}>
                {t('directory.notVerified')}
              </Badge>
            )}
          </div>
          {subtitle && <p className="mt-0.5 truncate text-sm text-gray-600">{subtitle}</p>}
        </div>
      </div>

      {description && <p className="mt-3 line-clamp-2 text-sm text-gray-600">{description}</p>}

      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4 text-xs text-gray-500">
        {location && (
          <span>
            <FontAwesomeIcon icon={faLocationDot} className="me-1 text-gray-400" />
            {location}
          </span>
        )}
        {extra}
        <span>
          <FontAwesomeIcon icon={faCalendar} className="me-1 text-gray-400" />
          {t('directory.joined', { date: joined })}
        </span>
        {entry.websiteUrl && (
          <a
            href={entry.websiteUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1 font-medium text-gray-700 hover:text-gray-950 hover:underline"
          >
            {hostOf(entry.websiteUrl)}
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[9px]" />
          </a>
        )}
      </div>
    </article>
  )
}

// /businesses aur /managers: jo bhi us qism ka account banaye, yahan aa jata hai
function DirectoryPage({ kind, icon }: { kind: Kind; icon: IconDefinition }) {
  const { t } = useTranslation()
  const { user, isLoading: checkingLogin } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const page = Number(searchParams.get('page')) || 1
  const [draft, setDraft] = useState(q)

  const params = new URLSearchParams({ page: String(page), limit: String(PAGE_SIZE) })
  if (q) params.set('q', q)
  const { data, isLoading, isError, refetch } = useQuery({
    ...directoryQuery(kind, params),
    placeholderData: keepPreviousData,
  })
  const total = data?.meta.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  // Mehman ko "is qism ka account banao" ka button (login ho to nahi)
  const showJoin = !user && !checkingLogin

  function search(e: FormEvent) {
    e.preventDefault()
    setSearchParams(draft.trim() ? { q: draft.trim() } : {})
  }
  function setPage(next: number) {
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev)
      nextParams.set('page', String(next))
      return nextParams
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const joinButton = (
    <Link
      to={`/register?type=${SIGNUP_TYPE[kind]}`}
      className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
    >
      <FontAwesomeIcon icon={faUserPlus} className="text-xs" />
      {t(`directory.${kind}.join`)}
    </Link>
  )

  let results: ReactNode
  if (isLoading) {
    results = (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-44 animate-pulse rounded-2xl bg-gray-200/70" />
        ))}
      </div>
    )
  } else if (isError) {
    results = (
      <div className="rounded-2xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-gray-200/70">
        <p className="font-semibold">{t('common.error')}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-4 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          {t('common.retry')}
        </button>
      </div>
    )
  } else if (!data || data.items.length === 0) {
    results = (
      <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
          <FontAwesomeIcon icon={q ? faMagnifyingGlass : icon} />
        </span>
        <p className="mt-4 font-semibold">
          {q ? t('directory.noMatch', { term: q }) : t(`directory.${kind}.emptyTitle`)}
        </p>
        <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
          {q ? t('directory.noMatchHint') : t(`directory.${kind}.emptyText`)}
        </p>
        {!q && showJoin && <div className="mt-5">{joinButton}</div>}
      </div>
    )
  } else {
    results = (
      <>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {kind === 'businesses'
            ? (data.items as DirectoryBusiness[]).map((b) => (
                <EntryCard
                  key={b._id}
                  entry={b}
                  name={b.name}
                  subtitle={[
                    b.industry,
                    b.companySize && t('directory.employees', { size: b.companySize }),
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                  description={b.description}
                />
              ))
            : (data.items as DirectoryManager[]).map((m) => (
                <EntryCard
                  key={m._id}
                  entry={m}
                  name={m.name}
                  subtitle={m.agencyName}
                  description={m.bio}
                  extra={
                    <span>
                      <FontAwesomeIcon icon={faUsers} className="me-1 text-gray-400" />
                      {t('directory.talents', { count: m.talents })}
                    </span>
                  }
                />
              ))}
        </div>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </>
    )
  }

  return (
    <div className="space-y-6">
      <section className="keep-dark relative isolate overflow-hidden rounded-3xl bg-gray-900 px-5 py-10 text-white sm:px-8 md:py-14">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.12),transparent_45%)]" />
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-xs font-medium tracking-wider text-white/60 uppercase">
            <FontAwesomeIcon icon={icon} />
            {t(`directory.${kind}.eyebrow`)}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
            {t(`directory.${kind}.title`)}
          </h1>
          <p className="mt-1 text-sm text-white/70">{t(`directory.${kind}.subtitle`)}</p>

          <form onSubmit={search} className="mt-5 flex max-w-lg gap-2" role="search">
            <label className="relative flex-1">
              <span className="sr-only">{t(`directory.${kind}.searchLabel`)}</span>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={t(`directory.${kind}.searchPlaceholder`)}
                className="w-full rounded-xl bg-white py-3 ps-11 pe-10 text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-white/60"
              />
              {draft && (
                <button
                  type="button"
                  onClick={() => {
                    setDraft('')
                    setSearchParams({})
                  }}
                  aria-label={t('browse.clearFilter')}
                  className="absolute end-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-xs" />
                </button>
              )}
            </label>
            <button
              type="submit"
              className="rounded-xl bg-white px-5 text-sm font-medium text-gray-900 hover:bg-gray-100"
            >
              {t('common.search')}
            </button>
          </form>
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          {data ? (
            <>
              <span className="font-semibold text-gray-900">{total}</span>{' '}
              {t(`directory.${kind}.count`, { count: total })}
            </>
          ) : (
            ' '
          )}
        </p>
        {showJoin && data && data.items.length > 0 && joinButton}
      </div>

      {results}
    </div>
  )
}

export default DirectoryPage
