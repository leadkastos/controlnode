import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import NotificationBell from './NotificationBell'

const routeTitles = {
  '/': 'Dashboard',
  '/morning-brief': 'Morning Brief',
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
  '/admin/chatter': 'Admin — Market Chatter',
  '/account': 'My Profile',
  '/billing': 'Billing',
  '/settings': 'Settings',
  '/admin': 'Admin',
  '/admin/morning-brief': 'Admin — Morning Brief',
  '/admin/updates': 'Admin — Updates',
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

function fmt(val, prefix = '', suffix = '', decimals = 2) {
  if (val === null || val === undefined) return '—'
  const n = parseFloat(val)
  if (isNaN(n)) return '—'
  if (Math.abs(n) >= 1000) return prefix + n.toLocaleString('en-US', { maximumFractionDigits: decimals }) + suffix
  return prefix + n.toFixed(decimals) + suffix
}

function chgLabel(val) {
  if (val === null || val === undefined) return '—'
  const n = parseFloat(val)
  if (isNaN(n)) return '—'
  return (n >= 0 ? '+' : '') + n.toFixed(2) + '%'
}

export default function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const title = routeTitles[location.pathname] || 'ControlNode'
  const [tickers, setTickers] = useState([])

  useEffect(function () {
    async function fetchAll() {
      try {
        const tdKey = import.meta.env.VITE_TWELVE_DATA_API_KEY
        console.log('TD Key loaded:', tdKey ? 'YES (' + tdKey.slice(0,6) + '...)' : 'NO - UNDEFINED')

        // CoinGecko — crypto (no key)
        const cgRes = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=ripple,bitcoin,ethereum,stellar&vs_currencies=usd&include_24hr_change=true'
        )
        const cg = await cgRes.json()

        // Twelve Data — all symbols in one batch call
        const tdSymbols = [
          'EUR/USD',
          'USD/JPY',
          'XAU/USD',
          'USOIL',
          'BRENT',
          'DXY',
          'SPX',
          'US10Y',
          'JP10Y',
          'XRPC',
          'XRPZ',
          'TOXR',
        ].join(',')

        const tdRes = await fetch(
          `https://api.twelvedata.com/price?symbol=${tdSymbols}&apikey=${tdKey}`
        )
        const td = await tdRes.json()
        console.log('Twelve Data response:', JSON.stringify(td))

        // Fear & Greed
        const fgRes = await fetch('https://api.alternative.me/fng/?limit=1')
        const fg = await fgRes.json()
        const fgVal = fg?.data?.[0]?.value
        const fgClass = fg?.data?.[0]?.value_classification

        function tdp(sym) {
          const val = td?.[sym]?.price
          return val ?? null
        }

        const oilUsd = parseFloat(tdp('USOIL') ?? tdp('BRENT') ?? 0)
        const usdjpy = parseFloat(tdp('USD/JPY') ?? 0)
        const oilJpy = (oilUsd > 0 && usdjpy > 0) ? (oilUsd * usdjpy) : null

        const items = [
          { sym: 'XRP', price: fmt(cg?.ripple?.usd, '$', '', 4), chg: chgLabel(cg?.ripple?.usd_24h_change), up: (cg?.ripple?.usd_24h_change ?? 0) >= 0 },
          { sym: 'BTC', price: fmt(cg?.bitcoin?.usd, '$', '', 0), chg: chgLabel(cg?.bitcoin?.usd_24h_change), up: (cg?.bitcoin?.usd_24h_change ?? 0) >= 0 },
          { sym: 'ETH', price: fmt(cg?.ethereum?.usd, '$', '', 0), chg: chgLabel(cg?.ethereum?.usd_24h_change), up: (cg?.ethereum?.usd_24h_change ?? 0) >= 0 },
          { sym: 'XLM', price: fmt(cg?.stellar?.usd, '$', '', 4), chg: chgLabel(cg?.stellar?.usd_24h_change), up: (cg?.stellar?.usd_24h_change ?? 0) >= 0 },
          { sym: 'GOLD', price: fmt(tdp('XAU/USD'), '$', '', 0), chg: '—', up: true },
          { sym: 'BRENT CRUDE', price: fmt(tdp('BRENT'), '$', '', 2), chg: '—', up: true },
          { sym: 'WTI CRUDE', price: fmt(tdp('USOIL'), '$', '', 2), chg: '—', up: true },
          { sym: 'OIL/JPY', price: oilJpy ? '¥' + oilJpy.toLocaleString('en-US', { maximumFractionDigits: 0 }) : '—', chg: '—', up: true },
          { sym: 'DXY', price: fmt(tdp('DXY'), '', '', 2), chg: '—', up: false },
          { sym: 'EUR/USD', price: fmt(tdp('EUR/USD'), '', '', 3), chg: '—', up: true },
          { sym: 'USD/JPY', price: fmt(tdp('USD/JPY'), '', '', 2), chg: '—', up: false },
          { sym: 'S&P 500', price: fmt(tdp('SPX'), '', '', 0), chg: '—', up: false },
          { sym: 'US 10Y', price: fmt(tdp('US10Y'), '', '%', 2), chg: '—', up: false },
          { sym: 'JAPAN 10Y', price: fmt(tdp('JP10Y'), '', '%', 2), chg: '—', up: true },
          { sym: 'XRPC ETF', price: fmt(tdp('XRPC'), '$', '', 2), chg: '—', up: true },
          { sym: 'XRPZ ETF', price: fmt(tdp('XRPZ'), '$', '', 2), chg: '—', up: true },
          { sym: 'TOXR ETF', price: fmt(tdp('TOXR'), '$', '', 2), chg: '—', up: true },
          { sym: 'F&G INDEX', price: fgVal ?? '—', chg: fgClass ?? '—', up: parseInt(fgVal) >= 50 },
        ]

        setTickers(items)
      } catch (e) {
        console.error('TopBar fetch error', e)
      }
    }

    fetchAll()
    const interval = setInterval(fetchAll, 5 * 60 * 1000)
    return function () { clearInterval(interval) }
  }, [])

  return (
    <header
      className="sticky top-0 z-20"
      style={{ background: 'rgba(10,11,15,0.85)', borderBottom: '1px solid #1e2330', backdropFilter: 'blur(12px)' }}
    >
      <style>{tickerStyle}</style>

      <div className="flex items-center justify-between px-4 lg:px-6 h-14">
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-8 lg:hidden" />
          <h1
            className="text-base font-semibold tracking-tight"
            style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}
          >
            {title}
          </h1>
        </div>

        <div className="hidden lg:flex flex-1 items-center overflow-hidden mx-8">
          <span
            className="flex-shrink-0 mr-4 pr-4 text-xs font-bold tracking-widest"
            style={{ fontFamily: 'JetBrains Mono, monospace', color: '#9d5cf6', borderRight: '1px solid #1e2330' }}
          >
            LIVE
          </span>
          <div className="cn-dash-wrapper">
            {tickers.length === 0 ? (
              <span className="text-xs" style={{ color: '#6b7a96' }}>Loading market data...</span>
            ) : (
              <div className="cn-dash-track">
                {[...tickers, ...tickers].map((item, i) => (
                  <span key={i} className="inline-flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-bold" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#eceef5' }}>
                      {item.sym}
                    </span>
                    <span className="text-xs" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#9aa8be' }}>
                      {item.price}
                    </span>
                    <span className="text-xs" style={{ fontFamily: 'JetBrains Mono, monospace', color: item.up ? '#10b981' : '#ef4444' }}>
                      {item.chg}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <NotificationBell />
          <button
            onClick={() => navigate('/account')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ml-1 transition-opacity hover:opacity-80"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff' }}
            title="My Profile"
          >
            JD
          </button>
        </div>
      </div>
    </header>
  )
}
