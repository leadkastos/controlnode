import React, { useState } from 'react'
import AppLayout from '../components/AppLayout'
import { MessageCircleWarning, ExternalLink, Filter, Search, Star, AlertTriangle } from 'lucide-react'

const mockChatter = [
  {
    id: 1,
    source_type: 'x',
    category: 'etf_rumor',
    custom_headline: 'BlackRock Internal Memo Allegedly References XRP ETF Timeline',
    admin_summary: 'A screenshot circulating on X purportedly shows an internal BlackRock document referencing an XRP ETF filing timeline of Q3 2026. This has NOT been verified by ControlNode or any reputable news source. Treat as unconfirmed rumor only.',
    source_url: 'https://x.com',
    date_added: '2 hours ago',
    is_featured: true,
    platform_color: '#1d9bf0',
    platform_label: 'X / Twitter',
  },
  {
    id: 2,
    source_type: 'x',
    category: 'ripple_rumor',
    custom_headline: 'Ripple IPO Date Allegedly Leaked — H2 2026 Target Circulating',
    admin_summary: 'Multiple accounts on X are sharing what they claim is a leaked Ripple investor communication suggesting an IPO target window of Q3–Q4 2026. No official confirmation from Ripple. Source unknown.',
    source_url: 'https://x.com',
    date_added: '5 hours ago',
    is_featured: false,
    platform_color: '#1d9bf0',
    platform_label: 'X / Twitter',
  },
  {
    id: 3,
    source_type: 'youtube',
    category: 'xrp_rumor',
    custom_headline: 'YouTube Creator Claims Insider Source on XRP Price Movement',
    admin_summary: 'A popular XRP-focused YouTube channel posted a video claiming access to an insider source predicting a significant XRP price move within 30 days. ControlNode has not verified this claim. This is social commentary only.',
    source_url: 'https://youtube.com',
    date_added: '8 hours ago',
    is_featured: false,
    platform_color: '#ef4444',
    platform_label: 'YouTube',
  },
  {
    id: 4,
    source_type: 'instagram',
    category: 'regulatory_chatter',
    custom_headline: 'Screenshot Circulating of Alleged SEC Internal Discussion on XRP',
    admin_summary: 'An Instagram post is circulating a screenshot allegedly showing an SEC internal Slack discussion about XRP classification. Authenticity is completely unverified. Could be fabricated. Monitor only.',
    source_url: 'https://instagram.com',
    date_added: '1 day ago',
    is_featured: false,
    platform_color: '#e1306c',
    platform_label: 'Instagram',
  },
  {
    id: 5,
    source_type: 'x',
    category: 'macro_chatter',
    custom_headline: 'Unconfirmed: BOJ Emergency Meeting Allegedly Scheduled This Week',
    admin_summary: 'Chatter on X suggests the Bank of Japan may have scheduled an emergency policy meeting this week. This has not been confirmed by any official Japanese government or BOJ communication channel. Watch for official confirmation.',
    source_url: 'https://x.com',
    date_added: '1 day ago',
    is_featured: true,
    platform_color: '#1d9bf0',
    platform_label: 'X / Twitter',
  },
  {
    id: 6,
    source_type: 'facebook',
    category: 'exchange_chatter',
    custom_headline: 'Rumor: Major Exchange Allegedly Preparing XRP Futures Product',
    admin_summary: 'A Facebook crypto group post claims a major unnamed exchange is preparing to launch XRP perpetual futures. No exchange has made any official announcement. Source is anonymous and unverifiable.',
    source_url: 'https://facebook.com',
    date_added: '2 days ago',
    is_featured: false,
    platform_color: '#1877f2',
    platform_label: 'Facebook',
  },
]

const sourceTypes = ['All', 'X / Twitter', 'Instagram', 'Facebook', 'YouTube', 'Other']
const categories = ['All', 'ETF Rumor', 'Ripple Rumor', 'XRP Rumor', 'Regulatory Chatter', 'Exchange Chatter', 'Macro Chatter', 'Market Sentiment', 'Other']

const categoryMap = {
  etf_rumor: 'ETF Rumor',
  ripple_rumor: 'Ripple Rumor',
  xrp_rumor: 'XRP Rumor',
  regulatory_chatter: 'Regulatory Chatter',
  exchange_chatter: 'Exchange Chatter',
  macro_chatter: 'Macro Chatter',
  market_sentiment: 'Market Sentiment',
  other: 'Other',
}

const categoryColors = {
  etf_rumor: { bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
  ripple_rumor: { bg: 'rgba(139,92,246,0.12)', text: '#8b5cf6' },
  xrp_rumor: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
  regulatory_chatter: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
  exchange_chatter: { bg: 'rgba(6,182,212,0.12)', text: '#06b6d4' },
  macro_chatter: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
  market_sentiment: { bg: 'rgba(236,72,153,0.12)', text: '#ec4899' },
  other: { bg: 'rgba(75,85,99,0.2)', text: '#6b7280' },
}

function PlatformIcon({ type, color, label }) {
  const icons = {
    x: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    instagram: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    facebook: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    youtube: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  }

  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold"
      style={{ background: `${color}20`, color }}
    >
      <span style={{ color }}>{icons[type] || icons.x}</span>
      {label}
    </div>
  )
}

