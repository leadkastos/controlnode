import React, { useState } from 'react'
import AppLayout from '../components/AppLayout'
import { Badge } from '../components/UI'
import { TrendingUp, TrendingDown, AlertCircle, Building2, BarChart3, Activity } from 'lucide-react'

// --- MOCK DATA ---
const etfs = [
  { name: 'Canary Capital XRP ETF', ticker: 'XRPC', issuer: 'Canary Capital', type: 'spot', aum: 1240000000, xrp_holdings: 536900000, flow_24h: 42000000, flow_7d: 187000000, flow_30d: 412000000, price_change: 3.4, status: 'active' },
  { name: 'Bitwise XRP ETF', ticker: 'XRP', issuer: 'Bitwise', type: 'spot', aum: 980000000, xrp_holdings: 424600000, flow_24h: 28000000, flow_7d: 134000000, flow_30d: 290000000, price_change: 3.2, status: 'active' },
  { name: 'Franklin Templeton XRP ETF', ticker: 'XRPZ', issuer: 'Franklin Templeton', type: 'spot', aum: 760000000, xrp_holdings: 329300000, flow_24h: 19000000, flow_7d: 98000000, flow_30d: 201000000, price_change: 3.1, status: 'active' },
  { name: 'Grayscale XRP ETF', ticker: 'GXRP', issuer: 'Grayscale', type: 'spot', aum: 640000000, xrp_holdings: 277200000, flow_24h: -8000000, flow_7d: 22000000, flow_30d: 88000000, price_change: 2.9, status: 'active' },
  { name: '21Shares XRP ETF', ticker: 'TOXR', issuer: '21Shares', type: 'spot', aum: 420000000, xrp_holdings: 181900000, flow_24h: 11000000, flow_7d: 54000000, flow_30d: 120000000, price_change: 3.3, status: 'active' },
  { name: 'REX-Osprey XRP ETF', ticker: 'XRPR', issuer: 'REX-Osprey', type: 'spot', aum: 310000000, xrp_holdings: 134300000, flow_24h: 6000000, flow_7d: 31000000, flow_30d: 74000000, price_change: 3.0, status: 'active' },
  { name: 'ProShares Ultra XRP ETF', ticker: 'UXRP', issuer: 'ProShares', type: 'futures', aum: 180000000, xrp_holdings: 0, flow_24h: 3000000, flow_7d: 18000000, flow_30d: 42000000, price_change: 6.8, status: 'active' },
]

const pipeline = [
  { issuer: 'BlackRock', status: 'not_filed', importance: 'high', notes: 'Major institutional catalyst if filed. Largest ETF issuer globally.' },
  { issuer: 'Fidelity', status: 'not_filed', importance: 'high', notes: 'Filed for BTC and ETH. XRP filing would signal full crypto suite.' },
  { issuer: 'Invesco', status: 'not_filed', importance: 'medium', notes: 'Active in crypto ETF space. XRP filing considered likely.' },
  { issuer: 'Grayscale', status: 'active', importance: 'high', notes: 'Conversion and product expansion underway.' },
  { issuer: 'Bitwise', status: 'active', importance: 'high', notes: 'Additional XRP products in development.' },
  { issuer: '21Shares', status: 'active', importance: 'medium', notes: 'Expanded offerings filed with SEC.' },
  { issuer: 'Franklin Templeton', status: 'active', importance: 'medium', notes: 'Additional approval applications in progress.' },
  { issuer: 'WisdomTree', status: 'withdrawn', importance: 'low', notes: 'Application withdrawn. May refile.' },
  { issuer: 'CoinShares', status: 'withdrawn', importance: 'low', notes: 'Application withdrawn pending regulatory clarity.' },
]

