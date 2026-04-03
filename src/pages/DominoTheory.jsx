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
    accelerator: false,
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
    ],
    triggerCondition: 'BOJ rate hike OR yield curve control failure',
    status: 'in_progress',
    adminNotes: 'BOJ held at 0.1% — surprise hold. 10Y yield at 0.84% and rising. YCC under pressure.',
    fragile: false,
    accelerator: false,
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
      'USD/JPY sharp movement',
      'Global volatility spikes (VIX)',
      'Bond and equity sudden selling',
      'Hedge fund deleveraging signals',
    ],
    triggerCondition: 'Strong yen appreciation combined with broad market sell-off',
    status: 'in_progress',
    adminNotes: 'USD/JPY at 153.4 — yen weak but carry trade active. BOJ surprise hike would trigger rapid unwind.',
    fragile: false,
    accelerator: false,
  },
  {
    id: 4,
    title: 'U.S. Treasury Stress',
    shortTitle: 'Treasury',
    color: '#8b5cf6',
    pips: [2, 6],
    confidence: 34,
    description: 'Foreign holders sell Treasuries, creating instability in the world\'s largest bond market.',
    whatToWatch: [
      'Treasury yields (10Y, 30Y) rapid spike',
      'Weak bond auction demand',
      'Bid-to-cover ratios declining',
      'Repo market stress signals',
    ],
    triggerCondition: 'Rapid yield spike combined with weak Treasury auction demand',
    status: 'not_started',
    adminNotes: 'Treasury market functioning normally. Auctions stable. Critical domino to watch.',
    fragile: false,
    accelerator: false,
  },
  {
    id: 5,
    title: 'Stablecoin Absorption',
    shortTitle: 'Stablecoins',
    color: '#06b6d4',
    pips: [1, 5],
    confidence: 28,
    description: 'Stablecoins absorb Treasury supply and support the system, creating a new digital dollar demand layer.',
    whatToWatch: [
      'Stablecoin market cap growth',
      'U.S. stablecoin regulatory bills',
      'Treasury demand via digital dollars',
      'USDT and USDC reserve compositions',
    ],
    triggerCondition: 'Large-scale stablecoin issuance explicitly tied to U.S. Treasury support',
    status: 'not_started',
    adminNotes: 'Stablecoin bills progressing in Senate. USDT at $110B market cap. Early stage — monitoring.',
    fragile: false,
    accelerator: false,
  },
  {
    id: 6,
    title: 'ETF Liquidity Stress',
    shortTitle: 'ETF Stress',
    color: '#eab308',
    pips: [3, 4],
    confidence: 82,
    description: 'ETFs and passive vehicles experience outflows and forced selling as liquidity tightens globally.',
    whatToWatch: [
      'Bitcoin ETF net inflows/outflows',
      'Total ETF AUM changes daily',
      'Redemption spikes across asset classes',
      'Forced selling cascade signals',
    ],
    triggerCondition: 'Large sustained ETF outflows combined with forced asset selling',
    status: 'in_progress',
    adminNotes: 'BTC ETF flows positive but slowing. Traditional ETF redemptions elevated. Late-stage accelerator.',
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
    description: 'Institutions sell liquid assets to raise cash — a global margin call across BTC, gold, and equities.',
    whatToWatch: [
      'BTC rapid drawdowns (20%+ moves)',
      'Gold and silver sudden sell-offs',
      'Equity market broad declines',
      'Multi-asset simultaneous selling',
    ],
    triggerCondition: 'Broad multi-asset sell-off across crypto, equities, and commodities simultaneously',
    status: 'not_started',
    adminNotes: 'BTC at $67,420. Equities elevated. No liquidation cascade signals yet.',
    fragile: false,
    accelerator: false,
  },
  {
    id: 8,
    title: 'Tether Instability',
    shortTitle: 'USDT Risk',
    color: '#f87171',
    pips: [2, 3],
    confidence: 18,
    description: 'Stablecoins — especially Tether — face pressure or potential de-peg due to severe liquidity stress.',
    whatToWatch: [
      'USDT peg deviations (watch for $0.99 or below)',
      'Stablecoin outflows from exchanges',
      'Tether redemption pressure',
      'Regulatory action against issuers',
    ],
    triggerCondition: 'De-peg event OR severe instability signals from major stablecoin issuers',
    status: 'not_started',
    adminNotes: 'USDT stable at $1.00. No peg stress. High-risk if triggered — systemic contagion risk.',
    fragile: true,
    accelerator: false,
  },
  {
    id: 9,
    title: 'XRP Liquidity Bridge',
    shortTitle: 'XRP Wins',
    color: '#10b981',
    pips: [4, 6],
    confidence: 45,
    description: 'XRP emerges as the neutral bridge asset for real-time global liquidity and cross-border settlement.',
    whatToWatch: [
      'XRP ODL volume spikes',
      'Institutional adoption signals',
      'Central bank XRP integration news',
      'XRP ETF approval and inflows',
    ],
    triggerCondition: 'Major institutional adoption event combined with global liquidity demand requiring bridge asset',
    status: 'not_started',
    adminNotes: 'The final domino. XRP positioned. ODL volume growing. ETF filings active.',
    fragile: false,
    accelerator: false,
  },
]

