import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, ExternalLink, Plus, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
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
  const { user } = useAuth()
  const prices = usePrices()
  const [masterSymbols, setMasterSymbols] = useState([])
  const [userSymbols, setUserSymbols] = useState([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [news, setNews] = useState([])
  const [marketSignals, setMarketSignals] = useState([])

  // Load master watchlist symbols (admin-approved)
  useEffect(function() {
    async function loadMasterSymbols() {
      try {
        var result = await supabase
          .from('master_watchlist')
          .select('symbol')
          .order('symbol')
        
        if (result.data) {
          setMasterSymbols(result.data.map(function(row) { return row.symbol }))
        }
      } catch(e) {
        console.error('Error loading master symbols:', e)
      }
    }

    loadMasterSymbols()

    // Refresh master symbols every 30 seconds (when admin updates)
    var interval = setInterval(loadMasterSymbols, 30 * 1000)
    return function() { clearInterval(interval) }
  }, [])

  // Load user's personal watchlist
  useEffect(function() {
    if (!user) return
    async function loadUserWatchlist() {
      try {
        var result = await supabase
          .from('user_watchlist')
          .select('symbol')
          .eq('user_id', user.id)
          .order('added_at', { ascending: true })
        
        if (result.data && result.data.length > 0) {
          setUserSymbols(result.data.map(function(d) { return d.symbol }))
        } else {
          // Default to first 4 master symbols if user has no watchlist yet
          var defaultSymbols = masterSymbols.slice(0, 4)
          if (defaultSymbols.length > 0) {
            setUserSymbols(defaultSymbols)
            // Save default selection
            var inserts = defaultSymbols.map(function(symbol) {
              return { user_id: user.id, symbol: symbol }
            })
            await supabase.from('user_watchlist').insert(inserts)
          }
        }
      } catch(e) {
        console.error('Error loading user watchlist:', e)
      }
    }
    
    if (masterSymbols.length > 0) {
      loadUserWatchlist()
    }
  }, [user, masterSymbols])

  async function addSymbolToWatchlist(symbol) {
    if (!user) return
    try {
      await supabase.from('user_watchlist').insert({
        user_id: user.id,
        symbol: symbol
      })
      setUserSymbols(function(prev) { return [...prev, symbol] })
      setShowAddDialog(false)
    } catch(e) {
      console.error('Error adding symbol:', e)
    }
  }

  async function removeSymbolFromWatchlist(symbol) {
    if (!user) return
    try {
      await supabase
        .from('user_watchlist')
        .delete()
        .eq('user_id', user.id)
        .eq('symbol', symbol)
      setUserSymbols(function(prev) { return prev.filter(function(s) { return s !== symbol }) })
    } catch(e) {
      console.error('Error removing symbol:', e)
    }
  }

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
    // Refresh signals every 30 seconds
    var interval = setInterval(loadMarketSignals, 30 * 1000)
    return function() { clearInterval(interval) }
  }, [])

  useEffect(function() {
    async function fetchNews() {
      try {
        var key = import.meta.env.VITE_CRYPTOCOMPARE_API_KEY
        var res = await fetch(
          'https://min-api.cryptocompare.com/data/v2/news/?categories=XRP,Ripple,Regulation&excludeCategories=Sponsored&lang=EN&api_key=' + key
        )
        var data = await res.json()
        if (data && data.Data) {
          setNews(data.Data.slice(0, 6))
        }
      } catch(e) {
        console.error('News fetch error:', e)
      }
    }
    fetchNews()
    var interval = setInterval(fetchNews, 5 * 60 * 1000)
    return function() { clearInterval(interval) }
  }, [])

  var availableSymbols = masterSymbols.filter(function(symbol) {
    return !userSymbols.includes(symbol)
  })

  return (
    <aside
      className="hidden lg:flex fixed right-0 top-0 h-screen w-64 flex-col z-30"
      style={{ background: '#0d0f14', borderLeft: '1px solid #1e2330' }}
    >
      <div style={{ height: '56px', flexShrink: 0, borderBottom: '1px solid #1e2330' }} />

      <div className="flex-1 overflow-y-auto py-4 px-4 space-y-5">

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6b7a96' }}>
              My Watchlist
            </p>
            {availableSymbols.length > 0 && (
              <button 
                onClick={function() { setShowAddDialog(!showAddDialog) }}
                className="p-1 rounded hover:opacity-80" 
                style={{ color: '#3b82f6' }}
                title="Add symbol"
              >
                <Plus size={12} />
              </button>
            )}
          </div>

          {showAddDialog && (
            <div className="mb-3 p-3 rounded-lg" style={{ background: '#161a22', border: '1px solid #1e2330' }}>
              <p className="text-xs mb-2" style={{ color: '#9aa8be' }}>Add to your watchlist:</p>
              <div className="space-y-1">
                {availableSymbols.map(function(symbol) {
                  return (
                    <button
                      key={symbol}
                      onClick={function() { addSymbolToWatchlist(symbol) }}
                      className="w-full text-left px-2 py-1.5 rounded text-xs hover:opacity-80"
                      style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}
                    >
                      + {symbol}
                    </button>
                  )
                })}
              </div>
              <button 
                onClick={function() { setShowAddDialog(false) }}
                className="text-xs mt-2 hover:opacity-80"
                style={{ color: '#6b7a96' }}
              >
                Cancel
              </button>
            </div>
          )}

          <div className="space-y-1.5">
            {userSymbols.length === 0 ? (
              <div className="text-xs text-center py-4" style={{ color: '#6b7a96' }}>
                No symbols in your watchlist yet.
                {availableSymbols.length > 0 && <div>Click + to add some!</div>}
              </div>
            ) : (
              userSymbols.map(function(symbol) {
                var cgId = COINGECKO_IDS[symbol]
                var p = cgId ? prices[cgId] : null
                var price = p ? p.usd : null
                var change = p ? p.usd_24h_change : null
                var up = (change || 0) >= 0
                return (
                  <div
                    key={symbol}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors hover:bg-white/5 group"
                    style={{ background: '#161a22', border: '1px solid #1e2330' }}
                  >
                    <div className="flex items-center gap-2">
                      {up
                        ? <TrendingUp size={13} style={{ color: '#10b981' }} />
                        : <TrendingDown size={13} style={{ color: '#ef4444' }} />
                      }
                      <span className="text-sm font-semibold" style={{ color: '#eceef5' }}>{symbol}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-xs font-medium" style={{ color: '#eceef5' }}>{fmt(price)}</p>
                        <p className="text-xs" style={{ color: up ? '#10b981' : '#ef4444' }}>
                          {change !== null ? (up ? '+' : '') + change.toFixed(2) + '%' : '—'}
                        </p>
                      </div>
                      {userSymbols.length > 1 && (
                        <button
                          onClick={function() { removeSymbolFromWatchlist(symbol) }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20"
                          style={{ color: '#ef4444' }}
                          title="Remove from watchlist"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

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
                var cat = getCategoryColor(item.categories)
                var catLabel = getCategoryLabel(item.categories)
                var sourceName = item.source_info ? item.source_info.name : item.source
                return (
                  <a key={String(item.id)} href={item.url} target="_blank" rel="noopener noreferrer" className="block px-3 py-3 rounded-lg transition-colors hover:bg-white/5" style={{ background: '#161a22', border: '1px solid #1e2330', textDecoration: 'none' }}>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: cat.bg, color: cat.text }}>
                        {catLabel}
                      </span>
                      <ExternalLink size={10} style={{ color: '#6b7a96', flexShrink: 0 }} />
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
