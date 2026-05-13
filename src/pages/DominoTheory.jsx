import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { AlertTriangle, X, ChevronRight, MousePointerClick } from 'lucide-react'
import { supabase } from '../lib/supabase'

const TILE_W = 58
const TILE_H = 100

const dominoes = [
  { id:1, title:'Global Oil & Energy Shock', shortTitle:'Oil Shock', color:'#ef4444', pips:[2,4], description:'A sharp rise in oil and energy prices creates global inflation pressure that ripples through every major economy.', whatToWatch:['Brent Crude — watch for 10-20%+ rapid spike','WTI Crude price movement','Middle East conflict and supply disruptions','Strait of Hormuz risk','OPEC+ emergency decisions'], triggerCondition:'Rapid spike in oil prices of 10–20%+ in a short time period', status:'not_started', adminNotes:'', fragile:false, accelerator:false },
  { id:2, title:'Japan Rate & Yield Break', shortTitle:'BOJ Hike', color:'#f97316', pips:[1,3], description:'Bank of Japan is forced to shift policy due to inflation pressure, breaking decades of ultra-loose monetary policy.', whatToWatch:['BOJ rate decisions and emergency meetings','Japanese 10Y and 30Y bond yields','Yield Curve Control (YCC) signals','Japan CPI inflation data'], triggerCondition:'BOJ rate hike OR yield curve control failure', status:'not_started', adminNotes:'', fragile:false, accelerator:false },
  { id:3, title:'Yen Carry Trade Unwind', shortTitle:'Carry Trade', color:'#f59e0b', pips:[3,5], description:'Global leveraged positions funded by cheap yen begin unwinding, triggering cascading asset sales worldwide.', whatToWatch:['USD/JPY sharp movement','Global volatility spikes (VIX)','Bond and equity sudden selling','Hedge fund deleveraging signals'], triggerCondition:'Strong yen appreciation combined with broad market sell-off', status:'not_started', adminNotes:'', fragile:false, accelerator:false },
  { id:4, title:'U.S. Treasury Stress', shortTitle:'Treasury', color:'#8b5cf6', pips:[2,6], description:"Foreign holders sell Treasuries, creating instability in the world's largest bond market.", whatToWatch:['Treasury yields (10Y, 30Y) rapid spike','Weak bond auction demand','Bid-to-cover ratios declining','Repo market stress signals'], triggerCondition:'Rapid yield spike combined with weak Treasury auction demand', status:'not_started', adminNotes:'', fragile:false, accelerator:false },
  { id:5, title:'Stablecoin Absorption', shortTitle:'Stablecoins', color:'#06b6d4', pips:[1,5], description:'Stablecoins absorb Treasury supply and support the system, creating a new digital dollar demand layer.', whatToWatch:['Stablecoin market cap growth','U.S. stablecoin regulatory bills','Treasury demand via digital dollars','USDT and USDC reserve compositions'], triggerCondition:'Large-scale stablecoin issuance explicitly tied to U.S. Treasury support', status:'not_started', adminNotes:'', fragile:false, accelerator:false },
  { id:6, title:'ETF Liquidity Stress', shortTitle:'ETF Stress', color:'#eab308', pips:[3,4], description:'ETFs and passive vehicles experience outflows and forced selling as liquidity tightens globally.', whatToWatch:['Bitcoin ETF net inflows/outflows','Total ETF AUM changes daily','Redemption spikes across asset classes','Forced selling cascade signals'], triggerCondition:'Large sustained ETF outflows combined with forced asset selling', status:'not_started', adminNotes:'', fragile:false, accelerator:true },
  { id:7, title:'Global Asset Liquidation', shortTitle:'Liquidation', color:'#ec4899', pips:[4,5], description:'Institutions sell liquid assets to raise cash — a global margin call across BTC, gold, and equities.', whatToWatch:['BTC rapid drawdowns (20%+ moves)','Gold and silver sudden sell-offs','Equity market broad declines','Multi-asset simultaneous selling'], triggerCondition:'Broad multi-asset sell-off across crypto, equities, and commodities simultaneously', status:'not_started', adminNotes:'', fragile:false, accelerator:false },
  { id:8, title:'Tether Instability', shortTitle:'USDT Risk', color:'#f87171', pips:[2,3], description:'Stablecoins — especially Tether — face pressure or potential de-peg due to severe liquidity stress.', whatToWatch:['USDT peg deviations (watch for $0.99 or below)','Stablecoin outflows from exchanges','Tether redemption pressure','Regulatory action against issuers'], triggerCondition:'De-peg event OR severe instability signals from major stablecoin issuers', status:'not_started', adminNotes:'', fragile:true, accelerator:false },
  { id:9, title:'XRP Liquidity Bridge', shortTitle:'XRP Wins', color:'#10b981', pips:[4,6], description:'XRP emerges as the neutral bridge asset for real-time global liquidity and cross-border settlement.', whatToWatch:['XRP ODL volume spikes','Institutional adoption signals','Central bank XRP integration news','XRP ETF approval and inflows'], triggerCondition:'Major institutional adoption event combined with global liquidity demand requiring bridge asset', status:'not_started', adminNotes:'', fragile:false, accelerator:false },
]

