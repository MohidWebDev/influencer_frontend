import type { AgreementStatus } from './agreement'
import type { HireStatus } from './business'
import type { ProfileStatus, SocialPlatform, TaxonomyItem } from './person'
import type { Availability, Pricing, ServiceCategory } from './services'

export const MAX_COMPARE = 4

// Lists wale page ka chhota khulasa
export interface ShortlistSummary {
  _id: string
  name: string
  description?: string
  count: number
  preview: { _id: string; name: string; photoUrl?: string }[]
  createdAt: string
  updatedAt: string
}

export interface ShortlistPerson {
  _id: string
  name: string
  // Neeche wali sab tab hi aati hain jab profile abhi bhi public ho (available)
  slug?: string
  headline?: string
  photoUrl?: string
  verified?: boolean
  claimed?: boolean
  status?: ProfileStatus
  country?: string
  city?: string
  totalFollowers?: number
  professions?: TaxonomyItem[]
  socialAccounts?: { platform: SocialPlatform; followers?: number }[]
  services?: { _id: string; title: string; category: ServiceCategory; pricing: Pricing }[]
  availability?: Availability | null
}

export interface ShortlistItem {
  personId: string
  note: string
  addedAt: string
  // false = profile chhup gayi ya mit gayi
  available: boolean
  person: ShortlistPerson | null
  rating: { average: number; count: number } | null
  // Business ki taraf se is shakhs ko aakhri hire request aur us ka muahida
  hiring: {
    hireId: string
    hireStatus: HireStatus
    agreementId: string | null
    agreementStatus: AgreementStatus | null
  } | null
}

export interface Shortlist {
  _id: string
  name: string
  description?: string
  items: ShortlistItem[]
  createdAt: string
  updatedAt: string
}

export interface SavedMembership {
  lists: { _id: string; name: string }[]
  // personId -> listIds
  saved: Record<string, string[]>
}
