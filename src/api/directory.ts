import api from './axios'
import { freshParams } from './freshness'
import type { ApiSuccess } from '../types/api'
import type {
  BusinessDetail,
  DirectoryBusiness,
  DirectoryManager,
  DirectoryReviews,
  ManagerDetail,
} from '../types/directory'

function withFresh(params: URLSearchParams) {
  const query = new URLSearchParams(params)
  Object.entries(freshParams()).forEach(([key, value]) => query.set(key, value))
  return query
}

export async function listBusinessDirectory(params: URLSearchParams) {
  const res = await api.get<ApiSuccess<{ businesses: DirectoryBusiness[] }>>(
    '/directory/businesses',
    { params: withFresh(params) },
  )
  return { items: res.data.data.businesses, meta: res.data.meta! }
}

export async function listManagerDirectory(params: URLSearchParams) {
  const res = await api.get<ApiSuccess<{ managers: DirectoryManager[] }>>('/directory/managers', {
    params: withFresh(params),
  })
  return { items: res.data.data.managers, meta: res.data.meta! }
}

export type DirectoryKind = 'businesses' | 'managers'

export async function getBusinessDetail(id: string) {
  const res = await api.get<ApiSuccess<BusinessDetail>>(`/directory/businesses/${id}`, {
    params: freshParams(),
  })
  return res.data.data
}

export async function getManagerDetail(id: string) {
  const res = await api.get<ApiSuccess<ManagerDetail>>(`/directory/managers/${id}`, {
    params: freshParams(),
  })
  return res.data.data
}

// Talents ki reviews, naye pehle (pehli 4; "Show all" baqi pages)
export async function getDirectoryReviews(kind: DirectoryKind, id: string, page = 1, limit = 4) {
  const res = await api.get<ApiSuccess<DirectoryReviews>>(`/directory/${kind}/${id}/reviews`, {
    params: { page, limit, ...freshParams() },
  })
  return { ...res.data.data, meta: res.data.meta! }
}
