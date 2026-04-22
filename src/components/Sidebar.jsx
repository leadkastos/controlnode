import React, { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, Zap, GitBranch, Globe,
  BarChart2, Newspaper, LineChart, Star, User, CreditCard,
  Settings, Menu, X, Youtube, MessageCircleWarning, LogOut, Activity
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const xrpNav = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/', color: '#3b82f6' },
  { label: 'Market Overview', icon: TrendingUp, path: '/market-overview', color: '#06b6d4' },
  { label: 'XRP Intelligence', icon: Zap, path: '/xrp-intelligence', color: '#8b5cf6' },
  { label: 'Domino Theory', icon: GitBranch, path: '/domino-theory', color: '#f59e0b' },
  { label: 'Geopolitical Watch', icon: Globe, path: '/geopolitical-watch', color: '#ef4444' },
  { label: 'Oil vs Yen', icon: BarChart2, path: '/oil-vs-yen', color: '#f97316' },
  { label: 'Media Intelligence', icon: Newspaper, path: '/media-intelligence', color: '#ec4899' },
  { label: 'ETF Flows', icon: LineChart, path: '/etf-flows', color: '#10b981' },
  { label: 'Watchlist', icon: Star, path: '/watchlist', color: '#eab308' },
  { label: 'YouTube Intel', icon: Youtube, path: '/youtube-intel', color: '#ef4444' },
  { label: 'Smart Money Flow', icon: Activity, path: '/smart-money-flow', color: '#10b981' },
  { label: 'Market Chatter', icon: MessageCircleWarning, path: '/market-chatter', color: '#8b5cf6' },
]

const bottomNav = [
  { label: 'Account', icon: User, path: '/account', color: '#9aa8be' },
  { label: 'Billing', icon: CreditCard, path: '/billing', color: '#9aa8be' },
  { label: 'Settings', icon: Settings, path: '/settings', color: '#9aa8be' },
]

function NavItem({ item, onClose }) {
  const location = useLocation()
  const [hovered, setHovered] = useState(false)
  const isActive = item.path === '/'
    ? location.pathname === '/'
    : location.pathname.startsWith(item.path)

  return (
    <NavLink to={item.path} onClick={onClose} style={{ textDecoration: 'none' }}>
      <div
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer"
        style={{
          background: isActive ? `${item.color}22` : hovered ? 'rgba(255,255,255,0.05)' : 'transparent',
          color: '#eceef5',
          borderLeft: isActive ? `2px solid ${item.color}` : '2px solid transparent',
        }}
        onMouseEnter={function() { setHovered(true) }}
        onMouseLeave={function() { setHovered(false) }}
      >
        <item.icon size={16} strokeWidth={1.8} style={{ color: item.color, flexShrink: 0 }} />
        <span>{item.label}</span>
      </div>
    </NavLink>
  )
}

function SidebarContent({ onClose }) {
  const { signOut, profile } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <>
      {/* Logo area */}
      <div className="px-4 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #1e2330' }}>
        <div className="flex items-center justify-center w-full">
          <img
            src="/controlnode-logo.png"
            alt="ControlNode"
            style={{
              height: '52px',
              width: 'auto',
              objectFit: 'contain',
              maxWidth: '180px',
            }}
          />
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg lg:hidden ml-2 flex-shrink-0" style={{ color: '#9aa8be' }}>
            <X size={18} />
          </button>
        )}
      </div>

      <div className="px-3 pt-4 pb-2">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6b7a96' }}>Intelligence Hub</p>
        <div className="flex items-center justify-center py-2 rounded-lg text-sm font-bold" style={{
          background: 'rgba(139,92,246,0.15)',
          border: '1px solid rgba(139,92,246,0.4)',
          color: '#8b5cf6'
        }}>
          <Zap size={14} className="mr-2" />
          XRP Intelligence Platform
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: '#6b7a96' }}>
          Intelligence
        </p>
        {xrpNav.map((item) => (
          <NavItem key={item.path} item={item} onClose={onClose} />
        ))}
      </nav>

      <div className="px-2 py-4 space-y-0.5" style={{ borderTop: '1px solid #1e2330' }}>
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: '#6b7a96' }}>
          Account
        </p>
        {bottomNav.map((item) => (
          <NavItem key={item.path} item={item} onClose={onClose} />
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer"
          style={{ color: '#eceef5', borderLeft: '2px solid transparent' }}
          onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent' }}
        >
          <LogOut size={16} strokeWidth={1.8} style={{ color: '#9aa8be', flexShrink: 0 }} />
          <span>Sign Out</span>
        </button>
        {profile?.role === 'super_admin' && (
          <NavLink to="/admin" style={{ textDecoration: 'none' }}>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer"
              style={{ color: '#f59e0b', borderLeft: '2px solid transparent' }}
              onMouseEnter={function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={function(e) { e.currentTarget.style.background = 'transparent' }}
            >
              <Settings size={16} strokeWidth={1.8} style={{ color: '#f59e0b', flexShrink: 0 }} />
              <span>Admin Panel</span>
            </div>
          </NavLink>
        )}
      </div>
    </>
  )
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        className="fixed top-3.5 left-4 z-50 p-2 rounded-lg lg:hidden"
        style={{ background: '#161a22', border: '1px solid #1e2330', color: '#eceef5' }}
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={18} />
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className="fixed left-0 top-0 h-screen w-64 flex flex-col z-50 transition-transform duration-300 lg:hidden"
        style={{ background: '#0d0f14', borderRight: '1px solid #1e2330', transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-56 flex-col z-30"
        style={{ background: '#0d0f14', borderRight: '1px solid #1e2330' }}>
        <SidebarContent />
      </aside>
    </>
  )
}
