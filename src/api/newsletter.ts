import api from './axios'
import type { ApiSuccess } from '../types/api'

export interface NewsletterSubscriber {
  _id: string
  email: string
  status: 'subscribed' | 'unsubscribed'
  language?: string
  subscribedAt: string
  unsubscribedAt?: string
}

// Footer ka form (login ke baghair)
export async function subscribeNewsletter(email: string, language?: string) {
  await api.post('/newsletter/subscribe', { email, language })
}

// Email ke "unsubscribe" link se
export async function unsubscribeNewsletter(token: string) {
  const res = await api.post<ApiSuccess<{ unsubscribed: boolean; email: string }>>('/newsletter/unsubscribe', {
    token,
  })
  return res.data.data
}

export async function listSubscribers(params: URLSearchParams) {
  const res = await api.get<ApiSuccess<{ subscribers: NewsletterSubscriber[]; subscribed: number }>>(
    '/admin/newsletter',
    { params },
  )
  return { ...res.data.data, meta: res.data.meta! }
}

// CSV file download (browser ki "Save" wali file)
export async function downloadSubscribersCsv() {
  const res = await api.get<Blob>('/admin/newsletter/export', { responseType: 'blob' })
  const url = URL.createObjectURL(res.data)
  const link = document.createElement('a')
  link.href = url
  link.download = 'newsletter-subscribers.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export async function deleteSubscriber(id: string) {
  await api.delete(`/admin/newsletter/${id}`)
}
