import { createContext } from 'react'
import type { LoginInput, RegisterInput } from '../api/auth'
import type { User } from '../types/user'
import type { ThemePreference } from '../utils/theme'

export interface AuthContextValue {
  user: User | null
  isLoading: boolean
  login: (input: LoginInput) => Promise<User>
  register: (input: RegisterInput) => Promise<User>
  logout: () => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  // Email wale code ke baad naya password; user khud login ho jata hai
  resetPassword: (email: string, resetToken: string, newPassword: string) => Promise<User>
  // confirm = "delete <naam>"
  deleteAccount: (confirm: string) => Promise<void>
  // Light / dark / system: har user (aur guest) ki apni pasand, is device pe
  theme: ThemePreference
  setTheme: (theme: ThemePreference) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
