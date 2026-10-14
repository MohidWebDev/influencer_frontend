import type { CompanySize, OrganizationType } from './business'

export type Role = 'talent' | 'representative' | 'business' | 'admin'

export type SignupRole = Exclude<Role, 'admin'>

export interface User {
  _id: string
  name: string
  email: string
  role: Role
  isEmailVerified: boolean
  status: 'active' | 'suspended'
  // Apni photo / business ka logo (upload ki hui)
  avatarUrl?: string
  // Business / organization signup pe di gayi details (tasdeeq ka form inhi se shuru hota hai)
  company?: {
    organizationType?: OrganizationType
    companyName: string
    industry?: string
    companySize?: CompanySize
    description?: string
    country?: string
    websiteUrl?: string
  }
  // Manager signup pe di gayi details (tasdeeq ka form inhi se shuru hota hai)
  manager?: {
    agencyName?: string
    country?: string
    websiteUrl?: string
  }
  createdAt: string
  updatedAt: string
}
