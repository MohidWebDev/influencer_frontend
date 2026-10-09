import { useEffect, useMemo, useRef } from 'react'
import axios from 'axios'
import { useQuery, useQueryClient, type Query } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faHandshake, faKey } from '@fortawesome/free-solid-svg-icons'
import { incomingHiresQuery, myBusinessQuery, myClaimsQuery, myHiresQuery } from '../api/queries'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUnreadNotifications } from '../hooks/useUnreadNotifications'
import { useAuth } from '../hooks/useAuth'
import { claimPersonName, type ClaimStatus } from '../types/claim'
import type { BusinessStatus, HireStatus } from '../types/business'

// Itne second baad khula hua data dobara mangwao (sirf jab tab samne ho)
const LIVE_INTERVAL_MS = 8000
// Tab / DevTools ke beech aate jaate focus baar baar aata hai: itni der mein dobara refresh nahi
const MIN_GAP_MS = 3000

// 404 / 403 jaisa jawab (4xx) chand second mein khud theek nahi hota. Aisi query jis ke paas
// dikhane ko data hi nahi, har refresh pe "loading" pe wapas jati hai aur section jhapakta hai.
// Isay baar baar mat mangwao; page dobara khulne pe React Query khud ek dafa phir koshish karta hai
function worthRefreshing(query: Query) {
  const { status, data, error } = query.state
  if (status !== 'error' || data !== undefined) return true
  const code = axios.isAxiosError(error) ? (error.response?.status ?? 0) : 0
  return !(code >= 400 && code < 500)
}

