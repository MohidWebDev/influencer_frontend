import api from './axios'
import type { ApiSuccess } from '../types/api'
import type { Person } from '../types/person'
import type {
  AdminManager,
  AdminManagerPayload,
  ManagedTalent,
  ManagerProfile,
  ManagerSocialAccount,
  MyManager,
  Representation,
  RepresentationPermissions,
} from '../types/manager'

// ---------- Manager ----------

export async function getMyManagerProfile() {
  const res = await api.get<ApiSuccess<{ manager: ManagerProfile | null }>>('/manager/profile')
  return res.data.data.manager
}

export interface ManagerPayload {
  agencyName?: string
  websiteUrl?: string
  socialAccounts: ManagerSocialAccount[]
  country: string
  city?: string
  contactPhone?: string
  bio?: string
  talentsCount?: number
  proofLinks: string[]
}

export async function saveMyManagerProfile(input: ManagerPayload) {
  const res = await api.put<ApiSuccess<{ manager: ManagerProfile }>>('/manager/profile', input)
  return res.data.data.manager
}

export async function listMyRepresentations() {
  const res = await api.get<ApiSuccess<{ representations: Representation[] }>>('/manager/representations')
  return res.data.data.representations
}

export async function requestRepresentation(personId: string, message?: string) {
  const res = await api.post<ApiSuccess<{ representation: Representation }>>('/manager/representations', {
    personId,
    message,
  })
  return res.data.data.representation
}

export async function managerRespond(id: string, action: 'accept' | 'decline') {
  await api.post(`/manager/representations/${id}/respond`, { action })
}

export async function managerEnd(id: string) {
  await api.post(`/manager/representations/${id}/end`)
}

export async function listMyTalents() {
  const res = await api.get<ApiSuccess<{ talents: ManagedTalent[] }>>('/manager/talents')
  return res.data.data.talents
}

export async function getMyTalent(personId: string) {
  const res = await api.get<
    ApiSuccess<{ person: Person; permissions: RepresentationPermissions; representationId: string }>
  >(`/manager/talents/${personId}`)
  return res.data.data
}

// ---------- Talent ----------

export async function getMyManager() {
  const res = await api.get<ApiSuccess<MyManager>>('/me/manager')
  return res.data.data
}

export async function inviteManager(email: string, permissions: RepresentationPermissions, message?: string) {
  const res = await api.post<ApiSuccess<{ representation: Representation }>>('/me/manager/invite', {
    email,
    permissions,
    message,
  })
  return res.data.data.representation
}

export async function talentRespond(
  id: string,
  action: 'accept' | 'decline',
  permissions?: RepresentationPermissions,
) {
  await api.post(`/me/manager/${id}/respond`, { action, permissions })
}

export async function updatePermissions(id: string, permissions: RepresentationPermissions) {
  await api.patch(`/me/manager/${id}`, { permissions })
}

// Talent apne manager ko sitare deta hai (har rishte pe ek dafa)
export async function reviewMyManager(id: string, rating: number, comment?: string) {
  await api.post(`/me/manager/${id}/review`, { rating, comment })
}

export async function talentEnd(id: string) {
  await api.post(`/me/manager/${id}/end`)
}

// ---------- Admin ----------

export async function listAdminManagers(params: URLSearchParams) {
  const res = await api.get<ApiSuccess<{ managers: AdminManager[] }>>('/admin/managers', { params })
  return { managers: res.data.data.managers, meta: res.data.meta! }
}

export async function getAdminManager(id: string) {
  const res = await api.get<ApiSuccess<AdminManagerPayload>>(`/admin/managers/${id}`)
  return res.data.data
}

export async function reviewManager(id: string, action: 'approve' | 'reject', reason?: string) {
  const res = await api.patch<ApiSuccess<AdminManagerPayload>>(`/admin/managers/${id}`, { action, reason })
  return res.data.data
}
