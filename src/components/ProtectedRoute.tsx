import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import type { Role } from '../types/user'

interface ProtectedRouteProps {
  children: ReactNode
  // Khali ho to har logged-in user aa sakta hai
  roles?: Role[]
}

function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { t } = useTranslation()
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <p className="text-center text-gray-500">{t('common.loading')}</p>
  }

  if (!user) {
    // Login ke baad wapas isi page pe aane ke liye location saath bhejo
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (roles && !roles.includes(user.role)) {
    return (
      <p className="text-center text-red-600">
        {t('site.noPermission')}
      </p>
    )
  }

  return children
}

export default ProtectedRoute
