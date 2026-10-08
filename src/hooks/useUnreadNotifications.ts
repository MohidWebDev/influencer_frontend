import { useQuery } from '@tanstack/react-query'
import { getUnreadCount } from '../api/notifications'
import { useAuth } from './useAuth'

// Bell pe ginti. LiveUpdates har kuch second mein ['notifications'] taaza karta hai
export function useUnreadNotifications() {
  const { user } = useAuth()
  const { data } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: getUnreadCount,
    enabled: Boolean(user),
  })
  return user ? (data ?? 0) : 0
}