function ChatterCard({ item }) {
  const cat = categoryColors[item.category] || categoryColors.other

  return (
    <div
      className="rounded-xl p-5 border transition-all"
      style={{
        background: '#161a22',
        borderColor: item.is_featured ? 'rgba(139,92,246,0.4)' : '#1e2330',
        borderLeft: item.is_featured ? '3px solid #8b5cf6' : '3px solid transparent',
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <PlatformIcon type={item.source_type} color={item.platform_color} label={item.platform_label} />
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded"
            style={{ background: cat.bg, color: cat.text }}
          >
            {categoryMap[item.category]}
          </span>
          {item.is_featured && (
            <span
              className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded"
              style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}
            >
              <Star size={10} fill="currentColor" />
              Featured
            </span>
          )}
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}
          >
            Unconfirmed
          </span>
        </div>
        <span className="text-xs flex-shrink-0" style={{ color: '#6b7a96' }}>{item.date_added}</span>
      </div>

      {/* Headline */}
      <h3 className="text-sm font-semibold mb-2 leading-snug" style={{ color: '#eceef5' }}>
        {item.custom_headline}
      </h3>

      {/* Summary */}
      <p className="text-xs leading-relaxed mb-4" style={{ color: '#9aa8be' }}>
        {item.admin_summary}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs" style={{ color: '#4a5870' }}>Added by ControlNode Admin</span>
        <a
          href={item.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-80"
          style={{ background: '#111318', border: '1px solid #1e2330', color: '#9aa8be' }}
        >
          <ExternalLink size={11} />
          Open Source
        </a>
      </div>
    </div>
  )
}

export default function MarketChatter() {
  const [sourceFilter, setSourceFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')

  const filtered = mockChatter.filter(item => {
    const matchSource = sourceFilter === 'All' || item.platform_label === sourceFilter
    const matchCategory = categoryFilter === 'All' || categoryMap[item.category] === categoryFilter
    const matchSearch = !searchQuery ||
      item.custom_headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.admin_summary.toLowerCase().includes(searchQuery.toLowerCase())
    return matchSource && matchCategory && matchSearch
  })

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>
            Unconfirmed Market Chatter
          </h1>
          <span
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}
          >
            <AlertTriangle size={11} />
            Unverified Information
          </span>
        </div>
        <p className="text-sm" style={{ color: '#9aa8be' }}>
          Unverified reports, rumors, social chatter, and third-party information being monitored by ControlNode.
        </p>
      </div>

      {/* Disclaimer box */}
      <div
        className="rounded-xl p-4 mb-6 flex gap-3"
        style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}
      >
        <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
        <div>
          <p className="text-xs font-semibold mb-1" style={{ color: '#ef4444' }}>Important Disclaimer</p>
          <p className="text-xs leading-relaxed" style={{ color: '#9aa8be' }}>
            The content shown on this page is provided for informational purposes only. It may include unconfirmed reports, rumors, opinions, commentary, or third-party information that has not been independently verified by ControlNode. Users should conduct their own research and independently verify any information before relying on it or making any decisions based on it. Nothing on this page constitutes financial advice.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div
        className="rounded-xl p-4 mb-5 space-y-3"
        style={{ background: '#161a22', border: '1px solid #1e2330' }}
      >
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6b7a96' }} />
          <input
            type="text"
            placeholder="Search chatter..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
            style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Source filter */}
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wide mb-1.5" style={{ color: '#6b7a96' }}>Source</p>
            <div className="flex flex-wrap gap-1">
              {sourceTypes.map(s => (
                <button
                  key={s}
                  onClick={() => setSourceFilter(s)}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    background: sourceFilter === s ? '#3b82f6' : '#111318',
                    color: sourceFilter === s ? '#fff' : '#8892a4',
                    border: '1px solid ' + (sourceFilter === s ? '#3b82f6' : '#1e2330'),
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <p className="text-xs uppercase tracking-wide mb-1.5" style={{ color: '#6b7a96' }}>Sort</p>
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs outline-none"
              style={{ background: '#111318', border: '1px solid #1e2330', color: '#9aa8be' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="featured">Featured First</option>
            </select>
          </div>
        </div>

        {/* Category filter */}
        <div>
          <p className="text-xs uppercase tracking-wide mb-1.5" style={{ color: '#6b7a96' }}>Category</p>
          <div className="flex flex-wrap gap-1">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors"
                style={{
                  background: categoryFilter === c ? '#8b5cf6' : '#111318',
                  color: categoryFilter === c ? '#fff' : '#8892a4',
                  border: '1px solid ' + (categoryFilter === c ? '#8b5cf6' : '#1e2330'),
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feed */}
      {filtered.length === 0 ? (
        <div
          className="rounded-xl p-10 text-center border"
          style={{ background: '#161a22', borderColor: '#1e2330' }}
        >
          <MessageCircleWarning size={32} className="mx-auto mb-3" style={{ color: '#4a5870' }} />
          <p className="text-sm font-medium mb-1" style={{ color: '#6b7a96' }}>No chatter found</p>
          <p className="text-xs" style={{ color: '#4a5870' }}>
            Try adjusting your filters or check back later.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(item => (
            <ChatterCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-xs" style={{ color: '#4a5870' }}>
          {filtered.length} item{filtered.length !== 1 ? 's' : ''} shown · All content unverified · ControlNode does not endorse any chatter content
        </p>
      </div>
    </AppLayout>
  )
}
