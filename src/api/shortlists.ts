import api from './axios'
import type { ApiSuccess } from '../types/api'
import type { SavedMembership, Shortlist, ShortlistSummary } from '../types/shortlist'

type One = ApiSuccess<{ shortlist: Shortlist }>
const one = (res: { data: One }) => res.data.data.shortlist

export async function listShortlists() {
  const res = await api.get<ApiSuccess<{ shortlists: ShortlistSummary[] }>>('/shortlists')
  return res.data.data.shortlists
}

// Har profile kin lists mein hai (save button ke liye)
export async function getSavedMembership() {
  const res = await api.get<ApiSuccess<SavedMembership>>('/shortlists/saved')
  return res.data.data
}

export async function getShortlist(id: string) {
  return one(await api.get<One>(`/shortlists/${id}`))
}

export async function createShortlist(name: string, description?: string) {
  return one(await api.post<One>('/shortlists', { name, description }))
}

export async function updateShortlist(id: string, input: { name?: string; description?: string }) {
  return one(await api.patch<One>(`/shortlists/${id}`, input))
}

export async function deleteShortlist(id: string) {
  await api.delete(`/shortlists/${id}`)
}

export async function addToShortlist(id: string, personId: string, note?: string) {
  return one(await api.post<One>(`/shortlists/${id}/items`, { personId, note }))
}

export async function updateShortlistNote(id: string, personId: string, note: string) {
  return one(await api.patch<One>(`/shortlists/${id}/items/${personId}`, { note }))
}

export async function removeFromShortlist(id: string, personId: string) {
  return one(await api.delete<One>(`/shortlists/${id}/items/${personId}`))
}
