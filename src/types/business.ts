import type { Currency } from './services'
import type { Role } from './user'

// Talent ke claim jaisa: admin code bhejta hai, business daalta hai, admin approve karta hai.
// Sirf approved business hire kar sakta hai
export type BusinessStatus =
  | 'pending'
  | 'waiting_for_business'
  | 'otp_failed'
  | 'code_verified'
  | 'approved'
  | 'rejected'

export const BUSINESS_STATUSES: BusinessStatus[] = [
  'pending',
  'waiting_for_business',
  'otp_failed',
  'code_verified',
  'approved',
  'rejected',
]

// Tasdeeq abhi chal rahi hai (approved / rejected nahi)
export const isOpenBusiness = (status: BusinessStatus) =>
  status !== 'approved' && status !== 'rejected'

export const MAX_BUSINESS_OTP_ATTEMPTS = 5
export type CompanySize = '1-10' | '11-50' | '51-200' | '201-1000' | '1000+'
export type HireStatus = 'pending' | 'accepted' | 'declined' | 'cancelled'

export const COMPANY_SIZES: CompanySize[] = ['1-10', '11-50', '51-200', '201-1000', '1000+']

export interface BusinessProfile {
  _id: string
  owner: string
  companyName: string
  industry?: string
  companySize?: CompanySize
  description?: string
  websiteUrl: string
  registrationNumber?: string
  country: string
  city?: string
  contactPhone?: string
  proofLinks: string[]
  status: BusinessStatus
  // Code kahan bheja gaya aur kab tak chalega
  verification?: { channel?: string; codeSentAt?: string; expiresAt?: string }
  otpAttempts?: number
  otpLockedAt?: string
  lastOtpAttemptAt?: string
  verifiedAt?: string
  verificationMethod?: 'otp' | 'admin_manual'
  submittedAt: string
  reviewedAt?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

export interface BusinessInput {
  companyName: string
  industry?: string
  companySize?: CompanySize | ''
  description?: string
  websiteUrl: string
  registrationNumber?: string
  country: string
  city?: string
  contactPhone?: string
  proofLinks: string[]
}

// Admin panel: owner aur reviewer ki details ke saath
export interface AdminBusiness extends Omit<BusinessProfile, 'owner'> {
  owner: { _id: string; name: string; email: string; role: Role; status: string; createdAt: string } | null
  reviewedBy?: { name: string; email: string }
  verifiedBy?: { name: string; email: string } | null
}

// Admin detail / code actions ka jawab: jahan code bheja ja sakta hai woh bhi
export interface AdminBusinessPayload {
  business: AdminBusiness
  channels: string[]
}

export interface HireRequest {
  _id: string
  person: { _id: string; name: string; slug: string; headline?: string; photoUrl?: string; verified: boolean } | null
  businessProfile?: {
    _id: string
    companyName: string
    websiteUrl: string
    industry?: string
    companySize?: CompanySize
    description?: string
    country: string
    city?: string
    status: BusinessStatus
  } | null
  // Accept ke baad bana muahida
  agreement?: string
  // Talent ko: pichle talents ne is business ko kitni rating di
  businessRating?: { average: number; count: number } | null
  // Sirf accept ke baad: doosri taraf ka raabta (talent ko business ka, business ko talent ka)
  contact?: { name: string; email: string; phone?: string; websiteUrl?: string }
  serviceId?: string
  serviceTitle?: string
  title: string
  message: string
  budget?: { amount: number; currency: Currency }
  startDate?: string
  status: HireStatus
  respondedAt?: string
  responseNote?: string
  createdAt: string
}

export interface HireInput {
  personId: string
  serviceId?: string
  title: string
  message: string
  budget?: { amount: number; currency: Currency }
  startDate?: string
}
