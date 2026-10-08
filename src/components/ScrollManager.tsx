import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { smoothScrollTop } from '../utils/scroll'

// Page badalne pe scroll kahan ho:
// - navbar/footer ka link (state.smoothTop): naya page aur aaraam se upar
// - baqi links se naya page: seedha upar (purane page ki neeche wali jagah pe na khule)
// - browser ka Back/Forward: browser khud purani jagah rakhta hai, hum kuch nahi karte
function ScrollManager() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const lastPath = useRef(location.pathname)

  useEffect(() => {
    const pathChanged = lastPath.current !== location.pathname
    lastPath.current = location.pathname
    if (navigationType === 'POP') return

    const fromNav = (location.state as { smoothTop?: boolean } | null)?.smoothTop
    if (fromNav) {
      // Naya page render ho jaye, phir smooth scroll
      requestAnimationFrame(() => smoothScrollTop())
    } else if (pathChanged) {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [location.key, location.pathname, location.state, navigationType])

  return null
}

export default ScrollManager
