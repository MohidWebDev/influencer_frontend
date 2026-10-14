import { createContext } from 'react'
import type { DeletedProfileOutcome, LoginInput, RegisterInput } from '../api/auth'
import type { User } from '../types/user'

export interface AuthContextValue {
  // Server ka pakka kiya hua login. Isi ko dekh kar user wali APIs chalti hain
  user: User | null
  // Server se login abhi pakka ho raha hai (is dauran `user` null hai)
  isLoading: boolean
  // Pichli dafa ka login, sirf navbar ki shakal foran sahi dikhane ke liye.
  // Is se kabhi API mat chalao: session khatam ho chuka ho to har call 401 deti hai
  cachedUser: User | null
  login: (input: LoginInput) => Promise<User>
  register: (input: RegisterInput) => Promise<User>
  logout: () => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  // Email wale code ke baad naya password; user khud login ho jata hai
  resetPassword: (email: string, resetToken: string, newPassword: string) => Promise<User>
  // confirm = "delete <naam>"
  deleteAccount: (confirm: string, removeProfile?: boolean) => Promise<DeletedProfileOutcome | null>
  // Server se aaya naya user (jaise photo badalne ke baad) foran har jagah
  updateUser: (user: User) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
