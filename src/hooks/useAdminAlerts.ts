import { useQuery } from '@tanstack/react-query'
import { getAdminStats } from '../api/adminPanel'
import { useAuth } from './useAuth'

// Admin ke liye "kitne kaam baqi hain": navbar aur sidebar ke badges isi se.
// LiveUpdates har kuch second mein ['admin'] taaza karta hai, to yeh bhi khud update hota hai
export function useAdminAlerts() {
  const { user } = useAuth()
  const { data } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: getAdminStats,
    enabled: user?.role === 'admin',
  })
  const claims = data?.claims.needsAction ?? 0
  const reports = data?.reports.open ?? 0
  return { claims, reports, total: claims + reports, isReady: Boolean(data) }
}
