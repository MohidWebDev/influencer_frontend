import { Link, useSearchParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { adminListClaims } from '../../api/claims'
import Avatar from '../../components/Avatar'
import AdminPager from '../../components/admin-panel/AdminPager'
import DataState from '../../components/admin-panel/DataState'
import PageHeader from '../../components/admin-panel/PageHeader'
import ClaimStatusPill from '../../components/ClaimStatusPill'
import ClaimVerificationNote from '../../components/ClaimVerificationNote'
import { claimPersonName, type ClaimFilter } from '../../types/claim'
import { formatDateTime } from '../../utils/adminFormat'

// "all" pehle: verified / approved claims list se gayab na hon
const FILTERS: ClaimFilter[] = [
  'all',
  'open',
  'needs_action',
  'new_profiles',
  'pending',
  'waiting_for_talent',
  'otp_failed',
  'verified',
  'approved',
  'rejected',
]
const PAGE_SIZE = 20

function AdminClaimsPage() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const status = (params.get('status') as ClaimFilter) || 'all'
  const page = Number(params.get('page')) || 1

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin', 'claims', status, page],
    queryFn: () => adminListClaims(status, page),
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

  const filterLabel = (f: ClaimFilter) =>
    f === 'all' || f === 'open' || f === 'needs_action' || f === 'new_profiles'
      ? t(`claimFilter.${f}`)
      : t(`claimStatus.${f}`)

  return (
    <>
      <PageHeader title={t('claims.title')} subtitle={t('claims.subtitle')}>
        <select
          aria-label={t('claims.colStatus')}
          value={status}
          onChange={(e) => setParam('status', e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          {FILTERS.map((f) => (
            <option key={f} value={f}>
              {filterLabel(f)}
            </option>
          ))}
        </select>
      </PageHeader>

      <DataState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!!data && data.claims.length === 0}
        emptyIcon={faUserCheck}
        emptyTitle={
          status === 'all' ? t('dataState.claimsEmptyTitle') : t('dataState.filteredTitle')
        }
        emptyText={status === 'all' ? t('dataState.claimsEmptyText') : t('dataState.filteredText')}
        onRetry={() => refetch()}
      >
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-gray-100 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-start font-medium">{t('claims.colPerson')}</th>
                <th className="px-4 py-3 text-start font-medium">{t('claims.colClaimant')}</th>
                <th className="px-4 py-3 text-start font-medium">{t('claims.colStatus')}</th>
                <th className="px-4 py-3 text-start font-medium">{t('claims.colSent')}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.claims.map((claim) => {
                const user = typeof claim.user === 'string' ? null : claim.user
                return (
                  <tr key={claim._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={claimPersonName(claim, '?')}
                          photoUrl={claim.person?.photoUrl}
                          size="sm"
                        />
                        <span className={`font-medium ${claim.person ? '' : 'text-gray-500'}`}>
                          {claimPersonName(claim, t('claims.deletedProfile'))}
                        </span>
                        {claim.isNewProfile && (
                          <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-violet-700 ring-1 ring-inset ring-violet-200">
                            {t('newProfile.badge')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p>{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <ClaimStatusPill status={claim.status} />
                      <ClaimVerificationNote claim={claim} />
                    </td>
                    <td className="px-4 py-3 text-gray-600">{formatDateTime(claim.createdAt)}</td>
                    <td className="px-4 py-3 text-end">
                      <Link
                        to={`/admin/claims/${claim._id}`}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium hover:bg-gray-100"
                      >
                        {t('common.view')}
                      </Link>
                    </td>
                  </tr>
                )
              })}
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

export default AdminClaimsPage
