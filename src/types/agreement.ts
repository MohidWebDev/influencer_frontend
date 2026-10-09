import type { BusinessStatus } from './business'
import type { Currency } from './services'

// negotiating -> active (dono ka sign) -> completed; beech mein disputed; sign se pehle cancelled
export type AgreementStatus = 'negotiating' | 'active' | 'disputed' | 'completed' | 'cancelled'
export type MilestoneStatus = 'pending' | 'delivered' | 'approved'
export type AgreementParty = 'business' | 'talent'
export type DisputeOutcome = 'continue' | 'complete' | 'cancel'

export const AGREEMENT_STATUSES: AgreementStatus[] = [
  'negotiating',
  'active',
  'disputed',
  'completed',
  'cancelled',
]
export const MAX_MILESTONES = 10
export const MAX_REVISIONS = 20

export interface AgreementMilestone {
  title: string
  amount: number
  dueDate?: string
}

export interface AgreementTerms {
  title: string
  scope: string
  currency: Currency
  milestones: AgreementMilestone[]
  paymentTerms?: string
  usageRights?: string
  revisions: number
  cancellationTerms?: string
}

export interface AgreementSignature {
  version: number
  signedAt: string
  name: string
  email: string
  ip?: string
}

export interface MilestoneWork {
  status: MilestoneStatus
  deliveredAt?: string
  deliveryNote?: string
  deliveryLink?: string
  approvedAt?: string
  changesNote?: string
}

export interface AgreementReview {
  rating: number
  comment?: string
  createdAt: string
}

export interface Agreement {
  _id: string
  hire: { _id: string; title: string; createdAt: string } | null
  business: { _id: string; name: string; email: string } | null
  talent: { _id: string; name: string; email: string } | null
  person: { _id: string; name: string; slug: string; headline?: string; photoUrl?: string } | null
  businessProfile: {
    _id: string
    companyName: string
    websiteUrl: string
    industry?: string
    country: string
    city?: string
    status: BusinessStatus
  } | null
  status: AgreementStatus
  terms: AgreementTerms
  version: number
  proposedBy: AgreementParty
  proposedAt: string
  // List mein nahi aati, sirf detail mein
  history?: { version: number; terms: AgreementTerms; proposedBy: AgreementParty; proposedAt: string }[]
  signatures: { business?: AgreementSignature; talent?: AgreementSignature }
  signedHash?: string
  activatedAt?: string
  work: MilestoneWork[]
  revisionsUsed: number
  dispute?: {
    openedBy: AgreementParty
    reason: string
    openedAt: string
    outcome?: DisputeOutcome
    note?: string
    resolvedAt?: string
    resolvedBy?: { name: string; email: string }
  }
  reviews: { business?: AgreementReview; talent?: AgreementReview }
  completedAt?: string
  cancelledAt?: string
  cancelledBy?: AgreementParty | 'admin'
  cancelReason?: string
  createdAt: string
  updatedAt: string
}

export interface PersonReviews {
  rating: { average: number | null; count: number }
  reviews: { rating: number; comment?: string; createdAt: string; business?: string }[]
}

// Kul raqam (saare milestones ka jor)
export const agreementTotal = (terms: AgreementTerms) =>
  terms.milestones.reduce((sum, m) => sum + (Number(m.amount) || 0), 0)

// Login user ko is muahide pe abhi kya karna hai (list pe chhota sa ishara)
export function nextStep(agreement: Agreement, side: AgreementParty) {
  if (agreement.status === 'negotiating') {
    return agreement.signatures[side]?.version === agreement.version ? 'waitingOther' : 'reviewAndSign'
  }
  if (agreement.status === 'active') {
    const statuses = agreement.work.map((w) => w.status)
    if (side === 'talent' && statuses.includes('pending')) return 'deliver'
    if (side === 'business' && statuses.includes('delivered')) return 'review'
    return 'inProgress'
  }
  if (agreement.status === 'completed' && !agreement.reviews?.[side]) return 'leaveReview'
  return null
}
