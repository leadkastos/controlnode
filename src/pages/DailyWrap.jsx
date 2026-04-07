import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { supabase } from '../lib/supabase'

export default function DailyWrap() {
  const [wrap, setWrap] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    supabase
      .from('daily_wraps')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
      .then(function(res) {
        if (res.data) setWrap(res.data)
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-96">
        <p style={{ color: '#6b7a96' }}>Loading...</p>
      </div>
    </AppLayout>
  )

  if (!wrap) return (
    <AppLayout>
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2" style={{ color: '#eceef5' }}>No Daily Wrap Published Yet</p>
          <p className="text-sm" style={{ color: '#6b7a96' }}>Check back later. Wraps are published each evening.</p>
        </div>
      </div>
    </AppLayout>
  )

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto pb-12">
        <div className="mb-6">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
            style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)' }}
          >
            🌙 DAILY WRAP
          </div>
          <h1 className="text-2xl font-bold leading-tight mb-2" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>
            {wrap.headline}
          </h1>
          <p className="text-xs" style={{ color: '#6b7a96' }}>{wrap.date} · Published by ControlNode</p>
        </div>

        <div
          className="mb-6 px-4 py-3 rounded-lg text-xs leading-relaxed"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
        >
          <span style={{ color: '#f59e0b', fontWeight: 600 }}>Informational Only: </span>
          <span style={{ color: '#9aa8be' }}>This wrap is for educational and informational purposes only. Nothing here constitutes financial advice or a recommendation to buy or sell any asset.</span>
        </div>

        <div className="rounded-xl p-6 mb-4" style={{ background: '#0d1117', border: '1px solid #1e2330' }}>
          <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6b7a96' }}>Summary</h2>
          <p className="text-sm leading-relaxed" style={{ color: '#9aa8be' }}>{wrap.summary}</p>
        </div>

        {wrap.catalysts && wrap.catalysts.length > 0 && (
          <div className="rounded-xl p-6 mb-4" style={{ background: '#0d1117', border: '1px solid #1e2330' }}>
            <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#6b7a96' }}>🌙 Key Points</h2>
            <div className="space-y-2">
              {wrap.catalysts.map(function(c, i) {
                return (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: '#8b5cf6' }} />
                    <p className="text-sm leading-relaxed" style={{ color: '#9aa8be' }}>{c}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div
          className="rounded-xl p-6"
          style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.2)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ background: '#8b5cf6' }} />
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#8b5cf6' }}>ControlNode</p>
          </div>
          <p className="text-xs" style={{ color: '#6b7a96' }}>
            This wrap is for informational and educational purposes only. Nothing in this publication constitutes financial advice, investment advice, or a recommendation to buy or sell any asset. Always consult a qualified financial advisor. M&N Consulting LLC.
          </p>
        </div>
      </div>
    </AppLayout>
  )
}
