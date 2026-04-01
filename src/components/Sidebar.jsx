import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, Zap, GitBranch, Globe,
  BarChart2, Newspaper, LineChart, Star, User, CreditCard,
  Settings, Menu, X, Youtube
} from 'lucide-react'

const mainNav = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/', color: '#3b82f6' },
  { label: 'Market Overview', icon: TrendingUp, path: '/market-overview', color: '#06b6d4' },
  { label: 'XRP Intelligence', icon: Zap, path: '/xrp-intelligence', color: '#8b5cf6' },
  { label: 'Domino Theory', icon: GitBranch, path: '/domino-theory', color: '#f59e0b' },
  { label: 'Geopolitical Watch', icon: Globe, path: '/geopolitical-watch', color: '#ef4444' },
  { label: 'Oil vs Yen', icon: BarChart2, path: '/oil-vs-yen', color: '#f97316' },
  { label: 'Media & Narratives', icon: Newspaper, path: '/media-narratives', color: '#ec4899' },
  { label: 'ETF Flows', icon: LineChart, path: '/etf-flows', color: '#10b981' },
  { label: 'Watchlist', icon: Star, path: '/watchlist', color: '#eab308' },
  { label: 'YouTube Intel', icon: Youtube, path: '/youtube-intel', color: '#ef4444' },
]

const bottomNav = [
  { label: 'Account', icon: User, path: '/account', color: '#8892a4' },
  { label: 'Billing', icon: CreditCard, path: '/billing', color: '#8892a4' },
  { label: 'Settings', icon: Settings, path: '/settings', color: '#8892a4' },
]

function NavItem({ item, onClose }) {
  const location = useLocation()
  const isActive = item.path === '/'
    ? location.pathname === '/'
    : location.pathname.startsWith(item.path)

  return (
    <NavLink
      to={item.path}
      onClick={onClose}
      style={{ textDecoration: 'none' }}
    >
      <div
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer"
        style={{
          background: isActive ? `${item.color}18` : 'transparent',
          color: isActive ? item.color : '#8892a4',
          borderLeft: isActive ? `2px solid ${item.color}` : '2px solid transparent',
        }}
      >
        <item.icon
          size={16}
          strokeWidth={1.8}
          style={{ color: isActive ? item.color : item.color + '99', flexShrink: 0 }}
        />
        <span>{item.label}</span>
      </div>
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
      <button
        className="fixed top-3.5 left-4 z-50 p-2 rounded-lg lg:hidden"
        style={{ background: '#161a22', border: '1px solid #1e2330', color: '#e8eaf0' }}
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={18} />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

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

      <aside
        className="hidden lg:flex fixed left-0 top-0 h-screen w-56 flex-col z-30"
        style={{ background: '#0d0f14', borderRight: '1px solid #1e2330' }}
      >
        <SidebarContent />
      </aside>
    </>
  )
}
