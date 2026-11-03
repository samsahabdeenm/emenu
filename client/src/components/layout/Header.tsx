import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, QrCode, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useAuth } from '@/hooks/useAuth'
import { clsx } from 'clsx'

const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Templates', href: '#templates' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (href: string) => {
    setMobileOpen(false)
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <QrCode className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <span
              className={clsx(
                'font-bold text-xl tracking-tight transition-colors',
                scrolled ? 'text-brand-blue' : 'text-white'
              )}
            >
              E-Menu
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className={clsx(
                  'px-3.5 py-2 rounded-lg text-sm font-medium transition-colors',
                  scrolled
                    ? 'text-gray-600 hover:text-brand-teal hover:bg-brand-teal/5'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  className={clsx(
                    'flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all',
                    scrolled
                      ? 'bg-brand-teal text-white hover:bg-brand-teal-dark shadow-sm hover:shadow-md'
                      : 'bg-white text-brand-blue hover:bg-white/90 shadow-sm'
                  )}
                >
                  Access Now <ChevronRight size={16} />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={clsx(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                    scrolled
                      ? 'text-gray-700 hover:text-brand-teal'
                      : 'text-white/90 hover:text-white'
                  )}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 rounded-xl bg-brand-teal text-white font-semibold text-sm hover:bg-brand-teal-dark transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  Sign Up Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className={clsx(
              'md:hidden p-2 rounded-lg transition-colors',
              scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="w-full text-left px-4 py-3 rounded-xl text-gray-700 font-medium hover:text-brand-teal hover:bg-brand-teal/5 transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              {isAuthenticated ? (
                <button
                  onClick={() => { setMobileOpen(false); navigate('/dashboard') }}
                  className="w-full py-3 rounded-xl bg-brand-teal text-white font-semibold text-center flex items-center justify-center gap-2"
                >
                  Access Now <ChevronRight size={16} />
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)}
                    className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-medium text-center">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)}
                    className="w-full py-3 rounded-xl bg-brand-teal text-white font-semibold text-center">
                    Sign Up Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
