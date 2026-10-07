// pending            -> admin ko code bhejna hai
// waiting_for_talent -> talent ko code (OTP) daalna hai
// otp_failed         -> talent ne 5 dafa ghalat code daala, claim lock (admin dekhega)
// verified           -> tasdeeq ho gayi (OTP ya admin), admin final approve karega
// approved / rejected
export type ClaimStatus =
  | 'pending'
  | 'waiting_for_talent'
  | 'otp_failed'
  | 'verified'
  | 'approved'
  | 'rejected'

export const CLAIM_STATUSES: ClaimStatus[] = [
  'pending',
  'waiting_for_talent',
  'otp_failed',
  'verified',
  'approved',
  'rejected',
]

export const OPEN_CLAIM_STATUSES: ClaimStatus[] = [
  'pending',
  'waiting_for_talent',
  'otp_failed',
  'verified',
]

export const MAX_OTP_ATTEMPTS = 5

export type VerificationMethod = 'otp' | 'admin_manual'

export function isOpenClaim(status: ClaimStatus) {
  return OPEN_CLAIM_STATUSES.includes(status)
}

export interface ClaimPerson {
  _id: string
  name: string
  slug: string
  headline?: string
  photoUrl?: string
  claimedBy: string | null
}

export interface Claim {
  _id: string
  person: ClaimPerson
  // Admin list mein user ki details aati hain, "mine" mein sirf id
  user: string | { _id: string; name: string; email: string; role: string }
  status: ClaimStatus
  evidence: { contactEmail?: string; links: string[]; note?: string }
  verification?: {
    channelUrl?: string
    codeSentAt?: string
    expiresAt?: string
  }
  // Purane claims mein na ho to 0 samjho
  otpAttempts?: number
  otpLockedAt?: string
  lastOtpAttemptAt?: string
  verifiedAt?: string
  // null = talent ne OTP se khud tasdeeq ki
  verifiedBy?: { _id: string; name: string; email: string } | string | null
  verificationMethod?: VerificationMethod
  rejectionReason?: string
  reviewedAt?: string
  createdAt: string
}

export interface ClaimInput {
  personId: string
  contactEmail?: string
  links: string[]
  note?: string
}

// Admin list ke filters
export type ClaimFilter = ClaimStatus | 'open' | 'needs_action' | 'all'
