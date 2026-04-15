import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { ExternalLink } from 'lucide-react'
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
  Business: { bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
  Technology: { bg: 'rgba(6,182,212,0.12)', text: '#06b6d4' },
  Blockchain: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
}
function timeAgo(ts) {
  var diff = Math.floor((Date.now() / 1000) - ts)
  if (diff < 3600) return Math.floor(diff / 60) + ' min ago'
  if (diff < 86400) return Math.floor(diff / 3600) + ' hrs ago'
  return Math.floor(diff / 86400) + ' days ago'
}
function getCategoryColor(categories) {
  if (!categories) return categoryColors['XRP']
  var cats = categories.split('|')
  for (var i = 0; i < cats.length; i++) {
    var t = cats[i].trim()
    if (categoryColors[t]) return categoryColors[t]
  }
  return categoryColors['XRP']
}
function getCategoryLabel(categories) {
  if (!categories) return 'XRP'
  return categories.split('|')[0].trim()
}
export default function MediaNarratives() {
  const [xrpNews, setXrpNews] = useState([])
  const [marketNews, setMarketNews] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(function() {
    var key = import.meta.env.VITE_CRYPTOCOMPARE_API_KEY
    async function fetchAll() {
      try {
        var r1 = await fetch('https://min-api.cryptocompare.com/data/v2/news/?categories=XRP,Ripple,Regulation&excludeCategories=Sponsored&lang=EN&api_key=' + key)
        var d1 = await r1.json()
        if (d1 && d1.Data) setXrpNews(d1.Data.slice(0, 12))
        var r2 = await fetch('https://min-api.cryptocompare.com/data/v2/news/?categories=ETF,Regulation,Blockchain&excludeCategories=Sponsored&lang=EN&api_key=' + key)
        var d2 = await r2.json()
        if (d2 && d2.Data) setMarketNews(d2.Data.slice(0, 8))
      } catch(e) {
        console.error('MediaNarratives fetch error:', e)
      }
      setLoading(false)
    }
    fetchAll()
    var interval = setInterval(fetchAll, 10 * 60 * 1000)
    return function() { clearInterval(interval) }
  }, [])
  function NewsItem({ article }) {
    var cat = getCategoryColor(article.categories)
    var catLabel = getCategoryLabel(article.categories)
    var sourceName = article.source_info ? article.source_info.name : article.source
    return (
      <a href={article.url} target="_blank" rel="noopener noreferrer" className="block py-3 hover:bg-white/5 -mx-5 px-5 transition-colors" style={{ borderBottom: '1px solid #1e2330', textDecoration: 'none' }}>
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: cat.bg, color: cat.text }}>{catLabel}</span>
          <ExternalLink size={10} style={{ color: '#6b7a96' }} />
        </div>
        <p className="text-sm leading-snug mb-1.5" style={{ color: '#eceef5' }}>{article.title}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: '#3b82f6' }}>{sourceName}</span>
          <span className="text-xs" style={{ color: '#6b7a96' }}>{timeAgo(article.published_on)}</span>
        </div>
      </a>
    )
  }
  function Section({ title, articles, badge }) {
    return (
      <div className="rounded-xl p-5 border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-semibold" style={{ color: '#eceef5' }}>{title}</h2>
          {badge && <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>{badge}</span>}
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(function(i) { return <div key={i} className="h-14 rounded animate-pulse" style={{ background: '#1e2330' }} /> })}
          </div>
        ) : articles.length === 0 ? (
          <p className="text-sm" style={{ color: '#6b7a96' }}>No articles available right now.</p>
        ) : (
          articles.map(function(article, i) { return <NewsItem key={i} article={article} /> })
        )}
        <p className="text-xs mt-4" style={{ color: '#6b7a96' }}>Source: CryptoCompare · Live feed · For informational purposes only.</p>
      </div>
    )
  }
  return (
    <AppLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>LIVE</span>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>Media & Narratives</h1>
        </div>
        <p className="text-sm" style={{ color: '#9aa8be' }}>Live XRP, Ripple, and crypto market news from reputable global sources. For informational purposes only.</p>
      </div>
      <div className="space-y-6">
        <Section title="XRP & Ripple News" articles={xrpNews} badge="LIVE" />
        <Section title="Market & Regulatory News" articles={marketNews} badge="LIVE" />
      </div>
    </AppLayout>
  )
}
