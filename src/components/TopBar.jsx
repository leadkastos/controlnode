import React from 'react'
import { useLocation } from 'react-router-dom'
import NotificationBell from './NotificationBell'

const routeTitles = {
  '/': 'Dashboard',
  '/morning-brief': 'Morning Brief',
  '/market-overview': 'Market Overview',
  '/xrp-intelligence': 'XRP Intelligence',
  '/domino-theory': 'Domino Theory',
  '/geopolitical-watch': 'Geopolitical Watch',
  '/oil-vs-yen': 'Oil vs Yen',
  '/media-narratives': 'Media & Narratives',
  '/etf-flows': 'ETF Flows',
  '/watchlist': 'Watchlist',
  '/account': 'Account',
  '/billing': 'Billing',
  '/settings': 'Settings',
  '/admin': 'Admin',
  '/admin/morning-brief': 'Admin — Morning Brief',
  '/admin/updates': 'Admin — Updates',
}

export default function TopBar() {
  const location = useLocation()
  const title = routeTitles[location.pathname] || 'ControlNode'

  return (
    <header
      className="sticky top-0 z-20 flex items-center justify-between px-4 lg:px-6 h-14"
      style={{ background: 'rgba(10,11,15,0.85)', borderBottom: '1px solid #1e2330', backdropFilter: 'blur(12px)' }}
    >
      {/* Left: spacer on mobile for hamburger, title */}
      <div className="flex items-center gap-3">
        <div className="w-8 lg:hidden" /> {/* space for hamburger button */}
        <h1
          className="text-base font-semibold tracking-tight"
          style={{ fontFamily: 'Syne, sans-serif', color: '#e8eaf0' }}
        >
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <NotificationBell />
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer ml-1"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff' }}
        >
          JD
        </div>
      </div>
    </header>
  )
}
