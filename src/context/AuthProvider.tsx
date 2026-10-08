import { useEffect, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  changePasswordRequest,
  deleteAccountRequest,
  getMe,
  loginUser,
  logoutUser,
  registerUser,
} from '../api/auth'
import { applyTheme, getStoredTheme, saveTheme, type ThemePreference } from '../utils/theme'
import type { LoginInput, RegisterInput } from '../api/auth'
import type { User } from '../types/user'
import { AuthContext } from './authContext'

const ME_KEY = ['auth', 'me']

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // App khulte hi pata karo ke koi login hai ya nahi
  const { data: user, isLoading } = useQuery({
    queryKey: ME_KEY,
    queryFn: async () => {
      try {
        return await getMe()
      } catch (error) {
        // 401 ka matlab sirf "login nahi", error nahi
        if (axios.isAxiosError(error) && error.response?.status === 401) return null
        throw error
      }
    },
    retry: false,
    staleTime: Infinity,
  })

  async function login(input: LoginInput) {
    const loggedIn = await loginUser(input)
    queryClient.setQueryData<User | null>(ME_KEY, loggedIn)
    return loggedIn
  }

  async function register(input: RegisterInput) {
    const created = await registerUser(input)
    queryClient.setQueryData<User | null>(ME_KEY, created)
    return created
  }

  // Login khatam: user null aur purane user ka baqi data cache se saaf
  function clearSession() {
    queryClient.setQueryData<User | null>(ME_KEY, null)
    queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== ME_KEY[0] })
  }

  async function logout() {
    try {
      await logoutUser()
    } finally {
      clearSession()
    }
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    await changePasswordRequest({ currentPassword, newPassword })
  }

  async function deleteAccount(confirm: string) {
    await deleteAccountRequest(confirm)
    // Pehle Home pe jao, session wahan pohanch kar saaf hoga (neeche effect).
    // Warna protected page session khatam hote hi /login pe bhej deta hai
    setLeavingAfterDelete(true)
    navigate('/', { replace: true })
  }

  const [leavingAfterDelete, setLeavingAfterDelete] = useState(false)
  useEffect(() => {
    if (!leavingAfterDelete || pathname !== '/') return
    setLeavingAfterDelete(false)
    queryClient.setQueryData<User | null>(ME_KEY, null)
    queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== ME_KEY[0] })
  }, [leavingAfterDelete, pathname, queryClient])

  // Theme: localStorage mein yaad, "system" ho to device ki setting ke saath badle
  const [theme, setThemeState] = useState<ThemePreference>(getStoredTheme)
  useEffect(() => {
    applyTheme(theme)
    if (theme !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('system', true)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [theme])

  function setTheme(next: ThemePreference) {
    saveTheme(next)
    applyTheme(next, true)
    setThemeState(next)
  }

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        login,
        register,
        logout,
        changePassword,
        deleteAccount,
        theme,
        setTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
