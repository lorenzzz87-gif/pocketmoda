import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LogOut, Menu, X, User } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { useAuth } from '../../hooks/useAuth'

const NAV_LINKS = {
  buyer: [
    { to: '/buyer', label: '展厅 Showroom' },
    { to: '/buyer/orders', label: '我的订单' },
  ],
  seller: [
    { to: '/seller', label: '控制台 Dashboard' },
    { to: '/seller/products', label: '商品管理' },
    { to: '/seller/orders', label: '订单管理' },
  ],
  admin: [
    { to: '/admin', label: '总览 Overview' },
    { to: '/admin/users', label: '用户管理' },
    { to: '/admin/orders', label: '全部订单' },
  ],
}

export function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  if (!user) return null

  const links = NAV_LINKS[user.role]

  return (
    <nav className="bg-white border-b border-silver-200 sticky top-0 z-40">
      {/* Role colour strip at top */}
      <div className="h-0.5 w-full" style={{ backgroundColor: 'var(--color-primary)' }} />

      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
        {/* Logo */}
        <Link to={`/${user.role}`} onClick={() => setOpen(false)}>
          <Logo size={28} />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={location.pathname === link.to ? {
                color: 'var(--color-primary)',
                backgroundColor: 'var(--color-primary-bg)',
              } : {}}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                location.pathname === link.to
                  ? 'font-semibold'
                  : 'text-charcoal hover:bg-silver-100'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-sm text-silver-600">
            <User className="w-4 h-4" />
            <span>{user.full_name}</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full capitalize text-white font-medium"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {user.role}
            </span>
          </div>
          <button onClick={logout} className="p-1.5 text-silver-600 hover:text-charcoal transition-colors" title="退出">
            <LogOut className="w-4 h-4" />
          </button>
          <button className="md:hidden p-1.5" onClick={() => setOpen(v => !v)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-silver-200 bg-white px-4 py-3 space-y-1">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              style={location.pathname === link.to ? {
                color: 'var(--color-primary)',
                backgroundColor: 'var(--color-primary-bg)',
              } : {}}
              className={`block px-3 py-2 text-sm rounded ${
                location.pathname === link.to ? 'font-semibold' : 'text-charcoal'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-silver-200 text-sm text-silver-600 flex items-center gap-2">
            <User className="w-4 h-4" />
            {user.full_name}
          </div>
        </div>
      )}
    </nav>
  )
}
