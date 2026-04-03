import React, { useState } from 'react'
import AppLayout from '../components/AppLayout'
import { AlertTriangle, X, ChevronRight } from 'lucide-react'

const dominoes = [
  {
    id: 1,
    title: 'Global Oil Shock',
    shortTitle: 'Oil Shock',
    color: '#ef4444',
    pips: [2, 4],
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
  },
  {
    id: 2,
    title: 'Japan Rate Shift',
    shortTitle: 'BOJ Hike',
    color: '#f97316',
    pips: [1, 3],
    description: 'Japan is forced to raise interest rates due to inflation caused by rising oil prices, breaking decades of ultra-loose monetary policy.',
    whatToWatch: [
      'Bank of Japan rate decisions and emergency meetings',
      'Japanese 10Y and 30Y bond yields',
      'Japan CPI inflation data',
      'Yield Curve Control (YCC) policy changes',
      'BOJ intervention signals',
    ],
    triggerCondition: 'BOJ rate hike announcement or yield curve control policy break',
    status: 'in_progress',
    adminNotes: 'BOJ held at 0.1% — surprise hold. Yield pressure building. 10Y at 0.84% and rising. Watch carefully.',
  },
  {
    id: 3,
    title: 'Yen Carry Unwind',
    shortTitle: 'Carry Trade',
    color: '#f59e0b',
    pips: [3, 5],
    description: 'Investors unwind trillions of dollars in leveraged positions funded by cheap yen, triggering cascading asset sales globally.',
    whatToWatch: [
      'USD/JPY rapid strengthening',
      'Global bond market sell-offs',
      'Sudden equity market volatility spikes',
      'Hedge fund deleveraging signals',
      'Cross-currency basis swap spreads',
    ],
    triggerCondition: 'Sharp yen strengthening combined with broad asset sell-off across multiple markets',
    status: 'in_progress',
    adminNotes: 'USD/JPY at 153.4 — yen weak but carry trade still active. If BOJ hikes unexpectedly, unwind could be rapid.',
  },
  {
    id: 4,
    title: 'Liquidity Crisis',
    shortTitle: 'Liquidity',
    color: '#8b5cf6',
    pips: [2, 6],
    description: 'Massive capital shifts cause liquidity to dry up across global markets simultaneously, creating a systemic funding crisis.',
    whatToWatch: [
      'US Treasury market stress and bid/ask spreads',
      'Repo market dysfunction and rate spikes',
      'Credit default swap spreads widening',
      'Central bank emergency liquidity operations',
      'LIBOR/SOFR rate anomalies',
    ],
    triggerCondition: 'Market-wide liquidity freeze across Treasury, repo, and credit markets simultaneously',
    status: 'not_started',
    adminNotes: 'Not yet triggered. Treasury market functioning normally. Repo rates stable. Critical domino to watch.',
  },
  {
    id: 5,
    title: 'Treasury Stress',
    shortTitle: 'Stablecoins',
    color: '#06b6d4',
    pips: [1, 5],
    description: 'Stablecoins and institutions are forced into Treasuries creating systemic pressure, while stablecoin pegs face extreme stress.',
    whatToWatch: [
      'Tether (USDT) peg stability',
      'Stablecoin total inflows and outflows',
      'Treasury demand spikes and auction results',
      'USDC and USDT reserve reports',
      'Stablecoin market cap changes',
    ],
    triggerCondition: 'Stablecoin depeg risk OR extreme Treasury demand spike causing dysfunction',
    status: 'not_started',
    adminNotes: 'Stablecoins stable. USDT at $1.00. Treasury auctions functioning. No stress signals yet.',
  },
  {
    id: 6,
    title: 'BTC Collapse',
    shortTitle: 'BTC Falls',
    color: '#ec4899',
    pips: [3, 3],
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
    adminNotes: 'BTC at $67,420. ETF flows positive. No stress signals. Falls only after Domino 4.',
  },
  {
    id: 7,
    title: 'XRP Solution',
    shortTitle: 'XRP Wins',
    color: '#10b981',
    pips: [4, 6],
    description: 'XRP emerges as the neutral bridge asset for global liquidity and settlement as the world demands a non-dollar, instant settlement layer.',
    whatToWatch: [
      'XRP volume spikes — especially ODL corridors',
      'Institutional adoption signals',
      'Central bank or sovereign XRP integration news',
      'Ripple partnership expansions',
      'XRP ETF approval and inflow data',
    ],
    triggerCondition: 'Major institutional adoption event combined with global liquidity demand requiring bridge asset',
    status: 'not_started',
    adminNotes: 'The final domino. XRP positioned but not yet triggered. ODL volume growing. ETF filings active.',
  },
]

