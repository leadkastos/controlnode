import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { supabase } from '../lib/supabase'
import { Activity, ArrowRight, ExternalLink } from 'lucide-react'

function StatRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #1e2330' }}>
      <span className="text-sm" style={{ color: '#9aa8be' }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: color || '#eceef5' }}>{value}</span>
    </div>
  )
}

function fmtXrp(amt) {
  if (amt == null) return '—'
  var n = Number(amt)
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M XRP'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K XRP'
  return n.toFixed(0) + ' XRP'
}

function fmtUsd(amt) {
  if (amt == null) return null
  var n = Number(amt)
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M'
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K'
  return '$' + n.toFixed(0)
}

function fmtAddr(addr, label) {
  if (label) return label
  if (!addr) return 'Unknown'
  if (addr.length > 12) return addr.slice(0, 6) + '...' + addr.slice(-4)
  return addr
}

function typeColor(t) {
  if (t === 'exchange_inflow') return { bg: 'rgba(239,68,68,0.12)', text: '#ef4444', label: 'EXCHANGE INFLOW' }
  if (t === 'exchange_outflow') return { bg: 'rgba(16,185,129,0.12)', text: '#10b981', label: 'EXCHANGE OUTFLOW' }
  if (t === 'whale_to_whale') return { bg: 'rgba(139,92,246,0.12)', text: '#8b5cf6', label: 'WHALE TRANSFER' }
  return { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6', label: 'LARGE TRANSFER' }
}

export default function SmartMoneyFlow() {
  const [escrow, setEscrow] = useState(null)
  const [whaleAlerts, setWhaleAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    async function load() {
      var e = await supabase.from('escrow_data').select('*').single()
      if (e.data) setEscrow(e.data)
      var w = await supabase.from('whale_alerts').select('*').order('occurred_at', { ascending: false }).limit(30)
      if (w.data) setWhaleAlerts(w.data)
      setLoading(false)
    }
    load()
  }, [])

  function timeAgo(ts) {
    var diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
    if (diff < 60) return diff + ' sec ago'
    if (diff < 3600) return Math.floor(diff / 60) + ' min ago'
    if (diff < 86400) return Math.floor(diff / 3600) + ' hrs ago'
    return Math.floor(diff / 86400) + ' days ago'
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>AUTO-UPDATED DAILY</span>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>Smart Money Flow</h1>
        </div>
        <p className="text-sm" style={{ color: '#9aa8be' }}>XRP whale activity, escrow releases, and notable on-chain movements. Automatically updated daily after market close.</p>
      </div>

      {/* Escrow & Unlock Schedule */}
      <div className="rounded-xl p-5 border mb-6" style={{ background: '#161a22', borderColor: '#1e2330' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#eceef5' }}>Escrow & Unlock Schedule</h2>
        {loading ? (
          <div className="space-y-3">{[1,2,3,4].map(function(i) { return <div key={i} className="h-5 rounded animate-pulse" style={{ background: '#1e2330' }} /> })}</div>
        ) : escrow ? (
          <div>
            <StatRow label="Total Escrow Locked" value={escrow.total_locked} color="#f59e0b" />
            <StatRow label="Next Monthly Unlock" value={escrow.next_unlock} color="#f59e0b" />
            <StatRow label="Unlock Frequency" value={escrow.unlock_frequency} />
            <StatRow label="Remaining Escrow Period" value={escrow.remaining_period} />
            <p className="text-xs mt-4" style={{ color: '#6b7a96' }}>
              Updated: {timeAgo(escrow.updated_at)} · Source: Ripple public disclosures · For informational purposes only.
            </p>
          </div>
        ) : (
          <p className="text-sm" style={{ color: '#6b7a96' }}>No escrow data available.</p>
        )}
      </div>

      {/* Whale Alerts — auto-updated from XRPSCAN */}
      <div className="rounded-xl p-5 border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
        <div className="flex items-center gap-2 mb-4">
          <Activity size={16} style={{ color: '#8b5cf6' }} />
          <h2 className="text-sm font-semibold" style={{ color: '#eceef5' }}>Whale Alerts</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded ml-auto" style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}>AUTO</span>
        </div>
        <div className="rounded-lg px-4 py-3 mb-4 text-xs" style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)', color: '#9aa8be' }}>
          <span style={{ color: '#8b5cf6', fontWeight: 600 }}>What is this? </span>
          Large XRP transfers (1M+ XRP) detected on the XRP Ledger. Updated automatically every day at market close. Sourced from XRPSCAN public ledger data.
        </div>
        {loading ? (
          <div className="space-y-3">{[1,2,3,4].map(function(i) { return <div key={i} className="h-16 rounded animate-pulse" style={{ background: '#1e2330' }} /> })}</div>
        ) : whaleAlerts.length === 0 ? (
          <div className="rounded-lg p-6 text-center" style={{ background: '#111318', border: '1px solid #1e2330' }}>
            <p className="text-sm font-medium mb-1" style={{ color: '#eceef5' }}>No whale alerts yet</p>
            <p className="text-xs" style={{ color: '#6b7a96' }}>The whale tracker runs daily at market close. New large XRP transfers will appear here automatically.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {whaleAlerts.map(function(w) {
              var tc = typeColor(w.transaction_type)
              var explorerUrl = 'https://xrpscan.com/tx/' + w.transaction_hash
              return (
                <a
                  key={w.id}
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 rounded-lg transition-colors hover:bg-white/5"
                  style={{ background: '#111318', border: '1px solid #1e2330', textDecoration: 'none' }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0 mt-2" style={{ background: tc.text }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: tc.bg, color: tc.text }}>{tc.label}</span>
                        <span className="text-sm font-bold" style={{ color: '#eceef5' }}>{fmtXrp(w.amount_xrp)}</span>
                        {w.amount_usd && <span className="text-xs" style={{ color: '#9aa8be' }}>({fmtUsd(w.amount_usd)})</span>}
                      </div>
                      <div className="flex items-center gap-2 text-xs mb-1.5" style={{ color: '#cbd5e1' }}>
                        <span style={{ color: '#9aa8be' }}>From:</span>
                        <span style={{ color: '#eceef5', fontWeight: 500 }}>{fmtAddr(w.from_address, w.from_label)}</span>
                        <ArrowRight size={12} style={{ color: '#6b7a96' }} />
                        <span style={{ color: '#9aa8be' }}>To:</span>
                        <span style={{ color: '#eceef5', fontWeight: 500 }}>{fmtAddr(w.to_address, w.to_label)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: '#6b7a96' }}>{timeAgo(w.occurred_at)}</span>
                        <ExternalLink size={10} style={{ color: '#6b7a96' }} />
                      </div>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        )}
        <p className="text-xs mt-4" style={{ color: '#6b7a96' }}>Source: XRPSCAN public ledger data · Updates daily at 3 PM CT · For informational purposes only.</p>
      </div>
    </AppLayout>
  )
}
