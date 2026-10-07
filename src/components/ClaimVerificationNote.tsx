import { useTranslation } from 'react-i18next'
import { MAX_OTP_ATTEMPTS, type Claim } from '../types/claim'
import { formatDateTime } from '../utils/adminFormat'

type ClaimLike = Pick<
  Claim,
  'status' | 'otpAttempts' | 'otpLockedAt' | 'verifiedAt' | 'verifiedBy' | 'verificationMethod'
>

// List mein status ke neeche chhoti si line: koshishein, lock ka waqt, ya kisne tasdeeq ki
function ClaimVerificationNote({ claim }: { claim: ClaimLike }) {
  const { t } = useTranslation()
  const attempts = claim.otpAttempts ?? 0

  if (claim.status === 'waiting_for_talent' && attempts > 0) {
    return (
      <p className="mt-1 text-xs text-yellow-800">
        {t('claimOtp.attemptsUsed', { count: attempts, max: MAX_OTP_ATTEMPTS })}
      </p>
    )
  }
  if (claim.status === 'otp_failed') {
    return (
      <p className="mt-1 text-xs text-red-700">
        {t('claimOtp.lockedShort', { date: formatDateTime(claim.otpLockedAt) })}
      </p>
    )
  }
  if ((claim.status === 'verified' || claim.status === 'approved') && claim.verificationMethod) {
    const by = typeof claim.verifiedBy === 'object' && claim.verifiedBy ? claim.verifiedBy.name : ''
    return (
      <p className="mt-1 text-xs text-green-700">
        {claim.verificationMethod === 'otp'
          ? t('claimOtp.byOtpShort')
          : t('claimOtp.byAdminShort', { name: by || t('claimOtp.anAdmin') })}
      </p>
    )
  }
  return null
}

export default ClaimVerificationNote