const statusConfig = {
  triggered: { label: 'Fallen', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  in_progress: { label: 'Tipping', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  not_started: { label: 'Standing', color: '#6b7280', bg: 'rgba(75,85,99,0.2)' },
}

const pipPositions = {
  1: [[50, 50]],
  2: [[32, 28], [68, 72]],
  3: [[32, 22], [50, 50], [68, 78]],
  4: [[32, 25], [68, 25], [32, 75], [68, 75]],
  5: [[32, 22], [68, 22], [50, 50], [32, 78], [68, 78]],
  6: [[32, 18], [68, 18], [32, 50], [68, 50], [32, 82], [68, 82]],
}

function PipSVG({ count, color }) {
  const positions = pipPositions[Math.min(count, 6)] || []
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100">
      {positions.map((pos, i) => (
        <circle key={i} cx={pos[0]} cy={pos[1]} r="8.5" fill={color} opacity="0.9" />
      ))}
    </svg>
  )
}

function DominoPiece({ domino, isActive, onClick }) {
  const isFallen = domino.status === 'triggered'
  const isTipping = domino.status === 'in_progress'

  const pipColor = isActive ? 'white' : domino.color
  const bg = isActive ? domino.color : '#12161f'
  const border = isActive ? domino.color : domino.color + '60'

  // 3D perspective transforms:
  // Standing: upright
  // Tipping: rotates backward slightly (rotateX negative = tips away from viewer)
  // Fallen: fully laid back flat (rotateX -90deg = flat on ground away from viewer)
  const perspectiveTransform = isFallen
    ? 'perspective(300px) rotateX(-82deg)'
    : isTipping
    ? 'perspective(300px) rotateX(-28deg)'
    : 'perspective(300px) rotateX(0deg)'

  // When fallen, the piece appears squished/flat — scale Y to simulate lying flat
  const scaleY = isFallen ? 0.18 : isTipping ? 0.75 : 1

  // Opacity: fallen pieces are dimmer (they've already fallen)
  const opacity = isFallen ? 0.65 : 1

  // Animation
  const animation = isTipping && !isActive
    ? 'rockingBack 2.8s ease-in-out infinite'
    : domino.fragile && !isFallen && !isTipping && !isActive
    ? 'fragileGlow 2s ease-in-out infinite'
    : 'none'

  return (
    <button
      onClick={onClick}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'block' }}
    >
      {/* Container with perspective */}
      <div style={{
        width: '60px',
        height: '106px',
        position: 'relative',
        transformStyle: 'preserve-3d',
      }}>
        {/* The domino tile */}
        <div style={{
          width: '60px',
          height: '106px',
          background: bg,
          border: `2px solid ${border}`,
          borderRadius: '8px',
          position: 'absolute',
          top: 0,
          left: 0,
          transform: perspectiveTransform,
          transformOrigin: 'bottom center',
          transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s, background 0.2s',
          opacity,
          animation,
          boxShadow: isActive
            ? `0 0 18px ${domino.color}55`
            : isFallen
            ? `0 8px 20px rgba(0,0,0,0.7)`
            : isTipping
            ? `0 4px 14px rgba(0,0,0,0.5)`
            : `0 2px 8px rgba(0,0,0,0.3)`,
          overflow: 'hidden',
        }}>
          {/* Color strip top */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: domino.color,
            boxShadow: domino.status !== 'not_started' ? `0 0 6px ${domino.color}` : 'none',
          }} />

          {/* Number */}
          <div style={{
            position: 'absolute', top: '5px', left: '5px',
            fontSize: '8px', fontFamily: 'JetBrains Mono', fontWeight: 700,
            color: isActive ? 'rgba(255,255,255,0.7)' : domino.color + '99',
          }}>
            {String(domino.id).padStart(2, '0')}
          </div>

          {/* Badges */}
          {domino.accelerator && (
            <div style={{ position: 'absolute', top: '4px', right: '4px', fontSize: '8px', color: '#eab308' }}>▲</div>
          )}
          {domino.fragile && (
            <div style={{ position: 'absolute', top: '4px', right: '4px', fontSize: '8px' }}>⚠️</div>
          )}

          {/* Top pips */}
          <div style={{ height: '47%', padding: '12px 7px 3px 7px' }}>
            <PipSVG count={domino.pips[0]} color={pipColor} />
          </div>

          {/* Divider */}
          <div style={{
            height: '2px', margin: '0 7px',
            background: isActive ? 'rgba(255,255,255,0.2)' : domino.color + '30',
          }} />

          {/* Bottom pips */}
          <div style={{ height: '47%', padding: '3px 7px 7px 7px' }}>
            <PipSVG count={domino.pips[1]} color={pipColor} />
          </div>
        </div>

        {/* Ground shadow — only when fallen or tipping */}
        {(isFallen || isTipping) && (
          <div style={{
            position: 'absolute',
            bottom: isFallen ? '-2px' : '-4px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: isFallen ? '58px' : '40px',
            height: isFallen ? '10px' : '6px',
            background: `radial-gradient(ellipse, ${domino.color}${isFallen ? '45' : '25'} 0%, transparent 70%)`,
            borderRadius: '50%',
            transition: 'all 0.6s',
          }} />
        )}
      </div>
    </button>
  )
}

