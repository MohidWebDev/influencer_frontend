import api from './axios'
import { freshParams } from './freshness'
import type { ApiSuccess } from '../types/api'
import type { DirectoryBusiness, DirectoryManager } from '../types/directory'

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
