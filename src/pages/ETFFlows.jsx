import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { TrendingUp, TrendingDown, DollarSign, Lock, Activity, FileText } from 'lucide-react'
import { supabase } from '../lib/supabase'

// Format helpers
function fmtAumUsd(val) {
  // val is in millions
  if (val == null) return '—'
  if (val >= 1000) return '$' + (val / 1000).toFixed(2) + 'B'
  return '$' + val.toFixed(2) + 'M'
}

function fmtXrp(val) {
  // val is in millions of XRP
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
    var openMinutes = 8 * 60 + 30  // 8:30 AM CT (9:30 AM ET)
    var closeMinutes = 15 * 60     // 3:00 PM CT (4:00 PM ET)
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
            {/* Total AUM */}
            <div className="rounded-xl p-5" style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid #334155' }}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={14} style={{ color: '#9aa8be' }} />
                <p className="text-xs font-medium tracking-wide uppercase" style={{ color: '#9aa8be' }}>Total AUM</p>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#3b82f6', fontFamily: 'DM Sans, sans-serif' }}>{fmtAumUsd(totalAum)}</p>
              <p className="text-xs mt-1" style={{ color: '#6b7a96' }}>{aumList.length} active ETFs</p>
            </div>

            {/* XRP Locked */}
            <div className="rounded-xl p-5" style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid #334155' }}>
              <div className="flex items-center gap-2 mb-2">
                <Lock size={14} style={{ color: '#9aa8be' }} />
                <p className="text-xs font-medium tracking-wide uppercase" style={{ color: '#9aa8be' }}>XRP Locked</p>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#8b5cf6', fontFamily: 'DM Sans, sans-serif' }}>{fmtXrp(xrpInEtfs)} XRP</p>
              <p className="text-xs mt-1" style={{ color: '#6b7a96' }}>Combined holdings</p>
            </div>

            {/* Total Inflows */}
            <div className="rounded-xl p-5" style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid #334155' }}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} style={{ color: '#10b981' }} />
                <p className="text-xs font-medium tracking-wide uppercase" style={{ color: '#9aa8be' }}>Inflows ({timeframe})</p>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#10b981', fontFamily: 'DM Sans, sans-serif' }}>+{fmtXrp(f.inflowsXrp)} XRP</p>
              <p className="text-xs mt-1" style={{ color: '#10b981' }}>{f.inflowsUsd != null ? '+$' + (Math.abs(f.inflowsUsd) >= 1000 ? (Math.abs(f.inflowsUsd)/1000).toFixed(2) + 'B' : Math.abs(f.inflowsUsd).toFixed(2) + 'M') : '—'}</p>
            </div>

            {/* Total Outflows */}
            <div className="rounded-xl p-5" style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid #334155' }}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={14} style={{ color: '#ef4444' }} />
                <p className="text-xs font-medium tracking-wide uppercase" style={{ color: '#9aa8be' }}>Outflows ({timeframe})</p>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#ef4444', fontFamily: 'DM Sans, sans-serif' }}>−{fmtXrp(f.outflowsXrp)} XRP</p>
              <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{f.outflowsUsd != null ? '−$' + (Math.abs(f.outflowsUsd) >= 1000 ? (Math.abs(f.outflowsUsd)/1000).toFixed(2) + 'B' : Math.abs(f.outflowsUsd).toFixed(2) + 'M') : '—'}</p>
            </div>

            {/* Net Total */}
            <div className="rounded-xl p-5" style={{ background: 'rgba(30,41,59,0.5)', border: '1px solid ' + (f.netXrp >= 0 ? '#10b981' : '#ef4444') }}>
              <div className="flex items-center gap-2 mb-2">
                <Activity size={14} style={{ color: f.netXrp >= 0 ? '#10b981' : '#ef4444' }} />
                <p className="text-xs font-medium tracking-wide uppercase" style={{ color: '#9aa8be' }}>Net ({timeframe})</p>
              </div>
              <p className="text-2xl font-bold" style={{ color: f.netXrp >= 0 ? '#10b981' : '#ef4444', fontFamily: 'DM Sans, sans-serif' }}>{fmtSignedXrp(f.netXrp)}</p>
              <p className="text-xs mt-1" style={{ color: f.netUsd >= 0 ? '#10b981' : '#ef4444' }}>{fmtSignedUsd(f.netUsd)}</p>
            </div>
          </div>

          {/* SEC EDGAR */}
          <div className="rounded-xl p-6 mb-6" style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid #334155' }}>
            <div className="flex items-center gap-3 mb-4">
              <FileText size={20} style={{ color: '#3b82f6' }} />
              <h2 className="text-lg font-semibold" style={{ color: '#eceef5' }}>SEC EDGAR — XRP ETF Filings</h2>
              <span className="ml-auto px-2 py-1 text-xs rounded" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>LIVE</span>
            </div>
            <p className="text-sm mb-4" style={{ color: '#9aa8be' }}>Search the SEC EDGAR full-text search for the latest XRP ETF filings.</p>
            <a href="https://efts.sec.gov/LATEST/search-index?q=%22XRP+ETF%22&forms=8-K,N-1A,N-2,S-1" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: '#3b82f6', color: '#fff' }}>
              Open SEC EDGAR Search →
            </a>
          </div>

          {/* AUM PIE CHART + LIST */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* AUM Market Share */}
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

            {/* Per-ETF AUM list */}
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

          {/* PIPELINE */}
          {pipeline.length > 0 && (
            <div className="rounded-xl p-6" style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid #334155' }}>
              <h2 className="text-lg font-semibold mb-4" style={{ color: '#eceef5' }}>ETF Pipeline — High Priority Watch</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pipeline.map(function(p) {
                  var priorityColor = p.priority === 'High' ? '#ef4444' : p.priority === 'Medium' ? '#f59e0b' : '#3b82f6'
                  return (
                    <div key={p.id} className="p-4 rounded-lg" style={{ background: '#1e293b', border: '1px solid #475569' }}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold" style={{ color: '#eceef5' }}>{p.issuer_name}</p>
                        <span className="px-2 py-1 text-xs rounded" style={{ background: priorityColor + '20', color: priorityColor }}>{p.priority}</span>
                      </div>
                      <p className="text-xs mb-2" style={{ color: '#9aa8be' }}>{p.status}</p>
                      <p className="text-sm" style={{ color: '#cbd5e1' }}>{p.notes}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Last updated */}
          {summary && summary.updated_at && (
            <p className="text-xs text-center mt-6" style={{ color: '#6b7a96' }}>
              Last updated: {new Date(summary.updated_at).toLocaleString('en-US', { timeZone: 'America/Chicago', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' })}
            </p>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
