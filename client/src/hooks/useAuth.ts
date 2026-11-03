import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout } = useAuthStore()

  useEffect(() => {
    // On app load, verify session with server.
    // Bug fix: setLoading(true) ensures a loading spinner is shown even on re-mounts
    // (after the first load, isLoading is false in the store).
    const verifySession = async () => {
      setLoading(true)
      try {
        const res = await api.get('/auth/me')
        setUser(res.data.user)
      } catch {
        setUser(null)
      }
    }
    verifySession()

    // Listen for auth:logout events (triggered by axios interceptor on refresh failure)
    const handleLogout = () => logout()
    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const signOut = async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      logout()
    }
  }

  return { user, isAuthenticated, isLoading, logout: signOut, setLoading }
}