const statusConfig = {
  triggered:  { label:'Fallen',   color:'#ef4444', bg:'rgba(239,68,68,0.15)' },
  in_progress:{ label:'Tipping',  color:'#f59e0b', bg:'rgba(245,158,11,0.15)' },
  not_started:{ label:'Standing', color:'#6b7280', bg:'rgba(75,85,99,0.2)' },
}

const pipPos = {
  1:[[50,50]],
  2:[[30,28],[70,72]],
  3:[[30,22],[50,50],[70,78]],
  4:[[30,25],[70,25],[30,75],[70,75]],
  5:[[30,22],[70,22],[50,50],[30,78],[70,78]],
  6:[[30,18],[70,18],[30,50],[70,50],[30,82],[70,82]],
}

function DominoSVG({ domino, isActive, state }) {
  const W = TILE_W, H = TILE_H
  const isFallen   = state === 'triggered'
  const isTipping  = state === 'in_progress'
  const pipColor = isActive ? 'white' : domino.color
  const bg       = isActive ? domino.color : '#12161f'
  const border   = isActive ? domino.color : domino.color + '70'
  const topPips = pipPos[domino.pips[0]] || []
  const botPips = pipPos[domino.pips[1]] || []
  const cx = W / 2
  const cy = H
  const RW = W - 4, RH = H - 8
  const RX = 2, RY = 4
  const FW = W - 4, FH = 22
  const FX = 2, FY = H - FH - 2

  return (
    <svg width={W} height={H + 14} viewBox={`0 0 ${W} ${H + 14}`} style={{ overflow:'visible' }}>
      <defs>
        <radialGradient id="goldGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ffe066"/>
          <stop offset="50%" stopColor="#d4a017"/>
          <stop offset="100%" stopColor="#7a5200"/>
        </radialGradient>
      </defs>
      {isFallen && (
        <g>
          <ellipse cx={cx} cy={H+10} rx={W*0.5} ry={5} fill={`${domino.color}25`}/>
          <rect x={FX} y={FY} width={FW} height={FH} rx={5} fill="#0a0d14" stroke={domino.color + '50'} strokeWidth={1.5}/>
          <rect x={FX+1} y={FY+1} width={3} height={FH-2} rx={1.5} fill={domino.color} opacity={0.6}/>
          <line x1={cx} y1={FY+3} x2={cx} y2={FY+FH-3} stroke={domino.color} strokeWidth={0.8} opacity={0.2}/>
          {topPips.map(function(p,i) { return <circle key={'t'+i} cx={FX+6 + (p[1]/100)*(FW/2-10)} cy={FY+3 + (p[0]/100)*(FH-6)} r={2} fill={domino.color} opacity={0.35}/> })}
          {botPips.map(function(p,i) { return <circle key={'b'+i} cx={cx+4 + (p[1]/100)*(FW/2-10)} cy={FY+3 + (p[0]/100)*(FH-6)} r={2} fill={domino.color} opacity={0.35}/> })}
          <circle cx={cx} cy={FY + FH/2} r={8} fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth={1.8}/>
          <line x1={cx - 5.5} y1={FY + FH/2 - 5.5} x2={cx + 5.5} y2={FY + FH/2 + 5.5} stroke="#10b981" strokeWidth={1.8} strokeLinecap="round"/>
        </g>
      )}
      {isTipping && (
        <g transform={`rotate(-18, ${cx}, ${cy})`}>
          <rect x={RX-1} y={RY-1} width={RW+2} height={RH+2} rx={7} fill="none" stroke={domino.color} strokeWidth={5} opacity={0.1}/>
          <rect x={RX} y={RY} width={RW} height={RH} rx={6} fill={bg} stroke={border} strokeWidth={2}/>
          <rect x={RX+2} y={RY+2} width={RW-4} height={3} rx={1.5} fill={domino.color} opacity={0.85}/>
          <text x={RX+4} y={RY+13} fontSize={7} fontWeight="700" fill={domino.color} opacity={0.65} fontFamily="monospace">{String(domino.id).padStart(2,'0')}</text>
          <line x1={RX+4} y1={RY+RH/2} x2={RX+RW-4} y2={RY+RH/2} stroke={domino.color} strokeWidth={1} opacity={0.25}/>
          {topPips.map(function(p,i) { return <circle key={'t'+i} cx={RX+5 + (p[0]/100)*(RW-10)} cy={RY+14 + (p[1]/100)*(RH/2-20)} r={3.5} fill={pipColor} opacity={0.9}/> })}
          {botPips.map(function(p,i) { return <circle key={'b'+i} cx={RX+5 + (p[0]/100)*(RW-10)} cy={RY+RH/2+4 + (p[1]/100)*(RH/2-18)} r={3.5} fill={pipColor} opacity={0.9}/> })}
          {domino.accelerator && <text x={RX+RW-10} y={RY+13} fontSize={8} fill="#eab308" fontWeight="700">▲</text>}
        </g>
      )}
      {!isFallen && !isTipping && (
        <g>
          {domino.fragile && <rect x={RX-3} y={RY-3} width={RW+6} height={RH+6} rx={9} fill="none" stroke="#f87171" strokeWidth={2} opacity={0.2} style={{ animation:'fragileRing 2s ease-in-out infinite' }}/>}
          <rect x={RX} y={RY} width={RW} height={RH} rx={6} fill={bg} stroke={border} strokeWidth={2}/>
          <rect x={RX+2} y={RY+2} width={RW-4} height={3} rx={1.5} fill={domino.color} opacity={0.85}/>
          <text x={RX+4} y={RY+13} fontSize={7} fontWeight="700" fill={domino.color} opacity={0.65} fontFamily="monospace">{String(domino.id).padStart(2,'0')}</text>
          {domino.id !== 9 && <line x1={RX+4} y1={RY+RH/2} x2={RX+RW-4} y2={RY+RH/2} stroke={domino.color} strokeWidth={1} opacity={0.25}/>}
          {domino.id === 9 ? (
            <>
              <line x1={RX+4} y1={RY+RH/2} x2={RX+RW-4} y2={RY+RH/2} stroke={domino.color} strokeWidth={1} opacity={0.25}/>
              <circle cx={RX+8} cy={RY+16} r={3} fill={pipColor} opacity={0.8}/>
              <circle cx={RX+RW-8} cy={RY+16} r={3} fill={pipColor} opacity={0.8}/>
              <circle cx={RX+8} cy={RY+RH-10} r={3} fill={pipColor} opacity={0.8}/>
              <circle cx={RX+RW-8} cy={RY+RH-10} r={3} fill={pipColor} opacity={0.8}/>
              <circle cx={RX+RW/2} cy={RY+RH/2} r={16} fill="#92700a" stroke="#f5c842" strokeWidth={1.5}/>
              <circle cx={RX+RW/2} cy={RY+RH/2} r={13} fill="#b8860b" stroke="#ffd700" strokeWidth={0.8} opacity={0.6}/>
              <circle cx={RX+RW/2} cy={RY+RH/2} r={11} fill="url(#goldGrad)"/>
              <line x1={RX+RW/2-5} y1={RY+RH/2-5} x2={RX+RW/2+5} y2={RY+RH/2+5} stroke="#ffd700" strokeWidth={2.5} strokeLinecap="round"/>
              <line x1={RX+RW/2+5} y1={RY+RH/2-5} x2={RX+RW/2-5} y2={RY+RH/2+5} stroke="#ffd700" strokeWidth={2.5} strokeLinecap="round"/>
              <line x1={RX+RW/2-7} y1={RY+RH/2} x2={RX+RW/2-2.5} y2={RY+RH/2} stroke="#92700a" strokeWidth={2.5}/>
              <line x1={RX+RW/2+2.5} y1={RY+RH/2} x2={RX+RW/2+7} y2={RY+RH/2} stroke="#92700a" strokeWidth={2.5}/>
              <ellipse cx={RX+RW/2-3} cy={RY+RH/2-5} rx={4} ry={2} fill="white" opacity={0.15} transform={`rotate(-30,${RX+RW/2-3},${RY+RH/2-5})`}/>
            </>
          ) : (
            <>
              {topPips.map(function(p,i) { return <circle key={'t'+i} cx={RX+5 + (p[0]/100)*(RW-10)} cy={RY+14 + (p[1]/100)*(RH/2-20)} r={3.5} fill={pipColor} opacity={0.9}/> })}
              {botPips.map(function(p,i) { return <circle key={'b'+i} cx={RX+5 + (p[0]/100)*(RW-10)} cy={RY+RH/2+4 + (p[1]/100)*(RH/2-18)} r={3.5} fill={pipColor} opacity={0.9}/> })}
            </>
          )}
        </g>
      )}
    </svg>
  )
}

