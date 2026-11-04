import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'

function readCentralLogoutMarker() {
  const match = document.cookie.match(/(?:^|;\\s*)zv_central_logout=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
}
function markCentralLogout() {
  document.cookie = 'zv_central_logout=' + Date.now() + '; Domain=.zenventora.in; Path=/; Max-Age=31536000; SameSite=Lax; Secure'
}

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout } = useAuthStore()

  useEffect(() => {
    let active = true
    const initialMarker = readCentralLogoutMarker()
    let checking = false
    const verifySession = async () => {
      if (checking || document.visibilityState === 'hidden') return
      if (window.location.pathname === '/auth/callback') { setLoading(false); return }
      checking = true
      try {
        const marker = readCentralLogoutMarker()
        if (marker && marker !== initialMarker) {
          try { await api.post('/auth/logout') } catch { /* Clear local state even if the network is unavailable. */ }
          if (active) logout()
          return
        }
        const res = await api.get('/auth/me')
        if (active) setUser(res.data.user)
      } catch {
        if (active) setUser(null)
      } finally { checking = false }
    }
    setLoading(true)
    void verifySession()
    const handleLogout = () => logout()
    const onVisible = () => { if (document.visibilityState === 'visible') void verifySession() }
    window.addEventListener('auth:logout', handleLogout)
    window.addEventListener('focus', verifySession)
    document.addEventListener('visibilitychange', onVisible)
    const timer = window.setInterval(verifySession, 20000)
    return () => {
      active = false
      window.clearInterval(timer)
      window.removeEventListener('auth:logout', handleLogout)
      window.removeEventListener('focus', verifySession)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const signOut = async () => {
    try { await api.post('/auth/logout') } finally { markCentralLogout(); logout() }
  }

  return { user, isAuthenticated, isLoading, logout: signOut, setLoading }
}
