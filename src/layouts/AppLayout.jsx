import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import ThemeToggle from '../components/ThemeToggle.jsx'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/reports', label: 'Reports' },
  { to: '/profile', label: 'Profile' },
]

// Sidebar + page content. On mobile the sidebar slides in when you tap the menu button.
export default function AppLayout() {
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  const displayName =
    user?.displayName ||
    user?.name ||
    user?.email?.split('@')[0] ||
    'User'
  const email = user?.email || ''

  return (
    <div className="app">
      <header className="topbar">
        <button
          className="btn"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          Menu
        </button>
        <span className="brand">Ledgerly</span>
        <ThemeToggle />
      </header>

      {menuOpen && (
        <div
          className="backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-brand-row">
          <div className="brand"><span className="brand-mark">L</span>Ledgerly</div>
          <ThemeToggle />
        </div>
        <nav>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className="nav-link"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-user">
          <strong>{displayName}</strong>
          <span>{email}</span>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