function DominoCard({ domino, isActive, onClick }) {
  const s = statusConfig[domino.status]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '72px' }}>
      <DominoPiece domino={domino} isActive={isActive} onClick={onClick} />

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%', background: s.color,
          boxShadow: domino.status !== 'not_started' ? `0 0 5px ${s.color}` : 'none',
          flexShrink: 0,
        }} />
        <span style={{ fontSize: '9px', color: s.color, fontWeight: 600 }}>{s.label}</span>
      </div>

      {/* Title */}
      <p style={{
        fontSize: '9px',
        color: isActive ? domino.color : '#5a6375',
        fontWeight: isActive ? 600 : 400,
        textAlign: 'center',
        lineHeight: 1.3,
        margin: 0,
      }}>
        {domino.shortTitle}
      </p>

      {/* Confidence bar */}
      <div style={{ width: '56px', height: '3px', background: '#1e2330', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${domino.confidence}%`,
          background: domino.color,
          borderRadius: '2px',
          transition: 'width 0.5s',
        }} />
      </div>
      <span style={{ fontSize: '8px', color: '#3a4252' }}>{domino.confidence}%</span>
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
            {domino.accelerator && <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308' }}>▲ Accelerator</span>}
            {domino.fragile && <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171' }}>⚠️ Fragile</span>}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
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
          <div className="rounded-lg p-3 text-sm mb-3" style={{ background: `${domino.color}08`, border: `1px solid ${domino.color}25`, color: '#8892a4' }}>
            {domino.adminNotes}
          </div>
          <div>
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
        @keyframes rockingBack {
          0%   { transform: perspective(300px) rotateX(-28deg); }
          35%  { transform: perspective(300px) rotateX(-18deg); }
          65%  { transform: perspective(300px) rotateX(-36deg); }
          100% { transform: perspective(300px) rotateX(-28deg); }
        }
        @keyframes fragileGlow {
          0%   { box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
          50%  { box-shadow: 0 0 16px rgba(248,113,113,0.5), 0 2px 8px rgba(0,0,0,0.3); }
          100% { box-shadow: 0 2px 8px rgba(0,0,0,0.3); }
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
          A macro-economic chain reaction framework. Fallen dominoes have triggered. Tipping dominoes are in progress. For informational purposes only.
        </p>
      </div>

      {/* Progress bar */}
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
          <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg, #ef4444, #f59e0b)', borderRadius: '9999px', transition: 'width 0.5s' }} />
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
        <p className="text-xs mb-6" style={{ color: '#3a4252' }}>
          Flat = fallen · Leaning back = tipping · Upright = standing
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-end' }}>
          {dominoes.map((domino, i) => (
            <div key={domino.id} style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
              <DominoCard
                domino={domino}
                isActive={activeDomino?.id === domino.id}
                onClick={() => handleClick(domino)}
              />
              {i < dominoes.length - 1 && (
                <ChevronRight size={10} style={{ color: '#2a3040', marginBottom: '38px', flexShrink: 0 }} />
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
                      {d.accelerator ? ' ▲' : ''}
                      {d.fragile ? ' ⚠️' : ''}
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
