import api from './axios'
import type { ApiSuccess } from '../types/api'
import type { AvailabilityInput, MyServices, Service, ServiceInput } from '../types/services'

export const MY_SERVICES_KEY = ['me', 'services'] as const

// Manager apne talent ki taraf se: ?person=<profile id> (talent ke liye khali)
const forPerson = (personId?: string) => (personId ? { params: { person: personId } } : undefined)

export async function getMyServices(personId?: string) {
  const res = await api.get<ApiSuccess<MyServices>>('/me/services', forPerson(personId))
  return res.data.data
}

export async function createService(input: ServiceInput, personId?: string) {
  const res = await api.post<ApiSuccess<MyServices & { service: Service }>>(
    '/me/services',
    input,
    forPerson(personId),
  )
  return res.data.data
}

export async function updateService(id: string, input: Partial<ServiceInput>, personId?: string) {
  const res = await api.patch<ApiSuccess<MyServices & { service: Service }>>(
    `/me/services/${id}`,
    input,
    forPerson(personId),
  )
  return res.data.data
}

export async function deleteService(id: string, personId?: string) {
  const res = await api.delete<ApiSuccess<MyServices>>(`/me/services/${id}`, forPerson(personId))
  return res.data.data
}

export async function saveAvailability(input: AvailabilityInput, personId?: string) {
  const res = await api.put<ApiSuccess<MyServices>>('/me/availability', input, forPerson(personId))
  return res.data.data
}
