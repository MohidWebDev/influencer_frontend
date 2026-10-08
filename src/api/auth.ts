import api from './axios'
import type { ApiSuccess } from '../types/api'
import type { SignupRole, User } from '../types/user'

export interface RegisterInput {
  name: string
  email: string
  password: string
  role: SignupRole
}

export interface LoginInput {
  email: string
  password: string
}

export async function registerUser(input: RegisterInput) {
  const res = await api.post<ApiSuccess<{ user: User }>>('/auth/register', input)
  return res.data.data.user
}

export async function loginUser(input: LoginInput) {
  const res = await api.post<ApiSuccess<{ user: User }>>('/auth/login', input)
  return res.data.data.user
}

export async function logoutUser() {
  await api.post('/auth/logout')
}

export async function getMe() {
  const res = await api.get<ApiSuccess<{ user: User }>>('/auth/me')
  return res.data.data.user
}

export async function changePasswordRequest(input: {
  currentPassword: string
  newPassword: string
}) {
  await api.patch('/auth/password', input)
}

export async function deleteAccountRequest(confirm: string) {
  await api.delete('/auth/account', { data: { confirm } })
}

// Password bhool gaya: 1) email pe code  2) code check -> reset token  3) naya password
export async function requestPasswordReset(email: string) {
  const res = await api.post<ApiSuccess<{ sent: boolean; resendIn: number; expiresIn: number }>>(
    '/auth/forgot-password',
    { email },
  )
  return res.data.data
}

export async function verifyPasswordResetCode(email: string, code: string) {
  const res = await api.post<ApiSuccess<{ resetToken: string }>>('/auth/forgot-password/verify', {
    email,
    code,
  })
  return res.data.data.resetToken
}

export async function resetPasswordRequest(input: {
  email: string
  resetToken: string
  newPassword: string
}) {
  const res = await api.post<ApiSuccess<{ user: User }>>('/auth/reset-password', input)
  return res.data.data.user
}
