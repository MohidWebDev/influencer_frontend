import type { MouseEvent } from 'react'
import { Link, useLocation, type LinkProps } from 'react-router-dom'
import { smoothScrollTop } from '../../utils/scroll'

// Navbar / footer ka link: naya page khule to ScrollManager aaraam se upar le jata hai.
// Usi page ka link dabaya (jaise Home pe Home) to yahin se upar scroll
function TopLink({ onClick, state, to, ...props }: LinkProps) {
  const location = useLocation()

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e)
    const target = typeof to === 'string' ? to : `${to.pathname ?? ''}${to.search ?? ''}`
    if (target === `${location.pathname}${location.search}`) smoothScrollTop()
  }

  return (
    <Link
      to={to}
      state={{ ...(typeof state === 'object' ? state : {}), smoothTop: true }}
      onClick={handleClick}
      {...props}
    />
  )
}

export default TopLink