const flowHistory = {
  '24h': [
    { label: '12AM', inflow: 18, outflow: -4 },
    { label: '4AM', inflow: 12, outflow: -2 },
    { label: '8AM', inflow: 28, outflow: -8 },
    { label: '12PM', inflow: 42, outflow: -6 },
    { label: '4PM', inflow: 35, outflow: -12 },
    { label: '8PM', inflow: 22, outflow: -5 },
  ],
  '7d': [
    { label: 'Mon', inflow: 95, outflow: -22 },
    { label: 'Tue', inflow: 112, outflow: -18 },
    { label: 'Wed', inflow: 87, outflow: -31 },
    { label: 'Thu', inflow: 134, outflow: -15 },
    { label: 'Fri', inflow: 156, outflow: -28 },
    { label: 'Sat', inflow: 68, outflow: -12 },
    { label: 'Sun', inflow: 44, outflow: -8 },
  ],
  '30d': [
    { label: 'W1', inflow: 420, outflow: -88 },
    { label: 'W2', inflow: 510, outflow: -102 },
    { label: 'W3', inflow: 380, outflow: -74 },
    { label: 'W4', inflow: 612, outflow: -120 },
  ],
}

// --- HELPERS ---
function fmt(n) {
  if (Math.abs(n) >= 1e9) return (n / 1e9).toFixed(2) + 'B'
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(0) + 'M'
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(0) + 'K'
  return n.toString()
}

function fmtXRP(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B XRP'
  if (n >= 1e6) return (n / 1e6).toFixed(0) + 'M XRP'
  return n.toString()
}

const totalAUM = etfs.reduce((s, e) => s + e.aum, 0)
const totalXRP = etfs.filter(e => e.type === 'spot').reduce((s, e) => s + e.xrp_holdings, 0)
const net24h = etfs.reduce((s, e) => s + e.flow_24h, 0)
const net7d = etfs.reduce((s, e) => s + e.flow_7d, 0)
const net30d = etfs.reduce((s, e) => s + e.flow_30d, 0)
const activeCount = etfs.length

const pieColors = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4','#ec4899']

// Simple bar chart component
function FlowChart({ data, period }) {
  const maxVal = Math.max(...data.map(d => Math.max(d.inflow, Math.abs(d.outflow))))
  const chartH = 120

  return (
    <div style={{ width: '100%' }}>
      <div className="flex items-end gap-1.5" style={{ height: chartH + 'px', alignItems: 'flex-end' }}>
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
            {/* Inflow bar */}
            <div
              className="w-full rounded-sm"
              style={{
                height: Math.max(4, (d.inflow / maxVal) * (chartH * 0.45)) + 'px',
                background: 'rgba(16,185,129,0.7)',
              }}
              title={`Inflow: $${d.inflow}M`}
            />
            {/* Outflow bar */}
            <div
              className="w-full rounded-sm"
              style={{
                height: Math.max(4, (Math.abs(d.outflow) / maxVal) * (chartH * 0.45)) + 'px',
                background: 'rgba(239,68,68,0.7)',
              }}
              title={`Outflow: $${d.outflow}M`}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 mt-1">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center">
            <span style={{ fontSize: '10px', color: '#4a5568' }}>{d.label}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(16,185,129,0.7)' }} />
          <span style={{ fontSize: '11px', color: '#8892a4' }}>Inflows</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(239,68,68,0.7)' }} />
          <span style={{ fontSize: '11px', color: '#8892a4' }}>Outflows</span>
        </div>
      </div>
    </div>
  )
}

