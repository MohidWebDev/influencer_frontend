import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faBuilding,
  faBullhorn,
  faUserTie,
  faBell,
  faCircleInfo,
  faCompass,
  faEnvelope,
  faGear,
  faHouse,
  faShieldHalved,
  faTableColumns,
} from '@fortawesome/free-solid-svg-icons'
import { tr } from '../i18n/translated'
import type { Role } from '../types/user'

export interface NavItem {
  to: string
  label: string
  icon: IconDefinition
  // Khali = sab ke liye (login ho ya na ho). 'auth' = har logged-in user
  roles?: Role[] | 'auth'
}

// Navbar ke beech wale links (document ke saare pages)
export const MAIN_NAV: NavItem[] = [
  {
    to: '/',
    get label() {
      return tr('site.nav.home')
    },
    icon: faHouse,
  },
  {
    to: '/search',
    get label() {
      return tr('site.nav.explore')
    },
    icon: faCompass,
  },
  {
    to: '/campaigns',
    get label() {
      return tr('site.nav.campaigns')
    },
    icon: faBullhorn,
  },
  {
    to: '/businesses',
    get label() {
      return tr('site.nav.businesses')
    },
    icon: faBuilding,
  },
  {
    to: '/managers',
    get label() {
      return tr('site.nav.managers')
    },
    icon: faUserTie,
  },
  {
    to: '/about',
    get label() {
      return tr('site.nav.about')
    },
    icon: faCircleInfo,
  },
]

// Admin ka "Dashboard": right side pe bell ke saath (baqi users ke Dashboard ki jagah)
export const ADMIN_PANEL_NAV: NavItem = {
  to: '/admin',
  get label() {
    return tr('site.nav.adminPanel')
  },
  icon: faShieldHalved,
  roles: ['admin'],
}

// Right side ke chhote icon buttons (logged-in)
export const UTILITY_NAV: NavItem[] = [
  {
    to: '/inbox',
    get label() {
      return tr('site.nav.inbox')
    },
    icon: faEnvelope,
    roles: 'auth',
  },
  {
    to: '/notifications',
    get label() {
      return tr('site.nav.notifications')
    },
    icon: faBell,
    roles: 'auth',
  },
]

// Account menu ke andar
export const ACCOUNT_NAV: NavItem[] = [
  {
    to: '/dashboard',
    get label() {
      return tr('site.nav.dashboard')
    },
    icon: faTableColumns,
    // Admin ke liye Dashboard nahi, us ka Admin panel hai
    roles: ['talent', 'representative', 'business'],
  },
  {
    to: '/settings',
    get label() {
      return tr('site.nav.settings')
    },
    icon: faGear,
    roles: 'auth',
  },
]

export function canSee(item: NavItem, role: Role | undefined) {
  if (!item.roles) return true
  if (!role) return false
  return item.roles === 'auth' || item.roles.includes(role)
}

// "/dashboard?tab=claims" jaise links ke liye query bhi match karni hai
export function isNavActive(item: NavItem, pathname: string, search: string) {
  const [path, query] = item.to.split('?')
  if (query) return pathname === path && new URLSearchParams(search).toString() === query
  if (path === '/dashboard') {
    return pathname === '/dashboard' && !new URLSearchParams(search).get('tab')
  }
  return pathname === path || pathname.startsWith(`${path}/`)
}
