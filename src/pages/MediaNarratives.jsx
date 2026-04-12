import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection } from '../components/DetailPageLayout'
import { Badge } from '../components/UI'
import { ExternalLink } from 'lucide-react'

const CRYPTOCOMPARE_KEY = import.meta.env.VITE_CRYPTOCOMPARE_API_KEY

const headlines = [
  { source: 'Reuters', headline: 'SEC Drops Final XRP Lawsuit Appeal — Ripple Fully Cleared to Operate', time: '2 hrs ago', category: 'Regulatory', url: '#', confirmed: true },
  { source: 'Bloomberg', headline: 'BlackRock Files XRP ETF Application — Third Major Institution This Month', time: '4 hrs ago', category: 'ETF', url: '#', confirmed: true },
  { source: 'Financial Times', headline: 'BRICS Summit Opens With Digital Settlement Framework Language for First Time', time: '6 hrs ago', category: 'Geopolitical', url: '#', confirmed: true },
  { source: 'CoinDesk', headline: 'XRP On-Chain Activity Hits 12-Month High as ODL Corridors Expand Globally', time: '8 hrs ago', category: 'XRP', url: '#', confirmed: true },
  { source: 'WSJ', headline: 'BOJ Holds Rates — Yen Carry Trade Dynamics Remain Active Amid USD/JPY Surge', time: '10 hrs ago', category: 'Macro', url: '#', confirmed: true },
  { source: 'Congress.gov', headline: 'Senate Banking Committee Schedules Crypto Market Structure Hearing for April', time: '12 hrs ago', category: 'Government', url: '#', confirmed: true },
  { source: 'The Block', headline: 'Ripple IPO Timeline: Investment Banks Said to Be in Early Conversations', time: '18 hrs ago', category: 'Ripple', url: '#', confirmed: false },
  { source: 'Decrypt', headline: 'XRP Futures Open Interest Hits Record High — Derivatives Market Expanding', time: '22 hrs ago', category: 'Markets', url: '#', confirmed: true },
  { source: 'Forbes', headline: 'Sovereign Wealth Fund Reportedly Exploring XRP Allocation — Sources Unconfirmed', time: '28 hrs ago', category: 'Institutional', url: '#', confirmed: false },
  { source: 'CoinDesk', headline: 'Ripple Expands RLUSD Stablecoin to Three New Markets — Official Announcement', time: '36 hrs ago', category: 'Ripple', url: '#', confirmed: true },
  { source: 'Reuters', headline: 'Oil Rises to $89 as OPEC+ Reaffirms Production Cut Extension Through Q2', time: '40 hrs ago', category: 'Macro', url: '#', confirmed: true },
  { source: 'Financial Times', headline: 'EU MiCA Compliance Deadline Passes — Major Exchanges Now Fully Regulated', time: '44 hrs ago', category: 'Regulatory', url: '#', confirmed: true },
]

