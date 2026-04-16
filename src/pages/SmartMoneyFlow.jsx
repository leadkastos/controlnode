import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { supabase } from '../lib/supabase'
import { Activity } from 'lucide-react'

function StatRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #1e2330' }}>
      <span className="text-sm" style={{ color: '#9aa8be' }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: color || '#eceef5' }}>{value}</span>
    </div>
  )
}

export default function SmartMoneyFlow() {
  const [escrow, setEscrow] = useState(null)
  const [observations, setObservations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    async function load() {
      var e = await supabase.from('escrow_data').select('*').single()
      if (e.data) setEscrow(e.data)
      var o = await supabase.from('smart_money_observations').select('*').order('created_at', { ascending: false }).limit(20)
      if (o.data) setObservations(o.data)
      setLoading(false)
    }
    load()
  }, [])

  function timeAgo(ts) {
    var diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
    if (diff < 3600) return Math.floor(diff / 60) + ' min ago'
    if (diff < 86400) return Math.floor(diff / 3600) + ' hrs ago'
    return Math.floor(diff / 86400) + ' days ago'
  }

  var whaleAlerts = observations.filter(function(o) { return o.type === 'whale_alert' })
  var exchangeNotes = observations.filter(function(o) { return o.type === 'exchange_flow' })

  return (
    <AppLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>ADMIN-UPDATED</span>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>Smart Money Flow</h1>
        </div>
        <p className="text-sm" style={{ color: '#9aa8be' }}>XRP whale activity, escrow releases, and notable on-chain movements. Curated daily by ControlNode.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl p-5 border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
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

        <div className="rounded-xl p-5 border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#eceef5' }}>Exchange Flow Notes</h2>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(function(i) { return <div key={i} className="h-10 rounded animate-pulse" style={{ background: '#1e2330' }} /> })}</div>
          ) : exchangeNotes.length === 0 ? (
            <div className="rounded-lg p-4 text-center" style={{ background: '#111318', border: '1px solid #1e2330' }}>
              <p className="text-sm" style={{ color: '#6b7a96' }}>No exchange flow notes yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {exchangeNotes.map(function(o) {
                return (
                  <div key={o.id} className="rounded-lg p-3" style={{ background: '#111318', border: '1px solid #1e2330' }}>
                    <p className="text-sm leading-relaxed" style={{ color: '#eceef5' }}>{o.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {o.source && <span className="text-xs font-medium" style={{ color: '#3b82f6' }}>{o.source}</span>}
                      <span className="text-xs" style={{ color: '#6b7a96' }}>{timeAgo(o.created_at)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl p-5 border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
        <div className="flex items-center gap-2 mb-4">
          <Activity size={16} style={{ color: '#8b5cf6' }} />
          <h2 className="text-sm font-semibold" style={{ color: '#eceef5' }}>Whale Alerts</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded ml-auto" style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}>CURATED</span>
        </div>
        <div className="rounded-lg px-4 py-3 mb-4 text-xs" style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)', color: '#9aa8be' }}>
          <span style={{ color: '#8b5cf6', fontWeight: 600 }}>What is this? </span>
          Notable large XRP transfers, whale accumulation, and significant on-chain movements curated daily by ControlNode from Whale Alert, XRP Scan, and Bithomp.
        </div>
        {loading ? (
          <div className="space-y-3">{[1,2,3,4].map(function(i) { return <div key={i} className="h-12 rounded animate-pulse" style={{ background: '#1e2330' }} /> })}</div>
        ) : whaleAlerts.length === 0 ? (
          <div className="rounded-lg p-6 text-center" style={{ background: '#111318', border: '1px solid #1e2330' }}>
            <p className="text-sm font-medium mb-1" style={{ color: '#eceef5' }}>No whale alerts posted yet</p>
            <p className="text-xs" style={{ color: '#6b7a96' }}>Check back later — ControlNode posts notable whale activity daily.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {whaleAlerts.map(function(o) {
              return (
                <div key={o.id} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: '#111318', border: '1px solid #1e2330' }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: '#8b5cf6' }} />
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed" style={{ color: '#eceef5' }}>{o.content}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {o.source && <span className="text-xs font-medium" style={{ color: '#3b82f6' }}>{o.source}</span>}
                      <span className="text-xs" style={{ color: '#6b7a96' }}>{timeAgo(o.created_at)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <p className="text-xs mt-4" style={{ color: '#6b7a96' }}>Sources: Whale Alert · XRP Scan · Bithomp · For informational purposes only.</p>
      </div>
    </AppLayout>
  )
}
