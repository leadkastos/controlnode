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
    whatToWatch: ['Brent Crude — watch for 10-20%+ rapid spike', 'WTI Crude price movement', 'Middle East conflict and supply disruptions', 'Strait of Hormuz risk', 'OPEC+ emergency decisions'],
    triggerCondition: 'Rapid spike in oil prices of 10–20%+ in a short time period',
    status: 'triggered',
    adminNotes: 'Brent Crude at $87.40 — elevated. Middle East tensions elevated. Monitor closely.',
    fragile: false, accelerator: false,
  },
  {
    id: 2,
    title: 'Japan Rate & Yield Break',
    shortTitle: 'BOJ Hike',
    color: '#f97316',
    pips: [1, 3],
    confidence: 58,
    description: 'Bank of Japan is forced to shift policy due to inflation pressure, breaking decades of ultra-loose monetary policy.',
    whatToWatch: ['BOJ rate decisions and emergency meetings', 'Japanese 10Y and 30Y bond yields', 'Yield Curve Control (YCC) signals', 'Japan CPI inflation data'],
    triggerCondition: 'BOJ rate hike OR yield curve control failure',
    status: 'in_progress',
    adminNotes: 'BOJ held at 0.1% — surprise hold. 10Y yield at 0.84% and rising.',
    fragile: false, accelerator: false,
  },
  {
    id: 3,
    title: 'Yen Carry Trade Unwind',
    shortTitle: 'Carry Trade',
    color: '#f59e0b',
    pips: [3, 5],
    confidence: 51,
    description: 'Global leveraged positions funded by cheap yen begin unwinding, triggering cascading asset sales worldwide.',
    whatToWatch: ['USD/JPY sharp movement', 'Global volatility spikes (VIX)', 'Bond and equity sudden selling', 'Hedge fund deleveraging signals'],
    triggerCondition: 'Strong yen appreciation combined with broad market sell-off',
    status: 'in_progress',
    adminNotes: 'USD/JPY at 153.4 — yen weak but carry trade active. BOJ surprise hike would trigger rapid unwind.',
    fragile: false, accelerator: false,
  },
  {
    id: 4,
    title: 'U.S. Treasury Stress',
    shortTitle: 'Treasury',
    color: '#8b5cf6',
    pips: [2, 6],
    confidence: 34,
    description: 'Foreign holders sell Treasuries, creating instability in the world\'s largest bond market.',
    whatToWatch: ['Treasury yields (10Y, 30Y) rapid spike', 'Weak bond auction demand', 'Bid-to-cover ratios declining', 'Repo market stress signals'],
    triggerCondition: 'Rapid yield spike combined with weak Treasury auction demand',
    status: 'not_started',
    adminNotes: 'Treasury market functioning normally. Auctions stable. Critical domino to watch.',
    fragile: false, accelerator: false,
  },
  {
    id: 5,
    title: 'Stablecoin Absorption',
    shortTitle: 'Stablecoins',
    color: '#06b6d4',
    pips: [1, 5],
    confidence: 28,
    description: 'Stablecoins absorb Treasury supply and support the system, creating a new digital dollar demand layer.',
    whatToWatch: ['Stablecoin market cap growth', 'U.S. stablecoin regulatory bills', 'Treasury demand via digital dollars', 'USDT and USDC reserve compositions'],
    triggerCondition: 'Large-scale stablecoin issuance explicitly tied to U.S. Treasury support',
    status: 'not_started',
    adminNotes: 'Stablecoin bills progressing in Senate. USDT at $110B market cap. Early stage.',
    fragile: false, accelerator: false,
  },
  {
    id: 6,
    title: 'ETF Liquidity Stress',
    shortTitle: 'ETF Stress',
    color: '#eab308',
    pips: [3, 4],
    confidence: 82,
    description: 'ETFs and passive vehicles experience outflows and forced selling as liquidity tightens globally.',
    whatToWatch: ['Bitcoin ETF net inflows/outflows', 'Total ETF AUM changes daily', 'Redemption spikes across asset classes', 'Forced selling cascade signals'],
    triggerCondition: 'Large sustained ETF outflows combined with forced asset selling',
    status: 'in_progress',
    adminNotes: 'BTC ETF flows positive but slowing. Traditional ETF redemptions elevated. Late-stage accelerator.',
    fragile: false, accelerator: true,
  },
  {
    id: 7,
    title: 'Global Asset Liquidation',
    shortTitle: 'Liquidation',
    color: '#ec4899',
    pips: [4, 5],
    confidence: 22,
    description: 'Institutions sell liquid assets to raise cash — a global margin call across BTC, gold, and equities.',
    whatToWatch: ['BTC rapid drawdowns (20%+ moves)', 'Gold and silver sudden sell-offs', 'Equity market broad declines', 'Multi-asset simultaneous selling'],
    triggerCondition: 'Broad multi-asset sell-off across crypto, equities, and commodities simultaneously',
    status: 'not_started',
    adminNotes: 'BTC at $67,420. Equities elevated. No liquidation cascade signals yet.',
    fragile: false, accelerator: false,
  },
  {
    id: 8,
    title: 'Tether Instability',
    shortTitle: 'USDT Risk',
    color: '#f87171',
    pips: [2, 3],
    confidence: 18,
    description: 'Stablecoins — especially Tether — face pressure or potential de-peg due to severe liquidity stress.',
    whatToWatch: ['USDT peg deviations (watch for $0.99 or below)', 'Stablecoin outflows from exchanges', 'Tether redemption pressure', 'Regulatory action against issuers'],
    triggerCondition: 'De-peg event OR severe instability signals from major stablecoin issuers',
    status: 'not_started',
    adminNotes: 'USDT stable at $1.00. No peg stress. High-risk if triggered — systemic contagion risk.',
    fragile: true, accelerator: false,
  },
  {
    id: 9,
    title: 'XRP Liquidity Bridge',
    shortTitle: 'XRP Wins',
    color: '#10b981',
    pips: [4, 6],
    confidence: 45,
    description: 'XRP emerges as the neutral bridge asset for real-time global liquidity and cross-border settlement.',
    whatToWatch: ['XRP ODL volume spikes', 'Institutional adoption signals', 'Central bank XRP integration news', 'XRP ETF approval and inflows'],
    triggerCondition: 'Major institutional adoption event combined with global liquidity demand requiring bridge asset',
    status: 'not_started',
    adminNotes: 'The final domino. XRP positioned. ODL volume growing. ETF filings active.',
    fragile: false, accelerator: false,
  },
]

