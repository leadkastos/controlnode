import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { usePrices } from '../contexts/PriceContext'

function DashCard({ title, route, children }) {
  const nav = useNavigate()
  return (
    <div
      className="rounded-xl p-5 border flex flex-col gap-4 cursor-pointer group transition-all duration-200"
      style={{ background: '#161a22', borderColor: '#1e2330' }}
      onClick={function() { nav(route) }}
      onMouseEnter={function(e) { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)' }}
      onMouseLeave={function(e) { e.currentTarget.style.borderColor = '#1e2330' }}
    >
      <h3 className="text-sm font-semibold" style={{ color: '#eceef5' }}>{title}</h3>
      <div className="space-y-2 flex-1">{children}</div>
      <button className="flex items-center gap-1.5 text-xs font-medium mt-auto" style={{ color: '#3b82f6' }}>
        View Details <ArrowRight size={12} />
      </button>
    </div>
  )
}

function Row({ label, value, color }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs" style={{ color: '#9aa8be' }}>{label}</span>
      <span className="text-xs font-medium text-right" style={{ color: color || '#8892a4' }}>{value || '—'}</span>
    </div>
  )
}

export function XRPPriceCard() {
  const { prices } = usePrices()
  const xrp = prices && prices.ripple
  const price = xrp ? '$' + xrp.usd.toFixed(4) : '—'
  const change24h = xrp ? ((xrp.usd_24h_change >= 0 ? '+' : '') + xrp.usd_24h_change.toFixed(2) + '%') : '—'
  const change7d = xrp ? ((xrp.usd_7d_change >= 0 ? '+' : '') + xrp.usd_7d_change.toFixed(2) + '%') : '—'
  const changeColor = xrp ? (xrp.usd_24h_change >= 0 ? '#10b981' : '#ef4444') : '#8892a4'
  const change7dColor = xrp ? (xrp.usd_7d_change >= 0 ? '#10b981' : '#ef4444') : '#8892a4'

  return (
    <DashCard title="XRP Price Snapshot" route="/xrp-intelligence">
      <Row label="Current Price" value={price} color="#eceef5" />
      <Row label="24h Change" value={change24h} color={changeColor} />
      <Row label="7d Change" value={change7d} color={change7dColor} />
    </DashCard>
  )
}

export function TechnicalCard() {
  const { prices } = usePrices()
  const xrp = prices && prices.ripple
  const price = xrp ? xrp.usd : null
  const change = xrp ? xrp.usd_24h_change : null
  var structure = '—'
  var momentum = '—'
  if (price && change !== null) {
    structure = change > 2 ? 'Bullish Momentum' : change > 0 ? 'Mild Uptrend' : change > -2 ? 'Consolidating' : 'Bearish Pressure'
    momentum = change > 0 ? 'Positive' : 'Negative'
  }

  return (
    <DashCard title="Daily Technical Analysis" route="/xrp-intelligence">
      <Row label="Price Structure" value={structure} color={change > 0 ? '#10b981' : '#ef4444'} />
      <Row label="24h Momentum" value={momentum} color={change > 0 ? '#10b981' : '#ef4444'} />
      <Row label="Current Price" value={price ? '$' + price.toFixed(4) : '—'} color="#eceef5" />
    </DashCard>
  )
}

export function XRPNewsCard() {
  const [article, setArticle] = useState(null)

  useEffect(function() {
    var key = import.meta.env.VITE_CRYPTOCOMPARE_API_KEY
    fetch('https://min-api.cryptocompare.com/data/v2/news/?categories=XRP,Ripple&excludeCategories=Sponsored&lang=EN&api_key=' + key)
      .then(function(r) { return r.json() })
      .then(function(json) {
        if (json && json.Data && json.Data.length > 0) setArticle(json.Data[0])
      })
      .catch(function() {})
  }, [])

  function timeAgo(ts) {
    var diff = Math.floor((Date.now() / 1000) - ts)
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago'
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago'
    return Math.floor(diff / 86400) + 'd ago'
  }

  var source = article ? (article.source_info ? article.source_info.name : article.source) : '—'
  var title = article ? (article.title.length > 50 ? article.title.slice(0, 50) + '...' : article.title) : 'Loading...'
  var time = article ? timeAgo(article.published_on) : '—'

  return (
    <DashCard title="XRP & Ripple News" route="/media-narratives">
      <Row label="Latest" value={time} color="#6b7a96" />
      <div className="text-xs leading-snug" style={{ color: '#9aa8be' }}>{title}</div>
      <Row label="Source" value={source} color="#3b82f6" />
    </DashCard>
  )
}

export function DominoTheoryCard() {
  const [dominoes, setDominoes] = useState([])

  useEffect(function() {
    supabase.from('domino_theory').select('domino_number, domino_name, status').order('domino_number').then(function(res) {
      if (res.data) setDominoes(res.data)
    })
  }, [])

  var fallen = dominoes.filter(function(d) { return d.status === 'Fallen' }).length
  var tipping = dominoes.filter(function(d) { return d.status === 'Tipping' })
  var latestTipping = tipping.length > 0 ? tipping[tipping.length - 1] : null
  var stage = fallen === 0 ? 'Early Stage' : 'Stage ' + fallen + ' — ' + (fallen <= 3 ? 'Building' : fallen <= 6 ? 'Activating' : 'Advanced')
  var stageColor = fallen === 0 ? '#6b7a96' : fallen <= 3 ? '#f59e0b' : fallen <= 6 ? '#ef4444' : '#8b5cf6'

  return (
    <DashCard title="Domino Theory" route="/domino-theory">
      <Row label="Dominoes Fallen" value={String(fallen) + ' of 9'} color={stageColor} />
      <Row label="Stage" value={stage} color={stageColor} />
      <Row label="Tipping" value={latestTipping ? 'Domino ' + latestTipping.domino_number + ' — ' + latestTipping.domino_name : 'None'} color={latestTipping ? '#f59e0b' : '#6b7a96'} />
    </DashCard>
  )
}

