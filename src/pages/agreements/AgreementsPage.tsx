import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { faFileContract } from '@fortawesome/free-solid-svg-icons'
import { myAgreementsQuery } from '../../api/queries'
import DataState from '../../components/admin-panel/DataState'
import StatusPill from '../../components/admin-panel/StatusPill'
import { useAuth } from '../../hooks/useAuth'
import { agreementTotal, nextStep, type AgreementParty } from '../../types/agreement'
import { formatDate } from '../../utils/adminFormat'
import { money } from '../../utils/price'

// /agreements -> business aur talent ke saare muahide
function AgreementsPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { data, isLoading, isError, error, refetch } = useQuery(myAgreementsQuery)
  const side: AgreementParty = user?.role === 'business' ? 'business' : 'talent'

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h1 className="text-2xl font-bold">{t('agreements.title')}</h1>
        <p className="mt-1 text-sm text-gray-500">{t(`agreements.subtitle.${side}`)}</p>
      </div>
      <DataState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!!data && data.length === 0}
        emptyIcon={faFileContract}
        emptyTitle={t('agreements.emptyTitle')}
        emptyText={t(`agreements.emptyText.${side}`)}
        onRetry={() => refetch()}
      >
        <ul className="space-y-3">
          {data?.map((agreement) => {
            const step = nextStep(agreement, side)
            const otherName =
              side === 'business' ? agreement.person?.name : agreement.businessProfile?.companyName
            return (
              <li key={agreement._id}>
                <Link
                  to={`/agreements/${agreement._id}`}
                  className={`block rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md md:p-5 ${
                    step && step !== 'waitingOther' && step !== 'inProgress'
                      ? 'border-amber-300'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{agreement.terms.title}</h2>
                    <StatusPill
                      status={agreement.status}
                      label={t(`agreementStatus.${agreement.status}`)}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {t(`agreements.with.${side}`, { name: otherName ?? '—' })} ·{' '}
                    {money(agreementTotal(agreement.terms), agreement.terms.currency)} ·{' '}
                    {t('agreements.updatedOn', { date: formatDate(agreement.updatedAt) })}
                  </p>
                  {step && (
                    <p className="mt-2 text-sm font-medium text-gray-900">
                      {t(`agreements.next.${step}`)}
                    </p>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </DataState>
    </div>
  )
}

export default AgreementsPage
