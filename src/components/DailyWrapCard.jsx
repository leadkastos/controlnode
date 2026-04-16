import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Moon } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function DailyWrapCard() {
  const nav = useNavigate()
  const [wrap, setWrap] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    supabase.from('daily_wraps').select('*').eq('published', true).order('created_at', { ascending: false }).limit(1).single().then(function(res) {
      if (res.data) setWrap(res.data)
      setLoading(false)
    })
  }, [])

  return (
    <div
      className="relative rounded-xl p-5 lg:p-6 overflow-hidden cursor-pointer h-full flex flex-col"
      style={{ background: 'linear-gradient(135deg, #0f1724 0%, #111827 40%, #0d1520 100%)', border: '1px solid rgba(139,92,246,0.3)' }}
      onClick={function() { nav('/daily-wrap') }}
    >
      <div className="absolute top-0 right-0 w-48 lg:w-72 h-48 lg:h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.2)' }}>
            <Moon size={11} fill="currentColor" />
            DAILY WRAP
          </div>
          <span className="text-xs" style={{ color: '#6b7a96' }}>{loading ? '...' : wrap ? wrap.date : 'No wrap yet'}</span>
        </div>
        {loading ? (
          <div className="space-y-2 flex-1">
            <div className="h-6 rounded animate-pulse" style={{ background: '#1e2330' }} />
            <div className="h-4 rounded animate-pulse" style={{ background: '#1e2330' }} />
            <div className="h-4 rounded animate-pulse w-3/4" style={{ background: '#1e2330' }} />
          </div>
        ) : !wrap ? (
          <div className="flex-1 flex items-center">
            <p className="text-sm" style={{ color: '#6b7a96' }}>No daily wrap published yet.</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg lg:text-xl font-bold mb-2 leading-tight" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>{wrap.headline}</h2>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: '#9aa8be' }}>{wrap.summary?.slice(0, 150)}{wrap.summary?.length > 150 ? '...' : ''}</p>
            {wrap.catalysts && wrap.catalysts.length > 0 && (
              <div className="space-y-1.5 mb-5">
                {wrap.catalysts.slice(0, 3).map(function(c, i) {
                  return (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: '#8b5cf6' }} />
                      <p className="text-sm" style={{ color: '#9aa8be' }}>{c}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
        <div className="flex items-center gap-3 flex-wrap mt-auto">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold" style={{ background: '#8b5cf6', color: '#fff' }} onClick={function(e) { e.stopPropagation(); nav('/daily-wrap') }}>
            View Full Wrap <ArrowRight size={14} />
          </button>
          <span className="text-xs" style={{ color: '#6b7a96' }}>For informational purposes only</span>
        </div>
      </div>
    </div>
  )
}