function DominoCard({ domino, isActive, onClick }) {
  const s = statusConfig[domino.status]
  const isTipping = domino.status === 'in_progress'
  return (
    <button onClick={onClick} style={{ background:'none', border:'none', padding:0, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px', width: (TILE_W + 16) + 'px', borderRadius:'8px', outline: isActive ? `1px solid ${domino.color}50` : 'none', paddingBottom:'4px' }}>
      <div style={{ animation: isTipping && !isActive ? 'rockTile 2.8s ease-in-out infinite' : 'none', filter: isActive ? `drop-shadow(0 0 7px ${domino.color}70)` : 'none', display:'flex', alignItems:'flex-end', justifyContent:'center', height: (TILE_H + 14) + 'px', width:'100%' }}>
        <DominoSVG domino={domino} isActive={isActive} state={domino.status}/>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
        <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:s.color, flexShrink:0, boxShadow: domino.status !== 'not_started' ? `0 0 5px ${s.color}` : 'none' }}/>
        <span style={{ fontSize:'10px', color:s.color, fontWeight:600 }}>{s.label}</span>
      </div>
      <p style={{ fontSize:'11px', color: isActive ? domino.color : '#a0abbe', fontWeight: isActive ? 600 : 500, textAlign:'center', lineHeight:1.3, margin:0 }}>{domino.shortTitle}</p>
    </button>
  )
}

