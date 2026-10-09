import { Link, useSearchParams } from 'react-router-dom'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { faFileContract } from '@fortawesome/free-solid-svg-icons'
import { adminListAgreements } from '../../api/agreements'
import AdminPager from '../../components/admin-panel/AdminPager'
import DataState from '../../components/admin-panel/DataState'
import PageHeader from '../../components/admin-panel/PageHeader'
import StatusPill from '../../components/admin-panel/StatusPill'
import { AGREEMENT_STATUSES, agreementTotal } from '../../types/agreement'
import { formatDateTime } from '../../utils/adminFormat'
import { money } from '../../utils/price'

const PAGE_SIZE = 20

// /admin/agreements -> saare muahide; disputes yahan se dekhe jate hain
function AdminAgreementsPage() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const page = Number(params.get('page')) || 1
  const apiParams = new URLSearchParams(params)
  apiParams.set('limit', String(PAGE_SIZE))

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin', 'agreements', apiParams.toString()],
    queryFn: () => adminListAgreements(apiParams),
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

  const filtered = [...params.keys()].some((key) => key !== 'page')

  return (
    <>
      <PageHeader title={t('adminAgreements.title')} subtitle={t('adminAgreements.subtitle')}>
        <select
          aria-label={t('businesses.colStatus')}
          value={params.get('status') ?? ''}
          onChange={(e) => setParam('status', e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">{t('businesses.allStatuses')}</option>
          {AGREEMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {t(`agreementStatus.${s}`)}
            </option>
          ))}
        </select>
      </PageHeader>

      <DataState
        isLoading={isLoading}
        isError={isError && !data}
        error={error}
        isEmpty={!!data && data.agreements.length === 0}
        emptyIcon={faFileContract}
        emptyTitle={filtered ? t('dataState.filteredTitle') : t('adminAgreements.emptyTitle')}
        emptyText={filtered ? t('dataState.filteredText') : t('adminAgreements.emptyText')}
        onRetry={() => refetch()}
      >
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-gray-100 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-start font-medium">{t('adminAgreements.colTitle')}</th>
                <th className="px-4 py-3 text-start font-medium">{t('agreements.party.business')}</th>
                <th className="px-4 py-3 text-start font-medium">{t('agreements.party.talent')}</th>
                <th className="px-4 py-3 text-start font-medium">{t('agreements.totalLabel')}</th>
                <th className="px-4 py-3 text-start font-medium">{t('businesses.colStatus')}</th>
                <th className="px-4 py-3 text-start font-medium">{t('adminAgreements.colUpdated')}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data?.agreements.map((agreement) => (
                <tr key={agreement._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{agreement.terms.title}</td>
                  <td className="px-4 py-3">{agreement.businessProfile?.companyName ?? '—'}</td>
                  <td className="px-4 py-3">{agreement.person?.name ?? '—'}</td>
                  <td className="px-4 py-3">
                    {money(agreementTotal(agreement.terms), agreement.terms.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill
                      status={agreement.status}
                      label={t(`agreementStatus.${agreement.status}`)}
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatDateTime(agreement.updatedAt)}</td>
                  <td className="px-4 py-3 text-end">
                    <Link
                      to={`/admin/agreements/${agreement._id}`}
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

export default AdminAgreementsPage
