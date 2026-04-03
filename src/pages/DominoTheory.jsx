import React, { useState } from 'react'
import AppLayout from '../components/AppLayout'
import { Badge } from '../components/UI'
import { ChevronRight, AlertTriangle, Info, ExternalLink, Bell, X, ChevronDown, ChevronUp } from 'lucide-react'

const dominoes = [
  {
    id: 1,
    title: 'Global Oil Shock',
    emoji: '🛢️',
    color: '#ef4444',
    description: 'A geopolitical or supply-driven spike in oil prices creates global inflation pressure that ripples through every major economy.',
    whatToWatch: [
      'Brent Crude price — watch for 10-20%+ rapid spike',
      'WTI Crude price movement',
      'Strait of Hormuz risk and closure threats',
      'Middle East conflict escalation headlines',
      'OPEC+ emergency production decisions',
    ],
    triggerCondition: 'Rapid spike in oil prices of 10–20%+ in a short time period',
    status: 'triggered',
    adminNotes: 'Brent Crude at $87.40 — elevated but not yet at shock levels. Middle East tensions elevated. Monitor closely.',
    links: [],
  },
  {
    id: 2,
    title: 'Japan Interest Rate Shift',
    emoji: '🏦',
    color: '#f97316',
    description: 'Japan is forced to raise interest rates due to inflation caused by rising oil prices, breaking decades of ultra-loose monetary policy.',
    whatToWatch: [
      'Bank of Japan rate decisions and emergency meetings',
      'Japanese 10Y and 30Y bond yields',
      'Japan CPI inflation data',
      'Yield Curve Control (YCC) policy changes',
      'BOJ intervention signals and statements',
    ],
    triggerCondition: 'BOJ rate hike announcement or yield curve control policy break',
    status: 'in_progress',
    adminNotes: 'BOJ held at 0.1% — surprise hold. Yield pressure building. 10Y at 0.84% and rising. Watch carefully.',
    links: [],
  },
  {
    id: 3,
    title: 'Yen Carry Trade Unwind',
    emoji: '💴',
    color: '#f59e0b',
    description: 'Investors unwind trillions of dollars in leveraged positions funded by cheap yen, triggering cascading asset sales globally.',
    whatToWatch: [
      'USD/JPY rapid strengthening (yen getting stronger)',
      'Global bond market sell-offs',
      'Sudden volatility spikes in equity markets',
      'Hedge fund positioning and deleveraging signals',
      'Cross-currency basis swap spreads',
    ],
    triggerCondition: 'Sharp yen strengthening combined with broad asset sell-off across multiple markets',
    status: 'in_progress',
    adminNotes: 'USD/JPY at 153.4 — yen weak but carry trade still active. If BOJ hikes unexpectedly, unwind could be rapid and severe.',
    links: [],
  },
  {
    id: 4,
    title: 'Global Liquidity Crisis',
    emoji: '🌊',
    color: '#8b5cf6',
    description: 'Massive capital shifts cause liquidity to dry up across global markets simultaneously, creating a systemic funding crisis.',
    whatToWatch: [
      'US Treasury market stress and bid/ask spreads',
      'Repo market dysfunction and rate spikes',
      'Credit default swap spreads widening',
      'LIBOR/SOFR rate anomalies',
      'Central bank emergency liquidity operations',
    ],
    triggerCondition: 'Market-wide liquidity freeze signals across Treasury, repo, and credit markets simultaneously',
    status: 'not_started',
    adminNotes: 'Not yet triggered. Treasury market functioning normally. Repo rates stable. This is the critical domino to watch.',
    links: [],
  },
  {
    id: 5,
    title: 'Treasury + Stablecoin Stress',
    emoji: '💵',
    color: '#06b6d4',
    description: 'Stablecoins and institutions are forced into Treasuries creating systemic pressure, while stablecoin pegs face extreme stress.',
    whatToWatch: [
      'Tether (USDT) peg stability — watch for deviation',
      'Stablecoin total inflows and outflows',
      'Treasury demand spikes and auction results',
      'USDC and USDT reserve transparency reports',
      'Stablecoin market cap changes',
    ],
    triggerCondition: 'Stablecoin depeg risk emerging OR extreme Treasury demand spike causing dysfunction',
    status: 'not_started',
    adminNotes: 'Stablecoins stable. USDT at $1.00. Treasury auctions functioning. No stress signals yet.',
    links: [],
  },
  {
    id: 6,
    title: 'Bitcoin & Risk Asset Collapse',
    emoji: '₿',
    color: '#ec4899',
    description: 'Bitcoin and risk assets experience forced selling as institutions and funds liquidate positions to meet liquidity demands.',
    whatToWatch: [
      'BTC rapid price drawdown (20%+ in days)',
      'Bitcoin ETF outflows accelerating',
      'Crypto exchange liquidity issues',
      'Forced liquidation cascade events',
      'Stablecoin flight to safety signals',
    ],
    triggerCondition: 'Rapid BTC drawdown of 20%+ combined with forced liquidation events across exchanges',
    status: 'not_started',
    adminNotes: 'BTC at $67,420. ETF flows positive. No stress signals. This domino falls only after Domino 4.',
    links: [],
  },
  {
    id: 7,
    title: 'XRP Liquidity Solution',
    emoji: '⚡',
    color: '#10b981',
    description: 'XRP emerges as the neutral bridge asset for global liquidity and settlement as the world demands a non-dollar, instant settlement layer.',
    whatToWatch: [
      'XRP volume spikes — especially ODL corridors',
      'Institutional adoption signals and announcements',
      'Central bank or sovereign XRP integration news',
      'Ripple partnership expansions',
      'XRP ETF approval and inflow data',
    ],
    triggerCondition: 'Major institutional adoption event combined with a global liquidity demand spike requiring bridge asset',
    status: 'not_started',
    adminNotes: 'The final domino. XRP positioned but not yet triggered. ODL volume growing. ETF filings active. Watching.',
    links: [],
  },
]

