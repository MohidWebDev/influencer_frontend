import { useTranslation } from 'react-i18next'
import type { ClaimStatus } from '../types/claim'

// Har claim status ka apna rang: intezar = peela, lock = laal, tasdeeq = hara, reject = grey
const STYLES: Record<ClaimStatus, string> = {
  pending: 'bg-blue-50 text-blue-700 ring-blue-200',
  waiting_for_talent: 'bg-yellow-50 text-yellow-800 ring-yellow-300',
  otp_failed: 'bg-red-50 text-red-700 ring-red-200',
  verified: 'bg-green-50 text-green-700 ring-green-200',
  approved: 'bg-green-600 text-white ring-green-600',
  rejected: 'bg-gray-100 text-gray-600 ring-gray-200',
}

function ClaimStatusPill({ status }: { status: ClaimStatus }) {
  const { t } = useTranslation()
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[status] ?? 'bg-gray-100 text-gray-700 ring-gray-200'}`}
    >
      {t(`claimStatus.${status}`, { defaultValue: status })}
    </span>
  )
}

export default ClaimStatusPill
