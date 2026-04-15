import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { supabase } from '../lib/supabase'
import { ExternalLink } from 'lucide-react'

const levelColors = {
  'High':     { bg: 'rgba(239,68,68,0.12)',   text: '#ef4444' },
  'Elevated': { bg: 'rgba(245,158,11,0.12)',  text: '#f59e0b' },
  'Moderate': { bg: 'rgba(245,158,11,0.12)',  text: '#f59e0b' },
  'Low':      { bg: 'rgba(16,185,129,0.12)',  text: '#10b981' },
  'Monitor':  { bg: 'rgba(59,130,246,0.12)',  text: '#3b82f6' },
}

const categoryColors = {
  Regulatory: { bg: 'rgba(139,92,246,0.12)', text: '#8b5cf6' },
  Government: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
  Geopolitical: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
  Policy: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
  XRP: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
  Ripple: { bg: 'rgba(139,92,246,0.12)', text: '#8b5cf6' },
}

function timeAgo(ts) {
  var diff = Math.floor((Date.now() - ts * 1000) / 60000)
  if (diff < 60) return diff + ' min ago'
  if (diff < 1440) return Math.floor(diff / 60) + ' hrs ago'
  return Math.floor(diff / 1440) + ' days ago'
}

function getCategoryColor(categories) {
  if (!categories) return categoryColors['XRP']
  var cats = categories.split('|')
  for (var i = 0; i < cats.length; i++) {
    var t = cats[i].trim()
    if (categoryColors[t]) return categoryColors[t]
  }
  return categoryColors['XRP']
}

export default function GeopoliticalWatch() {
  const [flashPoints, setFlashPoints] = useState([])
  const [weeklyWatch, setWeeklyWatch] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    async function load() {
      var res = await supabase
        .from('geopolitical_watch')
        .select('*')
        .order('sort_order', { ascending: true })
      if (res.data) {
        setFlashPoints(res.data.filter(function(r) { return r.section === 'flashpoint' }))
        setWeeklyWatch(res.data.filter(function(r) { return r.section === 'weekly_watch' }))
      }
      setLoading(false)
    }
    load()
  }, [])

  useEffect(function() {
    async function fetchNews() {
      try {
        var key = import.meta.env.VITE_CRYPTOCOMPARE_API_KEY
        var res = await fetch(
          'https://min-api.cryptocompare.com/data/v2/news/?categories=Regulation,Government,Geopolitical&excludeCategories=Sponsored&lang=EN&api_key=' + key
        )
        var data = await res.json()
        if (data && data.Data) setNews(data.Data.slice(0, 8))
      } catch(e) {
        console.error('Geo news error:', e)
      }
    }
    fetchNews()
    var interval = setInterval(fetchNews, 5 * 60 * 1000)
    return function() { clearInterval(interval) }
  }, [])

  return (
    <AppLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>RISK LEVEL: ELEVATED</span>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>Geopolitical Watch</h1>
        </div>
        <p className="text-sm" style={{ color: '#9aa8be' }}>Macro geopolitical events and crypto policy developments that may affect XRP and digital assets. Informational purposes only.</p>
      </div>

      <div className="space-y-6">

        {/* Flash Points */}
        <div className="rounded-xl p-5 border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#eceef5' }}>Active Flash Points</h2>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(function(i) { return <div key={i} className="h-10 rounded animate-pulse" style={{ background: '#1e2330' }} /> })}
            </div>
          ) : flashPoints.length === 0 ? (
            <p className="text-sm" style={{ color: '#6b7a96' }}>No active flash points. Check back later.</p>
          ) : (
            <div className="space-y-0">
              {flashPoints.map(function(fp) {
                var colors = levelColors[fp.level] || levelColors['Monitor']
                return (
                  <div key={fp.id} className="flex items-start justify-between gap-3 py-3" style={{ borderBottom: '1px solid #1e2330' }}>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#eceef5' }}>{fp.title}</p>
                      {fp.subtitle && <p className="text-xs mt-0.5" style={{ color: '#9aa8be' }}>{fp.subtitle}</p>}
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0" style={{ background: colors.bg, color: colors.text }}>{fp.level}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Crypto Policy News — Live */}
        <div className="rounded-xl p-5 border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-semibold" style={{ color: '#eceef5' }}>Crypto Policy Developments</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>LIVE</span>
          </div>
          {news.length === 0 ? (
            <div className="space-y-3">
              {[1,2,3].map(function(i) { return <div key={i} className="h-14 rounded animate-pulse" style={{ background: '#1e2330' }} /> })}
            </div>
          ) : (
            <div className="space-y-0">
              {news.map(function(item) {
                var cat = getCategoryColor(item.categories)
                var catLabel = item.categories ? item.categories.split('|')[0].trim() : 'Policy'
                var sourceName = item.source_info ? item.source_info.name : item.source
                return (
                  <a key={String(item.id)} href={item.url} target="_blank" rel="noopener noreferrer" className="block py-3 transition-colors hover:bg-white/5 -mx-5 px-5" style={{ borderBottom: '1px solid #1e2330', textDecoration: 'none' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: cat.bg, color: cat.text }}>{catLabel}</span>
                      <ExternalLink size={10} style={{ color: '#6b7a96' }} />
                    </div>
                    <p className="text-sm leading-snug mb-1" style={{ color: '#eceef5' }}>{item.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium" style={{ color: '#3b82f6' }}>{sourceName}</span>
                      <span className="text-xs" style={{ color: '#6b7a96' }}>{timeAgo(item.published_on)}</span>
                    </div>
                  </a>
                )
              })}
            </div>
          )}
          <p className="text-xs mt-4" style={{ color: '#6b7a96' }}>Source: CryptoCompare · Live feed · For informational purposes only.</p>
        </div>

        {/* What to Watch This Week */}
        <div className="rounded-xl p-5 border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#eceef5' }}>What to Watch This Week</h2>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(function(i) { return <div key={i} className="h-14 rounded animate-pulse" style={{ background: '#1e2330' }} /> })}
            </div>
          ) : weeklyWatch.length === 0 ? (
            <p className="text-sm" style={{ color: '#6b7a96' }}>No items this week yet. Check back soon.</p>
          ) : (
            <div className="space-y-2">
              {weeklyWatch.map(function(item) {
                return (
                  <div key={item.id} className="px-4 py-3 rounded-lg" style={{ background: '#111318', border: '1px solid #1e2330' }}>
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <p className="text-sm font-medium" style={{ color: '#eceef5' }}>{item.title}</p>
                      {!item.confirmed && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>Unconfirmed</span>
                      )}
                    </div>
                    {item.subtitle && <p className="text-xs mt-1" style={{ color: '#9aa8be' }}>{item.subtitle}</p>}
                  </div>
                )
              })}
            </div>
          )}
          <p className="text-xs mt-3" style={{ color: '#6b7a96' }}>Items marked Unconfirmed are based on developing reports. Always verify independently.</p>
        </div>

      </div>
    </AppLayout>
  )
}
