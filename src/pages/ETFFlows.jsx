import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { Building2, FileText } from 'lucide-react'
import { supabase } from '../lib/supabase'

function fmt(n) {
  if (n === null || n === undefined) return '0'
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(2) + 'B'
  if (Math.abs(n) >= 1) return n.toFixed(0) + 'M'
  return n.toString()
}

function fmtXRP(n) {
  if (n === null || n === undefined) return '0 XRP'
  if (n >= 1000) return (n / 1000).toFixed(2) + 'B XRP'
  if (n >= 1) return n.toFixed(0) + 'M XRP'
  return n.toString() + ' XRP'
}

function getLastUpdated(summary) {
  if (!summary || !summary.updated_at) return null
  var d = new Date(summary.updated_at)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })
}

function FlowBarChart({ summary }) {
  if (!summary) return <p style={{ color: '#6b7a96' }}>No data available.</p>
  var data = [
    { label: '24h', value: summary.net_flow_24h || 0 },
    { label: '7d',  value: summary.net_flow_7d || 0 },
    { label: '30d', value: summary.net_flow_30d || 0 }
  ]
  var maxVal = Math.max.apply(null, data.map(function(d) { return Math.abs(d.value) }))
  if (maxVal === 0) maxVal = 1
  var chartH = 140
  return (
    <div style={{ width: '100%' }}>
      <div className="flex items-end gap-6 justify-around px-4" style={{ height: chartH + 'px' }}>
        {data.map(function(d, i) {
          var isPos = d.value >= 0
          var barH = Math.max(6, (Math.abs(d.value) / maxVal) * (chartH * 0.85))
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end gap-2" style={{ height: '100%' }}>
              <span className="text-xs font-mono font-semibold" style={{ color: isPos ? '#10b981' : '#ef4444' }}>
                {isPos ? '+' : ''}${fmt(d.value)}
              </span>
              <div className="w-full rounded-t-md" style={{ height: barH + 'px', background: isPos ? 'rgba(16,185,129,0.7)' : 'rgba(239,68,68,0.7)', maxWidth: '80px', marginLeft: 'auto', marginRight: 'auto' }} />
            </div>
          )
        })}
      </div>
      <div className="flex gap-6 mt-2 justify-around px-4">
        {data.map(function(d, i) {
          return (
            <div key={i} className="flex-1 text-center">
              <span style={{ fontSize: '11px', color: '#9aa8be', fontWeight: 600 }}>{d.label}</span>
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 justify-center">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(16,185,129,0.7)' }} /><span style={{ fontSize: '11px', color: '#9aa8be' }}>Net Inflow</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(239,68,68,0.7)' }} /><span style={{ fontSize: '11px', color: '#9aa8be' }}>Net Outflow</span></div>
      </div>
    </div>
  )
}

function PieChart({ aumList }) {
  var total = aumList.reduce(function(s, e) { return s + (e.aum || 0) }, 0)
  if (total === 0) return <p style={{ color: '#6b7a96' }}>No AUM data entered yet.</p>
  var cumulative = 0
  var slices = aumList.map(function(e) {
    var pct = (e.aum || 0) / total
    var start = cumulative
    cumulative += pct
    return Object.assign({}, e, { pct: pct, start: start })
  })
  var size = 140
  var r = 55
  var cx = size / 2
  var cy = size / 2
  function polarToCartesian(cx, cy, r, angle) {
    var rad = (angle - 90) * Math.PI / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }
  function slicePath(start, end) {
    if (end - start >= 0.9999) {
      // full circle: render two half-arcs to avoid zero-length path
      var top = polarToCartesian(cx, cy, r, 0)
      var bot = polarToCartesian(cx, cy, r, 180)
      return 'M ' + cx + ' ' + cy + ' L ' + top.x + ' ' + top.y + ' A ' + r + ' ' + r + ' 0 1 1 ' + bot.x + ' ' + bot.y + ' A ' + r + ' ' + r + ' 0 1 1 ' + top.x + ' ' + top.y + ' Z'
    }
    var s = polarToCartesian(cx, cy, r, start * 360)
    var e = polarToCartesian(cx, cy, r, end * 360)
    var large = (end - start) > 0.5 ? 1 : 0
    return 'M ' + cx + ' ' + cy + ' L ' + s.x + ' ' + s.y + ' A ' + r + ' ' + r + ' 0 ' + large + ' 1 ' + e.x + ' ' + e.y + ' Z'
  }
  return (
    <div className="flex items-center gap-6 flex-wrap">
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        {slices.map(function(s, i) { return <path key={i} d={slicePath(s.start, s.start + s.pct)} fill={s.color || '#3b82f6'} opacity={0.9} /> })}
        <circle cx={cx} cy={cy} r={32} fill="#161a22" />
        <text x={cx} y={cy - 5} textAnchor="middle" fill="#e8eaf0" fontSize="11" fontWeight="600">AUM</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fill="#8892a4" fontSize="10">Split</text>
      </svg>
      <div className="space-y-1.5 flex-1 min-w-0">
        {slices.map(function(s, i) {
          return (
            <div key={i} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: s.color || '#3b82f6' }} />
                <span className="truncate" style={{ fontSize: '12px', color: '#9aa8be' }}>{s.etf_name}</span>
              </div>
              <span className="flex-shrink-0" style={{ fontSize: '12px', color: '#eceef5', fontFamily: 'monospace' }}>{(s.pct * 100).toFixed(1)}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  var map = {
    'Not Filed': { bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6' },
    'Filed':     { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
    'Approved':  { bg: 'rgba(16,185,129,0.12)', color: '#10b981' },
    'Rejected':  { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' }
  }
  var s = map[status] || map['Not Filed']
  return <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: s.bg, color: s.color }}>{status || 'Not Filed'}</span>
}

function PriorityBadge({ priority }) {
  var map = {
    'High':   { bg: 'rgba(239,68,68,0.1)',  color: '#ef4444' },
    'Medium': { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
    'Low':    { bg: 'rgba(75,85,99,0.2)',   color: '#6b7280' }
  }
  var s = map[priority] || map['Medium']
  return <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: s.bg, color: s.color }}>{priority || 'Medium'}</span>
}

function EDGARFilingsSection() {
  const [filings, setFilings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    fetch('https://efts.sec.gov/LATEST/search-index?q=%22XRP%22+%22ETF%22&dateRange=custom&startdt=2025-01-01&forms=S-1,19b-4')
      .then(function(r) { return r.json() })
      .then(function(json) {
        if (json && json.hits && json.hits.hits) {
          setFilings(json.hits.hits.slice(0, 8))
        }
        setLoading(false)
      })
      .catch(function() { setLoading(false) })
  }, [])

  return (
    <div className="rounded-xl border mb-6 overflow-hidden" style={{ background: '#161a22', borderColor: '#1e2330' }}>
      <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #1e2330', background: '#111318' }}>
        <FileText size={15} style={{ color: '#10b981' }} />
        <h2 className="text-sm font-semibold" style={{ color: '#eceef5' }}>SEC EDGAR — Live XRP ETF Filing Alerts</h2>
        <span className="text-xs font-semibold px-2 py-0.5 rounded ml-auto" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>LIVE</span>
      </div>
      <div className="px-5 py-4">
        <div className="rounded-lg px-4 py-3 mb-4 text-xs leading-relaxed" style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.15)', color: '#9aa8be' }}>
          <span style={{ color: '#10b981', fontWeight: 600 }}>What is this? </span>
          Live feed of XRP ETF-related filings directly from the SEC EDGAR database. New filings appear here before any news outlet reports them.
        </div>
        {loading ? (
          <p style={{ color: '#6b7a96' }}>Loading SEC filings...</p>
        ) : filings.length === 0 ? (
          <p style={{ color: '#6b7a96' }}>No recent XRP ETF filings found.</p>
        ) : (
          <div className="space-y-2">
            {filings.map(function(f, i) {
              var src = f._source || {}
              return (
                <a href={'https://www.sec.gov/Archives/edgar/full-index/' + (src.file_date || '').replace(/-/g, '/') + '/'} target="_blank" rel="noopener noreferrer" key={i} className="flex items-start justify-between gap-3 py-2.5 block" style={{ borderBottom: '1px solid #1e2330', textDecoration: 'none' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium mb-1" style={{ color: '#eceef5' }}>{src.display_names || src.entity_name || 'Unknown Entity'}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>{src.form_type || 'Filing'}</span>
                      <span className="text-xs" style={{ color: '#6b7a96' }}>{src.file_date || ''}</span>
                      {src.period_of_report && <span className="text-xs" style={{ color: '#6b7a96' }}>Period: {src.period_of_report}</span>}
                    </div>
                  </div>
                  <span className="text-xs flex-shrink-0" style={{ color: '#3b82f6' }}>View →</span>
                </a>
              )
            })}
          </div>
        )}
        <p className="text-xs mt-3" style={{ color: '#6b7a96' }}>Source: SEC EDGAR · Free public data · For informational purposes only.</p>
      </div>
    </div>
  )
}

export default function ETFFlows() {
  const [summary, setSummary] = useState(null)
  const [aumList, setAumList] = useState([])
  const [pipeline, setPipeline] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    async function load() {
      var sum = await supabase.from('etf_summary').select('*').limit(1).single()
      if (sum.data) setSummary(sum.data)

      // AUM list sorted largest to smallest, only active
      var aum = await supabase.from('etf_aum').select('*').eq('active', true).order('aum', { ascending: false })
      if (aum.data) setAumList(aum.data)

      // Pipeline sorted by priority then sort_order
      var pipe = await supabase.from('etf_pipeline').select('*').order('sort_order', { ascending: true })
      if (pipe.data) setPipeline(pipe.data)

      setLoading(false)
    }
    load()
  }, [])

  var lastUpdated = getLastUpdated(summary)
  var totalAumFromList = aumList.reduce(function(s, e) { return s + (e.aum || 0) }, 0)

  var summaryCards = [
    { label: 'Total ETF AUM', value: summary ? '$' + fmt(summary.total_aum) : '—', sub: aumList.length + ' active ETFs', color: '#3b82f6' },
    { label: 'XRP in ETFs',   value: summary ? fmtXRP(summary.xrp_in_etfs) : '—', sub: 'Combined holdings', color: '#8b5cf6' },
    { label: 'Net Flow 24h',  value: summary ? (summary.net_flow_24h >= 0 ? '+' : '') + '$' + fmt(summary.net_flow_24h) : '—', sub: 'Combined all ETFs', color: summary && summary.net_flow_24h >= 0 ? '#10b981' : '#ef4444' },
    { label: 'Net Flow 7d',   value: summary ? (summary.net_flow_7d >= 0 ? '+' : '') + '$' + fmt(summary.net_flow_7d) : '—', sub: 'Rolling 7 days', color: summary && summary.net_flow_7d >= 0 ? '#10b981' : '#ef4444' },
    { label: 'Net Flow 30d',  value: summary ? (summary.net_flow_30d >= 0 ? '+' : '') + '$' + fmt(summary.net_flow_30d) : '—', sub: 'Rolling 30 days', color: summary && summary.net_flow_30d >= 0 ? '#10b981' : '#ef4444' }
  ]

  return (
    <AppLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>XRP ETF Intelligence</h1>
          <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>ADMIN-UPDATED</span>
        </div>
        <p className="text-sm" style={{ color: '#9aa8be' }}>Institutional Flow & Market Impact Tracker — For informational purposes only</p>
      </div>

      <EDGARFilingsSection />

      {/* Five summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {summaryCards.map(function(k, i) {
          return (
            <div key={i} className="rounded-xl p-4 border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
              <p className="text-xs uppercase tracking-wide mb-2" style={{ color: '#6b7a96' }}>{k.label}</p>
              <p className="text-xl font-bold font-mono" style={{ color: k.color }}>{k.value}</p>
              <p className="text-xs mt-1" style={{ color: '#6b7a96' }}>{k.sub}</p>
            </div>
          )
        })}
      </div>

      {lastUpdated && (
        <div className="flex justify-end mb-3">
          <span className="text-xs" style={{ color: '#6b7a96' }}>Last updated: {lastUpdated}</span>
        </div>
      )}

      {/* Inflows vs Outflows + AUM Market Share */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl p-5 border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#eceef5' }}>Inflows vs Outflows</h2>
          {loading ? <p style={{ color: '#6b7a96' }}>Loading...</p> : <FlowBarChart summary={summary} />}
          <p className="text-xs mt-3" style={{ color: '#6b7a96' }}>Values in $M across all XRP ETFs combined.</p>
        </div>
        <div className="rounded-xl p-5 border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#eceef5' }}>AUM Market Share</h2>
          {loading ? <p style={{ color: '#6b7a96' }}>Loading...</p> : <PieChart aumList={aumList} />}
          <p className="text-xs mt-4" style={{ color: '#6b7a96' }}>Total AUM across active ETFs: ${fmt(totalAumFromList)}</p>
        </div>
      </div>

      {/* ETF Pipeline */}
      <div className="rounded-xl border mb-6 overflow-hidden" style={{ background: '#161a22', borderColor: '#1e2330' }}>
        <div className="px-5 py-3" style={{ borderBottom: '1px solid #1e2330', background: '#111318' }}>
          <div className="flex items-center gap-2">
            <Building2 size={15} style={{ color: '#8b5cf6' }} />
            <h2 className="text-sm font-semibold" style={{ color: '#eceef5' }}>ETF Pipeline — High Priority Watch</h2>
          </div>
        </div>
        <div className="px-5 py-4">
          {loading ? (
            <p style={{ color: '#6b7a96' }}>Loading pipeline...</p>
          ) : pipeline.length === 0 ? (
            <p style={{ color: '#6b7a96' }}>No pipeline entries yet.</p>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6b7a96' }}>Watching Closely</p>
              <div className="space-y-2">
                {pipeline.map(function(p, i) {
                  return (
                    <div key={p.id || i} className="flex items-start justify-between gap-3 p-3 rounded-lg" style={{ background: '#111318', border: '1px solid #1e2330' }}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-semibold" style={{ color: '#eceef5' }}>{p.issuer_name}</span>
                          <PriorityBadge priority={p.priority} />
                        </div>
                        {p.notes && <p className="text-xs" style={{ color: '#9aa8be' }}>{p.notes}</p>}
                      </div>
                      <StatusBadge status={p.status} />
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="text-center pb-4">
        <p className="text-xs" style={{ color: '#4a5870' }}>ETF flow data is manually updated by ControlNode admins. SEC EDGAR filings are live. Not financial advice.</p>
      </div>
    </AppLayout>
  )
}