function DetailPanel({ domino, onClose }) {
  const s = statusConfig[domino.status]
  return (
    <div className="rounded-xl border mt-5" style={{ background:'#161a22', borderColor:domino.color+'40' }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ background:`${domino.color}10`, borderBottom:`1px solid ${domino.color}25` }}>
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h2 className="text-base font-bold" style={{ fontFamily:'Syne, sans-serif', color:'#e8eaf0' }}>Domino {String(domino.id).padStart(2,'0')} — {domino.title}</h2>
            {domino.accelerator && <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background:'rgba(234,179,8,0.15)', color:'#eab308' }}>▲ Accelerator</span>}
            {domino.fragile && <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background:'rgba(248,113,113,0.15)', color:'#f87171' }}>⚠️ Fragile</span>}
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background:s.bg, color:s.color }}>{s.label}</span>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10" style={{ color:'#8892a4' }}><X size={15}/></button>
      </div>
      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color:'#4a5568' }}>What This Means</p>
          <p className="text-sm leading-relaxed" style={{ color:'#8892a4' }}>{domino.description}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color:'#4a5568' }}>Trigger Condition</p>
          <div className="rounded-lg p-3 text-sm" style={{ background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.2)', color:'#8892a4' }}>
            <AlertTriangle size={11} className="inline mr-1.5" style={{ color:'#ef4444' }}/>
            {domino.triggerCondition}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color:'#4a5568' }}>What to Watch</p>
          <div className="space-y-1.5">
            {domino.whatToWatch.map(function(item,i) {
              return (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background:domino.color }}/>
                  <p className="text-xs leading-relaxed" style={{ color:'#8892a4' }}>{item}</p>
                </div>
              )
            })}
          </div>
        </div>
        {domino.adminNotes && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color:'#6b7a96' }}>ControlNode Assessment</p>
            <div className="rounded-lg p-3 text-sm" style={{ background:`${domino.color}08`, border:`1px solid ${domino.color}25`, color:'#9aa8be' }}>
              {domino.adminNotes}
            </div>
          </div>
        )}
      </div>
      <div className="px-5 py-3 text-xs text-center" style={{ borderTop:'1px solid #1e2330', color:'#2d3748' }}>
        For informational purposes only — not financial advice
      </div>
    </div>
  )
}

