import React from 'react'
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
  '/market-chatter': 'Unconfirmed Market Chatter',
  '/admin/chatter': 'Admin — Market Chatter',
  '/account': 'My Profile',
  '/billing': 'Billing',
  '/settings': 'Settings',
  '/admin': 'Admin',
  '/admin/morning-brief': 'Admin — Morning Brief',
  '/admin/updates': 'Admin — Updates',
}

const tickerItems = [
  { sym: 'XRP',          price: '$2.31',   chg: '+3.4%',   up: true  },
  { sym: 'BTC',          price: '$67,420', chg: '-1.2%',   up: false },
  { sym: 'ETH',          price: '$3,480',  chg: '+0.8%',   up: true  },
  { sym: 'USD/JPY',      price: '153.4',   chg: '-0.3%',   up: false },
  { sym: 'BRENT CRUDE',  price: '$87.40',  chg: '+1.1%',   up: true  },
  { sym: 'WTI CRUDE',    price: '$83.20',  chg: '+0.9%',   up: true  },
  { sym: 'GOLD',         price: '$2,318',  chg: '+0.4%',   up: true  },
  { sym: 'DXY',          price: '104.2',   chg: '-0.2%',   up: false },
  { sym: 'JAPAN 10Y',    price: '0.72%',   chg: '+0.03%',  up: true  },
  { sym: 'US 10Y',       price: '4.38%',   chg: '-0.04%',  up: false },
  { sym: 'EUR/USD',      price: '1.084',   chg: '+0.1%',   up: true  },
  { sym: 'S&P 500',      price: '5,204',   chg: '-0.3%',   up: false },
  { sym: 'XRPC ETF',     price: '$24.18',  chg: '+2.1%',   up: true  },
  { sym: 'XRP ETF',      price: '$31.40',  chg: '+1.8%',   up: true  },
  { sym: 'XRPZ ETF',     price: '$18.92',  chg: '+2.4%',   up: true  },
  { sym: 'GXRP ETF',     price: '$12.55',  chg: '+1.5%',   up: true  },
  { sym: 'TOXR ETF',     price: '$9.87',   chg: '+1.2%',   up: true  },
  { sym: 'XRPR ETF',     price: '$22.34',  chg: '+1.9%',   up: true  },
  { sym: 'UXRP ETF',     price: '$15.61',  chg: '+2.2%',   up: true  },
  { sym: 'XRP ETF AUM',  price: '$1.0B',   chg: '+2.3%',   up: true  },
  { sym: 'F&G INDEX',    price: '62',      chg: 'Greed',   up: true  },
]

const tickerStyle = `
  @keyframes cn-dash-ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .cn-dash-track {
    display: flex;
    gap: 36px;
    animation: cn-dash-ticker 20s linear infinite;
    flex-shrink: 0;
    align-items: center;
    white-space: nowrap;
  }
  .cn-dash-track:hover {
    animation-play-state: paused;
  }
`

export default function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const title = routeTitles[location.pathname] || 'ControlNode'

  return (
    <header
      className="sticky top-0 z-20"
      style={{ background: 'rgba(10,11,15,0.85)', borderBottom: '1px solid #1e2330', backdropFilter: 'blur(12px)' }}
    >
      <style>{tickerStyle}</style>

      {/* Main top bar row */}
      <div className="flex items-center justify-between px-4 lg:px-6 h-14">
        {/* Page title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-8 lg:hidden" />
          <h1
            className="text-base font-semibold tracking-tight"
            style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}
          >
            {title}
          </h1>
        </div>

        {/* Scrolling ticker — center, with padding on both sides */}
        <div
          className="hidden lg:flex flex-1 items-center overflow-hidden mx-8"
          style={{ maxWidth: '780px' }}
        >
          {/* LIVE label */}
          <span
            className="flex-shrink-0 mr-4 pr-4 text-xs font-bold tracking-widest"
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              color: '#9d5cf6',
              borderRight: '1px solid #1e2330',
            }}
          >
            LIVE
          </span>

          {/* Ticker track wrapper — clips overflow */}
          <div className="overflow-hidden flex-1">
            <div className="cn-dash-track">
              {/* Items x2 for seamless infinite loop */}
              {[...tickerItems, ...tickerItems].map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 flex-shrink-0"
                >
                  <span
                    className="text-xs font-bold"
                    style={{ fontFamily: 'JetBrains Mono, monospace', color: '#eceef5' }}
                  >
                    {item.sym}
                  </span>
                  <span
                    className="text-xs"
                    style={{ fontFamily: 'JetBrains Mono, monospace', color: '#9aa8be' }}
                  >
                    {item.price}
                  </span>
                  <span
                    className="text-xs"
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      color: item.up ? '#10b981' : '#ef4444',
                    }}
                  >
                    {item.chg}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right side — bell + avatar */}
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
