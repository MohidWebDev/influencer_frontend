import api from './axios'
import type { ApiSuccess } from '../types/api'

export type HomeCategoryKey = 'journalists' | 'creators' | 'speakers' | 'experts'

// Home page ke numbers (sirf public profiles)
export interface HomeStats {
  profiles: number
  newThisWeek: number
  countries: number
  verified: number
  categories: { key: HomeCategoryKey; slugs: string[]; count: number }[]
}

export async function getHomeStats() {
  const res = await api.get<ApiSuccess<HomeStats>>('/stats/home')
  return res.data.data
}
