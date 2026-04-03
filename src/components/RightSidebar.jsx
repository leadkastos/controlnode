import React from 'react'
import { mockWatchlist, mockSignals, mockNewsFeed } from '../data/mockData'
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react'

const signalColors = {
  green: { bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
  yellow: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
  red: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
}

const categoryColors = {
  Regulatory: { bg: 'rgba(139,92,246,0.12)', text: '#8b5cf6' },
  Government: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
  Geopolitical: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
  ETF: { bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
  Macro: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
  XRP: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
  Ripple: { bg: 'rgba(139,92,246,0.12)', text: '#8b5cf6' },
}

export default function RightSidebar() {
  return (
    <aside
      className="hidden lg:flex fixed right-0 top-0 h-screen w-64 flex-col z-30"
      style={{ background: '#0d0f14', borderLeft: '1px solid #1e2330' }}
    >
      {/* Spacer for topbar height */}
      <div style={{ height: '56px', flexShrink: 0, borderBottom: '1px solid #1e2330' }} />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-5">
        {/* Watchlist */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6b7a96' }}>
            Watchlist
          </p>
          <div className="space-y-1.5">
            {mockWatchlist.map((item) => (
              <div
                key={item.symbol}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-white/5"
                style={{ background: '#161a22', border: '1px solid #1e2330' }}
              >
                <div className="flex items-center gap-2">
                  {item.up
                    ? <TrendingUp size={13} style={{ color: '#10b981' }} />
                    : <TrendingDown size={13} style={{ color: '#ef4444' }} />
                  }
                  <span className="text-sm font-semibold" style={{ color: '#eceef5' }}>{item.symbol}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium" style={{ color: '#eceef5' }}>{item.price}</p>
                  <p className="text-xs" style={{ color: item.up ? '#10b981' : '#ef4444' }}>{item.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Signals */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6b7a96' }}>
            Market Signals
          </p>
          <div className="space-y-2">
            {mockSignals.map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-between px-3 py-2 rounded-lg"
                style={{ background: '#161a22', border: '1px solid #1e2330' }}
              >
                <span className="text-xs" style={{ color: '#9aa8be' }}>{s.label}</span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded"
                  style={{ background: signalColors[s.color].bg, color: signalColors[s.color].text }}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* News Feed */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6b7a96' }}>
            News Feed
          </p>
          <div className="space-y-2">
            {mockNewsFeed.map((item) => {
              const cat = categoryColors[item.category] || categoryColors['XRP']
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-3 rounded-lg transition-colors hover:bg-white/5"
                  style={{ background: '#161a22', border: '1px solid #1e2330', textDecoration: 'none' }}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: cat.bg, color: cat.text }}>
                      {item.category}
                    </span>
                    <ExternalLink size={10} style={{ color: '#6b7a96', flexShrink: 0 }} />
                  </div>
                  <p className="text-xs leading-snug mb-1" style={{ color: '#eceef5' }}>{item.headline}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: '#3b82f6' }}>{item.source}</span>
                    <span className="text-xs" style={{ color: '#6b7a96' }}>{item.time}</span>
                  </div>
                </a>
              )
            })}
          </div>
        </div>

        <div className="pt-2 pb-4">
          <p className="text-xs leading-relaxed" style={{ color: '#4a5870' }}>
            For informational purposes only. Not financial advice.
          </p>
        </div>
      </div>
    </aside>
  )
}
