import api from './axios'
import type { ApiSuccess } from '../types/api'
import type { AvailabilityInput, MyServices, Service, ServiceInput } from '../types/services'

export const MY_SERVICES_KEY = ['me', 'services'] as const

export async function getMyServices() {
  const res = await api.get<ApiSuccess<MyServices>>('/me/services')
  return res.data.data
}

export async function createService(input: ServiceInput) {
  const res = await api.post<ApiSuccess<MyServices & { service: Service }>>('/me/services', input)
  return res.data.data
}

export async function updateService(id: string, input: Partial<ServiceInput>) {
  const res = await api.patch<ApiSuccess<MyServices & { service: Service }>>(
    `/me/services/${id}`,
    input,
  )
  return res.data.data
}

export async function deleteService(id: string) {
  const res = await api.delete<ApiSuccess<MyServices>>(`/me/services/${id}`)
  return res.data.data
}

export async function saveAvailability(input: AvailabilityInput) {
  const res = await api.put<ApiSuccess<MyServices>>('/me/availability', input)
  return res.data.data
}
