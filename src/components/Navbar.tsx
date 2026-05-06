import { useCallback } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { removeUser } from '../auth/userStorage'

const authBtnDesktop =
  'liquid-glass relative z-[1] rounded-full px-4 py-2 text-sm font-medium text-[hsl(var(--foreground))]/90 transition hover:text-white'

export function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const loggedIn = Boolean(localStorage.getItem('user'))

  const onSignUp = useCallback(() => {
    navigate('/signup')
  }, [navigate])

  const onLogin = useCallback(() => {
    navigate('/login')
  }, [navigate])

  const onLogout = useCallback(() => {
    removeUser()
    navigate('/')
  }, [navigate])

  const getLinkClass = (path: string) => {
    return `nav-link ${location.pathname === path ? 'text-white font-semibold' : ''}`
  }

  return (
    <header className="relative z-20 shrink-0">
      <nav className="flex items-center justify-between px-4 py-4 md:px-10 md:py-5">
        {/* LEFT */}
        <div className="w-12 md:w-24 shrink-0" aria-hidden></div>

        {/* CENTER NAV */}
        <div className="flex items-center justify-center gap-4 text-sm md:gap-8 md:text-base overflow-x-auto no-scrollbar">
          <Link to="/" className={getLinkClass('/')}>Home</Link>
          <Link to="/dashboard" className={getLinkClass('/dashboard')}>Dashboard</Link>
          <Link to="/planner" className={getLinkClass('/planner')}>Planner</Link>
          <Link to="/notes" className={getLinkClass('/notes')}>Notes</Link>
          <Link to="/quiz" className={getLinkClass('/quiz')}>Quiz</Link>
          <Link to="/chat" className={getLinkClass('/chat')}>Chat</Link>
        </div>

        {/* RIGHT BUTTON */}
        <div className="relative z-[1] flex shrink-0 items-center gap-2 md:gap-3 w-12 md:w-24 justify-end">
          {loggedIn ? (
            <button type="button" className={authBtnDesktop} onClick={onLogout}>
              Logout
            </button>
          ) : (
            <>
              <button type="button" className={`${authBtnDesktop} hidden sm:inline-flex`} onClick={onSignUp}>
                Sign Up
              </button>
              <button type="button" className={authBtnDesktop} onClick={onLogin}>
                Login
              </button>
            </>
          )}
        </div>
      </nav>

      <div
        className="mx-6 mt-[3px] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent md:mx-10"
        aria-hidden
      />
    </header>
  )
}

