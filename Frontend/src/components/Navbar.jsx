import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShoppingBag, Menu, X, LogOut, LayoutDashboard, GraduationCap, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { initials } from '../lib/format'

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-ink' : 'text-muted hover:text-ink'}`

export default function Navbar() {
  const { user, isAuthenticated, isInstructor, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  async function handleLogout() {
    try {
      await logout()
      toast.success('Logged out')
      setMenuOpen(false)
      navigate('/')
    } catch {
      toast.error('Could not log out. Try again.')
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-6 md:flex">
            <NavLink to="/courses" className={navLinkClass}>Browse</NavLink>
            {isAuthenticated && <NavLink to="/my-learning" className={navLinkClass}>My Learning</NavLink>}
            {isInstructor ? (
              <NavLink to="/teach/dashboard" className={navLinkClass}>Instructor Studio</NavLink>
            ) : (
              <NavLink to="/teach" className={navLinkClass}>Teach on LearnLoop</NavLink>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface2 hover:text-ink"
            aria-label="Cart"
          >
            <ShoppingBag size={19} />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber px-1 font-mono text-[10px] font-bold text-[#1A1305]">
                {count}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="relative hidden md:block" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-hairline bg-surface py-1 pl-1 pr-3 transition-colors hover:border-violet/40"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet/20 font-mono text-[11px] font-semibold text-violet-soft">
                  {initials(user?.name || user?.email)}
                </span>
                <ChevronDown size={14} className="text-muted" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-12 w-56 rounded-xl border border-hairline bg-surface p-1.5 shadow-card animate-rise">
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-medium text-ink">{user?.name || 'LearnLoop learner'}</p>
                    <p className="truncate text-xs text-faint">{user?.email}</p>
                  </div>
                  <div className="my-1 h-px bg-hairline" />
                  <Link to="/my-learning" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface2 hover:text-ink">
                    <GraduationCap size={15} /> My Learning
                  </Link>
                  {isInstructor && (
                    <Link to="/teach/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface2 hover:text-ink">
                      <LayoutDashboard size={15} /> Instructor Studio
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-bad hover:bg-bad/10">
                    <LogOut size={15} /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login" className="btn-ghost">Log in</Link>
              <Link to="/register" className="btn-primary">Get started</Link>
            </div>
          )}

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-surface2 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-hairline bg-canvas px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            <Link to="/courses" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-ink hover:bg-surface2">Browse</Link>
            {isAuthenticated && (
              <Link to="/my-learning" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-ink hover:bg-surface2">My Learning</Link>
            )}
            <Link to={isInstructor ? '/teach/dashboard' : '/teach'} onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-ink hover:bg-surface2">
              {isInstructor ? 'Instructor Studio' : 'Teach on LearnLoop'}
            </Link>
            <div className="my-2 h-px bg-hairline" />
            {isAuthenticated ? (
              <button onClick={handleLogout} className="rounded-lg px-3 py-2.5 text-left text-sm text-bad hover:bg-bad/10">Log out</button>
            ) : (
              <div className="flex gap-2 px-1 pt-1">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1">Log in</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1">Get started</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
