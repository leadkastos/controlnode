import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { TrendingUp, TrendingDown, DollarSign, Lock, Activity, FileText, Building2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

// Format helpers
function fmtAumUsd(val) {
  if (val == null) return '—'
  if (val >= 1000) return '$' + (val / 1000).toFixed(2) + 'B'
  return '$' + val.toFixed(2) + 'M'
}

function fmtXrp(val) {
  if (val == null) return '—'
  if (val >= 1000) return (val / 1000).toFixed(2) + 'B'
  return val.toFixed(2) + 'M'
}

function fmtSignedXrp(val) {
  if (val == null) return '—'
  var sign = val > 0 ? '+' : val < 0 ? '−' : ''
  var abs = Math.abs(val)
  return sign + (abs >= 1000 ? (abs / 1000).toFixed(2) + 'B' : abs.toFixed(2) + 'M') + ' XRP'
}

function fmtSignedUsd(val) {
  if (val == null) return '—'
  var sign = val > 0 ? '+' : val < 0 ? '−' : ''
  var abs = Math.abs(val)
  return sign + '$' + (abs >= 1000 ? (abs / 1000).toFixed(2) + 'B' : abs.toFixed(2) + 'M')
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

// SEC EDGAR live filings - restored from previous working version
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
  const [timeframe, setTimeframe] = useState('7d') // '24h' | '7d' | '30d'
  const [loading, setLoading] = useState(true)
  const [marketStatus, setMarketStatus] = useState({ open: false, label: 'Market closed' })

  useEffect(() => {
    loadAll()
    var t = setInterval(updateMarketStatus, 60000)
    updateMarketStatus()
    return () => clearInterval(t)
  }, [])

  async function loadAll() {
    setLoading(true)
    const s = await supabase.from('etf_summary').select('*').limit(1).maybeSingle()
    if (s.data) setSummary(s.data)
    const a = await supabase.from('etf_aum').select('*').eq('active', true).order('aum', { ascending: false })
    if (a.data) setAumList(a.data)
    const p = await supabase.from('etf_pipeline').select('*').order('sort_order', { ascending: true })
    if (p.data) setPipeline(p.data)
    setLoading(false)
  }

  function updateMarketStatus() {
    var now = new Date()
    var ctHour = parseInt(now.toLocaleString('en-US', { timeZone: 'America/Chicago', hour12: false, hour: '2-digit' }))
    var ctMinute = parseInt(now.toLocaleString('en-US', { timeZone: 'America/Chicago', minute: '2-digit' }))
    var weekday = now.toLocaleString('en-US', { timeZone: 'America/Chicago', weekday: 'short' })
    var isWeekday = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(weekday) !== -1
    var minutes = ctHour * 60 + ctMinute
    var openMinutes = 8 * 60 + 30
    var closeMinutes = 15 * 60
    var isOpen = isWeekday && minutes >= openMinutes && minutes < closeMinutes
    setMarketStatus({
      open: isOpen,
      label: isOpen ? 'Market open' : 'Market closed'
    })
  }

  function getFlows() {
    if (!summary) return { inflowsXrp: null, outflowsXrp: null, netXrp: null, inflowsUsd: null, outflowsUsd: null, netUsd: null }
    var key = timeframe === '24h' ? '24h' : timeframe === '7d' ? '7d' : '30d'
    return {
      inflowsXrp: summary['inflows_xrp_' + key],
      outflowsXrp: summary['outflows_xrp_' + key],
      netXrp: summary['net_xrp_' + key],
      inflowsUsd: summary['inflows_usd_' + key],
      outflowsUsd: summary['outflows_usd_' + key],
      netUsd: summary['net_usd_' + key]
    }
  }

  var f = getFlows()
  var totalAum = summary ? summary.total_aum : null
  var xrpInEtfs = summary ? summary.xrp_in_etfs : null
  var totalAumAcrossActive = aumList.reduce(function(s, a) { return s + (Number(a.aum) || 0) }, 0)

  var pieData = aumList.map(function(a) {
    var pct = totalAumAcrossActive > 0 ? (Number(a.aum) / totalAumAcrossActive) * 100 : 0
    return { name: a.etf_name, ticker: a.ticker, aum: Number(a.aum) || 0, pct: pct, color: a.color || '#3b82f6' }
  })

  return (
    <AppLayout>
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>XRP ETF Flow Tracker</h1>
                <span className="px-3 py-1 text-xs font-bold rounded" style={{ background: marketStatus.open ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)', color: marketStatus.open ? '#10b981' : '#f59e0b' }}>{marketStatus.label}</span>
              </div>
              <p style={{ color: '#9aa8be' }}>Daily XRP ETF inflows, outflows, and holdings. Updated daily by ControlNode editorial team.</p>
            </div>
            {/* Timeframe toggle */}
            <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#1e293b', border: '1px solid #475569' }}>
              {['24h', '7d', '30d'].map(function(tf) {
                var label = tf === '24h' ? '24 Hour' : tf === '7d' ? '7 Day' : '30 Day'
                var active = timeframe === tf
                return (
                  <button key={tf} onClick={() => setTimeframe(tf)} className="px-4 py-2 rounded text-sm font-medium transition-all" style={{ background: active ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'transparent', color: active ? '#fff' : '#94a3b8' }}>{label}</button>
                )
              })}
            </div>
          </div>

          {/* 5 SUMMARY CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
            <div className="rounded-xl p-5" style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid #334155' }}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={14} style={{ color: '#9aa8be' }} />
                <p className="text-xs font-medium tracking-wide uppercase" style={{ color: '#9aa8be' }}>Total AUM</p>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#3b82f6', fontFamily: 'DM Sans, sans-serif' }}>{fmtAumUsd(totalAum)}</p>
              <p className="text-xs mt-1" style={{ color: '#6b7a96' }}>{aumList.length} active ETFs</p>
            </div>

            <div className="rounded-xl p-5" style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid #334155' }}>
              <div className="flex items-center gap-2 mb-2">
                <Lock size={14} style={{ color: '#9aa8be' }} />
                <p className="text-xs font-medium tracking-wide uppercase" style={{ color: '#9aa8be' }}>XRP Locked</p>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#8b5cf6', fontFamily: 'DM Sans, sans-serif' }}>{fmtXrp(xrpInEtfs)} XRP</p>
              <p className="text-xs mt-1" style={{ color: '#6b7a96' }}>Combined holdings</p>
            </div>

            <div className="rounded-xl p-5" style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid #334155' }}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} style={{ color: '#10b981' }} />
                <p className="text-xs font-medium tracking-wide uppercase" style={{ color: '#9aa8be' }}>Inflows ({timeframe})</p>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#10b981', fontFamily: 'DM Sans, sans-serif' }}>+{fmtXrp(f.inflowsXrp)} XRP</p>
              <p className="text-xs mt-1" style={{ color: '#10b981' }}>{f.inflowsUsd != null ? '+$' + (Math.abs(f.inflowsUsd) >= 1000 ? (Math.abs(f.inflowsUsd)/1000).toFixed(2) + 'B' : Math.abs(f.inflowsUsd).toFixed(2) + 'M') : '—'}</p>
            </div>

            <div className="rounded-xl p-5" style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid #334155' }}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={14} style={{ color: '#ef4444' }} />
                <p className="text-xs font-medium tracking-wide uppercase" style={{ color: '#9aa8be' }}>Outflows ({timeframe})</p>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#ef4444', fontFamily: 'DM Sans, sans-serif' }}>−{fmtXrp(f.outflowsXrp)} XRP</p>
              <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{f.outflowsUsd != null ? '−$' + (Math.abs(f.outflowsUsd) >= 1000 ? (Math.abs(f.outflowsUsd)/1000).toFixed(2) + 'B' : Math.abs(f.outflowsUsd).toFixed(2) + 'M') : '—'}</p>
            </div>

            <div className="rounded-xl p-5" style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid ' + (f.netXrp >= 0 ? '#10b981' : '#ef4444') }}>
              <div className="flex items-center gap-2 mb-2">
                <Activity size={14} style={{ color: f.netXrp >= 0 ? '#10b981' : '#ef4444' }} />
                <p className="text-xs font-medium tracking-wide uppercase" style={{ color: '#9aa8be' }}>Net ({timeframe})</p>
              </div>
              <p className="text-2xl font-bold" style={{ color: f.netXrp >= 0 ? '#10b981' : '#ef4444', fontFamily: 'DM Sans, sans-serif' }}>{fmtSignedXrp(f.netXrp)}</p>
              <p className="text-xs mt-1" style={{ color: f.netUsd >= 0 ? '#10b981' : '#ef4444' }}>{fmtSignedUsd(f.netUsd)}</p>
            </div>
          </div>

          {/* SEC EDGAR live feed - restored to original working version */}
          <EDGARFilingsSection />

          {/* AUM PIE CHART + LIST */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl p-6" style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid #334155' }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#eceef5' }}>AUM Market Share</h2>
              <div className="flex items-center gap-6">
                <div className="relative" style={{ width: 180, height: 180 }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    {(function() {
                      var offset = 0
                      return pieData.map(function(d, i) {
                        var pct = d.pct
                        var dasharray = pct + ' ' + (100 - pct)
                        var el = (
                          <circle key={d.ticker} cx="18" cy="18" r="15.9155" fill="transparent" stroke={d.color} strokeWidth="3.5" strokeDasharray={dasharray} strokeDashoffset={-offset} />
                        )
                        offset += pct
                        return el
                      })
                    })()}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xs" style={{ color: '#9aa8be' }}>AUM</p>
                    <p className="text-sm font-semibold" style={{ color: '#eceef5' }}>{fmtAumUsd(totalAumAcrossActive)}</p>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  {pieData.map(function(d) {
                    return (
                      <div key={d.ticker} className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                        <span className="flex-1 min-w-0 truncate" style={{ color: '#cbd5e1' }}>{d.name}</span>
                        <span className="text-xs font-medium" style={{ color: '#eceef5' }}>{d.pct.toFixed(1)}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>
              <p className="text-xs mt-4" style={{ color: '#6b7a96' }}>Total AUM across active ETFs: {fmtAumUsd(totalAumAcrossActive)}</p>
            </div>

            <div className="rounded-xl p-6" style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid #334155' }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#eceef5' }}>By Issuer</h2>
              <div className="space-y-3">
                {aumList.map(function(a) {
                  var pct = totalAumAcrossActive > 0 ? (Number(a.aum) / totalAumAcrossActive) * 100 : 0
                  return (
                    <div key={a.id} className="flex items-center gap-3">
                      <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ background: a.color || '#3b82f6' }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate" style={{ color: '#eceef5' }}>{a.etf_name}</p>
                          <p className="font-semibold" style={{ color: '#eceef5', fontFamily: 'DM Sans, sans-serif' }}>{fmtAumUsd(Number(a.aum))}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs" style={{ color: '#9aa8be' }}>{a.ticker} · {a.etf_type}</p>
                          <p className="text-xs" style={{ color: '#9aa8be' }}>{pct.toFixed(1)}%</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ETF PIPELINE */}
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

          {/* Last updated */}
          {summary && summary.updated_at && (
            <p className="text-xs text-center mt-6 mb-4" style={{ color: '#6b7a96' }}>
              Last updated: {new Date(summary.updated_at).toLocaleString('en-US', { timeZone: 'America/Chicago', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })}
            </p>
          )}

          <div className="text-center pb-4">
            <p className="text-xs" style={{ color: '#4a5870' }}>ETF flow data is manually updated by ControlNode admins. SEC EDGAR filings are live. Not financial advice.</p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