// Simple donut/pie
function PieChart({ etfs }) {
  const spotETFs = etfs.filter(e => e.type === 'spot')
  const total = spotETFs.reduce((s, e) => s + e.aum, 0)
  let cumulative = 0
  const slices = spotETFs.map((e, i) => {
    const pct = e.aum / total
    const start = cumulative
    cumulative += pct
    return { ...e, pct, start, color: pieColors[i] }
  })

  const size = 120
  const r = 45
  const cx = size / 2
  const cy = size / 2

  function polarToCartesian(cx, cy, r, angle) {
    const rad = (angle - 90) * Math.PI / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  function slicePath(start, end) {
    const s = polarToCartesian(cx, cy, r, start * 360)
    const e = polarToCartesian(cx, cy, r, end * 360)
    const large = (end - start) > 0.5 ? 1 : 0
    return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`
  }

  return (
    <div className="flex items-center gap-6 flex-wrap">
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        {slices.map((s, i) => (
          <path key={i} d={slicePath(s.start, s.start + s.pct)} fill={s.color} opacity={0.85} />
        ))}
        <circle cx={cx} cy={cy} r={28} fill="#161a22" />
        <text x={cx} y={cy - 5} textAnchor="middle" fill="#e8eaf0" fontSize="10" fontWeight="600">AUM</text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="#8892a4" fontSize="9">Split</text>
      </svg>
      <div className="space-y-1.5 flex-1">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: s.color }} />
              <span style={{ fontSize: '11px', color: '#8892a4' }}>{s.issuer}</span>
            </div>
            <span style={{ fontSize: '11px', color: '#e8eaf0', fontFamily: 'monospace' }}>
              {(s.pct * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Status badge helper
function StatusBadge({ status }) {
  const map = {
    active: { bg: 'rgba(16,185,129,0.12)', color: '#10b981', label: 'Active' },
    pending: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', label: 'Pending' },
    withdrawn: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', label: 'Withdrawn' },
    not_filed: { bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6', label: 'Not Filed' },
  }
  const s = map[status] || map.pending
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

function ImportanceBadge({ importance }) {
  const map = {
    high: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444' },
    medium: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
    low: { bg: 'rgba(75,85,99,0.2)', color: '#6b7280' },
  }
  const s = map[importance]
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded capitalize" style={{ background: s.bg, color: s.color }}>
      {importance}
    </span>
  )
}

// --- MAIN PAGE ---
export default function ETFFlows() {
  const [flowPeriod, setFlowPeriod] = useState('7d')

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#e8eaf0' }}>
            XRP ETF Intelligence
          </h1>
          <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
            LIVE (MOCK)
          </span>
        </div>
        <p className="text-sm" style={{ color: '#8892a4' }}>
          Institutional Flow & Market Impact Tracker — For informational purposes only
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total ETF AUM', value: '$' + fmt(totalAUM), sub: `${activeCount} active ETFs`, color: '#3b82f6' },
          { label: 'XRP in ETFs', value: fmtXRP(totalXRP), sub: 'Spot ETFs only', color: '#8b5cf6' },
          { label: 'Net Flow 24h', value: (net24h >= 0 ? '+' : '') + '$' + fmt(net24h), sub: 'Combined all ETFs', color: net24h >= 0 ? '#10b981' : '#ef4444' },
          { label: 'Net Flow 7d', value: (net7d >= 0 ? '+' : '') + '$' + fmt(net7d), sub: 'Rolling 7 days', color: net7d >= 0 ? '#10b981' : '#ef4444' },
          { label: 'Net Flow 30d', value: (net30d >= 0 ? '+' : '') + '$' + fmt(net30d), sub: 'Rolling 30 days', color: net30d >= 0 ? '#10b981' : '#ef4444' },
        ].map((k, i) => (
          <div key={i} className="rounded-xl p-4 border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
            <p className="text-xs uppercase tracking-wide mb-2" style={{ color: '#4a5568' }}>{k.label}</p>
            <p className="text-xl font-bold font-mono" style={{ color: k.color }}>{k.value}</p>
            <p className="text-xs mt-1" style={{ color: '#4a5568' }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* ETF Table */}
      <div className="rounded-xl border mb-6 overflow-hidden" style={{ background: '#161a22', borderColor: '#1e2330' }}>
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #1e2330', background: '#111318' }}>
          <h2 className="text-sm font-semibold" style={{ fontFamily: 'Syne, sans-serif', color: '#e8eaf0' }}>
            Active XRP ETFs
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ background: '#3b82f6' }} />
              <span className="text-xs" style={{ color: '#8892a4' }}>Spot</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ background: '#f59e0b' }} />
              <span className="text-xs" style={{ color: '#8892a4' }}>Futures</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e2330' }}>
                {['ETF Name', 'Ticker', 'Type', 'AUM', 'XRP Holdings', 'Inflow 24h', 'Outflow 24h', 'Net 7d', 'Price Chg', 'Status'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#4a5568' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {etfs.map((e, i) => {
                const inflow = e.flow_24h > 0 ? e.flow_24h : 0
                const outflow = e.flow_24h < 0 ? e.flow_24h : 0
                return (
                  <tr
                    key={i}
                    style={{ borderBottom: '1px solid rgba(30,35,48,0.5)' }}
                    className="transition-colors hover:bg-white/5"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-1.5 h-8 rounded-full flex-shrink-0"
                          style={{ background: e.type === 'spot' ? '#3b82f6' : '#f59e0b' }}
                        />
                        <span className="text-sm font-medium" style={{ color: '#e8eaf0' }}>{e.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono font-bold px-2 py-1 rounded" style={{ background: '#111318', color: '#3b82f6' }}>
                        {e.ticker}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded capitalize"
                        style={{
                          background: e.type === 'spot' ? 'rgba(59,130,246,0.12)' : 'rgba(245,158,11,0.12)',
                          color: e.type === 'spot' ? '#3b82f6' : '#f59e0b'
                        }}
                      >
                        {e.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono" style={{ color: '#e8eaf0' }}>${fmt(e.aum)}</td>
                    <td className="px-4 py-3 text-sm font-mono" style={{ color: '#8892a4' }}>
                      {e.type === 'spot' ? fmtXRP(e.xrp_holdings) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      {inflow > 0 ? (
                        <span className="flex items-center gap-1 text-sm font-mono" style={{ color: '#10b981' }}>
                          <TrendingUp size={13} />
                          +${fmt(inflow)}
                        </span>
                      ) : (
                        <span className="text-sm font-mono" style={{ color: '#4a5568' }}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {outflow < 0 ? (
                        <span className="flex items-center gap-1 text-sm font-mono" style={{ color: '#ef4444' }}>
                          <TrendingDown size={13} />
                          ${fmt(outflow)}
                        </span>
                      ) : (
                        <span className="text-sm font-mono" style={{ color: '#4a5568' }}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono" style={{ color: e.flow_7d >= 0 ? '#10b981' : '#ef4444' }}>
                      {e.flow_7d >= 0 ? '+' : ''}${fmt(e.flow_7d)}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono" style={{ color: e.price_change >= 0 ? '#10b981' : '#ef4444' }}>
                      {e.price_change >= 0 ? '+' : ''}{e.price_change}%
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={e.status} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Flow chart */}
        <div className="rounded-xl p-5 border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold" style={{ color: '#e8eaf0' }}>Inflows vs Outflows</h2>
            <div className="flex gap-1">
              {['24h', '7d', '30d'].map(p => (
                <button
                  key={p}
                  onClick={() => setFlowPeriod(p)}
                  className="px-2.5 py-1 rounded text-xs font-medium transition-colors"
                  style={{
                    background: flowPeriod === p ? '#3b82f6' : '#111318',
                    color: flowPeriod === p ? '#fff' : '#8892a4',
                    border: '1px solid ' + (flowPeriod === p ? '#3b82f6' : '#1e2330'),
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <FlowChart data={flowHistory[flowPeriod]} period={flowPeriod} />
          <p className="text-xs mt-3" style={{ color: '#4a5568' }}>
            Values in $M. Green = inflows, Red = outflows.
          </p>
        </div>

        {/* Pie chart */}
        <div className="rounded-xl p-5 border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#e8eaf0' }}>AUM Market Share (Spot ETFs)</h2>
          <PieChart etfs={etfs} />
          <p className="text-xs mt-4" style={{ color: '#4a5568' }}>
            Total Spot AUM: ${fmt(etfs.filter(e => e.type === 'spot').reduce((s, e) => s + e.aum, 0))}
          </p>
        </div>
      </div>

      {/* Market Impact */}
      <div className="rounded-xl p-5 border mb-6" style={{ background: '#161a22', borderColor: '#1e2330' }}>
        <div className="flex items-center gap-2 mb-4">
          <Activity size={16} style={{ color: '#8b5cf6' }} />
          <h2 className="text-sm font-semibold" style={{ color: '#e8eaf0' }}>Market Impact Panel</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {[
            { label: '% XRP Supply in ETFs', value: '3.84%', note: 'Of 100B circulating supply' },
            { label: 'ETF-Driven Volume (24h)', value: '$412M', note: 'vs $4.2B total XRP volume (9.8%)' },
            { label: 'Institutional Participation', value: '~42%', note: 'Estimated of total ETF flows' },
          ].map((m, i) => (
            <div key={i} className="rounded-lg p-4" style={{ background: '#111318', border: '1px solid #1e2330' }}>
              <p className="text-xs uppercase tracking-wide mb-2" style={{ color: '#4a5568' }}>{m.label}</p>
              <p className="text-xl font-bold font-mono" style={{ color: '#8b5cf6' }}>{m.value}</p>
              <p className="text-xs mt-1" style={{ color: '#4a5568' }}>{m.note}</p>
            </div>
          ))}
        </div>

        {/* AI Insight box */}
        <div className="rounded-lg p-4" style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <p className="text-xs font-semibold mb-2" style={{ color: '#3b82f6' }}>ControlNode Insight</p>
          <p className="text-sm leading-relaxed" style={{ color: '#8892a4' }}>
            XRP ETF inflows have increased for 5 consecutive days, with combined net flows of <span style={{ color: '#e8eaf0' }}>${fmt(net7d)}</span> over the past 7 days. Spot ETFs now hold approximately <span style={{ color: '#e8eaf0' }}>{fmtXRP(totalXRP)}</span> — representing 3.84% of circulating supply. Grayscale remains the only ETF showing net outflows in the 24-hour window, consistent with the rotation pattern observed in BTC ETF markets post-launch. Institutional participation is estimated at 42% of total flows, suggesting sustained professional interest rather than retail-driven movement.
          </p>
          <p className="text-xs mt-3 font-semibold" style={{ color: '#4a5568' }}>
            Informational context only — not financial advice.
          </p>
        </div>
      </div>

      {/* Pipeline */}
      <div className="rounded-xl border mb-6 overflow-hidden" style={{ background: '#161a22', borderColor: '#1e2330' }}>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid #1e2330', background: '#111318' }}>
          <div className="flex items-center gap-2">
            <Building2 size={15} style={{ color: '#8b5cf6' }} />
            <h2 className="text-sm font-semibold" style={{ color: '#e8eaf0' }}>ETF Pipeline & Institutional Watchlist</h2>
          </div>
        </div>

        {/* Not Filed — High Priority */}
        <div className="px-5 py-3" style={{ borderBottom: '1px solid #1e2330' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#4a5568' }}>
            Not Yet Filed — High Priority Watch
          </p>
          <div className="space-y-2">
            {pipeline.filter(p => p.status === 'not_filed').map((p, i) => (
              <div key={i} className="flex items-start justify-between gap-3 p-3 rounded-lg" style={{ background: '#111318', border: '1px solid #1e2330' }}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold" style={{ color: '#e8eaf0' }}>{p.issuer}</span>
                    <ImportanceBadge importance={p.importance} />
                  </div>
                  <p className="text-xs" style={{ color: '#8892a4' }}>{p.notes}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Active */}
        <div className="px-5 py-3" style={{ borderBottom: '1px solid #1e2330' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#4a5568' }}>
            Active / Expanding
          </p>
          <div className="space-y-2">
            {pipeline.filter(p => p.status === 'active').map((p, i) => (
              <div key={i} className="flex items-start justify-between gap-3 p-3 rounded-lg" style={{ background: '#111318', border: '1px solid #1e2330' }}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold" style={{ color: '#e8eaf0' }}>{p.issuer}</span>
                    <ImportanceBadge importance={p.importance} />
                  </div>
                  <p className="text-xs" style={{ color: '#8892a4' }}>{p.notes}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Withdrawn */}
        <div className="px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#4a5568' }}>
            Withdrawn
          </p>
          <div className="space-y-2">
            {pipeline.filter(p => p.status === 'withdrawn').map((p, i) => (
              <div key={i} className="flex items-start justify-between gap-3 p-3 rounded-lg" style={{ background: '#111318', border: '1px solid #1e2330', opacity: 0.7 }}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold" style={{ color: '#e8eaf0' }}>{p.issuer}</span>
                    <ImportanceBadge importance={p.importance} />
                  </div>
                  <p className="text-xs" style={{ color: '#8892a4' }}>{p.notes}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-center pb-4">
        <p className="text-xs" style={{ color: '#374151' }}>
          All data shown is mock/illustrative. Live data connected in Phase 2. Not financial advice.
        </p>
      </div>
    </AppLayout>
  )
}
