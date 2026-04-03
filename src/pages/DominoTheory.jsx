import React, { useState } from 'react'
import AppLayout from '../components/AppLayout'
import { AlertTriangle, X, ChevronRight } from 'lucide-react'

const dominoes = [
  {
    id: 1,
    title: 'Global Oil & Energy Shock',
    shortTitle: 'Oil Shock',
    color: '#ef4444',
    pips: [2, 4],
    confidence: 72,
    description: 'A sharp rise in oil and energy prices creates global inflation pressure that ripples through every major economy.',
    whatToWatch: [
      'Brent Crude — watch for 10-20%+ rapid spike',
      'WTI Crude price movement',
      'Middle East conflict and supply disruptions',
      'Strait of Hormuz risk',
      'OPEC+ emergency decisions',
    ],
    triggerCondition: 'Rapid spike in oil prices of 10–20%+ in a short time period',
    status: 'triggered',
    adminNotes: 'Brent Crude at $87.40 — elevated. Middle East tensions elevated. Monitor closely.',
    fragile: false,
  },
  {
    id: 2,
    title: 'Japan Rate & Yield Break',
    shortTitle: 'BOJ Hike',
    color: '#f97316',
    pips: [1, 3],
    confidence: 58,
    description: 'Bank of Japan is forced to shift policy due to inflation pressure, breaking decades of ultra-loose monetary policy.',
    whatToWatch: [
      'BOJ rate decisions and emergency meetings',
      'Japanese 10Y and 30Y bond yields',
      'Yield Curve Control (YCC) signals',
      'Japan CPI inflation data',
      'BOJ intervention statements',
    ],
    triggerCondition: 'BOJ rate hike OR yield curve control failure',
    status: 'in_progress',
    adminNotes: 'BOJ held at 0.1% — surprise hold. 10Y yield at 0.84% and rising. YCC under pressure.',
    fragile: false,
  },
  {
    id: 3,
    title: 'Yen Carry Trade Unwind',
    shortTitle: 'Carry Trade',
    color: '#f59e0b',
    pips: [3, 5],
    confidence: 51,
    description: 'Global leveraged positions funded by cheap yen begin unwinding, triggering cascading asset sales worldwide.',
    whatToWatch: [
      'USD/JPY sharp movement (yen strengthening)',
      'Global volatility spikes (VIX)',
      'Bond and equity sudden selling',
      'Hedge fund deleveraging signals',
      'Cross-currency basis swap spreads',
    ],
    triggerCondition: 'Strong yen appreciation combined with broad market sell-off',
    status: 'in_progress',
    adminNotes: 'USD/JPY at 153.4 — yen weak but carry trade active. BOJ surprise hike would trigger rapid unwind.',
    fragile: false,
  },
  {
    id: 4,
    title: 'U.S. Treasury Market Stress',
    shortTitle: 'Treasury',
    color: '#8b5cf6',
    pips: [2, 6],
    confidence: 34,
    description: 'Foreign holders — especially Japan — sell Treasuries, creating instability in the world\'s largest bond market.',
    whatToWatch: [
      'Treasury yields (10Y, 30Y) rapid spike',
      'Weak bond auction demand',
      'Bid-to-cover ratios declining',
      'Foreign central bank Treasury holdings',
      'Repo market stress signals',
    ],
    triggerCondition: 'Rapid yield spike combined with weak Treasury auction demand',
    status: 'not_started',
    adminNotes: 'Treasury market functioning normally. Auctions stable. Not yet triggered — critical domino to watch.',
    fragile: false,
  },
  {
    id: 5,
    title: 'Stablecoin Absorption',
    shortTitle: 'Stablecoins',
    color: '#06b6d4',
    pips: [1, 5],
    confidence: 28,
    description: 'Stablecoins are used to absorb Treasury supply and support the system, creating a new digital dollar demand layer.',
    whatToWatch: [
      'Stablecoin market cap growth acceleration',
      'U.S. stablecoin regulatory bills progress',
      'Treasury demand via digital dollar instruments',
      'USDT and USDC reserve compositions',
      'Large-scale stablecoin issuance events',
    ],
    triggerCondition: 'Large-scale stablecoin issuance explicitly tied to U.S. Treasury support',
    status: 'not_started',
    adminNotes: 'Stablecoin bills progressing in Senate. USDT at $110B market cap. Early stage — monitoring.',
    fragile: false,
  },
  {
    id: 6,
    title: 'ETF & Passive Liquidity Stress',
    shortTitle: 'ETF Stress',
    color: '#eab308',
    pips: [3, 4],
    confidence: 82,
    description: 'ETFs and passive investment vehicles begin experiencing outflows and forced selling as liquidity tightens globally.',
    whatToWatch: [
      'Bitcoin ETF net inflows/outflows',
      'Total ETF AUM changes (daily)',
      'Redemption spikes across asset classes',
      'Volume vs liquidity gap widening',
      'Forced selling cascade signals',
    ],
    triggerCondition: 'Large sustained ETF outflows combined with forced asset selling across markets',
    status: 'in_progress',
    adminNotes: 'BTC ETF flows positive but slowing. Traditional ETF redemptions elevated. Late-stage accelerator — watch closely.',
    fragile: false,
    accelerator: true,
  },
  {
    id: 7,
    title: 'Global Asset Liquidation',
    shortTitle: 'Liquidation',
    color: '#ec4899',
    pips: [4, 5],
    confidence: 22,
    description: 'Institutions sell liquid assets to raise cash — a global margin call across BTC, gold, equities, and bonds.',
    whatToWatch: [
      'BTC rapid drawdowns (20%+ moves)',
      'Gold and silver sudden sell-offs',
      'Equity market broad declines',
      'Crypto exchange liquidity issues',
      'Multi-asset simultaneous selling',
    ],
    triggerCondition: 'Broad multi-asset sell-off across crypto, equities, and commodities simultaneously',
    status: 'not_started',
    adminNotes: 'BTC at $67,420. Equities elevated. No liquidation cascade signals yet. Follows Domino 6.',
    fragile: false,
  },
  {
    id: 8,
    title: 'Tether & Stablecoin Instability',
    shortTitle: 'USDT Risk',
    color: '#f87171',
    pips: [2, 3],
    confidence: 18,
    description: 'Stablecoins — especially Tether — face pressure or potential de-peg due to severe liquidity stress.',
    whatToWatch: [
      'USDT price peg deviations (watch for $0.99 or below)',
      'Stablecoin outflows from exchanges',
      'Liquidity depth on major exchanges',
      'Tether redemption pressure',
      'Regulatory action against stablecoin issuers',
    ],
    triggerCondition: 'De-peg event OR severe instability signals from major stablecoin issuers',
    status: 'not_started',
    adminNotes: 'USDT stable at $1.00. No peg stress. High-risk domino if triggered — systemic contagion risk.',
    fragile: true,
  },
  {
    id: 9,
    title: 'XRP Global Liquidity Bridge',
    shortTitle: 'XRP Wins',
    color: '#10b981',
    pips: [4, 6],
    confidence: 45,
    description: 'XRP emerges as the neutral bridge asset for real-time global liquidity and cross-border settlement.',
    whatToWatch: [
      'XRP ODL volume spikes',
      'Institutional adoption signals',
      'Central bank or sovereign XRP integration',
      'Ripple partnership expansions',
      'XRP ETF approval and inflow data',
    ],
    triggerCondition: 'Major institutional adoption event combined with global liquidity demand requiring neutral bridge asset',
    status: 'not_started',
    adminNotes: 'The final domino. XRP positioned. ODL volume growing. ETF filings active. Watching for Stage 4 catalyst.',
    fragile: false,
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

function PipSVG({ count, color }) {
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

  const pipColor = isActive ? 'white' : domino.color
  const bgColor = isActive ? domino.color : '#1a1f2e'
  const borderColor = isActive ? domino.color : domino.color + '55'

  // Fall to the RIGHT: positive rotation
  const baseRotation = isFallen ? 90 : isTipping ? 42 : 0

  // Extra tilt for accelerator/fragile
  const extraTilt = domino.accelerator ? 8 : domino.fragile ? 5 : 0
  const rotation = baseRotation + (isFallen || isTipping ? 0 : extraTilt)

  // Animation name
  let animationName = 'none'
  if (isTipping && !isActive) animationName = 'teetering'
  if (domino.fragile && !isFallen && !isTipping && !isActive) animationName = 'pulsing'

  const pieceStyle = {
    width: '58px',
    height: '110px',
    background: bgColor,
    border: `2px solid ${borderColor}`,
    borderRadius: '8px',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    // Transform origin at BOTTOM so it falls forward (right)
    transformOrigin: 'bottom center',
    // Positive rotation = falls to the RIGHT
    transform: `translateX(-50%) rotate(${rotation}deg)`,
    transition: 'transform 0.5s cubic-bezier(0.34, 1.2, 0.64, 1), background 0.2s, border-color 0.2s',
    boxShadow: isActive
      ? `0 0 20px ${domino.color}50`
      : isFallen
      ? `6px 3px 16px rgba(0,0,0,0.6)`
      : isTipping
      ? `4px 2px 10px rgba(0,0,0,0.4)`
      : `0 2px 8px rgba(0,0,0,0.2)`,
    cursor: 'pointer',
    overflow: 'hidden',
    animation: animationName !== 'none' ? `${animationName} 2.5s ease-in-out infinite` : 'none',
  }

  // Shadow on the ground — appears to the RIGHT of fallen domino
  const shadowStyle = isFallen ? {
    position: 'absolute',
    bottom: '-4px',
    left: '50%',
    transform: 'translateX(-10px)',
    width: '110px',
    height: '8px',
    background: `radial-gradient(ellipse, ${domino.color}35 0%, transparent 70%)`,
    borderRadius: '50%',
  } : (isTipping || extraTilt > 0) ? {
    position: 'absolute',
    bottom: '-3px',
    left: '50%',
    transform: 'translateX(-5px)',
    width: '75px',
    height: '5px',
    background: `radial-gradient(ellipse, ${domino.color}20 0%, transparent 70%)`,
    borderRadius: '50%',
  } : null

  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
      <div style={{ width: '72px', height: '140px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', position: 'relative' }}>
        {shadowStyle && <div style={shadowStyle} />}
        <div style={pieceStyle}>
          {/* Status strip */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: domino.color,
            boxShadow: domino.status !== 'not_started' ? `0 0 6px ${domino.color}` : 'none',
          }} />

          {/* Fragile warning */}
          {domino.fragile && (
            <div style={{
              position: 'absolute', top: '4px', right: '4px',
              fontSize: '8px', color: '#f87171',
            }}>⚠️</div>
          )}

          {/* Accelerator badge */}
          {domino.accelerator && (
            <div style={{
              position: 'absolute', top: '4px', right: '4px',
              fontSize: '7px', color: '#eab308', fontWeight: 700,
            }}>▲</div>
          )}

          {/* Number */}
          <div style={{
            position: 'absolute', top: '5px', left: '5px',
            fontSize: '8px', fontFamily: 'JetBrains Mono',
            color: isActive ? 'rgba(255,255,255,0.8)' : domino.color + 'aa',
            fontWeight: 700,
          }}>
            {String(domino.id).padStart(2, '0')}
          </div>

          {/* Top pips */}
          <div style={{ height: '48%', padding: '12px 8px 4px' }}>
            <PipSVG count={domino.pips[0]} color={pipColor} />
          </div>

          {/* Divider */}
          <div style={{ height: '2px', margin: '0 8px', background: isActive ? 'rgba(255,255,255,0.25)' : domino.color + '35' }} />

          {/* Bottom pips */}
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
    <div className="flex flex-col items-center gap-1.5" style={{ width: '80px' }}>
      <DominoPiece domino={domino} isActive={isActive} onClick={onClick} />
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color, boxShadow: domino.status !== 'not_started' ? `0 0 5px ${s.color}` : 'none' }} />
        <span style={{ fontSize: '9px', color: s.color, fontWeight: 600 }}>{s.label}</span>
      </div>
      <p style={{ fontSize: '9px', color: isActive ? domino.color : '#6b7280', fontWeight: isActive ? 600 : 400, textAlign: 'center', lineHeight: 1.3 }}>
        {domino.shortTitle}
      </p>
      {/* Confidence bar */}
      <div style={{ width: '60px', height: '3px', background: '#1e2330', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${domino.confidence}%`, background: domino.color, borderRadius: '2px', transition: 'width 0.5s' }} />
      </div>
      <span style={{ fontSize: '8px', color: '#4a5568' }}>{domino.confidence}%</span>
    </div>
  )
}

function DetailPanel({ domino, onClose }) {
  const s = statusConfig[domino.status]
  return (
    <div className="rounded-xl border mt-5" style={{ background: '#161a22', borderColor: domino.color + '40' }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ background: `${domino.color}10`, borderBottom: `1px solid ${domino.color}25` }}>
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h2 className="text-base font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#e8eaf0' }}>
              Domino {String(domino.id).padStart(2, '0')} — {domino.title}
            </h2>
            {domino.accelerator && <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308' }}>▲ Late-Stage Accelerator</span>}
            {domino.fragile && <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171' }}>⚠️ High Risk / Fragile</span>}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: s.bg, color: s.color }}>{s.label}</span>
            <span className="text-xs" style={{ color: '#4a5568' }}>Confidence: <span style={{ color: domino.color, fontWeight: 600 }}>{domino.confidence}%</span></span>
          </div>
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
          {/* Confidence meter */}
          <div className="mt-3">
            <div className="flex justify-between mb-1">
              <span className="text-xs" style={{ color: '#4a5568' }}>Trigger Confidence</span>
              <span className="text-xs font-semibold" style={{ color: domino.color }}>{domino.confidence}%</span>
            </div>
            <div style={{ height: '6px', background: '#111318', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${domino.confidence}%`, background: `linear-gradient(90deg, ${domino.color}88, ${domino.color})`, borderRadius: '3px' }} />
            </div>
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
          0%   { transform: translateX(-50%) rotate(42deg); }
          30%  { transform: translateX(-50%) rotate(36deg); }
          60%  { transform: translateX(-50%) rotate(46deg); }
          100% { transform: translateX(-50%) rotate(42deg); }
        }
        @keyframes pulsing {
          0%   { box-shadow: 0 0 0px rgba(248,113,113,0); }
          50%  { box-shadow: 0 0 14px rgba(248,113,113,0.5); }
          100% { box-shadow: 0 0 0px rgba(248,113,113,0); }
        }
      `}</style>

      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#e8eaf0' }}>Domino Theory</h1>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}>
            {progressCount} of {dominoes.length} Active
          </span>
        </div>
        <p className="text-sm" style={{ color: '#8892a4' }}>
          A macro-economic chain reaction framework tracking global liquidity stress and XRP emergence. Dominoes fall to the right. For informational purposes only.
        </p>
      </div>

      {/* Progress */}
      <div className="rounded-xl p-4 border mb-5" style={{ background: '#161a22', borderColor: '#1e2330' }}>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#4a5568' }}>Chain Reaction Progress</p>
          <div className="flex items-center gap-4 flex-wrap">
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

      {/* Legend */}
      <div className="flex items-center gap-4 mb-3 flex-wrap">
        <span className="text-xs" style={{ color: '#4a5568' }}>▲ = Late-stage accelerator</span>
        <span className="text-xs" style={{ color: '#4a5568' }}>⚠️ = High risk / fragile domino</span>
        <span className="text-xs" style={{ color: '#4a5568' }}>% = Trigger confidence</span>
      </div>

      {/* Domino chain */}
      <div className="rounded-xl p-5 border mb-4" style={{ background: '#161a22', borderColor: '#1e2330' }}>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#4a5568' }}>
          The Chain — Click Any Domino for Details
        </p>
        <p className="text-xs mb-5" style={{ color: '#2d3748' }}>
          Fallen = triggered · Tipping = in progress · Standing = monitoring
        </p>
        <div className="flex flex-wrap gap-2 items-end">
          {dominoes.map((domino, i) => (
            <div key={domino.id} className="flex items-end gap-1">
              <DominoCard
                domino={domino}
                isActive={activeDomino?.id === domino.id}
                onClick={() => handleClick(domino)}
              />
              {i < dominoes.length - 1 && (
                <ChevronRight size={11} style={{ color: '#2d3748', marginBottom: '42px', flexShrink: 0 }} />
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
                    <p className="text-xs" style={{ color: '#8892a4' }}>
                      {String(d.id).padStart(2, '0')} — {d.title}
                      {d.accelerator && ' ▲'}
                      {d.fragile && ' ⚠️'}
                    </p>
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
