import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Zap } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function MorningBriefCard() {
  const nav = useNavigate()
  const [brief, setBrief] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    supabase.from('morning_briefs').select('*').eq('published', true).order('created_at', { ascending: false }).limit(1).single().then(function(res) {
      if (res.data) setBrief(res.data)
      setLoading(false)
    })
  }, [])

  return (
    <div
      className="relative rounded-xl p-5 lg:p-6 overflow-hidden cursor-pointer h-full flex flex-col"
      style={{ background: 'linear-gradient(135deg, #0f1724 0%, #111827 40%, #0d1520 100%)', border: '1px solid rgba(59,130,246,0.3)' }}
      onClick={function() { nav('/morning-brief') }}
    >
      <div className="absolute top-0 right-0 w-48 lg:w-72 h-48 lg:h-72 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>
            <Zap size={11} fill="currentColor" />
            MORNING BRIEF
          </div>
          <span className="text-xs" style={{ color: '#6b7a96' }}>{loading ? '...' : brief ? brief.date : 'No brief yet'}</span>
        </div>
        {loading ? (
          <div className="space-y-2 flex-1">
            <div className="h-6 rounded animate-pulse" style={{ background: '#1e2330' }} />
            <div className="h-4 rounded animate-pulse" style={{ background: '#1e2330' }} />
            <div className="h-4 rounded animate-pulse w-3/4" style={{ background: '#1e2330' }} />
          </div>
        ) : !brief ? (
          <div className="flex-1 flex items-center">
            <p className="text-sm" style={{ color: '#6b7a96' }}>No morning brief published yet.</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg lg:text-xl font-bold mb-2 leading-tight" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>{brief.headline}</h2>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: '#9aa8be' }}>{brief.summary?.slice(0, 150)}{brief.summary?.length > 150 ? '...' : ''}</p>
            {brief.catalysts && brief.catalysts.length > 0 && (
              <div className="space-y-1.5 mb-5">
                {brief.catalysts.slice(0, 3).map(function(c, i) {
                  return (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: '#3b82f6' }} />
                      <p className="text-sm" style={{ color: '#9aa8be' }}>{c}</p>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
        <div className="flex items-center gap-3 flex-wrap mt-auto">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold" style={{ background: '#3b82f6', color: '#fff' }} onClick={function(e) { e.stopPropagation(); nav('/morning-brief') }}>
            View Full Brief <ArrowRight size={14} />
          </button>
          <span className="text-xs" style={{ color: '#6b7a96' }}>For informational purposes only</span>
        </div>
      </div>
    </div>
  )
}
