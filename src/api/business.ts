import api from './axios'
import type { ApiSuccess } from '../types/api'
import type { AuditLogEntry } from '../types/adminPanel'
import type {
  AdminBusiness,
  BusinessInput,
  BusinessProfile,
  HireInput,
  HireRequest,
} from '../types/business'

// Business ki apni company details (null = abhi bheji nahi)
export async function getMyBusiness() {
  const res = await api.get<ApiSuccess<{ business: BusinessProfile | null }>>('/business/profile')
  return res.data.data.business
}

// Pehli dafa ya dobara verification ke liye bhejo
export async function saveMyBusiness(input: BusinessInput) {
  const res = await api.put<ApiSuccess<{ business: BusinessProfile }>>('/business/profile', input)
  return res.data.data.business
}

export async function listMyHires() {
  const res = await api.get<ApiSuccess<{ hires: HireRequest[] }>>('/business/hires')
  return res.data.data.hires
}

export async function createHire(input: HireInput) {
  const res = await api.post<ApiSuccess<{ hire: HireRequest }>>('/business/hires', input)
  return res.data.data.hire
}

export async function cancelHire(id: string) {
  const res = await api.post<ApiSuccess<{ hire: HireRequest }>>(`/business/hires/${id}/cancel`)
  return res.data.data.hire
}

// Talent: aayi hui hire requests
export async function listIncomingHires() {
  const res = await api.get<ApiSuccess<{ hires: HireRequest[] }>>('/me/hire-requests')
  return res.data.data.hires
}

export async function respondHire(id: string, action: 'accept' | 'decline', note?: string) {
  const res = await api.patch<ApiSuccess<{ hire: HireRequest }>>(`/me/hire-requests/${id}`, {
    action,
    note,
  })
  return res.data.data.hire
}

// Admin: business verification
export async function listAdminBusinesses(params: URLSearchParams) {
  const res = await api.get<ApiSuccess<{ businesses: AdminBusiness[] }>>('/admin/businesses', {
    params,
  })
  return { businesses: res.data.data.businesses, meta: res.data.meta! }
}

export async function getAdminBusiness(id: string) {
  const res = await api.get<ApiSuccess<{ business: AdminBusiness; history: AuditLogEntry[] }>>(
    `/admin/businesses/${id}`,
  )
  return res.data.data
}

export async function reviewBusiness(id: string, action: 'approve' | 'reject', reason?: string) {
  const res = await api.patch<ApiSuccess<{ business: AdminBusiness }>>(`/admin/businesses/${id}`, {
    action,
    reason,
  })
  return res.data.data.business
}
