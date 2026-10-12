import type { CompanySize } from './business'

export type Role =
  | 'talent'
  | 'representative'
  | 'business'
  | 'agency'
  | 'organization'
  | 'admin'

export type SignupRole = Exclude<Role, 'admin'>

export interface User {
  _id: string
  name: string
  email: string
  role: Role
  isEmailVerified: boolean
  status: 'active' | 'suspended'
  // Business signup pe di gayi company details (tasdeeq ka form inhi se shuru hota hai)
  company?: {
    companyName: string
    industry?: string
    companySize?: CompanySize
    description?: string
  }
  createdAt: string
  updatedAt: string
}
