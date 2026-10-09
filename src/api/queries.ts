import { queryOptions } from '@tanstack/react-query'
import { getPerson, listPeople, listTaxonomy } from './people'
import { getMyProfile, listMyClaims } from './claims'
import { getMyBusiness, listIncomingHires, listMyHires } from './business'
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

// Logged-in user ka data: staleTime 0 taake hamesha taaza ho
export const myClaimsQuery = queryOptions({
  queryKey: ['claims', 'mine'],
  queryFn: listMyClaims,
  staleTime: 0,
})

export const myProfileQuery = queryOptions({
  queryKey: ['claims', 'my-profile'],
  queryFn: getMyProfile,
  staleTime: 0,
})

// Business: company details + verification ki halat
export const myBusinessQuery = queryOptions({
  queryKey: ['business', 'profile'],
  queryFn: getMyBusiness,
  staleTime: 0,
})

export const myHiresQuery = queryOptions({
  queryKey: ['business', 'hires'],
  queryFn: listMyHires,
  staleTime: 0,
})

// Talent: aayi hui hire requests
export const incomingHiresQuery = queryOptions({
  queryKey: ['me', 'hire-requests'],
  queryFn: listIncomingHires,
  staleTime: 0,
})
