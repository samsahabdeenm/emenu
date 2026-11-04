import { useEffect } from 'react'

const accountsUrl = (import.meta.env.VITE_ZENVENTORA_ACCOUNTS_URL || 'https://accounts.zenventora.in').replace(/\\/$/, '')
function goToAccounts(mode: 'signin'|'signup') {
  const url = new URL(accountsUrl + '/')
  url.searchParams.set('product', 'emenu')
  url.searchParams.set('mode', mode)
  url.searchParams.set('redirect_to', window.location.origin + '/auth/callback')
  window.location.assign(url.toString())
}
export default function LoginPage() {
  useEffect(() => { goToAccounts('signin') }, [])
  return <div className="min-h-screen flex items-center justify-center p-6"><div className="card max-w-md w-full p-8 text-center"><h1 className="text-2xl font-bold">Sign in with ZenVentora</h1><p className="text-gray-500 text-sm mt-2 mb-6">Use your ZenVentora account to securely access eMenu.</p><button className="btn-primary w-full" onClick={() => goToAccounts('signin')}>Continue to sign in</button><p className="text-sm text-gray-500 mt-5">New to eMenu? <a className="text-brand-teal font-semibold" href="#" onClick={e=>{e.preventDefault();goToAccounts('signup')}}>Create account</a></p></div></div>
}
