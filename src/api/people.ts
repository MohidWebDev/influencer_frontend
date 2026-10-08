import api from './axios'
import { freshParams } from './freshness'
import type { ApiSuccess } from '../types/api'
import type { Person, PersonSummary, TaxonomyItem, TaxonomyType } from '../types/person'

// URL ke search params seedha backend ko bhej dete hain
export async function listPeople(params: URLSearchParams) {
  const query = new URLSearchParams(params)
  Object.entries(freshParams()).forEach(([key, value]) => query.set(key, value))
  const res = await api.get<ApiSuccess<{ people: PersonSummary[] }>>('/people', { params: query })
  return { people: res.data.data.people, meta: res.data.meta! }
}

export async function getPerson(slug: string) {
  const res = await api.get<ApiSuccess<{ person: Person }>>(`/people/${slug}`, {
    params: freshParams(),
  })
  return res.data.data.person
}

export async function listTaxonomy(type: TaxonomyType) {
  const res = await api.get<ApiSuccess<{ items: TaxonomyItem[] }>>(`/taxonomy/${type}`)
  return res.data.data.items
}
