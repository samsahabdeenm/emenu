import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'

function readCentralLogoutMarker() {
  const match = document.cookie.match(/(?:^|;\s*)zv_central_logout=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : ''
}
function markCentralLogout() {
  const marker = String(Date.now())
  document.cookie = 'zv_central_logout=' + marker + '; Domain=.zenventora.in; Path=/; Max-Age=31536000; SameSite=Lax; Secure'
  try { localStorage.setItem('zv_central_logout_seen', marker) } catch {}
}

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout } = useAuthStore()

  useEffect(() => {
    let active = true
    const initialMarker = readCentralLogoutMarker()
    const callbackParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const isAccountsCallback = callbackParams.has('account_access_token')
    let seenMarker = ''
    try { seenMarker = localStorage.getItem('zv_central_logout_seen') || '' } catch {}
    let pendingLogoutAtBoot = Boolean(initialMarker && initialMarker !== seenMarker && !isAccountsCallback)
    if (isAccountsCallback) {
      try { localStorage.setItem('zv_central_logout_seen', initialMarker) } catch {}
    } else if (pendingLogoutAtBoot) {
      try { localStorage.setItem('zv_central_logout_seen', initialMarker) } catch {}
    }
    let checking = false
    const verifySession = async () => {
      if (checking || document.visibilityState === 'hidden') return
      if (window.location.pathname === '/auth/callback') { setLoading(false); return }
      checking = true
      try {
        const marker = readCentralLogoutMarker()
        let lastSeen = ''
        try { lastSeen = localStorage.getItem('zv_central_logout_seen') || '' } catch {}
        if (marker && marker !== lastSeen) {
          try { localStorage.setItem('zv_central_logout_seen', marker) } catch {}
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
    if (!pendingLogoutAtBoot && !isAccountsCallback) void verifySession()
    else if (pendingLogoutAtBoot) {
      pendingLogoutAtBoot = false
      void api.post('/auth/logout').finally(() => { if (active) logout() })
      setLoading(false)
    } else setLoading(false)
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
