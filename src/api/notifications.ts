import api from './axios'
import type { ApiSuccess } from '../types/api'
import type { AppNotification } from '../types/notification'

export const NOTIFICATIONS_PAGE_SIZE = 20

export async function listNotifications(page: number, unreadOnly: boolean) {
  const res = await api.get<ApiSuccess<{ notifications: AppNotification[]; unread: number }>>(
    '/notifications',
    { params: { page, limit: NOTIFICATIONS_PAGE_SIZE, ...(unreadOnly && { unread: 'true' }) } },
  )
  return { ...res.data.data, meta: res.data.meta! }
}

export async function getUnreadCount() {
  const res = await api.get<ApiSuccess<{ unread: number }>>('/notifications/unread-count')
  return res.data.data.unread
}

export async function markNotificationRead(id: string) {
  const res = await api.patch<ApiSuccess<{ notification: AppNotification }>>(
    `/notifications/${id}/read`,
  )
  return res.data.data.notification
}

export async function markAllNotificationsRead() {
  await api.post('/notifications/read-all')
}
