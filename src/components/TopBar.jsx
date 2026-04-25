import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'
import NotificationBell from './NotificationBell'
import { useAuth } from '../contexts/AuthContext'
import { usePrices } from '../contexts/PriceContext'
import { supabase } from '../lib/supabase'

const routeTitles = {
  '/': 'Dashboard', '/dashboard': 'Dashboard', '/morning-brief': 'Morning Brief',
  '/daily-wrap': 'Daily Wrap', '/market-overview': 'Market Overview',
  '/xrp-intelligence': 'XRP Intelligence', '/domino-theory': 'Domino Theory',
  '/geopolitical-watch': 'Geopolitical Watch', '/oil-vs-yen': 'Oil vs Yen',
  '/media-narratives': 'Media & Narratives', '/media-intelligence': 'Media Intelligence',
  '/etf-flows': 'XRP ETF Flow Tracker', '/watchlist': 'Watchlist', '/youtube-intel': 'YouTube Intel',
  '/smart-money-flow': 'Smart Money Flow', '/market-chatter': 'Unconfirmed Market Chatter',
  '/account': 'My Profile', '/billing': 'Billing', '/settings': 'Settings',
  '/admin': 'Admin', '/admin/morning-brief': 'Admin — Morning Brief',
  '/admin/daily-wrap': 'Admin — Daily Wrap', '/admin/domino-theory': 'Admin — Domino Theory',
  '/admin/geopolitical-watch': 'Admin — Geopolitical Watch', '/admin/oil-yen': 'Admin — Oil vs Yen',
  '/admin/headlines': 'Admin — Headlines', '/admin/watchlist': 'Admin — Watchlist',
  '/admin/chatter': 'Admin — Market Chatter', '/admin/etf-flows': 'Admin — ETF Flows',
  '/admin/youtube': 'Admin — YouTube Intel', '/admin/smart-money': 'Admin — Smart Money Flow',
}

const tickerStyle = `
  @keyframes cn-dash-ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .cn-dash-track {
    display: inline-flex; gap: 36px; animation: cn-dash-ticker 60s linear infinite;
    flex-shrink: 0; align-items: center; white-space: nowrap; will-change: transform;
  }
  .cn-dash-track:hover { animation-play-state: paused; }
  .cn-dash-wrapper { overflow: hidden; flex: 1; display: flex; }
`

const COINGECKO_MAP = {
  XRP: 'ripple',
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  ADA: 'cardano',
  XLM: 'stellar',
  HBAR: 'hedera-hashgraph',
  DOT: 'polkadot',
  MATIC: 'matic-network',
  AVAX: 'avalanche-2'
}

function fmt(val, prefix, suffix, decimals) {
  prefix = prefix || ''; suffix = suffix || ''; decimals = decimals !== undefined ? decimals : 2
  if (val === null || val === undefined) return '—'
  var n = parseFloat(val); if (isNaN(n)) return '—'
  if (Math.abs(n) >= 1000) return prefix + n.toLocaleString('en-US', { maximumFractionDigits: decimals }) + suffix
  return prefix + n.toFixed(decimals) + suffix
}

function chgLabel(val) {
  if (val === null || val === undefined) return '—'
  var n = parseFloat(val); if (isNaN(n)) return '—'
  return (n >= 0 ? '+' : '') + n.toFixed(2) + '%'
}

async function getMacro() {
  var res = await supabase.from('market_data').select('key, value')
  var result = { WTI_USD: null, BRENT_USD: null, USD_JPY: null, FEAR_GREED: null }
  if (res.data && res.data.length > 0) {
    res.data.forEach(function(row) {
      if (row.key in result) {
        result[row.key] = row.value
      }
    })
  }
  return result
}

