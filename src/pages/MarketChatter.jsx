import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { MessageCircleWarning, ExternalLink, AlertTriangle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const categoryColors = {
  'ETF Rumor': { bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
  'Ripple Rumor': { bg: 'rgba(139,92,246,0.12)', text: '#8b5cf6' },
  'XRP Rumor': { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
  'Regulatory': { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
  'Exchange': { bg: 'rgba(6,182,212,0.12)', text: '#06b6d4' },
  'Macro': { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
  'Social Buzz': { bg: 'rgba(236,72,153,0.12)', text: '#ec4899' },
  'General': { bg: 'rgba(75,85,99,0.2)', text: '#6b7280' },
}

const sourceColors = {
  'X / Twitter': '#1d9bf0',
  'Instagram': '#e1306c',
  'Facebook': '#1877f2',
  'YouTube': '#ef4444',
  'Telegram': '#0088cc',
  'Reddit': '#ff4500',
  'Other': '#6b7280',
}

const reactions = [
  { key: 'fire_count', emoji: '🔥', label: 'Fire' },
  { key: 'thinking_count', emoji: '🤔', label: 'Thinking' },
  { key: 'bullish_count', emoji: '📈', label: 'Bullish' },
  { key: 'warning_count', emoji: '⚠️', label: 'Warning' },
]

function timeAgo(ts) {
  var diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
  if (diff < 3600) return Math.floor(diff / 60) + ' min ago'
  if (diff < 86400) return Math.floor(diff / 3600) + ' hrs ago'
  return Math.floor(diff / 86400) + ' days ago'
}

function ChatterCard({ item, onReact }) {
  var catColor = categoryColors[item.category] || categoryColors['General']
  var srcColor = sourceColors[item.source] || sourceColors['Other']

  return (
    <div className="rounded-xl p-5 border" style={{ background: '#161a22', borderColor: '#1e2330', borderLeft: '3px solid ' + srcColor }}>
      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {item.source && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: srcColor + '20', color: srcColor }}>{item.source}</span>
          )}
          <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: catColor.bg, color: catColor.text }}>{item.category}</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}>Unconfirmed</span>
        </div>
        <span className="text-xs flex-shrink-0" style={{ color: '#6b7a96' }}>{timeAgo(item.created_at)}</span>
      </div>

      <h3 className="text-sm font-semibold mb-2 leading-snug" style={{ color: '#eceef5' }}>{item.content}</h3>

      {item.source_url && (
        <div className="mb-3">
          <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs" style={{ color: '#3b82f6' }}>
            <ExternalLink size={11} />View Source
          </a>
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid #1e2330' }}>
        <div className="flex items-center gap-2">
          {reactions.map(function(r) {
            return (
              <button key={r.key} onClick={function() { onReact(item.id, r.key, item[r.key] || 0) }} className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-colors hover:bg-white/10" style={{ background: '#111318', border: '1px solid #1e2330', color: '#9aa8be' }}>
                <span>{r.emoji}</span>
                <span>{item[r.key] || 0}</span>
              </button>
            )
          })}
        </div>
        <span className="text-xs" style={{ color: '#4a5870' }}>Posted by ControlNode</span>
      </div>
    </div>
  )
}

export default function MarketChatter() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const { user } = useAuth()

  async function load() {
    var res = await supabase.from('market_chatter').select('*').eq('flagged', false).order('created_at', { ascending: false }).limit(50)
    if (res.data) setPosts(res.data)
    setLoading(false)
  }

  useEffect(function() { load() }, [])

  async function handleReact(id, field, currentCount) {
    var update = {}
    update[field] = currentCount + 1
    await supabase.from('market_chatter').update(update).eq('id', id)
    setPosts(function(prev) {
      return prev.map(function(p) {
        if (p.id === id) { var u = Object.assign({}, p); u[field] = currentCount + 1; return u }
        return p
      })
    })
  }

  var categories = ['All', 'ETF Rumor', 'Ripple Rumor', 'XRP Rumor', 'Regulatory', 'Exchange', 'Macro', 'Social Buzz', 'General']
  var filtered = categoryFilter === 'All' ? posts : posts.filter(function(p) { return p.category === categoryFilter })

  return (
    <AppLayout>
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>Market Chatter</h1>
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}>
            <AlertTriangle size={11} />Unverified
          </span>
        </div>
        <p className="text-sm" style={{ color: '#9aa8be' }}>Unverified reports, rumors, and social chatter being monitored by ControlNode. React with an emoji to share your take.</p>
      </div>

      <div className="rounded-xl p-4 mb-6 flex gap-3" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
        <div>
          <p className="text-xs font-semibold mb-1" style={{ color: '#ef4444' }}>Important Disclaimer</p>
          <p className="text-xs leading-relaxed" style={{ color: '#9aa8be' }}>Content on this page is unconfirmed and has not been independently verified by ControlNode. Do your own research. Nothing here constitutes financial advice. Posts containing advertisements, spam, or off-topic content are not permitted and may result in removal from the platform.</p>
        </div>
      </div>

      <div className="rounded-xl p-4 mb-5" style={{ background: '#161a22', border: '1px solid #1e2330' }}>
        <p className="text-xs uppercase tracking-wide mb-2" style={{ color: '#6b7a96' }}>Filter by Category</p>
        <div className="flex flex-wrap gap-1">
          {categories.map(function(c) {
            return (
              <button key={c} onClick={function() { setCategoryFilter(c) }} className="px-2.5 py-1 rounded-lg text-xs font-medium transition-colors" style={{ background: categoryFilter === c ? '#8b5cf6' : '#111318', color: categoryFilter === c ? '#fff' : '#8892a4', border: '1px solid ' + (categoryFilter === c ? '#8b5cf6' : '#1e2330') }}>
                {c}
              </button>
            )
          })}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2,3].map(function(i) { return <div key={i} className="rounded-xl animate-pulse" style={{ background: '#161a22', height: '160px' }} /> })}</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl p-10 text-center border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
          <MessageCircleWarning size={32} className="mx-auto mb-3" style={{ color: '#4a5870' }} />
          <p className="text-sm font-medium mb-1" style={{ color: '#6b7a96' }}>No chatter posted yet</p>
          <p className="text-xs" style={{ color: '#4a5870' }}>ControlNode will post notable market chatter here as it surfaces.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(function(item) {
            return <ChatterCard key={item.id} item={item} onReact={handleReact} />
          })}
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-xs" style={{ color: '#4a5870' }}>{filtered.length} item{filtered.length !== 1 ? 's' : ''} · All content unverified · ControlNode does not endorse any chatter content</p>
      </div>
    </AppLayout>
  )
}
