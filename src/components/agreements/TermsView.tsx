import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import StatusPill from '../admin-panel/StatusPill'
import { agreementTotal, type AgreementTerms, type MilestoneWork } from '../../types/agreement'
import { formatDate } from '../../utils/adminFormat'
import { money } from '../../utils/price'

function Clause({ label, children }: { label: string; children?: ReactNode }) {
  if (!children) return null
  return (
    <div className="py-3">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 whitespace-pre-line text-sm text-gray-800">{children}</dd>
    </div>
  )
}

// Shartein parhne ke liye. work ho to har milestone ke saath us ki halat bhi
function TermsView({
  terms,
  work,
  milestoneActions,
}: {
  terms: AgreementTerms
  work?: MilestoneWork[]
  // Har milestone ke neeche buttons (deliver / approve) - detail page deta hai
  milestoneActions?: (index: number) => ReactNode
}) {
  const { t } = useTranslation()
  return (
    <div>
      <p className="whitespace-pre-line text-sm text-gray-800">{terms.scope}</p>

      <h3 className="mt-5 text-sm font-medium text-gray-500">{t('agreements.fields.milestones')}</h3>
      <ol className="mt-2 divide-y divide-gray-100 rounded-xl border border-gray-200">
        {terms.milestones.map((milestone, index) => {
          const progress = work?.[index]
          return (
            <li key={index} className="p-3">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium">
                    {index + 1}. {milestone.title}
                  </p>
                  {milestone.dueDate && (
                    <p className="text-xs text-gray-500">
                      {t('agreements.due', { date: formatDate(milestone.dueDate) })}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {progress && (
                    <StatusPill
                      status={progress.status}
                      label={t(`milestoneStatus.${progress.status}`)}
                    />
                  )}
                  <span className="font-semibold">{money(milestone.amount, terms.currency)}</span>
                </div>
              </div>
              {progress?.deliveryNote && (
                <div className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">
                  <p className="text-xs text-gray-500">
                    {t('agreements.deliveredOn', { date: formatDate(progress.deliveredAt) })}
                  </p>
                  <p className="mt-0.5 whitespace-pre-line">{progress.deliveryNote}</p>
                  {progress.deliveryLink && (
                    <a
                      href={progress.deliveryLink}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="mt-1 inline-block break-all text-sm underline"
                    >
                      {progress.deliveryLink}
                    </a>
                  )}
                </div>
              )}
              {progress?.changesNote && progress.status === 'pending' && (
                <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  {t('agreements.changesRequestedNote', { note: progress.changesNote })}
                </p>
              )}
              {milestoneActions?.(index)}
            </li>
          )
        })}
        <li className="flex justify-between p-3 text-sm font-semibold">
          <span>{t('agreements.totalLabel')}</span>
          <span>{money(agreementTotal(terms), terms.currency)}</span>
        </li>
      </ol>

      <dl className="mt-3 divide-y divide-gray-100">
        <Clause label={t('agreements.fields.paymentTerms')}>{terms.paymentTerms}</Clause>
        <Clause label={t('agreements.fields.usageRights')}>{terms.usageRights}</Clause>
        <Clause label={t('agreements.fields.revisions')}>
          {t('agreements.revisionsCount', { count: terms.revisions })}
        </Clause>
        <Clause label={t('agreements.fields.cancellationTerms')}>{terms.cancellationTerms}</Clause>
      </dl>
    </div>
  )
}

export default TermsView
