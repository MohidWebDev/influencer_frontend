import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { faBuilding } from '@fortawesome/free-solid-svg-icons'
import { listAdminBusinesses } from '../../api/business'
import AdminPager from '../../components/admin-panel/AdminPager'
import DataState from '../../components/admin-panel/DataState'
import PageHeader from '../../components/admin-panel/PageHeader'
import StatusPill from '../../components/admin-panel/StatusPill'
import { BUSINESS_STATUSES } from '../../types/business'
import { formatDateTime } from '../../utils/adminFormat'
import { countryName } from '../../utils/format'

const PAGE_SIZE = 20

// /admin/businesses -> business verification ki queue
function AdminBusinessesPage() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')
  const page = Number(params.get('page')) || 1
  const apiParams = new URLSearchParams(params)
  apiParams.set('limit', String(PAGE_SIZE))

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin', 'businesses', apiParams.toString()],
    queryFn: () => listAdminBusinesses(apiParams),
    placeholderData: keepPreviousData,
  })

  // Functional update: hamesha taaza URL params se shuru karo, purane snapshot se nahi
  function setParam(name: string, value: string) {
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) next.set(name, value)
      else next.delete(name)
      if (name !== 'page') next.delete('page')
      return next
    })
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    setParam('q', q.trim())
  }

  const filtered = [...params.keys()].some((key) => key !== 'page')

  return (
    <>
      <PageHeader title={t('businesses.title')} subtitle={t('businesses.subtitle')}>
        <div className="flex flex-wrap gap-2">
          <form onSubmit={handleSearch}>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('businesses.searchPlaceholder')}
              aria-label={t('common.search')}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            />
          </form>
          <select
            aria-label={t('businesses.colStatus')}
            value={params.get('status') ?? ''}
            onChange={(e) => setParam('status', e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">{t('businesses.allStatuses')}</option>
            <option value="needs_action">{t('claimFilter.needs_action')}</option>
            <option value="open">{t('claimFilter.open')}</option>
            {BUSINESS_STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`businessStatus.${s}`)}
              </option>
            ))}
          </select>
        </div>
      </PageHeader>

      <DataState
        isLoading={isLoading}
        isError={isError && !data}
        error={error}
        isEmpty={!!data && data.businesses.length === 0}
        emptyIcon={faBuilding}
        emptyTitle={filtered ? t('dataState.filteredTitle') : t('businesses.emptyTitle')}
        emptyText={filtered ? t('dataState.filteredText') : t('businesses.emptyText')}
        onRetry={() => refetch()}
      >
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-gray-100 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-start font-medium">{t('businesses.colCompany')}</th>
                <th className="px-4 py-3 text-start font-medium">{t('businesses.colOwner')}</th>
                <th className="px-4 py-3 text-start font-medium">{t('businesses.colCountry')}</th>
                <th className="px-4 py-3 text-start font-medium">{t('businesses.colStatus')}</th>
                <th className="px-4 py-3 text-start font-medium">{t('businesses.colSubmitted')}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.businesses.map((business) => (
                <tr key={business._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{business.companyName}</p>
                    <p className="truncate text-xs text-gray-500">{business.websiteUrl}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {business.owner?.email ?? t('claims.deletedUser')}
                  </td>
                  <td className="px-4 py-3">{countryName(business.country)}</td>
                  <td className="px-4 py-3">
                    <StatusPill
                      status={business.status}
                      label={t(`businessStatus.${business.status}`)}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatDateTime(business.submittedAt)}</td>
                  <td className="px-4 py-3 text-end">
                    <Link
                      to={`/admin/businesses/${business._id}`}
                      className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-100"
                    >
                      {t('common.view')}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data && (
          <AdminPager
            page={page}
            limit={PAGE_SIZE}
            total={data.meta.total}
            onChange={(p) => setParam('page', String(p))}
          />
        )}
      </DataState>
    </>
  )
}

export default AdminBusinessesPage
