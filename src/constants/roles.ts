import { translatedLabels, tr } from '../i18n/translated'
import type { Role, SignupRole } from '../types/user'

// Signup page pe dikhne wale account types (labels chuni hui zaban mein)
const SIGNUP_ROLES: SignupRole[] = [
  'talent',
  'representative',
  'business',
  'agency',
  'organization',
]

export const SIGNUP_ROLE_OPTIONS: { value: SignupRole; label: string; description: string }[] =
  SIGNUP_ROLES.map((value) => ({
    value,
    get label() {
      return tr(`roles.${value}`)
    },
    get description() {
      return tr(`roleDesc.${value}`)
    },
  }))

export const ROLE_LABELS: Record<Role, string> = translatedLabels(
  ['talent', 'representative', 'business', 'agency', 'organization', 'admin'],
  'roles',
)

// Ye account shortlists bana sakte hain (talent ki lists)
export const SHORTLIST_ROLES: Role[] = ['business', 'agency', 'organization']