const statusConfig = {
  triggered: { label: 'Fallen', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  in_progress: { label: 'Tipping', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  not_started: { label: 'Standing', color: '#6b7280', bg: 'rgba(75,85,99,0.2)' },
}

const pipPositions = {
  1: [[50, 50]],
  2: [[30, 28], [70, 72]],
  3: [[30, 22], [50, 50], [70, 78]],
  4: [[30, 25], [70, 25], [30, 75], [70, 75]],
  5: [[30, 22], [70, 22], [50, 50], [30, 78], [70, 78]],
  6: [[30, 18], [70, 18], [30, 50], [70, 50], [30, 82], [70, 82]],
}

function PipSVG({ count, color, half }) {
  const positions = pipPositions[count] || []
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" style={{ display: 'block' }}>
      {positions.map((pos, i) => (
        <circle key={i} cx={pos[0]} cy={pos[1]} r="9" fill={color} opacity="0.85" />
      ))}
    </svg>
  )
}

function DominoPiece({ domino, isActive, onClick }) {
  const isFallen = domino.status === 'triggered'
  const isTipping = domino.status === 'in_progress'
  const isStanding = domino.status === 'not_started'

  const pipColor = isActive ? 'white' : domino.color
  const bgColor = isActive ? domino.color : '#1a1f2e'
  const borderColor = isActive ? domino.color : domino.color + '55'

  // Rotation: fallen = 90deg, tipping = 45deg, standing = 0deg
  const rotation = isFallen ? 90 : isTipping ? 42 : 0

  // Transform origin and positioning adjustments
  // When fallen, the domino lays flat — shift it down
  // When tipping, shift slightly
  const containerStyle = {
    width: '72px',
    height: '140px', // extra space for rotation
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'relative',
  }

  const pieceStyle = {
    width: '58px',
    height: '110px',
    background: bgColor,
    border: `2px solid ${borderColor}`,
    borderRadius: '8px',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${-rotation}deg)`,
    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s, border-color 0.2s',
    boxShadow: isActive
      ? `0 0 20px ${domino.color}50`
      : isFallen
      ? `4px 2px 12px rgba(0,0,0,0.5)`
      : isTipping
      ? `3px 1px 8px rgba(0,0,0,0.3)`
      : `0 2px 8px rgba(0,0,0,0.2)`,
    cursor: 'pointer',
    overflow: 'hidden',
    animation: isTipping && !isActive ? 'teetering 2.5s ease-in-out infinite' : 'none',
  }

  // Shadow/ground effect under fallen domino
  const shadowStyle = isFallen ? {
    position: 'absolute',
    bottom: '-3px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100px',
    height: '6px',
    background: `radial-gradient(ellipse, ${domino.color}30 0%, transparent 70%)`,
    borderRadius: '50%',
  } : isTipping ? {
    position: 'absolute',
    bottom: '-3px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '70px',
    height: '4px',
    background: `radial-gradient(ellipse, ${domino.color}20 0%, transparent 70%)`,
    borderRadius: '50%',
  } : null

  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
      <div style={containerStyle}>
        {/* Ground shadow */}
        {shadowStyle && <div style={shadowStyle} />}

        {/* The domino piece */}
        <div style={pieceStyle}>
          {/* Status strip at top */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: domino.color,
            opacity: isFallen ? 1 : 0.6,
            boxShadow: domino.status !== 'not_started' ? `0 0 6px ${domino.color}` : 'none',
          }} />

          {/* Number */}
          <div style={{
            position: 'absolute', top: '5px', left: '5px',
            fontSize: '8px', fontFamily: 'JetBrains Mono',
            color: isActive ? 'rgba(255,255,255,0.8)' : domino.color + 'aa',
            fontWeight: 700,
          }}>
            {String(domino.id).padStart(2, '0')}
          </div>

          {/* Top half pips */}
          <div style={{ height: '48%', padding: '12px 8px 4px' }}>
            <PipSVG count={domino.pips[0]} color={pipColor} />
          </div>

          {/* Divider */}
          <div style={{
            height: '2px', margin: '0 8px',
            background: isActive ? 'rgba(255,255,255,0.25)' : domino.color + '35',
          }} />

          {/* Bottom half pips */}
          <div style={{ height: '48%', padding: '4px 8px 8px' }}>
            <PipSVG count={domino.pips[1]} color={pipColor} />
          </div>
        </div>
      </div>
    </button>
  )
}

function DominoCard({ domino, isActive, onClick }) {
  const s = statusConfig[domino.status]

  return (
    <div className="flex flex-col items-center gap-2" style={{ width: '80px' }}>
      <DominoPiece domino={domino} isActive={isActive} onClick={onClick} />

      {/* Status label */}
      <div className="flex items-center gap-1">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: s.color,
            boxShadow: domino.status !== 'not_started' ? `0 0 5px ${s.color}` : 'none',
          }}
        />
        <span style={{ fontSize: '9px', color: s.color, fontWeight: 600 }}>{s.label}</span>
      </div>

      {/* Title */}
      <p style={{
        fontSize: '10px',
        color: isActive ? domino.color : '#6b7280',
        fontWeight: isActive ? 600 : 400,
        textAlign: 'center',
        lineHeight: 1.3,
      }}>
        {domino.shortTitle}
      </p>
    </div>
  )
}

function DetailPanel({ domino, onClose }) {
  const s = statusConfig[domino.status]
  return (
    <div className="rounded-xl border mt-5" style={{ background: '#161a22', borderColor: domino.color + '40' }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ background: `${domino.color}10`, borderBottom: `1px solid ${domino.color}25` }}>
        <div>
          <h2 className="text-base font-bold mb-0.5" style={{ fontFamily: 'Syne, sans-serif', color: '#e8eaf0' }}>
            Domino {String(domino.id).padStart(2, '0')} — {domino.title}
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: s.bg, color: s.color }}>{s.label}</span>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10" style={{ color: '#8892a4' }}>
          <X size={15} />
        </button>
      </div>
      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#4a5568' }}>What This Means</p>
          <p className="text-sm leading-relaxed" style={{ color: '#8892a4' }}>{domino.description}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#4a5568' }}>Trigger Condition</p>
          <div className="rounded-lg p-3 text-sm" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', color: '#8892a4' }}>
            <AlertTriangle size={11} className="inline mr-1.5" style={{ color: '#ef4444' }} />
            {domino.triggerCondition}
          </div>
        </div>
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
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#4a5568' }}>ControlNode Assessment</p>
          <div className="rounded-lg p-3 text-sm" style={{ background: `${domino.color}08`, border: `1px solid ${domino.color}25`, color: '#8892a4' }}>
            {domino.adminNotes}
          </div>
        </div>
      </div>
      <div className="px-5 py-3 text-xs text-center" style={{ borderTop: '1px solid #1e2330', color: '#2d3748' }}>
        For informational purposes only — not financial advice
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
    setActiveDomino(prev => prev?.id === domino.id ? null : domino)
  }

  return (
    <AppLayout>
      <style>{`
        @keyframes teetering {
          0%   { transform: translateX(-50%) rotate(-42deg); }
          40%  { transform: translateX(-50%) rotate(-38deg); }
          60%  { transform: translateX(-50%) rotate(-44deg); }
          100% { transform: translateX(-50%) rotate(-42deg); }
        }
      `}</style>

      <div className="mb-5">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#e8eaf0' }}>Domino Theory</h1>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
            {progressCount} of {dominoes.length} Active
          </span>
        </div>
        <p className="text-sm" style={{ color: '#8892a4' }}>
          A macro-economic chain reaction framework. Fallen dominoes have triggered. Tipping dominoes are in progress. For informational purposes only.
        </p>
      </div>

      {/* Progress */}
      <div className="rounded-xl p-4 border mb-5" style={{ background: '#161a22', borderColor: '#1e2330' }}>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#4a5568' }}>Chain Reaction Progress</p>
          <div className="flex items-center gap-4">
            {[
              { label: 'Fallen', count: triggered, color: '#ef4444' },
              { label: 'Tipping', count: inProgress, color: '#f59e0b' },
              { label: 'Standing', count: dominoes.length - progressCount, color: '#4a5568' },
            ].map(g => (
              <div key={g.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: g.color }} />
                <span className="text-xs" style={{ color: '#8892a4' }}>{g.label} ({g.count})</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: '#111318' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #ef4444, #f59e0b)' }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: '#4a5568' }}>Oil Shock</span>
          <span className="text-xs font-semibold" style={{ color: '#f59e0b' }}>{progressPct}% Active</span>
          <span className="text-xs" style={{ color: '#4a5568' }}>XRP Solution</span>
        </div>
      </div>

      {/* Domino chain */}
      <div className="rounded-xl p-5 border mb-4" style={{ background: '#161a22', borderColor: '#1e2330' }}>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#4a5568' }}>
          The Chain — Click Any Domino for Details
        </p>
        <p className="text-xs mb-5" style={{ color: '#2d3748' }}>
          Fallen = triggered · Tipping = in progress · Standing = monitoring
        </p>
        <div className="flex flex-wrap gap-4 items-end">
          {dominoes.map((domino, i) => (
            <div key={domino.id} className="flex items-end gap-2">
              <DominoCard
                domino={domino}
                isActive={activeDomino?.id === domino.id}
                onClick={() => handleClick(domino)}
              />
              {i < dominoes.length - 1 && (
                <ChevronRight size={12} style={{ color: '#2d3748', marginBottom: '28px', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {activeDomino && <DetailPanel domino={activeDomino} onClose={() => setActiveDomino(null)} />}

      {/* Status summary */}
      {!activeDomino && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Fallen Dominoes', items: dominoes.filter(d => d.status === 'triggered'), color: '#ef4444', bg: 'rgba(239,68,68,0.07)', border: 'rgba(239,68,68,0.2)' },
            { label: 'Tipping Dominoes', items: dominoes.filter(d => d.status === 'in_progress'), color: '#f59e0b', bg: 'rgba(245,158,11,0.07)', border: 'rgba(245,158,11,0.2)' },
            { label: 'Standing — Monitoring', items: dominoes.filter(d => d.status === 'not_started'), color: '#6b7280', bg: 'rgba(75,85,99,0.1)', border: 'rgba(75,85,99,0.2)' },
          ].map(group => (
            <div key={group.label} className="rounded-xl p-4 border" style={{ background: group.bg, borderColor: group.border }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: group.color }}>{group.label} ({group.items.length})</p>
              <div className="space-y-2">
                {group.items.map(d => (
                  <button key={d.id} onClick={() => handleClick(d)} className="text-left w-full hover:opacity-80">
                    <p className="text-xs" style={{ color: '#8892a4' }}>{String(d.id).padStart(2, '0')} — {d.title}</p>
                  </button>
                ))}
                {group.items.length === 0 && <p className="text-xs" style={{ color: '#2d3748' }}>None yet</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 text-center">
        <p className="text-xs" style={{ color: '#2d3748' }}>
          The Domino Theory is an observational framework for educational purposes only. Not financial advice or a prediction of future events.
        </p>
      </div>
    </AppLayout>
  )
}
