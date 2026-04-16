import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import NotificationBell from './NotificationBell'
import { useAuth } from '../contexts/AuthContext'
import { usePrices } from '../contexts/PriceContext'
import { supabase } from '../lib/supabase'

const routeTitles = {
  '/': 'Dashboard', '/dashboard': 'Dashboard', '/morning-brief': 'Morning Brief',
  '/daily-wrap': 'Daily Wrap', '/market-overview': 'Market Overview',
  '/xrp-intelligence': 'XRP Intelligence', '/domino-theory': 'Domino Theory',
  '/geopolitical-watch': 'Geopolitical Watch', '/oil-vs-yen': 'Oil vs Yen',
  '/media-narratives': 'Media & Narratives', '/etf-flows': 'XRP ETF Flow Tracker',
  '/watchlist': 'Watchlist', '/youtube-intel': 'YouTube Intel',
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

var macroCache = null
var macroCacheTime = 0

async function fetchAndCacheMacro() {
  var oilKey = import.meta.env.VITE_OIL_PRICE_API_KEY
  var result = { WTI_USD: null, BRENT_USD: null, USD_JPY: null, FEAR_GREED: null, FEAR_GREED_LABEL: null }

  try {
    var fxRes = await fetch('https://open.er-api.com/v6/latest/USD')
    var fx = await fxRes.json()
    if (fx && fx.rates && fx.rates.JPY) result.USD_JPY = fx.rates.JPY
  } catch(e) {}

  try {
    var wtiRes = await fetch('https://api.oilpriceapi.com/v1/prices/latest?by_code=WTI_USD', {
      headers: { 'Authorization': 'Token ' + oilKey, 'Content-Type': 'application/json' }
    })
    var wtiData = await wtiRes.json()
    if (wtiData && wtiData.data && wtiData.data.price) result.WTI_USD = wtiData.data.price
  } catch(e) {}

  try {
    var brentRes = await fetch('https://api.oilpriceapi.com/v1/prices/latest?by_code=BRENT_CRUDE_USD', {
      headers: { 'Authorization': 'Token ' + oilKey, 'Content-Type': 'application/json' }
    })
    var brentData = await brentRes.json()
    if (brentData && brentData.data && brentData.data.price) result.BRENT_USD = brentData.data.price
  } catch(e) {}

  try {
    var fgRes = await fetch('https://api.alternative.me/fng/?limit=1')
    var fg = await fgRes.json()
    if (fg && fg.data && fg.data[0]) {
      result.FEAR_GREED = parseInt(fg.data[0].value)
      result.FEAR_GREED_LABEL = fg.data[0].value_classification
    }
  } catch(e) {}

  var updates = []
  if (result.USD_JPY) updates.push({ key: 'USD_JPY', value: result.USD_JPY, updated_at: new Date().toISOString() })
  if (result.WTI_USD) updates.push({ key: 'WTI_USD', value: result.WTI_USD, updated_at: new Date().toISOString() })
  if (result.BRENT_USD) updates.push({ key: 'BRENT_USD', value: result.BRENT_USD, updated_at: new Date().toISOString() })
  if (result.FEAR_GREED) updates.push({ key: 'FEAR_GREED', value: result.FEAR_GREED, updated_at: new Date().toISOString() })
  if (updates.length > 0) {
    await supabase.from('market_data').upsert(updates, { onConflict: 'key' })
  }

  macroCache = result
  macroCacheTime = Date.now()
  return result
}

async function getMacro() {
  if (macroCache && (Date.now() - macroCacheTime) < 5 * 60 * 1000) return macroCache
  var res = await supabase.from('market_data').select('*')
  if (res.data && res.data.length > 0) {
    var cached = {}
    var oldestUpdate = null
    res.data.forEach(function(row) {
      cached[row.key] = row.value
      var t = new Date(row.updated_at).getTime()
      if (!oldestUpdate || t < oldestUpdate) oldestUpdate = t
    })
    var age = Date.now() - oldestUpdate
    if (age < 5 * 60 * 1000) {
      macroCache = {
        WTI_USD: cached.WTI_USD || null,
        BRENT_USD: cached.BRENT_USD || null,
        USD_JPY: cached.USD_JPY || null,
        FEAR_GREED: cached.FEAR_GREED || null,
      }
      macroCacheTime = Date.now()
      return macroCache
    }
  }
  return fetchAndCacheMacro()
}

export default function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const prices = usePrices()
  const title = routeTitles[location.pathname] || 'ControlNode'
  const [macro, setMacro] = useState({ WTI_USD: null, BRENT_USD: null, USD_JPY: null, FEAR_GREED: null })
  const [tickers, setTickers] = useState([])

  var initials = 'CN'
  if (profile && profile.full_name) {
    initials = profile.full_name.split(' ').map(function(n) { return n[0] }).join('').toUpperCase().slice(0, 2)
  }

  useEffect(function() {
    getMacro().then(function(m) { setMacro(m) })
    var interval = setInterval(function() {
      fetchAndCacheMacro().then(function(m) { setMacro(m) })
    }, 5 * 60 * 1000)
    return function() { clearInterval(interval) }
  }, [])

  useEffect(function() {
    var xrp = prices && prices.ripple
    var btc = prices && prices.bitcoin
    var eth = prices && prices.ethereum
    var xlm = prices && prices.stellar
    var oilPrice = macro.BRENT_USD || macro.WTI_USD
    var oilJpy = (oilPrice && macro.USD_JPY) ? (oilPrice * macro.USD_JPY) : null

    var items = [
      { sym: 'XRP', price: xrp ? fmt(xrp.usd, '$', '', 4) : '—', chg: xrp ? chgLabel(xrp.usd_24h_change) : '—', up: xrp ? xrp.usd_24h_change >= 0 : true },
      { sym: 'BTC', price: btc ? fmt(btc.usd, '$', '', 0) : '—', chg: btc ? chgLabel(btc.usd_24h_change) : '—', up: btc ? btc.usd_24h_change >= 0 : true },
      { sym: 'ETH', price: eth ? fmt(eth.usd, '$', '', 0) : '—', chg: eth ? chgLabel(eth.usd_24h_change) : '—', up: eth ? eth.usd_24h_change >= 0 : true },
      { sym: 'XLM', price: xlm ? fmt(xlm.usd, '$', '', 4) : '—', chg: xlm ? chgLabel(xlm.usd_24h_change) : '—', up: xlm ? xlm.usd_24h_change >= 0 : true },
      { sym: 'WTI CRUDE', price: macro.WTI_USD ? '$' + parseFloat(macro.WTI_USD).toFixed(2) : '—', chg: '—', up: true },
      { sym: 'BRENT CRUDE', price: macro.BRENT_USD ? '$' + parseFloat(macro.BRENT_USD).toFixed(2) : '—', chg: '—', up: true },
      { sym: 'OIL/JPY', price: oilJpy ? '¥' + oilJpy.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '—', chg: '—', up: true },
      { sym: 'USD/JPY', price: macro.USD_JPY ? parseFloat(macro.USD_JPY).toFixed(2) : '—', chg: '—', up: false },
      { sym: 'F&G INDEX', price: macro.FEAR_GREED ? String(macro.FEAR_GREED) : '—', chg: macro.FEAR_GREED ? (macro.FEAR_GREED >= 50 ? 'Greed' : 'Fear') : '—', up: macro.FEAR_GREED ? macro.FEAR_GREED >= 50 : true },
    ]
    setTickers(items)
  }, [prices, macro])

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
          <NotificationBell />
          <button onClick={function() { navigate('/account') }} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ml-1 transition-opacity hover:opacity-80" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff' }} title="My Profile">
            {initials}
          </button>
        </div>
      </div>
    </header>
  )
}
