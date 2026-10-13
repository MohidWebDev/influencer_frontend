import type { SocialPlatform } from './person'
import type { AuditLogEntry } from './adminPanel'

// Manager / agent (representative account) ki tasdeeq
export type ManagerStatus = 'pending' | 'approved' | 'rejected'

export interface ManagerProfile {
  _id: string
  owner: string
  agencyName?: string
  // Optional; kam az kam ek social account zaroori
  websiteUrl?: string
  socialAccounts: ManagerSocialAccount[]
  country: string
  city?: string
  contactPhone?: string
  bio?: string
  talentsCount?: number
  proofLinks: string[]
  status: ManagerStatus
  submittedAt: string
  reviewedAt?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

export interface ManagerSocialAccount {
  platform: SocialPlatform
  url: string
}

export interface ManagerInput {
  agencyName: string
  websiteUrl: string
  socialAccounts: ManagerSocialAccount[]
  country: string
  city: string
  contactPhone: string
  bio: string
  talentsCount: string
  proofLinks: string[]
}

// Talent manager ko kya karne deta hai
export interface RepresentationPermissions {
  manageProfile: boolean
  handleHires: boolean
}

export type RepresentationStatus = 'invited' | 'requested' | 'active' | 'declined' | 'cancelled' | 'ended'

interface PersonCard {
  _id: string
  name: string
  slug: string
  photoUrl?: string
  verified: boolean
  headline?: string
}

export interface Representation {
  _id: string
  status: RepresentationStatus
  initiatedBy: 'talent' | 'manager'
  message?: string
  permissions: RepresentationPermissions
  person: PersonCard | null
  // Manager ko talent ka, talent ko manager ka naam / email
  talent: { _id: string; name: string; email: string } | string
  manager: { _id: string; name: string; email: string } | string
  // Talent ko: manager ki professional details
  managerProfile?: {
    agencyName?: string
    websiteUrl: string
    country: string
    city?: string
    bio?: string
    verified: boolean
  } | null
  respondedAt?: string
  endedAt?: string
  // Talent ki di hui review (ek dafa)
  review?: { rating: number; comment?: string; createdAt: string }
  createdAt: string
  updatedAt: string
}

export interface MyManager {
  active: Representation | null
  pending: Representation[]
  history: Representation[]
}

// Manager ka roster: har talent aur us pe kya baqi hai
export interface ManagedTalent {
  representationId: string
  since: string
  permissions: RepresentationPermissions
  person: PersonCard & { totalFollowers: number; isOpen: boolean; liveServices: number }
  pendingHires: number
  openAgreements: number
}

export interface AdminManager extends Omit<ManagerProfile, 'owner'> {
  owner: { _id: string; name: string; email: string; role: string; status: string; createdAt: string } | null
  reviewedBy?: { _id: string; name: string; email: string } | null
}

export interface AdminManagerPayload {
  manager: AdminManager
  representations: Representation[]
  history: AuditLogEntry[]
}
