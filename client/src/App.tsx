import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/authStore'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import DashboardPage from '@/pages/DashboardPage'
import TemplatePickerPage from '@/pages/TemplatePickerPage'

// Bug fix: Route guards use useAuthStore directly (read-only) instead of useAuth().
// useAuth() triggers verifySession() as a side-effect — calling it in multiple
// components caused /api/auth/me to fire 2-3 times on every page load.
// Only App (root) calls useAuth() to initialise the session once.
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore()
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-full border-4 border-brand-teal/20 border-t-brand-teal animate-spin" />
      <span className="text-sm text-gray-500">Loading...</span>
    </div>
  )
}

export default function App() {
  useAuth() // Initialize session check on mount

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth — redirect to dashboard if already logged in */}
      <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
      <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Public menu view (customer-facing) */}
      <Route path="/menu/:slug" element={<div>Menu View — Coming Soon</div>} />

      {/* Template Picker — protected onboarding step */}
      <Route path="/onboarding/template" element={<ProtectedRoute><TemplatePickerPage /></ProtectedRoute>} />

      {/* Protected Dashboard */}
      <Route path="/dashboard/*" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
