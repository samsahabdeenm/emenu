import { useEffect } from 'react'

const accountsUrl = (import.meta.env.VITE_ZENVENTORA_ACCOUNTS_URL || 'https://accounts.zenventora.in').replace(/\\/$/, '')
function goToAccounts() {
  const url = new URL(accountsUrl + '/')
  url.searchParams.set('product', 'emenu')
  url.searchParams.set('mode', 'signup')
  url.searchParams.set('redirect_to', window.location.origin + '/auth/callback')
  window.location.assign(url.toString())
}
export default function SignupPage() {
  useEffect(() => { goToAccounts() }, [])
  return <div className="min-h-screen flex items-center justify-center p-6"><div className="card max-w-md w-full p-8 text-center"><h1 className="text-2xl font-bold">Create your eMenu account</h1><p className="text-gray-500 text-sm mt-2 mb-6">Your account is managed securely by ZenVentora Accounts.</p><button className="btn-primary w-full" onClick={goToAccounts}>Continue to create account</button><p className="text-sm text-gray-500 mt-5">Already registered? <a className="text-brand-teal font-semibold" href="/login">Sign in</a></p></div></div>
}
