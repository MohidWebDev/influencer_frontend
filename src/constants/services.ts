import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faBriefcase,
  faBullhorn,
  faCalendarDays,
  faChalkboardUser,
  faHashtag,
  faHandshake,
  faMicrophoneLines,
  faPodcast,
  faStar,
} from '@fortawesome/free-solid-svg-icons'
import type { Currency, OpenTo, PriceUnit, ResponseTime, ServiceCategory } from '../types/services'

export const MAX_SERVICES = 12

export const SERVICE_CATEGORIES: { value: ServiceCategory; icon: IconDefinition }[] = [
  { value: 'keynote', icon: faMicrophoneLines },
  { value: 'brand_campaign', icon: faBullhorn },
  { value: 'sponsored_post', icon: faHashtag },
  { value: 'podcast_guest', icon: faPodcast },
  { value: 'event_appearance', icon: faStar },
  { value: 'workshop', icon: faChalkboardUser },
  { value: 'consulting', icon: faHandshake },
  { value: 'other', icon: faBriefcase },
]

export const categoryIcon = (category: ServiceCategory) =>
  SERVICE_CATEGORIES.find((c) => c.value === category)?.icon ?? faBriefcase

export const OPEN_TO_OPTIONS: { value: OpenTo; icon: IconDefinition }[] = [
  { value: 'speaking', icon: faMicrophoneLines },
  { value: 'campaigns', icon: faBullhorn },
  { value: 'podcasts', icon: faPodcast },
  { value: 'events', icon: faCalendarDays },
]

export const CURRENCIES: Currency[] = ['PKR', 'USD', 'AED', 'SAR', 'GBP', 'EUR']
export const PRICE_UNITS: PriceUnit[] = ['project', 'event', 'post', 'hour', 'day']
export const RESPONSE_TIMES: ResponseTime[] = ['24h', '3d', '1w']
