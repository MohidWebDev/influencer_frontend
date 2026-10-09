import api from './axios'
import type { ApiSuccess } from '../types/api'
import type { AuditLogEntry } from '../types/adminPanel'
import type {
  Agreement,
  AgreementParty,
  AgreementTerms,
  DisputeOutcome,
  PersonReviews,
} from '../types/agreement'

type One = ApiSuccess<{ agreement: Agreement }>

// Backend khali cheezen chhod sakta hai (purana server, ya koi sign / review abhi nahi hua):
// pages hamesha poora object paayen, warna agreement.signatures.business pe crash
export function normalizeAgreement(agreement: Agreement): Agreement {
  return {
    ...agreement,
    terms: { ...agreement.terms, milestones: agreement.terms?.milestones ?? [] },
    signatures: agreement.signatures ?? {},
    reviews: agreement.reviews ?? {},
    work: agreement.work ?? [],
    revisionsUsed: agreement.revisionsUsed ?? 0,
  }
}

const one = (res: { data: One }) => normalizeAgreement(res.data.data.agreement)

export async function listMyAgreements() {
  const res = await api.get<ApiSuccess<{ agreements: Agreement[] }>>('/agreements')
  return res.data.data.agreements.map(normalizeAgreement)
}

export async function getAgreement(id: string) {
  const res = await api.get<ApiSuccess<{ agreement: Agreement; side: AgreementParty }>>(
    `/agreements/${id}`,
  )
  return { ...res.data.data, agreement: normalizeAgreement(res.data.data.agreement) }
}

// Business: accept hui hire request se muahida shuru
export async function createAgreement(hireId: string, terms: AgreementTerms) {
  return one(await api.post<One>('/agreements', { hireId, terms }))
}

// Counter-offer: naya version, dono ke sign khatam
export async function updateAgreementTerms(id: string, terms: AgreementTerms) {
  return one(await api.put<One>(`/agreements/${id}/terms`, { terms }))
}

export async function sendSignCode(id: string) {
  const res = await api.post<ApiSuccess<{ sent: boolean; resendIn: number; expiresIn: number }>>(
    `/agreements/${id}/sign/code`,
  )
  return res.data.data
}

export async function signAgreement(id: string, code: string) {
  return one(await api.post<One>(`/agreements/${id}/sign`, { code }))
}

export async function cancelAgreement(id: string, reason?: string) {
  return one(await api.post<One>(`/agreements/${id}/cancel`, { reason }))
}

export async function deliverMilestone(id: string, index: number, note: string, link?: string) {
  return one(await api.post<One>(`/agreements/${id}/milestones/${index}/deliver`, { note, link }))
}

export async function approveMilestone(id: string, index: number) {
  return one(await api.post<One>(`/agreements/${id}/milestones/${index}/approve`))
}

export async function requestMilestoneChanges(id: string, index: number, note: string) {
  return one(await api.post<One>(`/agreements/${id}/milestones/${index}/request-changes`, { note }))
}

export async function openDispute(id: string, reason: string) {
  return one(await api.post<One>(`/agreements/${id}/dispute`, { reason }))
}

export async function reviewAgreement(id: string, rating: number, comment?: string) {
  return one(await api.post<One>(`/agreements/${id}/review`, { rating, comment }))
}

// Public: talent ke baare mein businesses ki reviews
export async function getPersonReviews(slug: string) {
  const res = await api.get<ApiSuccess<PersonReviews>>(`/people/${slug}/reviews`)
  return res.data.data
}

// Admin
export async function adminListAgreements(params: URLSearchParams) {
  const res = await api.get<ApiSuccess<{ agreements: Agreement[] }>>('/admin/agreements', { params })
  return { agreements: res.data.data.agreements.map(normalizeAgreement), meta: res.data.meta! }
}

export async function adminGetAgreement(id: string) {
  const res = await api.get<ApiSuccess<{ agreement: Agreement; history: AuditLogEntry[] }>>(
    `/admin/agreements/${id}`,
  )
  return { ...res.data.data, agreement: normalizeAgreement(res.data.data.agreement) }
}

export async function adminResolveDispute(id: string, outcome: DisputeOutcome, note: string) {
  return one(await api.post<One>(`/admin/agreements/${id}/resolve`, { outcome, note }))
}
