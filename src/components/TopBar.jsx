import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import NotificationBell from './NotificationBell'
import { useAuth } from '../contexts/AuthContext'
import { usePrices } from '../contexts/PriceContext'

const routeTitles = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/morning-brief': 'Morning Brief',
  '/daily-wrap': 'Daily Wrap',
  '/market-overview': 'Market Overview',
  '/xrp-intelligence': 'XRP Intelligence',
  '/domino-theory': 'Domino Theory',
  '/geopolitical-watch': 'Geopolitical Watch',
  '/oil-vs-yen': 'Oil vs Yen',
  '/media-narratives': 'Media & Narratives',
  '/etf-flows': 'XRP ETF Flow Tracker',
  '/watchlist': 'Watchlist',
  '/youtube-intel': 'YouTube Intel',
  '/smart-money-flow': 'Smart Money Flow',
  '/market-chatter': 'Unconfirmed Market Chatter',
  '/account': 'My Profile',
  '/billing': 'Billing',
  '/settings': 'Settings',
  '/admin': 'Admin',
  '/admin/morning-brief': 'Admin — Morning Brief',
  '/admin/daily-wrap': 'Admin — Daily Wrap',
  '/admin/domino-theory': 'Admin — Domino Theory',
  '/admin/geopolitical-watch': 'Admin — Geopolitical Watch',
  '/admin/oil-yen': 'Admin — Oil vs Yen',
  '/admin/headlines': 'Admin — Headlines',
  '/admin/watchlist': 'Admin — Watchlist',
  '/admin/chatter': 'Admin — Market Chatter',
  '/admin/etf-flows': 'Admin — ETF Flows',
  '/admin/youtube': 'Admin — YouTube Intel',
  '/admin/smart-money': 'Admin — Smart Money Flow',
}

const tickerStyle = `
  @keyframes cn-dash-ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .cn-dash-track {
    display: inline-flex;
    gap: 36px;
    animation: cn-dash-ticker 60s linear infinite;
    flex-shrink: 0;
    align-items: center;
    white-space: nowrap;
    will-change: transform;
  }
  .cn-dash-track:hover {
    animation-play-state: paused;
  }
  .cn-dash-wrapper {
    overflow: hidden;
    flex: 1;
    display: flex;
  }
`

function fmt(val, prefix, suffix, decimals) {
  prefix = prefix || ''
  suffix = suffix || ''
  decimals = decimals !== undefined ? decimals : 2
  if (val === null || val === undefined) return '—'
  var n = parseFloat(val)
  if (isNaN(n)) return '—'
  if (Math.abs(n) >= 1000) return prefix + n.toLocaleString('en-US', { maximumFractionDigits: decimals }) + suffix
  return prefix + n.toFixed(decimals) + suffix
}

function chgLabel(val) {
  if (val === null || val === undefined) return '—'
  var n = parseFloat(val)
  if (isNaN(n)) return '—'
  return (n >= 0 ? '+' : '') + n.toFixed(2) + '%'
}