export default function DominoTheory() {
  const [activeDomino, setActiveDomino] = useState(null)
  const [dbStatuses, setDbStatuses] = useState({})
  const [hasClicked, setHasClicked] = useState(false)

  useEffect(function() {
    supabase.from('domino_theory').select('domino_number, status, notes').then(function(res) {
      if (res.data) {
        var map = {}
        res.data.forEach(function(row) {
          map[row.domino_number] = { status: row.status, notes: row.notes }
        })
        setDbStatuses(map)
      }
    })
  }, [])

  var dominoesWithStatus = dominoes.map(function(d) {
    var db = dbStatuses[d.id]
    if (!db) return d
    var statusMap = { 'Standing': 'not_started', 'Tipping': 'in_progress', 'Fallen': 'triggered' }
    return Object.assign({}, d, {
      status: statusMap[db.status] || 'not_started',
      adminNotes: db.notes || d.adminNotes
    })
  })

  const triggered  = dominoesWithStatus.filter(function(d) { return d.status === 'triggered' }).length
  const inProgress = dominoesWithStatus.filter(function(d) { return d.status === 'in_progress' }).length
  const progressCount = triggered + inProgress
  const progressPct   = Math.round((progressCount / dominoes.length) * 100)

  function handleClick(domino) {
    setHasClicked(true)
    setActiveDomino(function(prev) { return prev?.id === domino.id ? null : domino })
  }

  return (
    <AppLayout>
      <style>{`
        @keyframes rockTile { 0%{transform:rotate(0deg)} 30%{transform:rotate(3deg)} 60%{transform:rotate(-2deg)} 100%{transform:rotate(0deg)} }
        @keyframes fragileRing { 0%{opacity:0.1} 50%{opacity:0.4} 100%{opacity:0.1} }
        @keyframes clickPulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.05);opacity:0.85} }
        @keyframes clickGlow { 0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,0.5)} 50%{box-shadow:0 0 0 8px rgba(245,158,11,0)} }
        @keyframes pointerBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(4px)} }
      `}</style>

      <div className="mb-5">
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <h1 className="text-2xl font-bold" style={{ fontFamily:'Syne, sans-serif', color:'#e8eaf0' }}>Domino Theory</h1>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background:'rgba(245,158,11,0.12)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.3)' }}>
            {progressCount} of {dominoes.length} Active
          </span>
        </div>
        <p className="text-sm" style={{ color:'#8892a4' }}>A macro-economic chain reaction framework. Fallen dominoes have triggered. Tipping dominoes are in progress. For informational purposes only.</p>
      </div>

      <div className="rounded-xl p-4 border mb-5" style={{ background:'#161a22', borderColor:'#1e2330' }}>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color:'#7a8599' }}>Chain Reaction Progress</p>
          <div className="flex items-center gap-4 flex-wrap">
            {[{label:'Fallen',count:triggered,color:'#ef4444'},{label:'Tipping',count:inProgress,color:'#f59e0b'},{label:'Standing',count:dominoes.length-progressCount,color:'#4a5568'}].map(function(g) {
              return (
                <div key={g.label} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background:g.color }}/>
                  <span className="text-xs" style={{ color:'#8892a4' }}>{g.label} ({g.count})</span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background:'#111318' }}>
          <div style={{ height:'100%', width:`${progressPct}%`, background:'linear-gradient(90deg,#ef4444,#f59e0b)', borderRadius:'9999px', transition:'width 0.5s' }}/>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color:'#4a5568' }}>Oil Shock</span>
          <span className="text-xs font-semibold" style={{ color:'#f59e0b' }}>{progressPct}% Active</span>
          <span className="text-xs" style={{ color:'#4a5568' }}>XRP Solution</span>
        </div>
      </div>

      {/* PROMINENT CLICK INSTRUCTION BANNER */}
      {!hasClicked && (
        <div
          className="rounded-xl p-4 mb-4 flex items-center justify-center gap-3 flex-wrap"
          style={{
            background:'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(239,68,68,0.12))',
            border:'2px solid rgba(245,158,11,0.5)',
            animation:'clickGlow 2s ease-in-out infinite'
          }}
        >
          <div style={{ animation:'pointerBounce 1.4s ease-in-out infinite' }}>
            <MousePointerClick size={22} style={{ color:'#f59e0b' }}/>
          </div>
          <p className="text-sm font-bold text-center" style={{ color:'#fbbf24', fontFamily:'Syne, sans-serif', letterSpacing:'0.3px' }}>
            👇 CLICK ANY DOMINO BELOW TO SEE THE FULL BREAKDOWN
          </p>
          <div style={{ animation:'pointerBounce 1.4s ease-in-out infinite' }}>
            <MousePointerClick size={22} style={{ color:'#f59e0b' }}/>
          </div>
        </div>
      )}

      <div className="rounded-xl p-5 border mb-4" style={{ background:'#161a22', borderColor:'#1e2330' }}>
        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color:'#7a8599' }}>The Chain</p>
        <p className="text-xs mb-5" style={{ color:'#6b7a96' }}>⊘ = fallen (triggered) · Tilted = tipping · Upright = standing</p>
        <div style={{ display:'flex', flexWrap:'wrap', gap:'16px', alignItems:'flex-end' }}>
          {dominoesWithStatus.map(function(domino,i) {
            return (
              <div key={domino.id} style={{ display:'flex', alignItems:'flex-end', gap:'4px' }}>
                <div style={{ animation: !hasClicked ? 'clickPulse 2s ease-in-out infinite' : 'none' }}>
                  <DominoCard domino={domino} isActive={activeDomino?.id===domino.id} onClick={function() { handleClick(domino) }}/>
                </div>
                {i < dominoes.length-1 && <ChevronRight size={10} style={{ color:'#2a3040', marginBottom:'40px', flexShrink:0 }}/>}
              </div>
            )
          })}
        </div>
      </div>

      {activeDomino && <DetailPanel domino={activeDomino} onClose={function() { setActiveDomino(null) }}/>}

      {!activeDomino && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label:'Fallen Dominoes',      items:dominoesWithStatus.filter(function(d) { return d.status==='triggered' }),  color:'#ef4444', bg:'rgba(239,68,68,0.07)',  border:'rgba(239,68,68,0.2)' },
            { label:'Tipping Dominoes',     items:dominoesWithStatus.filter(function(d) { return d.status==='in_progress' }),color:'#f59e0b', bg:'rgba(245,158,11,0.07)', border:'rgba(245,158,11,0.2)' },
            { label:'Standing — Monitoring',items:dominoesWithStatus.filter(function(d) { return d.status==='not_started' }),color:'#6b7280', bg:'rgba(75,85,99,0.1)',    border:'rgba(75,85,99,0.2)' },
          ].map(function(group) {
            return (
              <div key={group.label} className="rounded-xl p-4 border" style={{ background:group.bg, borderColor:group.border }}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color:group.color }}>{group.label} ({group.items.length})</p>
                <div className="space-y-2">
                  {group.items.map(function(d) {
                    return (
                      <button key={d.id} onClick={function() { handleClick(d) }} className="text-left w-full hover:opacity-80">
                        <p className="text-xs" style={{ color:'#8892a4' }}>{String(d.id).padStart(2,'0')} — {d.title}{d.accelerator?' ▲':''}{d.fragile?' ⚠️':''}</p>
                      </button>
                    )
                  })}
                  {group.items.length===0 && <p className="text-xs" style={{ color:'#2d3748' }}>None yet</p>}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-5 text-center">
        <p className="text-xs" style={{ color:'#2d3748' }}>The Domino Theory is an observational framework for educational purposes only. Not financial advice or a prediction of future events.</p>
      </div>

      <div className="mt-6 rounded-xl border overflow-hidden" style={{ background:'#161a22', borderColor:'#1e2330' }}>
        <div className="px-5 py-4" style={{ borderBottom:'1px solid #1e2330', background:'#111318' }}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-semibold" style={{ fontFamily:'Syne, sans-serif', color:'#eceef5' }}>Learn the Framework — Jake Claver on Domino Theory</p>
              <p className="text-xs mt-1" style={{ color:'#6b7a96' }}>These videos explain the macro chain reaction framework in detail. Highly recommended for understanding the full context behind each domino.</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0" style={{ background:'rgba(239,68,68,0.12)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.2)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              Jake Claver
            </div>
          </div>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title:'The Domino Theory — Full Breakdown', desc:'Jake explains the complete macro chain reaction from oil shock to XRP as the final liquidity solution.', duration:'~45 min', url:'https://www.youtube.com/watch?v=OZsMd-5yDYY&t=6s', tag:'Part 1', tagColor:'#10b981' },
            { title:'Yen Carry Trade & The Global Liquidity Crisis', desc:'Deep dive into how the BOJ rate shift and yen carry trade unwind triggers the broader liquidity crisis.', duration:'~38 min', url:'https://www.youtube.com/watch?v=CRHvvC4vqqs&t=12s', tag:'Part 2', tagColor:'#f59e0b' },
            { title:'Tether, Stablecoins & Treasury Stress Explained', desc:'How stablecoins absorb Treasury supply and what happens when that system faces stress.', duration:'~32 min', url:'https://www.youtube.com/watch?v=UnE9Iz6iLUs&t=13s', tag:'Part 3', tagColor:'#06b6d4' },
            { title:'Why XRP Is the Final Domino', desc:'Jake makes the case for XRP as the neutral bridge asset that emerges when all other dominoes have fallen.', duration:'~41 min', url:'https://www.youtube.com/watch?v=46TUpfxIfww&t=23s', tag:'Part 4', tagColor:'#8b5cf6' },
          ].map(function(video, i) {
            return (
              <a key={i} href={video.url} target="_blank" rel="noopener noreferrer" className="block rounded-xl p-4 transition-all hover:bg-white/5" style={{ background:'#111318', border:'1px solid #1e2330', textDecoration:'none' }} onMouseEnter={function(e) { e.currentTarget.style.borderColor='rgba(239,68,68,0.3)' }} onMouseLeave={function(e) { e.currentTarget.style.borderColor='#1e2330' }}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background:`${video.tagColor}18`, color:video.tagColor }}>{video.tag}</span>
                  <span className="text-xs" style={{ color:'#4a5870' }}>{video.duration}</span>
                </div>
                <p className="text-sm font-semibold mb-1.5 leading-snug" style={{ color:'#eceef5' }}>{video.title}</p>
                <p className="text-xs leading-relaxed mb-3" style={{ color:'#6b7a96' }}>{video.desc}</p>
                <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color:'#ef4444' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  Watch on YouTube →
                </div>
              </a>
            )
          })}
        </div>
        <div className="px-5 py-3" style={{ borderTop:'1px solid #1e2330' }}>
          <p className="text-xs" style={{ color:'#4a5870' }}>Content created by Jake Claver. ControlNode does not own or control this content. Links open YouTube in a new tab. Third-party content for educational reference only.</p>
        </div>
      </div>
    </AppLayout>
  )
}