export function GeopoliticalCard() {
  const [items, setItems] = useState([])

  useEffect(function() {
    supabase.from('geopolitical_watch').select('*').eq('section', 'flashpoint').order('sort_order', { ascending: true }).limit(3).then(function(res) {
      if (res.data) setItems(res.data)
    })
  }, [])

  var top = items[0]
  var levelColor = top ? (top.level === 'High' ? '#ef4444' : top.level === 'Elevated' ? '#f59e0b' : '#10b981') : '#6b7a96'

  return (
    <DashCard title="Geopolitical Watch" route="/geopolitical-watch">
      <Row label="Active Flash Points" value={String(items.length)} color={items.length > 0 ? '#f59e0b' : '#6b7a96'} />
      <Row label="Top Focus" value={top ? top.title : 'None active'} color="#eceef5" />
      <Row label="Risk Level" value={top ? top.level : '—'} color={levelColor} />
    </DashCard>
  )
}

export function ETFFlowCard() {
  const [etfs, setEtfs] = useState([])

  useEffect(function() {
    supabase.from('xrp_etf_flows').select('aum, flow_7d, status').then(function(res) {
      if (res.data) setEtfs(res.data)
    })
  }, [])

  var totalAUM = etfs.reduce(function(s, e) { return s + (e.aum || 0) }, 0)
  var net7d = etfs.reduce(function(s, e) { return s + (e.flow_7d || 0) }, 0)
  var active = etfs.filter(function(e) { return e.status === 'active' }).length

  function fmt(n) {
    if (Math.abs(n) >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B'
    if (Math.abs(n) >= 1e6) return '$' + (n / 1e6).toFixed(0) + 'M'
    return '$' + n.toFixed(0)
  }

  return (
    <DashCard title="XRP ETF Flow Tracker" route="/etf-flows">
      <Row label="Total AUM" value={totalAUM > 0 ? fmt(totalAUM) : '—'} color="#3b82f6" />
      <Row label="Net Flow 7d" value={net7d !== 0 ? (net7d >= 0 ? '+' : '') + fmt(net7d) : '—'} color={net7d >= 0 ? '#10b981' : '#ef4444'} />
      <Row label="Active ETFs" value={active > 0 ? String(active) + ' products' : '—'} color="#eceef5" />
    </DashCard>
  )
}

export function MediaIntelCard() {
  const [articles, setArticles] = useState([])

  useEffect(function() {
    var key = import.meta.env.VITE_CRYPTOCOMPARE_API_KEY
    fetch('https://min-api.cryptocompare.com/data/v2/news/?categories=XRP,Ripple,ETF,Regulation&excludeCategories=Sponsored&lang=EN&api_key=' + key)
      .then(function(r) { return r.json() })
      .then(function(json) {
        if (json && json.Data) setArticles(json.Data.slice(0, 10))
      })
      .catch(function() {})
  }, [])

  var categories = {}
  articles.forEach(function(a) {
    var cat = a.categories ? a.categories.split('|')[0].trim() : 'General'
    categories[cat] = (categories[cat] || 0) + 1
  })
  var topCat = Object.keys(categories).sort(function(a, b) { return categories[b] - categories[a] })[0] || '—'
  var count = articles.length

  return (
    <DashCard title="Media Intelligence" route="/media-narratives">
      <Row label="Articles Tracked" value={count > 0 ? String(count) + ' recent' : '—'} color="#eceef5" />
      <Row label="Top Category" value={topCat} color="#8b5cf6" />
      <Row label="Feed Status" value={count > 0 ? 'Live' : 'Loading'} color={count > 0 ? '#10b981' : '#6b7a96'} />
    </DashCard>
  )
}

export function OilYenCard() {
  const { macro } = usePrices()

  var brent = macro && macro['BRENT'] ? '$' + parseFloat(macro['BRENT']).toFixed(2) : '—'
  var usdjpy = macro && macro['USD/JPY'] ? parseFloat(macro['USD/JPY']).toFixed(2) : '—'
  var oilJpy = (macro && macro['BRENT'] && macro['USD/JPY'])
    ? '¥' + (parseFloat(macro['BRENT']) * parseFloat(macro['USD/JPY'])).toLocaleString('en-US', { maximumFractionDigits: 0 })
    : '—'

  return (
    <DashCard title="Oil vs Yen" route="/oil-vs-yen">
      <Row label="Brent Crude" value={brent} color="#eceef5" />
      <Row label="USD/JPY" value={usdjpy} color="#eceef5" />
      <Row label="Oil in JPY" value={oilJpy} color="#f59e0b" />
    </DashCard>
  )
}