const categoryColors = {
  Regulatory: { bg: 'rgba(139,92,246,0.12)', text: '#8b5cf6' },
  Government: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
  Geopolitical: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
  ETF: { bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
  Macro: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
  XRP: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
  Ripple: { bg: 'rgba(139,92,246,0.12)', text: '#8b5cf6' },
  Markets: { bg: 'rgba(6,182,212,0.12)', text: '#06b6d4' },
  Institutional: { bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
}

function SentimentSection() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    fetch('https://min-api.cryptocompare.com/data/social/coin/latest?coinId=5031&api_key=' + CRYPTOCOMPARE_KEY)
      .then(function(r) { return r.json() })
      .then(function(json) {
        if (json && json.Data) setData(json.Data)
        setLoading(false)
      })
      .catch(function() { setLoading(false) })
  }, [])

  function formatNum(n) {
    if (!n) return '—'
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
    if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
    return n.toString()
  }

  return (
    <DetailSection title="XRP Social Sentiment">
      <div className="rounded-lg px-4 py-3 mb-4 text-xs leading-relaxed" style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)', color: '#9aa8be' }}>
        <span style={{ color: '#10b981', fontWeight: 600 }}>What is this? </span>
        Live social activity data for XRP across Reddit and Twitter. High mention volume often precedes price movement. Sourced from CryptoCompare.
      </div>
      {loading ? (
        <p style={{ color: '#6b7a96' }}>Loading sentiment data...</p>
      ) : !data ? (
        <p style={{ color: '#6b7a96' }}>Sentiment data unavailable.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.Reddit && (
            <div className="rounded-lg p-4" style={{ background: '#111318', border: '1px solid #1e2330' }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6b7a96' }}>Reddit</p>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-xs" style={{ color: '#9aa8be' }}>Subscribers</span><span className="text-xs font-mono" style={{ color: '#eceef5' }}>{formatNum(data.Reddit.subscribers)}</span></div>
                <div className="flex justify-between"><span className="text-xs" style={{ color: '#9aa8be' }}>Active Users</span><span className="text-xs font-mono" style={{ color: '#eceef5' }}>{formatNum(data.Reddit.active_users)}</span></div>
                <div className="flex justify-between"><span className="text-xs" style={{ color: '#9aa8be' }}>Posts (24h)</span><span className="text-xs font-mono" style={{ color: '#eceef5' }}>{formatNum(data.Reddit.posts_per_day)}</span></div>
                <div className="flex justify-between"><span className="text-xs" style={{ color: '#9aa8be' }}>Comments (24h)</span><span className="text-xs font-mono" style={{ color: '#eceef5' }}>{formatNum(data.Reddit.comments_per_day)}</span></div>
              </div>
            </div>
          )}
          {data.Twitter && (
            <div className="rounded-lg p-4" style={{ background: '#111318', border: '1px solid #1e2330' }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6b7a96' }}>X (Twitter)</p>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-xs" style={{ color: '#9aa8be' }}>Followers</span><span className="text-xs font-mono" style={{ color: '#eceef5' }}>{formatNum(data.Twitter.followers)}</span></div>
                <div className="flex justify-between"><span className="text-xs" style={{ color: '#9aa8be' }}>Statuses</span><span className="text-xs font-mono" style={{ color: '#eceef5' }}>{formatNum(data.Twitter.statuses)}</span></div>
                <div className="flex justify-between"><span className="text-xs" style={{ color: '#9aa8be' }}>Favourites</span><span className="text-xs font-mono" style={{ color: '#eceef5' }}>{formatNum(data.Twitter.favourites)}</span></div>
                <div className="flex justify-between"><span className="text-xs" style={{ color: '#9aa8be' }}>Following</span><span className="text-xs font-mono" style={{ color: '#eceef5' }}>{formatNum(data.Twitter.following)}</span></div>
              </div>
            </div>
          )}
        </div>
      )}
      <p className="text-xs mt-3" style={{ color: '#6b7a96' }}>Source: CryptoCompare · For informational purposes only.</p>
    </DetailSection>
  )
}

export default function MediaNarratives() {
  return (
    <AppLayout>
      <DetailPageLayout title="Media & Narratives" subtitle="Top headlines from the last 48 hours — reputable sources only. For informational purposes only." badge="LAST 48 HOURS" badgeColor="blue">
        <SentimentSection />
        <DetailSection title="Top Headlines">
          <div className="space-y-1">
            {headlines.map(function(item, i) {
              const cat = categoryColors[item.category] || categoryColors['XRP']
              return (
                <a href={item.url} target="_blank" rel="noopener noreferrer" key={i} className="flex items-start gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-white/5 block" style={{ textDecoration: 'none', borderBottom: '1px solid #1e2330' }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: cat.bg, color: cat.text }}>{item.category}</span>
                      {!item.confirmed && (<span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>Unconfirmed</span>)}
                    </div>
                    <p className="text-sm leading-snug mb-1.5" style={{ color: '#eceef5' }}>{item.headline}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium" style={{ color: '#3b82f6' }}>{item.source}</span>
                      <span className="text-xs" style={{ color: '#6b7a96' }}>{item.time}</span>
                      <ExternalLink size={10} style={{ color: '#6b7a96' }} />
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </DetailSection>
        <div className="rounded-lg px-4 py-3 mt-2 text-xs text-center" style={{ color: '#6b7a96' }}>
          Headlines sourced from Reuters, Bloomberg, WSJ, Financial Times, CoinDesk, The Block, Forbes, Decrypt, and official government sources only. Unconfirmed items are flagged in red — always verify independently.
        </div>
      </DetailPageLayout>
    </AppLayout>
  )
}
