import type { Currency } from './services'
import type { Role } from './user'

// pending -> admin dekh raha hai, approved -> verified (hire kar sakta hai), rejected -> dobara bhejo
export type BusinessStatus = 'pending' | 'approved' | 'rejected'
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
}

export interface HireRequest {
  _id: string
  person: { _id: string; name: string; slug: string; headline?: string; photoUrl?: string; verified: boolean } | null
  businessProfile?: {
    _id: string
    companyName: string
    websiteUrl: string
    industry?: string
    country: string
    city?: string
    status: BusinessStatus
  } | null
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