export default function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const prices = usePrices()
  const title = routeTitles[location.pathname] || 'ControlNode'
  const [macro, setMacro] = useState({})
  const [fng, setFng] = useState(null)
  const [tickers, setTickers] = useState([])

  var initials = 'CN'
  if (profile && profile.full_name) {
    initials = profile.full_name.split(' ').map(function(n) { return n[0] }).join('').toUpperCase().slice(0, 2)
  }

  useEffect(function() {
    async function fetchMacro() {
      try {
        var tdKey = import.meta.env.VITE_TWELVE_DATA_API_KEY
        var tdSymbols = 'USD/JPY,XAU/USD,WTI,BZ,US10Y,JP10Y'
        var tdRes = await fetch('https://api.twelvedata.com/price?symbol=' + tdSymbols + '&apikey=' + tdKey)
        var td = await tdRes.json()
        setMacro(td || {})
      } catch(e) {
        console.error('TopBar macro fetch error', e)
      }
      try {
        var fgRes = await fetch('https://api.alternative.me/fng/?limit=1')
        var fg = await fgRes.json()
        if (fg && fg.data && fg.data[0]) setFng(fg.data[0])
      } catch(e) {}
    }
    fetchMacro()
    var interval = setInterval(fetchMacro, 5 * 60 * 1000)
    return function() { clearInterval(interval) }
  }, [])

  useEffect(function() {
    function tdp(sym) {
      return macro && macro[sym] && macro[sym].price ? macro[sym].price : null
    }

    var xrp = prices && prices.ripple
    var btc = prices && prices.bitcoin
    var eth = prices && prices.ethereum
    var xlm = prices && prices.stellar

    var wti = parseFloat(tdp('WTI') || 0)
    var brent = parseFloat(tdp('BZ') || 0)
    var usdjpy = parseFloat(tdp('USD/JPY') || 0)
    var oilPrice = brent > 0 ? brent : wti
    var oilJpy = (oilPrice > 0 && usdjpy > 0) ? (oilPrice * usdjpy) : null

    var items = [
      { sym: 'XRP', price: xrp ? fmt(xrp.usd, '$', '', 4) : '—', chg: xrp ? chgLabel(xrp.usd_24h_change) : '—', up: xrp ? xrp.usd_24h_change >= 0 : true },
      { sym: 'BTC', price: btc ? fmt(btc.usd, '$', '', 0) : '—', chg: btc ? chgLabel(btc.usd_24h_change) : '—', up: btc ? btc.usd_24h_change >= 0 : true },
      { sym: 'ETH', price: eth ? fmt(eth.usd, '$', '', 0) : '—', chg: eth ? chgLabel(eth.usd_24h_change) : '—', up: eth ? eth.usd_24h_change >= 0 : true },
      { sym: 'XLM', price: xlm ? fmt(xlm.usd, '$', '', 4) : '—', chg: xlm ? chgLabel(xlm.usd_24h_change) : '—', up: xlm ? xlm.usd_24h_change >= 0 : true },
      { sym: 'GOLD', price: fmt(tdp('XAU/USD'), '$', '', 0), chg: '—', up: true },
      { sym: 'BRENT CRUDE', price: fmt(tdp('BZ'), '$', '', 2), chg: '—', up: true },
      { sym: 'WTI CRUDE', price: fmt(tdp('WTI'), '$', '', 2), chg: '—', up: true },
      { sym: 'OIL/JPY', price: oilJpy ? '¥' + oilJpy.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '—', chg: '—', up: true },
      { sym: 'USD/JPY', price: fmt(tdp('USD/JPY'), '', '', 2), chg: '—', up: false },
      { sym: 'US 10Y', price: fmt(tdp('US10Y'), '', '%', 2), chg: '—', up: false },
      { sym: 'JAPAN 10Y', price: fmt(tdp('JP10Y'), '', '%', 2), chg: '—', up: true },
      { sym: 'F&G INDEX', price: fng ? fng.value : '—', chg: fng ? fng.value_classification : '—', up: fng ? parseInt(fng.value) >= 50 : true },
    ]

    setTickers(items)
  }, [prices, macro, fng])

  return (
    <header
      className="sticky top-0 z-20"
      style={{ background: 'rgba(10,11,15,0.85)', borderBottom: '1px solid #1e2330', backdropFilter: 'blur(12px)' }}
    >
      <style>{tickerStyle}</style>
      <div className="flex items-center justify-between px-4 lg:px-6 h-14">
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-8 lg:hidden" />
          <h1 className="text-base font-semibold tracking-tight" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>
            {title}
          </h1>
        </div>
        <div className="hidden lg:flex flex-1 items-center overflow-hidden mx-8">
          <span className="flex-shrink-0 mr-4 pr-4 text-xs font-bold tracking-widest" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#9d5cf6', borderRight: '1px solid #1e2330' }}>
            LIVE
          </span>
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
          <button
            onClick={function() { navigate('/account') }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ml-1 transition-opacity hover:opacity-80"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff' }}
            title="My Profile"
          >
            {initials}
          </button>
        </div>
      </div>
    </header>
  )
}
