import { useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faKey } from '@fortawesome/free-solid-svg-icons'
import { myClaimsQuery } from '../api/queries'
import { useNavigate } from 'react-router-dom'
import { useUnreadNotifications } from '../hooks/useUnreadNotifications'
import { useAuth } from '../hooks/useAuth'
import { claimPersonName, type ClaimStatus } from '../types/claim'

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
      const keys =
        role === 'admin'
          ? [['admin'], ['claims'], ['notifications'], ['people'], ['person']]
          : [['claims'], ['notifications'], ['people'], ['person']]
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

// Nayi notification aaye (unread ginti badhe) to admin ko toast; click pe Notifications page
function AdminNotifier() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const unread = useUnreadNotifications()
  const previous = useRef<number | null>(null)

  useEffect(() => {
    const before = previous.current
    previous.current = unread
    // Pehli dafa sirf yaad rakho, toast nahi
    if (before === null || unread <= before) return
    toast(
      (toastItem) => (
        <button
          type="button"
          className="text-start"
          onClick={() => {
            toast.dismiss(toastItem.id)
            navigate('/notifications')
          }}
        >
          {t('live.newNotifications', { count: unread - before })}
          <span className="mt-0.5 block text-xs font-medium underline">
            {t('live.openNotifications')}
          </span>
        </button>
      ),
      { icon: <FontAwesomeIcon icon={faBell} />, id: 'live-notifications', duration: 6000 },
    )
  }, [unread, t, navigate])

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
      const name = claimPersonName(claim, t('claims.deletedProfile'))
      if (claim.status === 'waiting_for_talent') {
        toast(t('live.codeSent', { name, url: claim.verification?.channelUrl ?? '' }), {
          icon: <FontAwesomeIcon icon={faKey} />,
          duration: 8000,
        })
      } else if (claim.status === 'approved') {
        toast.success(t('live.approved', { name }), { duration: 8000 })
        // Profile ab is talent ki hai: profile wala data bhi taaza karo
        if (claim.person) queryClient.invalidateQueries({ queryKey: ['person', claim.person.slug] })
      } else if (claim.status === 'rejected') {
        toast.error(t('live.rejected', { name }), { duration: 8000 })
      }
    }
  }, [claims, t, queryClient])

  return null
}

export default LiveUpdates
