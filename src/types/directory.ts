import type { OrganizationType } from './business'
import type { Campaign } from './campaign'
import type { PersonRating, SocialPlatform } from './person'

// Navbar ke public "Businesses" aur "Managers" pages
interface DirectoryEntry {
  _id: string
  name: string
  country?: string
  city?: string
  websiteUrl?: string
  // Admin ne tasdeeq kar di
  verified: boolean
  // Details bheji hain, tasdeeq chal rahi hai
  inReview: boolean
  joinedAt: string
  // Talents ki di hui reviews ka average aur ginti (koi na ho to null)
  rating: PersonRating | null
}

export interface DirectoryBusiness extends DirectoryEntry {
  // Business ka upload kiya hua logo
  logoUrl?: string
  organizationType?: OrganizationType
  industry?: string
  companySize?: string
  description?: string
}

export interface DirectoryManager extends DirectoryEntry {
  photoUrl?: string
  agencyName?: string
  bio?: string
  // Is waqt kitne talents ko represent kar rahe hain
  talents: number
}

// Detail pages
export interface BusinessDetail {
  business: DirectoryBusiness & { completedWork: number }
  campaigns: Pick<
    Campaign,
    '_id' | 'title' | 'category' | 'budget' | 'country' | 'deadline' | 'slots' | 'publishedAt'
  >[]
}

export interface RepresentedTalent {
  _id: string
  name: string
  slug: string
  headline?: string
  photoUrl?: string
  verified: boolean
  totalFollowers?: number
  country?: string
  city?: string
}

export interface ManagerDetail {
  manager: DirectoryManager & { socialAccounts: { platform: SocialPlatform; url: string }[] }
  talents: RepresentedTalent[]
}

// Talents ki likhi review (business ya manager ke baare mein)
export interface DirectoryReview {
  _id: string
  rating: number
  comment?: string
  createdAt: string
  reviewer?: string
  reviewerSlug?: string
  reviewerPhoto?: string
}

export interface DirectoryReviews {
  rating: { average: number | null; count: number }
  reviews: DirectoryReview[]
}
