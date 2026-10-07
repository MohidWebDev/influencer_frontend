import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBars,
  faRightFromBracket,
  faRightToBracket,
  faTableColumns,
  faUserPlus,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import toast from 'react-hot-toast'
import { PLATFORM_NAME } from '../../constants/config'
import {
  ACCOUNT_NAV,
  MAIN_NAV,
  UTILITY_NAV,
  canSee,
  isNavActive,
  type NavItem,
} from '../../constants/navigation'
import { ROLE_LABELS } from '../../constants/roles'
import { useAdminAlerts } from '../../hooks/useAdminAlerts'
import { useAuth } from '../../hooks/useAuth'
import CountBadge from '../CountBadge'
import Avatar from '../Avatar'
import AccountMenu from './AccountMenu'
import LanguageMenu from './LanguageMenu'

function Navbar() {
  const { t } = useTranslation()
  const { user, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    setMobileOpen(false)
    await logout()
    toast.success(t('site.nav.loggedOut'))
    navigate('/')
  }

  const role = user?.role
  const alerts = useAdminAlerts()
  const mainItems = MAIN_NAV.filter((item) => canSee(item, role))
  const utilityItems = UTILITY_NAV.filter((item) => canSee(item, role))
  const active = (item: NavItem) => isNavActive(item, pathname, search)

  const linkClass = (isActive: boolean) =>
    `inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition ${
      isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
    }`
  const iconButton = (isActive: boolean) =>
    `inline-flex h-9 w-9 items-center justify-center rounded-lg transition ${
      isActive ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
    }`

  const dashboardItem = ACCOUNT_NAV[0]
  const showDashboard = canSee(dashboardItem, role)

  // Sticky: scroll karne pe bhi navbar upar chipka rahe
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      {/* Desktop (xl, 1280px+): brand bilkul start pe, links beech mein, baqi sab bilkul end pe.
          Chhoti screen pe ☰ menu, kyun ke talent ke zyada links 1024px pe brand se takrate hain */}
      <nav className="flex items-center gap-3 px-4 py-3 sm:px-6 xl:grid xl:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link to="/" className="me-2 truncate text-base font-bold sm:text-xl xl:justify-self-start">
          {PLATFORM_NAME}
        </Link>

        {/* Desktop: beech wale links */}
        <div className="hidden items-center justify-center gap-1 xl:flex">
          {mainItems.map((item) => (
            <Link key={item.to} to={item.to} className={linkClass(active(item))}>
              <FontAwesomeIcon icon={item.icon} />
              {item.label}
              {item.to === '/admin' && <CountBadge count={alerts.total} />}
            </Link>
          ))}
        </div>

        {/* Desktop: right side */}
        <div className="ms-auto hidden items-center gap-1 xl:flex xl:justify-self-end">
          <LanguageMenu />
          {!isLoading &&
            (user ? (
              <>
                {utilityItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    title={item.label}
                    aria-label={item.label}
                    className={iconButton(active(item))}
                  >
                    <FontAwesomeIcon icon={item.icon} />
                  </Link>
                ))}
                {showDashboard && (
                  <Link to="/dashboard" className={`${linkClass(active(dashboardItem))} ms-1`}>
                    <FontAwesomeIcon icon={faTableColumns} />
                    {t('site.nav.dashboard')}
                  </Link>
                )}
                <div className="ms-1">
                  <AccountMenu onLogout={handleLogout} />
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={linkClass(pathname === '/login')}>
                  <FontAwesomeIcon icon={faRightToBracket} />
                  {t('site.nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white hover:bg-gray-800"
                >
                  <FontAwesomeIcon icon={faUserPlus} />
                  {t('site.nav.signup')}
                </Link>
              </>
            ))}
        </div>

        {/* Mobile: notifications + menu button */}
        <div className="ms-auto flex items-center gap-1 xl:hidden">
          {user && (
            <Link
              to="/notifications"
              aria-label={t('site.nav.notifications')}
              className={iconButton(pathname === '/notifications')}
              onClick={() => setMobileOpen(false)}
            >
              <FontAwesomeIcon icon={UTILITY_NAV[1].icon} />
            </Link>
          )}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? t('site.nav.closeMenu') : t('site.nav.openMenu')}
            aria-expanded={mobileOpen}
            className={iconButton(mobileOpen)}
          >
            <FontAwesomeIcon icon={mobileOpen ? faXmark : faBars} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute inset-x-0 top-full z-30 max-h-[calc(100vh-60px)] overflow-y-auto border-b border-gray-200 bg-white shadow-lg xl:hidden">
          <div className="mx-auto max-w-6xl space-y-4 px-4 py-4">
            {user && (
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                <Avatar name={user.name} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs text-gray-500">{ROLE_LABELS[user.role]}</p>
                </div>
              </div>
            )}

            <ul className="space-y-1">
              {[
                ...mainItems,
                ...(user
                  ? [...(showDashboard ? [dashboardItem] : []), ...utilityItems, ACCOUNT_NAV[1]]
                  : []),
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex w-full ${linkClass(active(item))} py-2.5`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="w-4" />
                    {item.label}
                    {item.to === '/admin' && <CountBadge count={alerts.total} />}
                  </Link>
                </li>
              ))}
            </ul>

            {/* flex-wrap: zaban ki list khule to is row ke neeche poori chaurai mein aati hai */}
            <div className="flex flex-wrap items-center justify-between gap-y-3 border-t border-gray-100 pt-4">
              <LanguageMenu variant="inline" />
              {user ? (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  {t('site.nav.logout')}
                </button>
              ) : (
                <div className="flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
                  >
                    <FontAwesomeIcon icon={faRightToBracket} />
                    {t('site.nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white"
                  >
                    <FontAwesomeIcon icon={faUserPlus} />
                    {t('site.nav.signup')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