const statusConfig = {
  triggered: { label: 'Fallen', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  in_progress: { label: 'Tipping', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  not_started: { label: 'Standing', color: '#6b7280', bg: 'rgba(75,85,99,0.2)' },
}

const pipPos = {
  1: [[50,50]],
  2: [[30,28],[70,72]],
  3: [[30,22],[50,50],[70,78]],
  4: [[30,25],[70,25],[30,75],[70,75]],
  5: [[30,22],[70,22],[50,50],[30,78],[70,78]],
  6: [[30,18],[70,18],[30,50],[70,50],[30,82],[70,82]],
}

// STANDING domino — tall rectangle with pips
function StandingDomino({ domino, isActive }) {
  const W = 52, H = 96
  const pipColor = isActive ? 'white' : domino.color
  const bg = isActive ? domino.color : '#12161f'
  const border = isActive ? domino.color : domino.color + '70'
  const topPips = pipPos[domino.pips[0]] || []
  const botPips = pipPos[domino.pips[1]] || []

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {/* Shadow */}
      <ellipse cx={W/2} cy={H-2} rx={W*0.45} ry={4} fill="rgba(0,0,0,0.4)" />
      {/* Body */}
      <rect x={1} y={1} width={W-2} height={H-6} rx={6} fill={bg} stroke={border} strokeWidth={2}/>
      {/* Top color strip */}
      <rect x={3} y={3} width={W-6} height={3} rx={1.5} fill={domino.color} opacity={0.9}/>
      {/* Number */}
      <text x={4} y={13} fontSize={7} fontWeight="700" fill={domino.color} opacity={0.7} fontFamily="monospace">
        {String(domino.id).padStart(2,'0')}
      </text>
      {/* Divider */}
      <line x1={6} y1={H/2-3} x2={W-6} y2={H/2-3} stroke={domino.color} strokeWidth={1} opacity={0.3}/>
      {/* Top half pips */}
      {topPips.map((p,i) => (
        <circle key={i}
          cx={6 + (p[0]/100)*(W-12)}
          cy={16 + (p[1]/100)*(H/2-22)}
          r={3.5} fill={pipColor} opacity={0.9}/>
      ))}
      {/* Bottom half pips */}
      {botPips.map((p,i) => (
        <circle key={i}
          cx={6 + (p[0]/100)*(W-12)}
          cy={H/2 + (p[1]/100)*(H/2-22)}
          r={3.5} fill={pipColor} opacity={0.9}/>
      ))}
      {/* Accelerator badge */}
      {domino.accelerator && (
        <text x={W-10} y={13} fontSize={8} fill="#eab308" fontWeight="700">▲</text>
      )}
      {/* Fragile badge */}
      {domino.fragile && (
        <text x={W-12} y={13} fontSize={8} fill="#f87171">⚠</text>
      )}
    </svg>
  )
}

// TIPPING domino — same shape but rotated ~20deg, with amber glow
function TippingDomino({ domino, isActive }) {
  const W = 52, H = 96
  const pipColor = isActive ? 'white' : domino.color
  const bg = isActive ? domino.color : '#12161f'
  const border = isActive ? domino.color : domino.color + '70'
  const topPips = pipPos[domino.pips[0]] || []
  const botPips = pipPos[domino.pips[1]] || []
  // Tilt: rotate around bottom center
  const cx = W/2, cy = H-6

  return (
    <svg width={W+20} height={H+10} viewBox={`-10 0 ${W+20} ${H+10}`} style={{ overflow: 'visible' }}>
      <g transform={`rotate(-18, ${cx}, ${cy})`}>
        {/* Glow */}
        <rect x={1} y={1} width={W-2} height={H-6} rx={6}
          fill="none" stroke={domino.color} strokeWidth={6} opacity={0.12}/>
        {/* Body */}
        <rect x={1} y={1} width={W-2} height={H-6} rx={6} fill={bg} stroke={border} strokeWidth={2}/>
        {/* Top strip */}
        <rect x={3} y={3} width={W-6} height={3} rx={1.5} fill={domino.color} opacity={0.9}/>
        {/* Number */}
        <text x={4} y={13} fontSize={7} fontWeight="700" fill={domino.color} opacity={0.7} fontFamily="monospace">
          {String(domino.id).padStart(2,'0')}
        </text>
        {/* Divider */}
        <line x1={6} y1={H/2-3} x2={W-6} y2={H/2-3} stroke={domino.color} strokeWidth={1} opacity={0.3}/>
        {/* Top pips */}
        {topPips.map((p,i) => (
          <circle key={i}
            cx={6 + (p[0]/100)*(W-12)}
            cy={16 + (p[1]/100)*(H/2-22)}
            r={3.5} fill={pipColor} opacity={0.9}/>
        ))}
        {/* Bottom pips */}
        {botPips.map((p,i) => (
          <circle key={i}
            cx={6 + (p[0]/100)*(W-12)}
            cy={H/2 + (p[1]/100)*(H/2-22)}
            r={3.5} fill={pipColor} opacity={0.9}/>
        ))}
        {domino.accelerator && (
          <text x={W-10} y={13} fontSize={8} fill="#eab308" fontWeight="700">▲</text>
        )}
      </g>
      {/* Ground shadow */}
      <ellipse cx={cx+8} cy={H+2} rx={22} ry={4} fill="rgba(0,0,0,0.35)"/>
    </svg>
  )
}

// FALLEN domino — wide flat rectangle lying on ground
function FallenDomino({ domino, isActive }) {
  const W = 96, H = 28
  const pipColor = domino.color
  const bg = '#0d1018'
  const border = domino.color + '60'
  const topPips = pipPos[domino.pips[0]] || []
  const botPips = pipPos[domino.pips[1]] || []

  return (
    <svg width={W} height={H+10} viewBox={`0 0 ${W} ${H+10}`}>
      {/* Shadow beneath */}
      <ellipse cx={W/2} cy={H+6} rx={W*0.48} ry={5} fill={`${domino.color}20`}/>
      {/* Flat body — wide and short */}
      <rect x={1} y={1} width={W-2} height={H-2} rx={5} fill={bg} stroke={border} strokeWidth={1.5} opacity={0.75}/>
      {/* Left color strip (was top) */}
      <rect x={2} y={2} width={3} height={H-4} rx={1.5} fill={domino.color} opacity={0.7}/>
      {/* Center divider (vertical now) */}
      <line x1={W/2} y1={4} x2={W/2} y2={H-4} stroke={domino.color} strokeWidth={1} opacity={0.25}/>
      {/* Left half pips */}
      {topPips.map((p,i) => (
        <circle key={i}
          cx={8 + (p[1]/100)*(W/2-14)}
          cy={4 + (p[0]/100)*(H-10)}
          r={2.8} fill={pipColor} opacity={0.6}/>
      ))}
      {/* Right half pips */}
      {botPips.map((p,i) => (
        <circle key={i}
          cx={W/2+4 + (p[1]/100)*(W/2-14)}
          cy={4 + (p[0]/100)*(H-10)}
          r={2.8} fill={pipColor} opacity={0.6}/>
      ))}
      {/* FALLEN label */}
      <text x={W/2} y={H/2+1} fontSize={6} fill={domino.color} opacity={0.5}
        textAnchor="middle" dominantBaseline="middle" fontWeight="700" fontFamily="monospace" letterSpacing="1">
        FALLEN
      </text>
    </svg>
  )
}

function DominoCard({ domino, isActive, onClick }) {
  const s = statusConfig[domino.status]
  const isFallen = domino.status === 'triggered'
  const isTipping = domino.status === 'in_progress'

  return (
    <button
      onClick={onClick}
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
        width: isFallen ? '100px' : '68px',
        outline: isActive ? `1px solid ${domino.color}40` : 'none',
        borderRadius: '8px', paddingBottom: '4px',
      }}
    >
      {/* The visual domino */}
      <div style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        height: '110px', width: '100%',
        animation: isTipping && !isActive ? 'rockDomino 2.8s ease-in-out infinite' : 'none',
        filter: isActive ? `drop-shadow(0 0 8px ${domino.color}80)` : 'none',
      }}>
        {isFallen && <FallenDomino domino={domino} isActive={isActive} />}
        {isTipping && <TippingDomino domino={domino} isActive={isActive} />}
        {!isFallen && !isTipping && <StandingDomino domino={domino} isActive={isActive} />}
      </div>

      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%', background: s.color, flexShrink: 0,
          boxShadow: domino.status !== 'not_started' ? `0 0 5px ${s.color}` : 'none',
        }}/>
        <span style={{ fontSize: '9px', color: s.color, fontWeight: 600 }}>{s.label}</span>
      </div>

      {/* Title */}
      <p style={{ fontSize: '9px', color: isActive ? domino.color : '#5a6375', fontWeight: isActive ? 600 : 400, textAlign: 'center', lineHeight: 1.3, margin: 0 }}>
        {domino.shortTitle}
      </p>

      {/* Confidence bar */}
      <div style={{ width: '90%', height: '3px', background: '#1e2330', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${domino.confidence}%`, background: domino.color, borderRadius: '2px' }}/>
      </div>
      <span style={{ fontSize: '8px', color: '#3a4252' }}>{domino.confidence}%</span>
    </button>
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
              Domino {String(domino.id).padStart(2,'0')} — {domino.title}
            </h2>
            {domino.accelerator && <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(234,179,8,0.15)', color: '#eab308' }}>▲ Accelerator</span>}
            {domino.fragile && <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: 'rgba(248,113,113,0.15)', color: '#f87171' }}>⚠️ Fragile</span>}
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: s.bg, color: s.color }}>{s.label}</span>
            <span className="text-xs" style={{ color: '#4a5568' }}>Confidence: <span style={{ color: domino.color, fontWeight: 600 }}>{domino.confidence}%</span></span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10" style={{ color: '#8892a4' }}><X size={15}/></button>
      </div>
      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#4a5568' }}>What This Means</p>
          <p className="text-sm leading-relaxed" style={{ color: '#8892a4' }}>{domino.description}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#4a5568' }}>Trigger Condition</p>
          <div className="rounded-lg p-3 text-sm" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', color: '#8892a4' }}>
            <AlertTriangle size={11} className="inline mr-1.5" style={{ color: '#ef4444' }}/>
            {domino.triggerCondition}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#4a5568' }}>What to Watch</p>
          <div className="space-y-1.5">
            {domino.whatToWatch.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: domino.color }}/>
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
          <div className="flex justify-between mb-1">
            <span className="text-xs" style={{ color: '#4a5568' }}>Trigger Confidence</span>
            <span className="text-xs font-semibold" style={{ color: domino.color }}>{domino.confidence}%</span>
          </div>
          <div style={{ height: '6px', background: '#111318', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${domino.confidence}%`, background: `linear-gradient(90deg, ${domino.color}88, ${domino.color})`, borderRadius: '3px' }}/>
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
        @keyframes rockDomino {
          0%   { transform: rotate(0deg);   }
          30%  { transform: rotate(4deg);   }
          60%  { transform: rotate(-3deg);  }
          100% { transform: rotate(0deg);   }
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
          <div className="flex items-center gap-4 flex-wrap">
            {[{label:'Fallen',count:triggered,color:'#ef4444'},{label:'Tipping',count:inProgress,color:'#f59e0b'},{label:'Standing',count:dominoes.length-progressCount,color:'#4a5568'}].map(g => (
              <div key={g.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: g.color }}/>
                <span className="text-xs" style={{ color: '#8892a4' }}>{g.label} ({g.count})</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: '#111318' }}>
          <div style={{ height: '100%', width: `${progressPct}%`, background: 'linear-gradient(90deg, #ef4444, #f59e0b)', borderRadius: '9999px', transition: 'width 0.5s' }}/>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: '#4a5568' }}>Oil Shock</span>
          <span className="text-xs font-semibold" style={{ color: '#f59e0b' }}>{progressPct}% Active</span>
          <span className="text-xs" style={{ color: '#4a5568' }}>XRP Solution</span>
        </div>
      </div>

      {/* Chain */}
      <div className="rounded-xl p-5 border mb-4" style={{ background: '#161a22', borderColor: '#1e2330' }}>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#4a5568' }}>The Chain — Click Any Domino for Details</p>
        <p className="text-xs mb-5" style={{ color: '#3a4252' }}>Flat & on ground = fallen · Tilted = tipping · Upright = standing</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'flex-end' }}>
          {dominoes.map((domino, i) => (
            <div key={domino.id} style={{ display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
              <DominoCard domino={domino} isActive={activeDomino?.id === domino.id} onClick={() => handleClick(domino)} />
              {i < dominoes.length - 1 && (
                <ChevronRight size={10} style={{ color: '#2a3040', marginBottom: '40px', flexShrink: 0 }}/>
              )}
            </div>
          ))}
        </div>
      </div>

      {activeDomino && <DetailPanel domino={activeDomino} onClose={() => setActiveDomino(null)} />}

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
                    <p className="text-xs" style={{ color: '#8892a4' }}>{String(d.id).padStart(2,'0')} — {d.title}{d.accelerator?' ▲':''}{d.fragile?' ⚠️':''}</p>
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
