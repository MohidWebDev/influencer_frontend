import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { smoothScrollTop } from '../utils/scroll'

// Page badalne pe scroll kahan ho:
// - navbar/footer ka link (state.smoothTop): naya page aur aaraam se upar
// - baqi links se naya page: seedha upar (purane page ki neeche wali jagah pe na khule)
// - "/#faq" jaisa link: us hisse tak
// - browser ka Back/Forward: browser khud purani jagah rakhta hai, hum kuch nahi karte
function ScrollManager() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const lastPath = useRef(location.pathname)

  useEffect(() => {
    const pathChanged = lastPath.current !== location.pathname
    lastPath.current = location.pathname
    if (navigationType === 'POP') return

    // "/#faq" jaisa link: us hisse tak aaraam se. Page ka data der se aaye to hissa
    // baad mein banta hai, is liye thori der (zyada se zyada ~2s) dhoondte raho
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1))
      let tries = 0
      const timer = window.setInterval(() => {
        const target = document.getElementById(id)
        if (target || ++tries > 20) {
          window.clearInterval(timer)
          target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
      return () => window.clearInterval(timer)
    }

    const fromNav = (location.state as { smoothTop?: boolean } | null)?.smoothTop
    if (fromNav) {
      // Naya page render ho jaye, phir smooth scroll
      requestAnimationFrame(() => smoothScrollTop())
    } else if (pathChanged) {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [location.key, location.pathname, location.hash, location.state, navigationType])

  return null
}

export default ScrollManager