export default function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const prices = usePrices()
  const title = routeTitles[location.pathname] || 'ControlNode'
  const [macro, setMacro] = useState({ WTI_USD: null, BRENT_USD: null, USD_JPY: null, FEAR_GREED: null })
  const [masterSymbols, setMasterSymbols] = useState([])
  const [tickers, setTickers] = useState([])

  var initials = 'CN'
  if (profile && profile.full_name) {
    initials = profile.full_name.split(' ').map(function(n) { return n[0] }).join('').toUpperCase().slice(0, 2)
  }

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
        setMasterSymbols(['XRP', 'BTC', 'ETH', 'XLM'])
      }
    }

    loadMasterSymbols()
    var interval = setInterval(loadMasterSymbols, 30 * 1000)
    return function() { clearInterval(interval) }
  }, [])

  useEffect(function() {
    getMacro().then(function(m) { setMacro(m) })
    var interval = setInterval(function() {
      getMacro().then(function(m) { setMacro(m) })
    }, 60 * 1000)
    return function() { clearInterval(interval) }
  }, [])

  useEffect(function() {
    var items = []

    masterSymbols.forEach(function(symbol) {
      var coinId = COINGECKO_MAP[symbol]
      if (coinId && prices && prices[coinId]) {
        var coin = prices[coinId]
        var decimals = symbol === 'XRP' || symbol === 'XLM' ? 4 : symbol === 'BTC' ? 0 : 2
        items.push({
          sym: symbol,
          price: fmt(coin.usd, '$', '', decimals),
          chg: chgLabel(coin.usd_24h_change),
          up: coin.usd_24h_change >= 0
        })
      } else {
        items.push({
          sym: symbol,
          price: '—',
          chg: '—',
          up: true
        })
      }
    })

    items.push(
      { sym: 'WTI CRUDE', price: macro.WTI_USD ? '$' + parseFloat(macro.WTI_USD).toFixed(2) : '—', chg: '—', up: true },
      { sym: 'BRENT CRUDE', price: macro.BRENT_USD ? '$' + parseFloat(macro.BRENT_USD).toFixed(2) : '—', chg: '—', up: true },
      { sym: 'USD/JPY', price: macro.USD_JPY ? parseFloat(macro.USD_JPY).toFixed(2) : '—', chg: '—', up: false },
      { sym: 'F&G INDEX', price: macro.FEAR_GREED ? String(macro.FEAR_GREED) : '—', chg: macro.FEAR_GREED ? (macro.FEAR_GREED >= 50 ? 'Greed' : 'Fear') : '—', up: macro.FEAR_GREED ? macro.FEAR_GREED >= 50 : true }
    )

    setTickers(items)
  }, [prices, macro, masterSymbols])

  return (
    <header className="sticky top-0 z-20" style={{ background: 'rgba(10,11,15,0.85)', borderBottom: '1px solid #1e2330', backdropFilter: 'blur(12px)' }}>
      <style>{tickerStyle}</style>
      <div className="flex items-center justify-between px-4 lg:px-6 h-14">
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-8 lg:hidden" />
          <h1 className="text-base font-semibold tracking-tight" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>{title}</h1>
        </div>
        <div className="hidden lg:flex flex-1 items-center overflow-hidden mx-8">
          <span className="flex-shrink-0 mr-4 pr-4 text-xs font-bold tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#9d5cf6', borderRight: '1px solid #1e2330' }}>LIVE</span>
          <div className="cn-dash-wrapper">
            {tickers.length === 0 ? (
              <span className="text-xs" style={{ color: '#6b7a96' }}>Loading market data...</span>
            ) : (
              <div className="cn-dash-track">
                {[...tickers, ...tickers].map(function(item, i) {
                  return (
                    <span key={i} className="inline-flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-bold" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#eceef5' }}>{item.sym}</span>
                      <span className="text-xs" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#9aa8be' }}>{item.price}</span>
                      <span className="text-xs" style={{ fontFamily: 'JetBrains Mono, monospace', color: item.up ? '#10b981' : '#ef4444' }}>{item.chg}</span>
                    </span>
                  )
                })}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* XRP Intelligence Platform - decorative badge (hidden on small screens) */}
          <div
            className="hidden md:flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-bold flex-shrink-0"
            style={{
              background: 'rgba(139,92,246,0.15)',
              border: '1px solid rgba(139,92,246,0.4)',
              color: '#8b5cf6',
            }}
          >
            <Zap size={12} />
            <span className="whitespace-nowrap">XRP Intelligence Platform</span>
          </div>
          <NotificationBell />
          <button onClick={function() { navigate('/account') }} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ml-1 transition-opacity hover:opacity-80" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff' }} title="My Profile">
            {initials}
          </button>
        </div>
      </div>
    </header>
  )
}
