import React from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection } from '../components/DetailPageLayout'
import { Badge } from '../components/UI'
import { TrendingUp, TrendingDown, Star } from 'lucide-react'

const watchlistFull = [
  { symbol: 'XRP', name: 'XRP / Ripple', price: '$2.31', change: '+3.4%', high: '$2.40', low: '$2.20', vol: '$4.2B', up: true },
  { symbol: 'BTC', name: 'Bitcoin', price: '$67,420', change: '-1.2%', high: '$68,900', low: '$66,400', vol: '$28B', up: false },
  { symbol: 'SOL', name: 'Solana', price: '$148.60', change: '+5.1%', high: '$152.00', low: '$140.20', vol: '$3.8B', up: true },
  { symbol: 'ETH', name: 'Ethereum', price: '$3,480', change: '+0.8%', high: '$3,520', low: '$3,390', vol: '$14B', up: true },
  { symbol: 'HBAR', name: 'Hedera', price: '$0.098', change: '+2.1%', high: '$0.102', low: '$0.094', vol: '$180M', up: true },
  { symbol: 'XLM', name: 'Stellar', price: '$0.131', change: '+1.8%', high: '$0.135', low: '$0.127', vol: '$210M', up: true },
]

export default function Watchlist() {
  return (
    <AppLayout>
      <DetailPageLayout
        title="Watchlist"
        subtitle="Your tracked assets with live prices and key levels."
      >
        <div className="rounded-xl border overflow-hidden" style={{ background: '#161a22', borderColor: '#1e2330' }}>
          {/* Header */}
          <div className="grid grid-cols-6 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: '#4a5568', borderBottom: '1px solid #1e2330', background: '#111318' }}>
            <span className="col-span-2">Asset</span>
            <span className="text-right">Price</span>
            <span className="text-right">24h</span>
            <span className="text-right">Volume</span>
            <span className="text-right">24h Range</span>
          </div>

          {watchlistFull.map((a, i) => (
            <div
              key={a.symbol}
              className="grid grid-cols-6 gap-4 px-5 py-4 items-center cursor-pointer transition-colors hover:bg-white/5"
              style={{ borderBottom: i < watchlistFull.length - 1 ? '1px solid #1e2330' : 'none' }}
            >
              <div className="col-span-2 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}
                >
                  {a.symbol.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#e8eaf0' }}>{a.symbol}</p>
                  <p className="text-xs" style={{ color: '#4a5568' }}>{a.name}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-right" style={{ color: '#e8eaf0' }}>{a.price}</p>
              <div className="flex items-center justify-end gap-1">
                {a.up ? <TrendingUp size={12} style={{ color: '#10b981' }} /> : <TrendingDown size={12} style={{ color: '#ef4444' }} />}
                <span className="text-sm font-medium" style={{ color: a.up ? '#10b981' : '#ef4444' }}>{a.change}</span>
              </div>
              <p className="text-sm text-right" style={{ color: '#8892a4' }}>{a.vol}</p>
              <p className="text-xs text-right" style={{ color: '#4a5568' }}>{a.low} – {a.high}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
            style={{ color: '#8892a4', borderColor: '#1e2330' }}
          >
            <Star size={14} />
            Add Asset
          </button>
        </div>
      </DetailPageLayout>
    </AppLayout>
  )
}
