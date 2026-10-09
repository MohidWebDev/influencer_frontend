import { useCallback, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowLeft,
  faArrowUpRightFromSquare,
  faBan,
  faCheck,
} from '@fortawesome/free-solid-svg-icons'
import { getAdminBusiness, reviewBusiness } from '../../api/business'
import ConfirmDialog from '../../components/admin-panel/ConfirmDialog'
import DataState from '../../components/admin-panel/DataState'
import HistoryList from '../../components/admin-panel/HistoryList'
import StatusPill from '../../components/admin-panel/StatusPill'
import { adminErrorMessage, formatDateTime } from '../../utils/adminFormat'
import { countryName } from '../../utils/format'

const card = 'rounded-2xl bg-white p-5 shadow-sm'
const button =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50'

function Row({ label, children }: { label: string; children?: ReactNode }) {
  if (!children) return null
  return (
    <div className="grid gap-1 py-2 sm:grid-cols-[180px_1fr]">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="min-w-0 break-words text-sm">{children}</dd>
    </div>
  )
}

const ExternalLink = ({ href }: { href: string }) => (
  <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="underline">
    {href}
    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="ms-1.5 text-xs" />
  </a>
)

// /admin/businesses/:id -> company details dekh kar approve / reject
function AdminBusinessDetailPage() {
  const { id = '' } = useParams()
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [dialog, setDialog] = useState<'approve' | 'reject' | null>(null)
  const [reason, setReason] = useState('')
  // Stable rakho: ConfirmDialog har nayi onCancel pe focus Cancel button pe le jata hai
  const closeDialog = useCallback(() => setDialog(null), [])

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin', 'business', id],
    queryFn: () => getAdminBusiness(id),
  })

  const review = useMutation({
    mutationFn: (input: { action: 'approve' | 'reject'; reason?: string }) =>
      reviewBusiness(id, input.action, input.reason),
    onSuccess: (business) => {
      toast.success(
        business.status === 'approved' ? t('businesses.approved') : t('businesses.rejected'),
      )
      setDialog(null)
      setReason('')
      queryClient.invalidateQueries({ queryKey: ['admin'] })
    },
    onError: (error) => toast.error(adminErrorMessage(error)),
  })

  const business = data?.business

  return (
    <>
      <Link to="/admin/businesses" className="mb-4 inline-flex items-center gap-2 text-sm underline">
        <FontAwesomeIcon icon={faArrowLeft} className="rtl:rotate-180" />
        {t('common.back')}
      </Link>
      <DataState
        isLoading={isLoading}
        isError={isError}
        error={error}
        isEmpty={!business}
        backTo="/admin/businesses"
        onRetry={() => refetch()}
      >
        {business && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold">{business.companyName}</h1>
              <StatusPill status={business.status} label={t(`businessStatus.${business.status}`)} />
            </div>

            <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
              <section className={card}>
                <h2 className="font-semibold">{t('businesses.details')}</h2>
                <dl className="mt-2 divide-y divide-gray-100">
                  <Row label={t('business.fields.websiteUrl')}>
                    <ExternalLink href={business.websiteUrl} />
                  </Row>
                  <Row label={t('business.fields.industry')}>{business.industry}</Row>
                  <Row label={t('business.fields.companySize')}>
                    {business.companySize &&
                      t('business.fields.employees', { size: business.companySize })}
                  </Row>
                  <Row label={t('business.fields.registrationNumber')}>
                    {business.registrationNumber}
                  </Row>
                  <Row label={t('business.fields.country')}>
                    {[business.city, countryName(business.country)].filter(Boolean).join(', ')}
                  </Row>
                  <Row label={t('business.fields.contactPhone')}>{business.contactPhone}</Row>
                  <Row label={t('business.fields.description')}>
                    {business.description && (
                      <span className="whitespace-pre-line">{business.description}</span>
                    )}
                  </Row>
                  <Row label={t('business.fields.proofLinks')}>
                    {business.proofLinks.length > 0 && (
                      <ul className="space-y-1">
                        {business.proofLinks.map((link) => (
                          <li key={link}>
                            <ExternalLink href={link} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </Row>
                </dl>
              </section>

              <div className="space-y-5">
                <section className={card}>
                  <h2 className="text-sm font-medium text-gray-500">{t('businesses.owner')}</h2>
                  {business.owner ? (
                    <>
                      <p className="mt-3 font-semibold">{business.owner.name}</p>
                      <p className="break-all text-sm text-gray-600">{business.owner.email}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {t('businesses.joined', { date: formatDateTime(business.owner.createdAt) })}
                      </p>
                    </>
                  ) : (
                    <p className="mt-3 text-sm text-gray-500">{t('claims.deletedUser')}</p>
                  )}
                  <p className="mt-3 text-xs text-gray-500">
                    {t('businesses.submittedOn', { date: formatDateTime(business.submittedAt) })}
                  </p>
                </section>

                <section className={`${card} space-y-3`}>
                  <h2 className="font-semibold">{t('businesses.decision')}</h2>
                  {business.status === 'rejected' && business.rejectionReason && (
                    <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                      {t('claims.rejectionReason', { reason: business.rejectionReason })}
                    </p>
                  )}
                  {business.reviewedBy && business.reviewedAt && (
                    <p className="text-xs text-gray-500">
                      {t('reports.handled', {
                        name: business.reviewedBy.name,
                        date: formatDateTime(business.reviewedAt),
                      })}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {business.status !== 'approved' && (
                      <button
                        onClick={() => setDialog('approve')}
                        className={`${button} bg-green-600 text-white hover:bg-green-700`}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                        {t('businesses.approve')}
                      </button>
                    )}
                    {business.status !== 'rejected' && (
                      <button
                        onClick={() => setDialog('reject')}
                        className={`${button} border border-red-200 text-red-600 hover:bg-red-50`}
                      >
                        <FontAwesomeIcon icon={faBan} />
                        {business.status === 'approved'
                          ? t('businesses.revoke')
                          : t('businesses.reject')}
                      </button>
                    )}
                  </div>
                </section>
              </div>
            </div>

            <HistoryList history={data.history} />

            <ConfirmDialog
              open={dialog === 'approve'}
              title={t('businesses.approveTitle')}
              tone="success"
              confirmLabel={t('businesses.approve')}
              isBusy={review.isPending}
              onConfirm={() => review.mutate({ action: 'approve' })}
              onCancel={closeDialog}
            >
              {t('businesses.approveBody', { name: business.companyName })}
            </ConfirmDialog>
            <ConfirmDialog
              open={dialog === 'reject'}
              title={t('businesses.rejectTitle')}
              tone="danger"
              confirmLabel={
                business.status === 'approved' ? t('businesses.revoke') : t('businesses.reject')
              }
              isBusy={review.isPending}
              onConfirm={() =>
                review.mutate({ action: 'reject', reason: reason.trim() || undefined })
              }
              onCancel={closeDialog}
            >
              <label htmlFor="reject-reason" className="mb-1 block font-medium text-gray-900">
                {t('businesses.rejectReason')}
              </label>
              <textarea
                id="reject-reason"
                rows={3}
                maxLength={500}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t('businesses.rejectPlaceholder')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </ConfirmDialog>
          </div>
        )}
      </DataState>
    </>
  )
}

export default AdminBusinessDetailPage
