import React, { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, Zap, GitBranch, Globe,
  BarChart2, Newspaper, LineChart, Star, User, CreditCard,
  Settings, Menu, X, Youtube, MessageCircleWarning, LogOut, Activity, Bitcoin, Lock
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const xrpNav = [
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
  { label: 'Smart Money Flow', icon: Activity, path: '/smart-money-flow', color: '#10b981' },
  { label: 'Market Chatter', icon: MessageCircleWarning, path: '/market-chatter', color: '#8b5cf6' },
]

const btcNav = [
  { label: 'Dashboard', icon: LayoutDashboard, color: '#f7931a' },
  { label: 'Market Overview', icon: TrendingUp, color: '#06b6d4' },
  { label: 'Bitcoin Intelligence', icon: Bitcoin, color: '#f7931a' },
  { label: 'Geopolitical Watch', icon: Globe, color: '#ef4444' },
  { label: 'Media & Narratives', icon: Newspaper, color: '#ec4899' },
  { label: 'ETF Flows', icon: LineChart, color: '#10b981' },
  { label: 'Watchlist', icon: Star, color: '#eab308' },
  { label: 'YouTube Intel', icon: Youtube, color: '#ef4444' },
  { label: 'Smart Money Flow', icon: Activity, color: '#10b981' },
  { label: 'Market Chatter', icon: MessageCircleWarning, color: '#8b5cf6' },
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

function BtcNavItem({ item }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
      style={{
        background: hovered ? 'rgba(255,255,255,0.05)' : 'transparent',
        color: '#eceef5',
        borderLeft: '2px solid transparent',
        cursor: 'default',
      }}
      onMouseEnter={function() { setHovered(true) }}
      onMouseLeave={function() { setHovered(false) }}
    >
      <item.icon size={16} strokeWidth={1.8} style={{ color: item.color, flexShrink: 0 }} />
      <span className="flex-1">{item.label}</span>
      <Lock size={10} style={{ color: item.color, opacity: 0.5, flexShrink: 0 }} />
    </div>
  )
}

function SidebarContent({ onClose }) {
  const { signOut, profile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isBtc = location.pathname === '/bitcoin'

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <>
      <div className="px-4 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid #1e2330' }}>
        <div className="flex items-center gap-2.5">
          <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="12" fill="#6d28d9"/>
            <circle cx="32" cy="32" r="4" fill="white"/>
            <circle cx="16" cy="20" r="3" fill="white" opacity="0.9"/>
            <circle cx="48" cy="18" r="3" fill="white" opacity="0.9"/>
            <circle cx="50" cy="44" r="3" fill="white" opacity="0.9"/>
            <circle cx="18" cy="48" r="3" fill="white" opacity="0.9"/>
            <line x1="32" y1="32" x2="16" y2="20" stroke="white" strokeWidth="1.5" opacity="0.5"/>
            <line x1="32" y1="32" x2="48" y2="18" stroke="white" strokeWidth="1.5" opacity="0.5"/>
            <line x1="32" y1="32" x2="50" y2="44" stroke="white" strokeWidth="1.5" opacity="0.5"/>
            <line x1="32" y1="32" x2="18" y2="48" stroke="white" strokeWidth="1.5" opacity="0.5"/>
            <line x1="16" y1="20" x2="48" y2="18" stroke="white" strokeWidth="1" opacity="0.25"/>
            <line x1="50" y1="44" x2="18" y2="48" stroke="white" strokeWidth="1" opacity="0.25"/>
          </svg>
          <span className="font-semibold text-sm tracking-wide" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>
            ControlNode
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg lg:hidden" style={{ color: '#9aa8be' }}>
            <X size={18} />
          </button>
        )}
      </div>

      <div className="px-3 pt-4 pb-2">
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6b7a96' }}>Intelligence Hub</p>
        <div className="grid grid-cols-2 gap-1.5">
          <NavLink to="/" onClick={onClose} style={{ textDecoration: 'none' }}>
            <div className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all" style={{
              background: !isBtc ? 'rgba(139,92,246,0.15)' : '#111318',
              border: !isBtc ? '1px solid rgba(139,92,246,0.4)' : '1px solid #1e2330',
              color: !isBtc ? '#8b5cf6' : '#6b7a96'
            }}>
              <Zap size={12} />
              XRP
            </div>
          </NavLink>
          <NavLink to="/bitcoin" onClick={onClose} style={{ textDecoration: 'none' }}>
            <div className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all" style={{
              background: isBtc ? 'rgba(247,147,26,0.15)' : '#111318',
              border: isBtc ? '1px solid rgba(247,147,26,0.4)' : '1px solid #1e2330',
              color: isBtc ? '#f7931a' : '#6b7a96'
            }}>
              <Bitcoin size={12} />
              BTC
              {!isBtc && <Lock size={9} style={{ opacity: 0.6 }} />}
            </div>
          </NavLink>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: '#6b7a96' }}>
          {isBtc ? 'Bitcoin Intelligence' : 'Intelligence'}
        </p>
        {isBtc ? (
          <>
            <div className="rounded-lg px-3 py-2 mb-2 text-xs" style={{ background: 'rgba(247,147,26,0.07)', border: '1px solid rgba(247,147,26,0.15)', color: '#f7931a' }}>
              <Lock size={10} className="inline mr-1" />
              Coming Soon — Founding members get early access
            </div>
            {btcNav.map(function(item, i) {
              return <BtcNavItem key={i} item={item} />
            })}
          </>
        ) : (
          xrpNav.map((item) => (
            <NavItem key={item.path} item={item} onClose={onClose} />
          ))
        )}
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
