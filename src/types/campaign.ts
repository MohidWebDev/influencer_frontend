import type { OrganizationType } from './business'
import type { Currency, ServiceCategory } from './services'

export type CampaignStatus = 'draft' | 'open' | 'closed'
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn'

// Business / organization ka "open call": talent khud apply karte hain
export interface Campaign {
  _id: string
  owner: string
  title: string
  brief: string
  category: ServiceCategory
  budget?: { amount: number; currency: Currency }
  // Khali = kisi bhi mulk ka talent
  country?: string
  deadline?: string
  slots: number
  status: CampaignStatus
  publishedAt?: string
  closedAt?: string
  createdAt: string
  business: {
    _id: string
    name: string
    organizationType?: OrganizationType
    country?: string
    city?: string
    websiteUrl?: string
    verified: boolean
  } | null
  counts: { applications: number; accepted: number; pending: number }
  // Open aur aakhri tareekh nahi guzri
  acceptingApplications: boolean
}

export interface CampaignInput {
  title: string
  brief: string
  category: ServiceCategory
  budget: { amount: number; currency: Currency } | null
  country: string
  deadline: string | null
  slots: number
  status?: CampaignStatus
}

export interface ApplicantPerson {
  _id: string
  name: string
  slug: string
  headline?: string
  photoUrl?: string
  verified: boolean
  country?: string
  city?: string
  totalFollowers?: number
}

export interface CampaignApplication {
  _id: string
  campaign: string
  person: ApplicantPerson
  pitch: string
  status: ApplicationStatus
  respondedAt?: string
  hire?: string
  createdAt: string
}

// Talent ki apni application (campaign ke saath)
export interface MyApplication extends Omit<CampaignApplication, 'campaign' | 'person'> {
  campaign: Campaign | null
}

export interface CampaignDetail {
  campaign: Campaign
  isOwner: boolean
  myApplication: Pick<
    CampaignApplication,
    '_id' | 'status' | 'pitch' | 'createdAt' | 'respondedAt' | 'hire'
  > | null
}
