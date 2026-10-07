import { useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { myClaimsQuery } from '../api/queries'
import { useAdminAlerts } from '../hooks/useAdminAlerts'
import { useAuth } from '../hooks/useAuth'
import type { ClaimStatus } from '../types/claim'

// Itne second baad khula hua data dobara mangwao (sirf jab tab samne ho)
const LIVE_INTERVAL_MS = 8000

// Page refresh ke baghair naya data: har thodi der baad aur tab pe wapas aane pe
// jo queries screen pe hain unko taaza karo. Naya kaam aaye to toast bhi dikhao.
function LiveUpdates() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const role = user?.role

  useEffect(() => {
    if (!role) return
    // Admin ko admin ka sara data, baqi users ko apne claims aur profile
    const refresh = () => {
      if (document.visibilityState !== 'visible') return
      const keys = role === 'admin' ? [['admin'], ['claims']] : [['claims']]
      // Sirf screen pe maujood (active) queries dobara chalti hain
      keys.forEach((queryKey) => queryClient.invalidateQueries({ queryKey, refetchType: 'active' }))
    }
    const timer = window.setInterval(refresh, LIVE_INTERVAL_MS)
    document.addEventListener('visibilitychange', refresh)
    window.addEventListener('focus', refresh)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [role, queryClient])

  if (role === 'admin') return <AdminNotifier />
  if (role === 'talent') return <TalentNotifier />
  return null
}

// Naya claim ya report aaye to admin ko batao
function AdminNotifier() {
  const { t } = useTranslation()
  const { claims, reports, isReady } = useAdminAlerts()
  const previous = useRef<{ claims: number; reports: number } | null>(null)

  useEffect(() => {
    if (!isReady) return
    const before = previous.current
    previous.current = { claims, reports }
    // Pehli dafa sirf yaad rakho, toast nahi
    if (!before) return
    if (claims > before.claims) {
      toast(t('live.claimsNeedAction', { count: claims }), { icon: '🔔', id: 'live-claims' })
    }
    if (reports > before.reports) {
      toast(t('live.newReport', { count: reports }), { icon: '🚩', id: 'live-reports' })
    }
  }, [claims, reports, isReady, t])

  return null
}

// Admin ne code bheja / approve / reject kiya to talent ko foran pata chale
function TalentNotifier() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { data: claims } = useQuery(myClaimsQuery)
  const previous = useRef<Map<string, ClaimStatus> | null>(null)

  useEffect(() => {
    if (!claims) return
    const before = previous.current
    previous.current = new Map(claims.map((c) => [c._id, c.status]))
    if (!before) return

    for (const claim of claims) {
      const old = before.get(claim._id)
      if (!old || old === claim.status) continue
      const name = claim.person.name
      if (claim.status === 'code_sent') {
        toast(t('live.codeSent', { name, url: claim.verification?.channelUrl ?? '' }), {
          icon: '🔑',
          duration: 8000,
        })
      } else if (claim.status === 'approved') {
        toast.success(t('live.approved', { name }), { duration: 8000 })
        // Profile ab is talent ki hai: profile wala data bhi taaza karo
        queryClient.invalidateQueries({ queryKey: ['person', claim.person.slug] })
      } else if (claim.status === 'rejected') {
        toast.error(t('live.rejected', { name }), { duration: 8000 })
      }
    }
  }, [claims, t, queryClient])

  return null
}

export default LiveUpdates
