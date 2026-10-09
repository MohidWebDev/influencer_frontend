import { createContext } from 'react'
import type { DeletedProfileOutcome, LoginInput, RegisterInput } from '../api/auth'
import type { User } from '../types/user'

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
  deleteAccount: (confirm: string, removeProfile?: boolean) => Promise<DeletedProfileOutcome | null>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
