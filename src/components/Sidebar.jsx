import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, Zap, GitBranch, Globe,
  BarChart2, Newspaper, LineChart, Star, User, CreditCard,
  Settings, Menu, X
} from 'lucide-react'

const mainNav = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Market Overview', icon: TrendingUp, path: '/market-overview' },
  { label: 'XRP Intelligence', icon: Zap, path: '/xrp-intelligence' },
  { label: 'Domino Theory', icon: GitBranch, path: '/domino-theory' },
  { label: 'Geopolitical Watch', icon: Globe, path: '/geopolitical-watch' },
  { label: 'Oil vs Yen', icon: BarChart2, path: '/oil-vs-yen' },
  { label: 'Media & Narratives', icon: Newspaper, path: '/media-narratives' },
  { label: 'ETF Flows', icon: LineChart, path: '/etf-flows' },
  { label: 'Watchlist', icon: Star, path: '/watchlist' },
]

const bottomNav = [
  { label: 'Account', icon: User, path: '/account' },
  { label: 'Billing', icon: CreditCard, path: '/billing' },
  { label: 'Settings', icon: Settings, path: '/settings' },
]

function NavItem({ item, onClose }) {
  const location = useLocation()
  const isActive = item.path === '/'
    ? location.pathname === '/'
    : location.pathname.startsWith(item.path)

  return (
    <NavLink
      to={item.path}
      className={`sidebar-item ${isActive ? 'active' : ''}`}
      onClick={onClose}
    >
      <item.icon size={16} strokeWidth={1.8} />
      <span>{item.label}</span>
    </NavLink>
  )
}

function SidebarContent({ onClose }) {
  return (
    <>
      <div className="px-4 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #1e2330' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
          >
            CN
          </div>
          <span className="font-semibold text-sm tracking-wide" style={{ fontFamily: 'Syne, sans-serif', color: '#e8eaf0' }}>
            ControlNode
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg lg:hidden" style={{ color: '#8892a4' }}>
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-0.5">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: '#4a5568' }}>
          Intelligence
        </p>
        {mainNav.map((item) => (
          <NavItem key={item.path} item={item} onClose={onClose} />
        ))}
      </nav>

      <div className="px-2 py-4 space-y-0.5" style={{ borderTop: '1px solid #1e2330' }}>
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: '#4a5568' }}>
          Account
        </p>
        {bottomNav.map((item) => (
          <NavItem key={item.path} item={item} onClose={onClose} />
        ))}
      </div>
    </>
  )
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="fixed top-3.5 left-4 z-50 p-2 rounded-lg lg:hidden"
        style={{ background: '#161a22', border: '1px solid #1e2330', color: '#e8eaf0' }}
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className="fixed left-0 top-0 h-screen w-64 flex flex-col z-50 transition-transform duration-300 lg:hidden"
        style={{
          background: '#0d0f14',
          borderRight: '1px solid #1e2330',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 h-screen w-56 flex-col z-30"
        style={{ background: '#0d0f14', borderRight: '1px solid #1e2330' }}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
