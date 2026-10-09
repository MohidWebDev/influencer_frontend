import { queryOptions } from '@tanstack/react-query'
import { getPerson, listPeople, listTaxonomy } from './people'
import { getMyProfile, listMyClaims } from './claims'
import { getMyBusiness, listIncomingHires, listMyHires } from './business'
import { getAgreement, getPersonReviews, listMyAgreements } from './agreements'
import { getSavedMembership, getShortlist, listShortlists } from './shortlists'
import type { TaxonomyType } from '../types/person'

// Har query ki key aur function ek jagah. Pages aur prefetch dono yahi use karte hain,
// is liye cache ki key hamesha same rehti hai

export function peopleQuery(params: URLSearchParams) {
  return queryOptions({
    queryKey: ['people', params.toString()],
    queryFn: () => listPeople(params),
    // Verified / claimed jaisi tabdeeli jaldi dikhe
    staleTime: 30 * 1000,
  })
}

export function personQuery(slug: string) {
  return queryOptions({
    queryKey: ['person', slug],
    queryFn: () => getPerson(slug),
    staleTime: 30 * 1000,
  })
}

export function taxonomyQuery(type: TaxonomyType) {
  return queryOptions({
    queryKey: ['taxonomy', type],
    queryFn: () => listTaxonomy(type),
    // Ye lists kam hi badalti hain
    staleTime: Infinity,
  })
}

// Logged-in user ka data: LiveUpdates har kuch second taaza karta hai (staleTime default Infinity)
export const myClaimsQuery = queryOptions({
  queryKey: ['claims', 'mine'],
  queryFn: listMyClaims,
})

export const myProfileQuery = queryOptions({
  queryKey: ['claims', 'my-profile'],
  queryFn: getMyProfile,
})

// Business: company details + verification ki halat
export const myBusinessQuery = queryOptions({
  queryKey: ['business', 'profile'],
  queryFn: getMyBusiness,
})

export const myHiresQuery = queryOptions({
  queryKey: ['business', 'hires'],
  queryFn: listMyHires,
})

// Talent: aayi hui hire requests
export const incomingHiresQuery = queryOptions({
  queryKey: ['me', 'hire-requests'],
  queryFn: listIncomingHires,
})

// Muahide: business aur talent dono ke
export const myAgreementsQuery = queryOptions({
  queryKey: ['agreements', 'mine'],
  queryFn: listMyAgreements,
})

export function agreementQuery(id: string) {
  return queryOptions({
    queryKey: ['agreements', id],
    queryFn: () => getAgreement(id),
    })
}

export function personReviewsQuery(slug: string) {
  return queryOptions({
    queryKey: ['person', slug, 'reviews'],
    queryFn: () => getPersonReviews(slug),
    staleTime: 60 * 1000,
  })
}

// Shortlists: business / agency / organization
export const shortlistsQuery = queryOptions({
  queryKey: ['shortlists', 'all'],
  queryFn: listShortlists,
})

export const savedMembershipQuery = queryOptions({
  queryKey: ['shortlists', 'saved'],
  queryFn: getSavedMembership,
})

export function shortlistQuery(id: string) {
  return queryOptions({
    queryKey: ['shortlists', 'one', id],
    queryFn: () => getShortlist(id),
  })
}
