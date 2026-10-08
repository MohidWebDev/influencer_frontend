export type ServiceCategory =
  | 'keynote'
  | 'brand_campaign'
  | 'sponsored_post'
  | 'podcast_guest'
  | 'event_appearance'
  | 'workshop'
  | 'consulting'
  | 'other'

export type OpenTo = 'speaking' | 'campaigns' | 'podcasts' | 'events'
export type PricingType = 'fixed' | 'range' | 'quote'
export type PriceUnit = 'project' | 'event' | 'post' | 'hour' | 'day'
export type Currency = 'PKR' | 'USD' | 'AED' | 'SAR' | 'GBP' | 'EUR'
export type ResponseTime = '24h' | '3d' | '1w'

export interface Pricing {
  type: PricingType
  currency: Currency
  unit: PriceUnit
  amount?: number
  min?: number
  max?: number
}

export interface Service {
  _id: string
  title: string
  category: ServiceCategory
  description?: string
  pricing: Pricing
  deliveryDays?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Availability {
  isOpen: boolean
  openTo: OpenTo[]
  responseTime?: ResponseTime
  availableFrom?: string
  note?: string
  updatedAt?: string
}

// Form se backend ko jane wala data
export interface ServiceInput {
  title: string
  category: ServiceCategory
  description?: string
  pricing: Pricing
  deliveryDays?: number | null
  isActive: boolean
}

export interface AvailabilityInput {
  isOpen: boolean
  openTo: OpenTo[]
  responseTime?: ResponseTime | null
  availableFrom?: string | null
  note?: string
}

export interface MyServices {
  person: {
    _id: string
    name: string
    slug: string
    status: string
    photoUrl?: string
    verified: boolean
  }
  services: Service[]
  availability: Availability | null
}
