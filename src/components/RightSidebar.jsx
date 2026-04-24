import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, ExternalLink, Zap } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { usePrices, COINGECKO_IDS } from '../contexts/PriceContext'

const categoryColors = {
  Regulatory: { bg: 'rgba(139,92,246,0.12)', text: '#8b5cf6' },
  Government: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
  Geopolitical: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
  ETF: { bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
  Macro: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
  XRP: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
  Ripple: { bg: 'rgba(139,92,246,0.12)', text: '#8b5cf6' },
  Business: { bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
  Technology: { bg: 'rgba(6,182,212,0.12)', text: '#06b6d4' },
  Regulation: { bg: 'rgba(139,92,246,0.12)', text: '#8b5cf6' },
  Blockchain: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
}

const signalColors = {
  green: { bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
  yellow: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
  red: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
  blue: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
}

function fmt(n) {
  if (n === null || n === undefined) return '—'
  if (n >= 1000) return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
  if (n >= 1) return '$' + n.toFixed(2)
  return '$' + n.toFixed(4)
}

function timeAgo(ts) {
  var diff = Math.floor((Date.now() - ts * 1000) / 60000)
  if (diff < 60) return diff + ' min ago'
  if (diff < 1440) return Math.floor(diff / 60) + ' hrs ago'
  return Math.floor(diff / 1440) + ' days ago'
}

function getCategoryColor(categories) {
  if (!categories) return categoryColors['XRP']
  var cats = categories.split('|')
  for (var i = 0; i < cats.length; i++) {
    var trimmed = cats[i].trim()
    if (categoryColors[trimmed]) return categoryColors[trimmed]
  }
  return categoryColors['XRP']
}

function getCategoryLabel(categories) {
  if (!categories) return 'XRP'
  return categories.split('|')[0].trim()
}

export default function RightSidebar() {
  const prices = usePrices()
  const [symbols, setSymbols] = useState([])
  const [news, setNews] = useState([])
  const [marketSignals, setMarketSignals] = useState([])

  useEffect(function() {
    async function loadMasterSymbols() {
      try {
        var result = await supabase
          .from('master_watchlist')
          .select('symbol')
          .order('symbol')
        if (result.data && result.data.length > 0) {
          setSymbols(result.data.map(function(row) { return row.symbol }))
        } else {
          // If no data, set empty array - don't show fallback symbols
          setSymbols([])
        }
      } catch(e) {
        console.error('Error loading master symbols:', e)
        // If error, set empty array - don't show fallback symbols
        setSymbols([])
      }
    }
    loadMasterSymbols()
    var interval = setInterval(loadMasterSymbols, 30 * 1000)
    return function() { clearInterval(interval) }
  }, [])

  useEffect(function() {
    async function loadMarketSignals() {
      try {
        var result = await supabase
          .from('market_signals')
          .select('signal_name, signal_value, color')
          .order('signal_name')
        if (result.data) {
          setMarketSignals(result.data)
        }
      } catch(e) {
        console.error('Market signals fetch error:', e)
      }
    }
    loadMarketSignals()
    var interval = setInterval(loadMarketSignals, 30 * 1000)
    return function() { clearInterval(interval) }
  }, [])

  useEffect(function() {
    async function fetchNews() {
      try {
        var allNews = []

        // Fetch manual posts from market_news table
        try {
          var manualRes = await supabase
            .from('market_news')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10)
          
          if (manualRes.data) {
            var manualPosts = manualRes.data.map(function(post) {
              return {
                id: 'manual_' + post.id,
                title: post.content,
                url: post.source_url || '#',
                source: post.source || 'Admin Post',
                source_info: { name: post.source || 'Admin Post' },
                categories: post.type === 'confirmed' ? 'Confirmed|News' : 'Chatter|Unconfirmed',
                published_on: Math.floor(new Date(post.created_at).getTime() / 1000),
                isManual: true,
                postType: post.type
              }
            })
            allNews = allNews.concat(manualPosts)
          }
        } catch(e) {
          console.error('Manual news fetch error:', e)
        }

        // Fetch automated crypto news
        try {
          var key = import.meta.env.VITE_CRYPTOCOMPARE_API_KEY
          var res = await fetch(
            'https://min-api.cryptocompare.com/data/v2/news/?categories=XRP,Ripple,Regulation&excludeCategories=Sponsored&lang=EN&api_key=' + key
          )
          var data = await res.json()
          if (data && data.Data) {
            var autoNews = data.Data.slice(0, 8).map(function(item) {
              return Object.assign({}, item, { isManual: false })
            })
            allNews = allNews.concat(autoNews)
          }
        } catch(e) {
          console.error('Auto news fetch error:', e)
        }

        // Sort all news by timestamp (newest first) and take top 8
        allNews.sort(function(a, b) { return b.published_on - a.published_on })
        setNews(allNews.slice(0, 8))

      } catch(e) {
        console.error('News fetch error:', e)
      }
    }
    fetchNews()
    var interval = setInterval(fetchNews, 3 * 60 * 1000) // Refresh every 3 minutes
    return function() { clearInterval(interval) }
  }, [])

  return (
    <aside
      className="hidden lg:flex fixed right-0 top-0 h-screen w-64 flex-col z-30"
      style={{ background: '#0d0f14', borderLeft: '1px solid #1e2330' }}
    >
      {/* Top spacer to align with TopBar */}
      <div style={{ height: '56px', flexShrink: 0, borderBottom: '1px solid #1e2330' }} />

      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-5">

        {/* XRP Intelligence Platform Badge */}
        <div
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-bold"
          style={{
            background: 'rgba(139,92,246,0.15)',
            border: '1px solid rgba(139,92,246,0.4)',
            color: '#8b5cf6',
          }}
        >
          <Zap size={14} />
          XRP Intelligence Platform
        </div>

        {/* Watchlist */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6b7a96' }}>
            Watchlist
          </p>
          <div className="space-y-1.5">
            {symbols.length === 0 ? (
              <div className="text-xs text-center py-4" style={{ color: '#6b7a96' }}>
                No symbols in watchlist yet.
              </div>
            ) : (
              symbols.map(function(symbol) {
                var cgId = COINGECKO_IDS[symbol]
                var p = cgId ? prices[cgId] : null
                var price = p ? p.usd : null
                var change = p ? p.usd_24h_change : null
                var up = (change || 0) >= 0
                return (
                  <div
                    key={symbol}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-white/5"
                    style={{ background: '#161a22', border: '1px solid #1e2330' }}
                  >
                    <div className="flex items-center gap-2">
                      {up
                        ? <TrendingUp size={13} style={{ color: '#10b981' }} />
                        : <TrendingDown size={13} style={{ color: '#ef4444' }} />
                      }
                      <span className="text-sm font-semibold" style={{ color: '#eceef5' }}>{symbol}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium" style={{ color: '#eceef5' }}>{fmt(price)}</p>
                      <p className="text-xs" style={{ color: up ? '#10b981' : '#ef4444' }}>
                        {change !== null ? (up ? '+' : '') + change.toFixed(2) + '%' : '—'}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Market Signals */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6b7a96' }}>
            Market Signals
          </p>
          <div className="space-y-2">
            {marketSignals.length === 0 ? (
              <div className="space-y-2">
                {[1, 2, 3].map(function(i) {
                  return (
                    <div key={i} className="px-3 py-2 rounded-lg" style={{ background: '#161a22', border: '1px solid #1e2330' }}>
                      <div className="h-2 rounded animate-pulse" style={{ background: '#1e2330', width: '60%' }} />
                    </div>
                  )
                })}
              </div>
            ) : (
              marketSignals.map(function(s) {
                var color = signalColors[s.color] || signalColors['blue']
                return (
                  <div
                    key={s.signal_name}
                    className="flex items-center justify-between px-3 py-2 rounded-lg"
                    style={{ background: '#161a22', border: '1px solid #1e2330' }}
                  >
                    <span className="text-xs" style={{ color: '#9aa8be' }}>{s.signal_name}</span>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded"
                      style={{ background: color.bg, color: color.text }}
                    >
                      {s.signal_value}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* News Feed */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6b7a96' }}>
            News Feed
          </p>
          <div className="space-y-2">
            {news.length === 0 ? (
              <div className="space-y-2">
                {[1, 2, 3].map(function(i) {
                  return (
                    <div key={i} className="px-3 py-3 rounded-lg" style={{ background: '#161a22', border: '1px solid #1e2330' }}>
                      <div className="h-3 rounded animate-pulse mb-2" style={{ background: '#1e2330', width: '60%' }} />
                      <div className="h-3 rounded animate-pulse mb-1" style={{ background: '#1e2330' }} />
                      <div className="h-3 rounded animate-pulse" style={{ background: '#1e2330', width: '80%' }} />
                    </div>
                  )
                })}
              </div>
            ) : (
              news.map(function(item) {
                var cat, catLabel, sourceName
                
                if (item.isManual) {
                  // Manual posts from admin
                  if (item.postType === 'confirmed') {
                    cat = { bg: 'rgba(16,185,129,0.12)', text: '#10b981' }
                    catLabel = 'CONFIRMED'
                  } else {
                    cat = { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' }
                    catLabel = 'CHATTER'
                  }
                  sourceName = item.source
                } else {
                  // Automated posts
                  cat = getCategoryColor(item.categories)
                  catLabel = getCategoryLabel(item.categories)
                  sourceName = item.source_info ? item.source_info.name : item.source
                }
                
                return (
                  <a 
                    key={String(item.id)} 
                    href={item.url !== '#' ? item.url : undefined} 
                    target={item.url !== '#' ? "_blank" : undefined} 
                    rel={item.url !== '#' ? "noopener noreferrer" : undefined} 
                    className={item.url !== '#' ? "block px-3 py-3 rounded-lg transition-colors hover:bg-white/5" : "block px-3 py-3 rounded-lg"} 
                    style={{ 
                      background: '#161a22', 
                      border: '1px solid #1e2330', 
                      textDecoration: 'none',
                      cursor: item.url !== '#' ? 'pointer' : 'default'
                    }}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: cat.bg, color: cat.text }}>
                        {catLabel}
                      </span>
                      {item.url !== '#' && <ExternalLink size={10} style={{ color: '#6b7a96', flexShrink: 0 }} />}
                    </div>
                    <p className="text-xs leading-snug mb-1" style={{ color: '#eceef5' }}>{item.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium" style={{ color: '#3b82f6' }}>{sourceName}</span>
                      <span className="text-xs" style={{ color: '#6b7a96' }}>{timeAgo(item.published_on)}</span>
                    </div>
                  </a>
                )
              })
            )}
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