// Page refresh ke baghair naya data: har thodi der baad aur tab pe wapas aane pe
// jo queries screen pe hain unko taaza karo. Naya kaam aaye to toast bhi dikhao.
// Taaza karna "khamosh" hai: jo dikh raha hai woh rehta hai, sirf badli cheez badalti hai
function LiveUpdates() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { pathname } = useLocation()
  const role = user?.role
  // Aakhri refresh ka waqt (interval, focus aur page badalna sab yahi dekhte hain)
  const lastRun = useRef(0)

  // Naya page khula: cache wala data foran dikhta hai, peeche se ek dafa taaza
  useEffect(() => {
    if (!role) return
    const timer = window.setTimeout(() => {
      lastRun.current = Date.now()
      queryClient.invalidateQueries(
        {
          refetchType: 'active',
          // Login aur categories (taxonomy) ko har page pe dobara mangwane ki zaroorat nahi
          predicate: (query) =>
            !['auth', 'taxonomy'].includes(String(query.queryKey[0])) && worthRefreshing(query),
        },
        { cancelRefetch: false },
      )
    }, 0)
    return () => window.clearTimeout(timer)
  }, [pathname, role, queryClient])

  useEffect(() => {
    if (!role) return
    // Admin ko admin ka sara data, baqi users ko apne claims, profile, business
    // verification, hire requests aur muahide
    const keys =
      role === 'admin'
        ? [['admin'], ['claims'], ['notifications'], ['people'], ['person']]
        : [['claims'], ['notifications'], ['people'], ['person'], ['business'], ['me'], ['agreements'], ['shortlists']]

    const refresh = () => {
      if (document.visibilityState !== 'visible') return
      // User ka koi kaam (accept, sign, save) chal raha hai: us ka jawab aane do,
      // warna purana data us ke naye nateeje ko ek pal ke liye palat deta hai
      if (queryClient.isMutating() > 0) return
      if (Date.now() - lastRun.current < MIN_GAP_MS) return
      lastRun.current = Date.now()
      for (const queryKey of keys) {
        queryClient.invalidateQueries(
          // Sirf screen pe maujood (active) queries; jo request abhi chal rahi hai use
          // kaat kar dobara shuru mat karo (dheemi network pe data kabhi pohanchta hi nahi)
          { queryKey, refetchType: 'active', predicate: worthRefreshing },
          { cancelRefetch: false },
        )
      }
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
  if (role === 'business') return <BusinessNotifier />
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

// Pichli dafa ki halat se badla kya? Pehli dafa sirf yaad rakho, kuch nahi batao
function useChanges<T extends { _id: string }, S>(
  items: T[] | undefined,
  statusOf: (item: T) => S,
  onChange: (item: T, before: S | undefined) => void,
) {
  const previous = useRef<Map<string, S> | null>(null)
  // Callbacks har render pe naye hain: ref mein rakho, effect sirf data badalne pe chale
  const latest = useRef({ statusOf, onChange })
  useEffect(() => {
    latest.current = { statusOf, onChange }
  })

  useEffect(() => {
    if (!items) return
    const { statusOf: read, onChange: notify } = latest.current
    const before = previous.current
    previous.current = new Map(items.map((item) => [item._id, read(item)]))
    if (!before) return
    for (const item of items) {
      const old = before.get(item._id)
      if (old !== read(item)) notify(item, old)
    }
  }, [items])
}

// Talent ko nayi hire request aaye (ya business wapas le le) to foran pata chale
function HireRequestNotifier() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: hires } = useQuery(incomingHiresQuery)

  useChanges(
    hires,
    (hire) => hire.status,
    (hire, before) => {
      const business = hire.businessProfile?.companyName ?? ''
      if (before === undefined && hire.status === 'pending') {
        toast(
          (toastItem) => (
            <button
              type="button"
              className="text-start"
              onClick={() => {
                toast.dismiss(toastItem.id)
                navigate('/dashboard')
              }}
            >
              {t('live.hireNew', { business })}
              <span className="mt-0.5 block text-xs font-medium underline">
                {t('live.openDashboard')}
              </span>
            </button>
          ),
          { icon: <FontAwesomeIcon icon={faHandshake} />, duration: 10000 },
        )
      } else if (before === 'pending' && hire.status === 'cancelled') {
        toast(t('live.hireCancelled', { business }), { duration: 8000 })
      }
    },
  )
  return null
}

// Business: admin ne code bheja / approve / reject kiya, ya talent ne jawab diya
function BusinessNotifier() {
  const { t } = useTranslation()
  const { data: business } = useQuery(myBusinessQuery)
  const { data: hires } = useQuery(myHiresQuery)

  // Naya array sirf data badalne pe (warna har render pe effect chalta)
  const verification = useMemo(
    () =>
      business
        ? [{ _id: business._id, status: business.status, channel: business.verification?.channel }]
        : undefined,
    [business],
  )
  const sent = useMemo(
    () =>
      hires?.map((hire) => ({ _id: hire._id, status: hire.status, name: hire.person?.name ?? '' })),
    [hires],
  )

  useChanges<{ _id: string; status: BusinessStatus; channel?: string }, BusinessStatus>(
    verification,
    (item) => item.status,
    (item, before) => {
      if (before === undefined) return
      if (item.status === 'waiting_for_business') {
        toast(t('live.businessCodeSent', { channel: item.channel ?? '' }), {
          icon: <FontAwesomeIcon icon={faKey} />,
          duration: 8000,
        })
      } else if (item.status === 'approved') {
        toast.success(t('live.businessApproved'), { duration: 8000 })
      } else if (item.status === 'rejected') {
        toast.error(t('live.businessRejected'), { duration: 8000 })
      }
    },
  )

  useChanges<{ _id: string; status: HireStatus; name: string }, HireStatus>(
    sent,
    (item) => item.status,
    (item, before) => {
      if (before !== 'pending') return
      if (item.status === 'accepted') {
        toast.success(t('live.hireAccepted', { name: item.name }), { duration: 8000 })
      } else if (item.status === 'declined') {
        toast(t('live.hireDeclined', { name: item.name }), { duration: 8000 })
      }
    },
  )
  return null
}

// Admin ne code bheja / approve / reject kiya to talent ko foran pata chale
function TalentNotifier() {
  return (
    <>
      <ClaimNotifier />
      <HireRequestNotifier />
    </>
  )
}

function ClaimNotifier() {
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
