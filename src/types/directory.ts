// Navbar ke public "Businesses" aur "Managers" pages
interface DirectoryEntry {
  _id: string
  name: string
  country?: string
  city?: string
  websiteUrl?: string
  // Admin ne tasdeeq kar di
  verified: boolean
  // Details bheji hain, tasdeeq chal rahi hai
  inReview: boolean
  joinedAt: string
}

export interface DirectoryBusiness extends DirectoryEntry {
  industry?: string
  companySize?: string
  description?: string
}

export interface DirectoryManager extends DirectoryEntry {
  agencyName?: string
  bio?: string
  // Is waqt kitne talents ko represent kar rahe hain
  talents: number
}
