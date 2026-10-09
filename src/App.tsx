import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Search from './pages/Search'
import Profile from './pages/Profile'
import ClaimProfile from './pages/ClaimProfile'
import EditMyProfile from './pages/dashboards/EditMyProfile'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import Browse from './pages/Browse'
import About from './pages/About'
import Notifications from './pages/Notifications'
import CreateMyProfile from './pages/dashboards/CreateMyProfile'
import ComingSoon from './pages/ComingSoon'
import Settings from './pages/Settings'
import ServicesPage from './pages/dashboards/ServicesPage'
import BusinessProfileForm from './pages/dashboards/BusinessProfileForm'
import ForgotPassword from './pages/ForgotPassword'
import MyProfileRedirect from './pages/MyProfileRedirect'
import { faEnvelope, faStar, faUsers } from '@fortawesome/free-solid-svg-icons'
import AdminPersonEditor from './pages/admin/AdminPersonEditor'
import AdminLayout from './components/admin-panel/AdminLayout'
import AdminOverviewPage from './pages/admin-panel/AdminOverviewPage'
import AdminClaimsPage from './pages/admin-panel/AdminClaimsPage'
import AdminClaimDetailPage from './pages/admin-panel/AdminClaimDetailPage'
import AdminUsersPage from './pages/admin-panel/AdminUsersPage'
import AdminReportsPage from './pages/admin-panel/AdminReportsPage'
import AdminReportDetailPage from './pages/admin-panel/AdminReportDetailPage'
import AdminAuditLogPage from './pages/admin-panel/AdminAuditLogPage'
import AdminBusinessesPage from './pages/admin-panel/AdminBusinessesPage'
import AdminBusinessDetailPage from './pages/admin-panel/AdminBusinessDetailPage'
import ReportProfile from './pages/ReportProfile'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/my-profile/new"
          element={
            <ProtectedRoute roles={['talent']}>
              <CreateMyProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute roles={['talent']}>
              <MyProfileRedirect />
            </ProtectedRoute>
          }
        />
        {/* Ye pages document mein hain, abhi "Coming soon" */}
        <Route
          path="/dashboard/services"
          element={
            <ProtectedRoute roles={['talent']}>
              <ServicesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/business"
          element={
            <ProtectedRoute roles={['business']}>
              <BusinessProfileForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <ComingSoon page="inbox" icon={faEnvelope} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shortlists"
          element={
            <ProtectedRoute roles={['business', 'agency', 'organization']}>
              <ComingSoon page="shortlists" icon={faStar} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/talents"
          element={
            <ProtectedRoute roles={['representative']}>
              <ComingSoon page="talents" icon={faUsers} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route path="/people/:slug" element={<Profile />} />
        <Route
          path="/people/:slug/claim"
          element={
            <ProtectedRoute roles={['talent']}>
              <ClaimProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/profile/edit"
          element={
            <ProtectedRoute roles={['talent']}>
              <EditMyProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/people/new"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminPersonEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/people/:id/edit"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminPersonEditor />
            </ProtectedRoute>
          }
        />
        {/* Admin panel: sidebar ke saath, sirf admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverviewPage />} />
          <Route path="claims" element={<AdminClaimsPage />} />
          <Route path="claims/:id" element={<AdminClaimDetailPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="reports/:id" element={<AdminReportDetailPage />} />
          <Route path="businesses" element={<AdminBusinessesPage />} />
          <Route path="businesses/:id" element={<AdminBusinessDetailPage />} />
          <Route path="audit-logs" element={<AdminAuditLogPage />} />
        </Route>
        <Route path="/people/:slug/report" element={<ReportProfile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