const statusConfig = {
  triggered: { label: 'Triggered', bg: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'rgba(239,68,68,0.4)', dot: '#ef4444' },
  in_progress: { label: 'In Progress', bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'rgba(245,158,11,0.4)', dot: '#f59e0b' },
  not_started: { label: 'Monitoring', bg: 'rgba(75,85,99,0.2)', color: '#6b7280', border: 'rgba(75,85,99,0.3)', dot: '#4a5568' },
}

function StatusDot({ status }) {
  const s = statusConfig[status]
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-2 h-2 rounded-full"
        style={{
          background: s.dot,
          boxShadow: status === 'triggered' ? `0 0 6px ${s.dot}` : 'none',
        }}
      />
      <span className="text-xs font-semibold" style={{ color: s.color }}>{s.label}</span>
    </div>
  )
}

function DominoCard({ domino, index, isLast, onClick, isActive }) {
  const s = statusConfig[domino.status]

  return (
    <div className="flex items-center">
      <div
        className="relative rounded-xl border cursor-pointer transition-all duration-200 flex-shrink-0"
        style={{
          background: isActive ? `${domino.color}12` : '#161a22',
          borderColor: isActive ? domino.color : s.border,
          width: '200px',
          padding: '16px',
        }}
        onClick={() => onClick(domino)}
        onMouseEnter={e => e.currentTarget.style.borderColor = domino.color}
        onMouseLeave={e => e.currentTarget.style.borderColor = isActive ? domino.color : s.border}
      >
        {/* Status bar at top */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
          style={{ background: s.dot }}
        />

        {/* Number + emoji */}
        <div className="flex items-center justify-between mb-3 mt-1">
          <span
            className="text-xs font-bold"
            style={{ fontFamily: 'JetBrains Mono', color: domino.color, opacity: 0.7 }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <span style={{ fontSize: '20px' }}>{domino.emoji}</span>
        </div>

        {/* Title */}
        <h3 className="text-xs font-semibold mb-2 leading-snug" style={{ color: '#e8eaf0' }}>
          {domino.title}
        </h3>

        {/* Status */}
        <StatusDot status={domino.status} />

        {/* Click hint */}
        <p className="text-xs mt-2" style={{ color: '#2d3748' }}>Click for details</p>
      </div>

      {/* Arrow connector */}
      {!isLast && (
        <div className="flex items-center flex-shrink-0 mx-1">
          <div className="w-6 h-px" style={{ background: '#1e2330' }} />
          <ChevronRight size={14} style={{ color: '#2d3748' }} />
        </div>
      )}
    </div>
  )
}

function DetailPanel({ domino, onClose }) {
  const s = statusConfig[domino.status]

  return (
    <div
      className="rounded-xl border mt-6 overflow-hidden"
      style={{ background: '#161a22', borderColor: domino.color + '40' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ background: `${domino.color}10`, borderBottom: `1px solid ${domino.color}30` }}
      >
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '24px' }}>{domino.emoji}</span>
          <div>
            <h2 className="text-base font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#e8eaf0' }}>
              Domino {String(dominoes.findIndex(d => d.id === domino.id) + 1).padStart(2, '0')} — {domino.title}
            </h2>
            <StatusDot status={domino.status} />
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          style={{ color: '#8892a4' }}
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Description */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#4a5568' }}>What This Means</p>
          <p className="text-sm leading-relaxed" style={{ color: '#8892a4' }}>{domino.description}</p>
        </div>

        {/* Trigger */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#4a5568' }}>Trigger Condition</p>
          <div
            className="rounded-lg p-3 text-sm leading-relaxed"
            style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', color: '#8892a4' }}
          >
            <AlertTriangle size={12} className="inline mr-1.5" style={{ color: '#ef4444' }} />
            {domino.triggerCondition}
          </div>
        </div>

        {/* What to Watch */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#4a5568' }}>What to Watch</p>
          <div className="space-y-1.5">
            {domino.whatToWatch.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: domino.color }} />
                <p className="text-xs leading-relaxed" style={{ color: '#8892a4' }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Notes */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#4a5568' }}>ControlNode Assessment</p>
          <div
            className="rounded-lg p-3 text-sm leading-relaxed"
            style={{ background: `${domino.color}08`, border: `1px solid ${domino.color}25`, color: '#8892a4' }}
          >
            {domino.adminNotes}
          </div>
        </div>
      </div>

      <div
        className="px-6 py-3 text-xs text-center"
        style={{ borderTop: '1px solid #1e2330', color: '#2d3748' }}
      >
        For informational purposes only. Not financial advice.
      </div>
    </div>
  )
}

export default function DominoTheory() {
  const [activeDomino, setActiveDomino] = useState(null)

  const triggered = dominoes.filter(d => d.status === 'triggered').length
  const inProgress = dominoes.filter(d => d.status === 'in_progress').length
  const progressCount = triggered + inProgress
  const progressPct = Math.round((progressCount / dominoes.length) * 100)

  function handleClick(domino) {
    setActiveDomino(activeDomino?.id === domino.id ? null : domino)
  }

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#e8eaf0' }}>
            Domino Theory
          </h1>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}
          >
            {progressCount} of {dominoes.length} Active
          </span>
        </div>
        <p className="text-sm" style={{ color: '#8892a4' }}>
          A macro-economic chain reaction framework tracking the path to global liquidity stress and XRP emergence. For informational and educational purposes only.
        </p>
      </div>

      {/* Progress bar */}
      <div
        className="rounded-xl p-5 border mb-6"
        style={{ background: '#161a22', borderColor: '#1e2330' }}
      >
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#4a5568' }}>
            Chain Reaction Progress
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: '#ef4444' }} />
              <span className="text-xs" style={{ color: '#8892a4' }}>Triggered ({triggered})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: '#f59e0b' }} />
              <span className="text-xs" style={{ color: '#8892a4' }}>In Progress ({inProgress})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: '#4a5568' }} />
              <span className="text-xs" style={{ color: '#8892a4' }}>Monitoring ({dominoes.length - progressCount})</span>
            </div>
          </div>
        </div>

        {/* Progress track */}
        <div className="relative h-3 rounded-full overflow-hidden" style={{ background: '#111318' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPct}%`,
              background: `linear-gradient(90deg, #ef4444, #f59e0b)`,
            }}
          />
        </div>

        {/* Domino markers */}
        <div className="flex justify-between mt-1">
          {dominoes.map((d, i) => (
            <div key={d.id} className="flex flex-col items-center">
              <div
                className="w-1 h-2 rounded-full"
                style={{
                  background: d.status === 'triggered' ? '#ef4444' :
                    d.status === 'in_progress' ? '#f59e0b' : '#1e2330'
                }}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs" style={{ color: '#4a5568' }}>Oil Shock</span>
          <span className="text-xs font-semibold" style={{ color: '#f59e0b' }}>{progressPct}% Active</span>
          <span className="text-xs" style={{ color: '#4a5568' }}>XRP Solution</span>
        </div>
      </div>

      {/* Domino chain — horizontal scrollable */}
      <div
        className="rounded-xl p-5 border mb-4 overflow-x-auto"
        style={{ background: '#161a22', borderColor: '#1e2330' }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: '#4a5568' }}>
          The Chain — Click Any Domino for Details
        </p>
        <div className="flex items-center pb-2" style={{ minWidth: 'max-content' }}>
          {dominoes.map((domino, i) => (
            <DominoCard
              key={domino.id}
              domino={domino}
              index={i}
              isLast={i === dominoes.length - 1}
              onClick={handleClick}
              isActive={activeDomino?.id === domino.id}
            />
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {activeDomino && (
        <DetailPanel domino={activeDomino} onClose={() => setActiveDomino(null)} />
      )}

      {/* Status summary cards */}
      {!activeDomino && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {[
            {
              label: 'Triggered Dominoes',
              items: dominoes.filter(d => d.status === 'triggered'),
              color: '#ef4444',
              bg: 'rgba(239,68,68,0.07)',
              border: 'rgba(239,68,68,0.2)',
            },
            {
              label: 'In Progress',
              items: dominoes.filter(d => d.status === 'in_progress'),
              color: '#f59e0b',
              bg: 'rgba(245,158,11,0.07)',
              border: 'rgba(245,158,11,0.2)',
            },
            {
              label: 'Monitoring',
              items: dominoes.filter(d => d.status === 'not_started'),
              color: '#6b7280',
              bg: 'rgba(75,85,99,0.1)',
              border: 'rgba(75,85,99,0.2)',
            },
          ].map((group) => (
            <div
              key={group.label}
              className="rounded-xl p-4 border"
              style={{ background: group.bg, borderColor: group.border }}
            >
              <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: group.color }}>
                {group.label} ({group.items.length})
              </p>
              <div className="space-y-2">
                {group.items.map(d => (
                  <button
                    key={d.id}
                    onClick={() => handleClick(d)}
                    className="flex items-center gap-2 w-full text-left hover:opacity-80 transition-opacity"
                  >
                    <span style={{ fontSize: '14px' }}>{d.emoji}</span>
                    <span className="text-xs" style={{ color: '#8892a4' }}>{d.title}</span>
                  </button>
                ))}
                {group.items.length === 0 && (
                  <p className="text-xs" style={{ color: '#2d3748' }}>None yet</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-6 text-center">
        <p className="text-xs" style={{ color: '#2d3748' }}>
          The Domino Theory is an observational framework for educational purposes only. It does not constitute financial advice or a prediction of future market events.
        </p>
      </div>
    </AppLayout>
  )
}
