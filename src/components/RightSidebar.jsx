import React from 'react'
import { mockWatchlist, mockSignals, mockTrendingNarratives } from '../data/mockData'
import { TrendingUp, TrendingDown } from 'lucide-react'

const signalColors = {
  green: { bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
  yellow: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
  red: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
}

export default function RightSidebar() {
  return (
    <aside
      className="fixed right-0 top-0 h-screen w-64 overflow-y-auto py-5 px-4 space-y-5"
      style={{ background: '#0d0f14', borderLeft: '1px solid #1e2330' }}
    >
      {/* Watchlist */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#4a5568' }}>
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
                <span className="text-sm font-semibold" style={{ color: '#e8eaf0' }}>{item.symbol}</span>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium" style={{ color: '#e8eaf0' }}>{item.price}</p>
                <p className="text-xs" style={{ color: item.up ? '#10b981' : '#ef4444' }}>{item.change}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Signals */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#4a5568' }}>
          Market Signals
        </p>
        <div className="space-y-2">
          {mockSignals.map((s) => (
            <div
              key={s.label}
              className="flex items-center justify-between px-3 py-2 rounded-lg"
              style={{ background: '#161a22', border: '1px solid #1e2330' }}
            >
              <span className="text-xs" style={{ color: '#8892a4' }}>{s.label}</span>
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

      {/* Trending Narratives */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#4a5568' }}>
          Trending Narratives
        </p>
        <div className="space-y-2">
          {mockTrendingNarratives.map((n, i) => (
            <div
              key={i}
              className="px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-white/5"
              style={{ background: '#161a22', border: '1px solid #1e2330' }}
            >
              <div className="flex gap-2">
                <span className="text-xs font-bold mt-0.5 flex-shrink-0" style={{ color: '#3b82f6' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-xs leading-snug" style={{ color: '#8892a4' }}>{n}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
