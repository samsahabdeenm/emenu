import { useEffect } from 'react'

const accountsUrl = (import.meta.env.VITE_ZENVENTORA_ACCOUNTS_URL || 'https://accounts.zenventora.in').replace(/\/$/, '')
export default function ForgotPasswordPage() {
  useEffect(() => {
    const url = new URL(accountsUrl + '/')
    url.searchParams.set('product', 'emenu')
    url.searchParams.set('mode', 'reset')
    url.searchParams.set('redirect_to', window.location.origin + '/auth/callback')
    window.location.replace(url.toString())
  }, [])
  return <div className="min-h-screen flex items-center justify-center p-6"><div className="card max-w-md w-full p-8 text-center"><h1 className="text-xl font-bold">Reset your ZenVentora password</h1><p className="text-sm text-gray-500 mt-2">Redirecting to secure account recovery…</p></div></div>
}
