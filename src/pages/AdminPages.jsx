import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { Plus, Trash2, Bell, MessageCircle, PlaySquare, FileText, BarChart3, TrendingUp, Calendar, Database } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

// Market Signals — locked options
const SIGNAL_NAMES = ['Market Sentiment', 'Risk Environment', 'Technical Outlook']
const SIGNAL_VALUE_COLORS = { Bullish: 'green', Bearish: 'red', Neutral: 'yellow', Cautious: 'blue' }
const SIGNAL_VALUES = Object.keys(SIGNAL_VALUE_COLORS)

export default function AdminPages() {
  const { profile } = useAuth()
  const [activeSection, setActiveSection] = useState('market-news')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [marketNewsForm, setMarketNewsForm] = useState({ type: 'unconfirmed', content: '', category: 'General', source: '', source_url: '' })
  const [youtubeForm, setYoutubeForm] = useState({ title: '', description: '', youtube_url: '', video_id: '', thumbnail_url: '' })
  const [youtubeVideos, setYoutubeVideos] = useState([])
  const [symbols, setSymbols] = useState([])
  const [newSymbol, setNewSymbol] = useState('')
  const [notificationForm, setNotificationForm] = useState({ title: '', message: '' })

  const [morningBriefForm, setMorningBriefForm] = useState({ headline: '', summary: '', catalysts: '', date: '' })
  const [dailyWrapForm, setDailyWrapForm] = useState({ headline: '', summary: '', catalysts: '', date: '' })

  const [marketSignals, setMarketSignals] = useState([])
  const [signalForm, setSignalForm] = useState({ signal_name: 'Market Sentiment', signal_value: 'Bullish' })

  // ETF DAILY SNAPSHOTS state
  const [etfList, setEtfList] = useState([])
  const [snapshotDate, setSnapshotDate] = useState('')
  const [snapshots, setSnapshots] = useState({}) // { ticker: { xrp_locked, aum_usd, nav_per_share } }
  const [savingSnapshots, setSavingSnapshots] = useState(false)

  // ETF Pipeline state (kept from before)
  const [etfPipeline, setEtfPipeline] = useState([])
  const [newPipeline, setNewPipeline] = useState({ issuer_name: '', priority: 'Medium', notes: '', status: 'Not Filed' })
  const [addingPipeline, setAddingPipeline] = useState(false)

  function extractVideoId(url) {
    if (!url) return ''
    const patterns = [/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/, /youtube\.com\/v\/([^&\n?#]+)/]
    for (const p of patterns) { const m = url.match(p); if (m) return m[1] }
    return ''
  }

  useEffect(() => {
    var today = new Date().toISOString().split('T')[0]
    setMorningBriefForm(prev => ({ ...prev, date: prev.date || today }))
    setDailyWrapForm(prev => ({ ...prev, date: prev.date || today }))
    setSnapshotDate(today)
  }, [])

  useEffect(() => {
    const id = extractVideoId(youtubeForm.youtube_url)
    if (id) setYoutubeForm(prev => ({ ...prev, video_id: id, thumbnail_url: 'https://img.youtube.com/vi/' + id + '/maxresdefault.jpg' }))
    else setYoutubeForm(prev => ({ ...prev, video_id: '', thumbnail_url: '' }))
  }, [youtubeForm.youtube_url])

  useEffect(() => { loadMasterSymbols(); loadMarketSignals(); loadYouTubeVideos(); loadEtfData() }, [])

  // When date changes, reload snapshots for that date
  useEffect(() => {
    if (snapshotDate && etfList.length > 0) loadSnapshotsForDate(snapshotDate)
  }, [snapshotDate, etfList.length])

  async function loadYouTubeVideos() {
    const r = await supabase.from('youtube_videos').select('*').order('published_at', { ascending: false, nullsFirst: false })
    if (r.data) setYoutubeVideos(r.data)
  }
  async function loadMasterSymbols() {
    const r = await supabase.from('master_watchlist').select('*').order('symbol')
    if (r.data) setSymbols(r.data)
  }
  async function loadMarketSignals() {
    const r = await supabase.from('market_signals').select('*').order('signal_name')
    if (r.data) setMarketSignals(r.data)
  }
  async function loadEtfData() {
    const a = await supabase.from('etf_aum').select('*').eq('active', true).order('sort_order', { ascending: true })
    if (a.data) setEtfList(a.data)
    const p = await supabase.from('etf_pipeline').select('*').order('sort_order', { ascending: true })
    if (p.data) setEtfPipeline(p.data)
  }

  async function loadSnapshotsForDate(date) {
    const r = await supabase.from('etf_daily_snapshots').select('*').eq('snapshot_date', date)
    var byTicker = {}
    if (r.data) {
      r.data.forEach(s => {
        byTicker[s.ticker] = {
          xrp_locked: s.xrp_locked,
          aum_usd: s.aum_usd,
          nav_per_share: s.nav_per_share
        }
      })
    }
    setSnapshots(byTicker)
  }

  function updateSnapshotField(ticker, field, value) {
    setSnapshots(prev => ({
      ...prev,
      [ticker]: { ...(prev[ticker] || {}), [field]: value }
    }))
  }

  async function handleSaveAllSnapshots() {
    if (!snapshotDate) { setMessage('Pick a date first'); return }
    setSavingSnapshots(true)

    var rows = []
    for (var i = 0; i < etfList.length; i++) {
      var etf = etfList[i]
      var s = snapshots[etf.ticker] || {}
      var aum = parseFloat(s.aum_usd) || 0
      var xrp = parseFloat(s.xrp_locked) || 0
      var nav = s.nav_per_share != null && s.nav_per_share !== '' ? parseFloat(s.nav_per_share) : null

      // Skip if both AUM and XRP are zero — user hasn't entered anything for this ETF
      if (aum === 0 && xrp === 0) continue

      rows.push({
        ticker: etf.ticker,
        etf_name: etf.etf_name,
        snapshot_date: snapshotDate,
        xrp_locked: xrp,
        aum_usd: aum,
        nav_per_share: nav,
        data_source: 'manual',
        created_by: profile.id
      })
    }

    if (rows.length === 0) {
      setSavingSnapshots(false)
      setMessage('Nothing to save — enter numbers for at least one ETF')
      return
    }

    // Upsert all snapshots
    const { error: snapErr } = await supabase
      .from('etf_daily_snapshots')
      .upsert(rows, { onConflict: 'ticker,snapshot_date' })

    if (snapErr) {
      setSavingSnapshots(false)
      setMessage('Error saving snapshots: ' + snapErr.message)
      return
    }

    // Update etf_aum (current AUM in millions)
    for (var j = 0; j < rows.length; j++) {
      var r = rows[j]
      await supabase.from('etf_aum').update({
        aum: r.aum_usd / 1000000,
        updated_at: new Date().toISOString()
      }).eq('ticker', r.ticker)
    }

    // Recalculate the etf_summary 5 cards by calling the calculation function
    await recalculateEtfSummary(snapshotDate)

    setSavingSnapshots(false)
    setMessage('Saved ' + rows.length + ' ETF snapshots! Member page now reflects updated numbers.')
  }

  // Calculate inflows, outflows, net for 24h/7d/30d, write to etf_summary
  async function recalculateEtfSummary(forDate) {
    // Get today's snapshots
    const { data: today } = await supabase.from('etf_daily_snapshots').select('*').eq('snapshot_date', forDate)
    if (!today || today.length === 0) return

    var totalAumUsd = today.reduce((s, r) => s + (Number(r.aum_usd) || 0), 0)
    var totalXrpLocked = today.reduce((s, r) => s + (Number(r.xrp_locked) || 0), 0)

    // For each timeframe, compute total inflows + total outflows + net
    async function flows(daysBack) {
      var target = new Date(forDate)
      target.setDate(target.getDate() - daysBack)
      var targetStr = target.toISOString().split('T')[0]
      var inflowsXrp = 0
      var outflowsXrp = 0
      var inflowsUsd = 0
      var outflowsUsd = 0
      for (var i = 0; i < today.length; i++) {
        var t = today[i]
        const { data: prior } = await supabase
          .from('etf_daily_snapshots')
          .select('xrp_locked, aum_usd')
          .eq('ticker', t.ticker)
          .lte('snapshot_date', targetStr)
          .order('snapshot_date', { ascending: false })
          .limit(1)
          .maybeSingle()
        if (prior) {
          var xrpDelta = (Number(t.xrp_locked) || 0) - (Number(prior.xrp_locked) || 0)
          var usdDelta = (Number(t.aum_usd) || 0) - (Number(prior.aum_usd) || 0)
          if (xrpDelta >= 0) inflowsXrp += xrpDelta; else outflowsXrp += Math.abs(xrpDelta)
          if (usdDelta >= 0) inflowsUsd += usdDelta; else outflowsUsd += Math.abs(usdDelta)
        }
      }
      return {
        inflows_xrp: inflowsXrp,
        outflows_xrp: outflowsXrp,
        net_xrp: inflowsXrp - outflowsXrp,
        inflows_usd: inflowsUsd,
        outflows_usd: outflowsUsd,
        net_usd: inflowsUsd - outflowsUsd
      }
    }

    var f24 = await flows(1)
    var f7 = await flows(7)
    var f30 = await flows(30)

    var summary = {
      total_aum: totalAumUsd / 1000000,
      xrp_in_etfs: totalXrpLocked / 1000000,
      // Legacy fields for backwards compat
      net_flow_24h: f24.net_usd / 1000000,
      net_flow_7d: f7.net_usd / 1000000,
      net_flow_30d: f30.net_usd / 1000000,
      // New flow fields (in millions for display)
      inflows_xrp_24h: f24.inflows_xrp / 1000000,
      outflows_xrp_24h: f24.outflows_xrp / 1000000,
      net_xrp_24h: f24.net_xrp / 1000000,
      inflows_usd_24h: f24.inflows_usd / 1000000,
      outflows_usd_24h: f24.outflows_usd / 1000000,
      net_usd_24h: f24.net_usd / 1000000,
      inflows_xrp_7d: f7.inflows_xrp / 1000000,
      outflows_xrp_7d: f7.outflows_xrp / 1000000,
      net_xrp_7d: f7.net_xrp / 1000000,
      inflows_usd_7d: f7.inflows_usd / 1000000,
      outflows_usd_7d: f7.outflows_usd / 1000000,
      net_usd_7d: f7.net_usd / 1000000,
      inflows_xrp_30d: f30.inflows_xrp / 1000000,
      outflows_xrp_30d: f30.outflows_xrp / 1000000,
      net_xrp_30d: f30.net_xrp / 1000000,
      inflows_usd_30d: f30.inflows_usd / 1000000,
      outflows_usd_30d: f30.outflows_usd / 1000000,
      net_usd_30d: f30.net_usd / 1000000,
      updated_at: new Date().toISOString()
    }

    const { data: existing } = await supabase.from('etf_summary').select('id').limit(1).maybeSingle()
    if (existing) {
      await supabase.from('etf_summary').update(summary).eq('id', existing.id)
    } else {
      await supabase.from('etf_summary').insert([summary])
    }
  }

  async function handleMarketNewsSubmit(e) {
    e.preventDefault()
    if (!marketNewsForm.content.trim()) { setMessage('Content is required'); return }
    setLoading(true)
    const { error } = await supabase.from('market_news').insert([{
      type: marketNewsForm.type,
      content: marketNewsForm.content,
      category: marketNewsForm.category,
      source: marketNewsForm.source || null,
      source_url: marketNewsForm.source_url || null,
      created_by: profile.id
    }])
    setLoading(false)
    if (error) { setMessage('Error posting market news: ' + error.message); return }
    var label = marketNewsForm.type === 'breaking' ? 'Breaking news' : marketNewsForm.type === 'confirmed' ? 'Market news' : 'Market chatter'
    setMessage(label + ' posted successfully!')
    setMarketNewsForm({ type: 'unconfirmed', content: '', category: 'General', source: '', source_url: '' })
  }

  async function handleYouTubeSubmit(e) {
    e.preventDefault()
    if (!youtubeForm.title.trim() || !youtubeForm.youtube_url.trim()) { setMessage('Title and YouTube URL are required'); return }
    if (!youtubeForm.video_id) { setMessage('Please enter a valid YouTube URL'); return }
    setLoading(true)
    const { error } = await supabase.from('youtube_videos').insert([{ title: youtubeForm.title, description: youtubeForm.description || null, youtube_url: youtubeForm.youtube_url, video_id: youtubeForm.video_id, thumbnail_url: youtubeForm.thumbnail_url, channel_handle: 'unknown', channel_name: 'Unknown Channel', published_at: new Date().toISOString(), created_by: profile.id }])
    setLoading(false)
    if (error) { setMessage('Error adding YouTube video'); return }
    setMessage('YouTube video added successfully!')
    setYoutubeForm({ title: '', description: '', youtube_url: '', video_id: '', thumbnail_url: '' })
    loadYouTubeVideos()
  }

  async function handleDeleteYouTubeVideo(id) {
    if (!confirm('Delete this video?')) return
    const { error } = await supabase.from('youtube_videos').delete().eq('id', id)
    if (error) { setMessage('Error deleting video'); return }
    setMessage('Video deleted'); loadYouTubeVideos()
  }

  async function handleAddSymbol(e) {
    e.preventDefault()
    if (!newSymbol.trim()) return
    const symbol = newSymbol.toUpperCase().trim()
    if (symbols.some(s => s.symbol === symbol)) { setMessage('Symbol already exists'); return }
    setLoading(true)
    const { error } = await supabase.from('master_watchlist').insert([{ symbol }])
    setLoading(false)
    if (error) { setMessage('Error adding symbol'); return }
    setMessage('Symbol added!'); setNewSymbol(''); loadMasterSymbols()
  }

  async function handleDeleteSymbol(id) {
    if (!confirm('Delete this symbol?')) return
    const { error } = await supabase.from('master_watchlist').delete().eq('id', id)
    if (error) { setMessage('Error'); return }
    setMessage('Deleted'); loadMasterSymbols()
  }

  function parseCatalysts(text) {
    if (!text || !text.trim()) return null
    return text.split('\n').map(s => s.replace(/^[-•\s]+/, '').trim()).filter(s => s.length > 0)
  }

  async function handleMorningBriefSubmit(e) {
    e.preventDefault()
    if (!morningBriefForm.headline.trim() || !morningBriefForm.summary.trim()) { setMessage('Headline and Summary required'); return }
    setLoading(true)
    const payload = {
      headline: morningBriefForm.headline,
      summary: morningBriefForm.summary,
      catalysts: parseCatalysts(morningBriefForm.catalysts),
      date: morningBriefForm.date || new Date().toISOString().split('T')[0],
      published: true,
      published_at: new Date().toISOString(),
      created_by: profile.id
    }
    const { error } = await supabase.from('morning_briefs').insert([payload])
    setLoading(false)
    if (error) { setMessage('Error publishing: ' + error.message); return }
    setMessage('Morning Brief published!')
    var today = new Date().toISOString().split('T')[0]
    setMorningBriefForm({ headline: '', summary: '', catalysts: '', date: today })
  }

  async function handleDailyWrapSubmit(e) {
    e.preventDefault()
    if (!dailyWrapForm.headline.trim() || !dailyWrapForm.summary.trim()) { setMessage('Headline and Summary required'); return }
    setLoading(true)
    const payload = {
      headline: dailyWrapForm.headline,
      summary: dailyWrapForm.summary,
      catalysts: parseCatalysts(dailyWrapForm.catalysts),
      date: dailyWrapForm.date || new Date().toISOString().split('T')[0],
      published: true,
      published_at: new Date().toISOString(),
      created_by: profile.id
    }
    const { error } = await supabase.from('daily_wraps').insert([payload])
    setLoading(false)
    if (error) { setMessage('Error publishing: ' + error.message); return }
    setMessage('Daily Wrap published!')
    var today = new Date().toISOString().split('T')[0]
    setDailyWrapForm({ headline: '', summary: '', catalysts: '', date: today })
  }

  async function handleSaveSignal(e) {
    e.preventDefault()
    var color = SIGNAL_VALUE_COLORS[signalForm.signal_value]
    setLoading(true)
    const { error } = await supabase.from('market_signals').upsert([{
      signal_name: signalForm.signal_name,
      signal_value: signalForm.signal_value,
      color: color
    }], { onConflict: 'signal_name' })
    setLoading(false)
    if (error) { setMessage('Error updating: ' + error.message); return }
    setMessage(signalForm.signal_name + ' updated to ' + signalForm.signal_value + '!')
    loadMarketSignals()
  }

  async function handleDeleteSignal(name) {
    if (!confirm('Remove ' + name + '?')) return
    const { error } = await supabase.from('market_signals').delete().eq('signal_name', name)
    if (error) { setMessage('Error removing'); return }
    setMessage(name + ' removed')
    loadMarketSignals()
  }

  function updateEtfPipelineField(id, field, value) {
    setEtfPipeline(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  async function saveEtfPipelineRow(p) {
    const { error } = await supabase.from('etf_pipeline').update({ issuer_name: p.issuer_name, priority: p.priority, notes: p.notes, status: p.status, updated_at: new Date().toISOString() }).eq('id', p.id)
    if (error) { setMessage('Error saving'); return }
    setMessage(p.issuer_name + ' saved!'); loadEtfData()
  }

  async function handleAddPipeline(e) {
    e.preventDefault()
    if (!newPipeline.issuer_name) { setMessage('Issuer name required'); return }
    setAddingPipeline(true)
    const nextOrder = etfPipeline.length > 0 ? Math.max(...etfPipeline.map(p => p.sort_order || 0)) + 1 : 1
    const { error } = await supabase.from('etf_pipeline').insert([{ issuer_name: newPipeline.issuer_name, priority: newPipeline.priority, notes: newPipeline.notes, status: newPipeline.status, sort_order: nextOrder }])
    setAddingPipeline(false)
    if (error) { setMessage('Error adding'); return }
    setMessage('Pipeline entry added!'); setNewPipeline({ issuer_name: '', priority: 'Medium', notes: '', status: 'Not Filed' }); loadEtfData()
  }

  async function handleRemovePipeline(id) {
    if (!confirm('Remove this entry?')) return
    const { error } = await supabase.from('etf_pipeline').delete().eq('id', id)
    if (error) { setMessage('Error'); return }
    setMessage('Entry removed'); loadEtfData()
  }

  async function handleNotificationSubmit(e) {
    e.preventDefault()
    if (!notificationForm.title.trim() || !notificationForm.message.trim()) { setMessage('Title and message required'); return }
    setLoading(true)
    const { error } = await supabase.from('notifications').insert([{ title: notificationForm.title, message: notificationForm.message, type: 'admin_broadcast', created_by: profile.id }])
    setLoading(false)
    if (error) { setMessage('Error sending'); return }
    setMessage('Notification sent!'); setNotificationForm({ title: '', message: '' })
  }

  const sections = [
    { id: 'market-news', label: 'Market News', icon: MessageCircle },
    { id: 'morning-brief', label: 'Morning Brief', icon: FileText },
    { id: 'daily-wrap', label: 'Daily Wrap', icon: Calendar },
    { id: 'market-signals', label: 'Market Signals', icon: BarChart3 },
    { id: 'youtube-intel', label: 'YouTube Intel', icon: PlaySquare },
    { id: 'etf-snapshots', label: 'ETF Daily Data', icon: Database },
    { id: 'etf-pipeline', label: 'ETF Pipeline', icon: TrendingUp },
    { id: 'master-watchlist', label: 'Master Watchlist', icon: Plus },
    { id: 'notifications', label: 'Send Notification', icon: Bell },
  ]

  const inputStyle = { background: '#1e293b', border: '1px solid #475569', color: '#eceef5' }
  const innerInputStyle = { background: '#0f172a', border: '1px solid #475569', color: '#eceef5' }
  const btnPrimary = { background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff' }

  const colorPreviewMap = {
    green: { bg: 'rgba(16,185,129,0.20)', text: '#10b981' },
    red: { bg: 'rgba(239,68,68,0.20)', text: '#ef4444' },
    yellow: { bg: 'rgba(245,158,11,0.20)', text: '#f59e0b' },
    blue: { bg: 'rgba(59,130,246,0.20)', text: '#3b82f6' }
  }
  var previewColor = colorPreviewMap[SIGNAL_VALUE_COLORS[signalForm.signal_value]] || colorPreviewMap.blue

  // Helper for ETF source URLs (shown next to each ETF for reference)
  const ETF_SOURCES = {
    'XRP':  { name: 'Bitwise',           url: 'https://bitxrpetf.com/' },
    'XRPC': { name: 'Canary',            url: 'https://canaryetfs.com/xrpc/' },
    'XRPZ': { name: 'Franklin Templeton',url: 'https://www.franklintempleton.com/investments/options/exchange-traded-funds/products/47318/SINGLCLASS/franklin-xrp-etf/XRPZ' },
    'TOXR': { name: '21Shares',          url: 'https://www.21shares.com/en-us/products-us/toxr' },
    'GXRP': { name: 'Grayscale',         url: 'https://etfs.grayscale.com/gxrp' },
    'XRPR': { name: 'REX-Osprey',        url: 'https://www.rexshares.com/xrpr/' }
  }

  return (
    <AppLayout>
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>Admin Panel</h1>
            <p style={{ color: '#9aa8be' }}>Manage your ControlNode platform content and settings.</p>
          </div>

          {message && (
            <div className="mb-6 px-4 py-3 rounded-lg" style={{ background: message.includes('Error') ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', border: '1px solid ' + (message.includes('Error') ? '#ef4444' : '#10b981'), color: message.includes('Error') ? '#ef4444' : '#10b981' }}>
              {message}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-64 flex-shrink-0">
              <nav className="space-y-2">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => { setActiveSection(section.id); setMessage('') }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                    style={{ background: activeSection === section.id ? 'rgba(59,130,246,0.15)' : 'rgba(30,41,59,0.5)', border: '1px solid ' + (activeSection === section.id ? '#3b82f6' : '#475569') }}
                  >
                    <section.icon size={18} style={{ color: activeSection === section.id ? '#3b82f6' : '#94a3b8' }} />
                    <span style={{ color: activeSection === section.id ? '#eceef5' : '#cbd5e1' }}>{section.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex-1">
              {activeSection === 'market-news' && (
                <div className="rounded-xl p-6" style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid #334155' }}>
                  <h2 className="text-xl font-semibold mb-2" style={{ color: '#eceef5' }}>Post Market News</h2>
                  <p className="text-sm mb-6" style={{ color: '#9aa8be' }}>
                    Choose a Post Type. <span style={{ color: '#cbd5e1' }}>Breaking News</span> appears in the dashboard's red banner AND the right sidebar news feed. <span style={{ color: '#cbd5e1' }}>Confirmed News</span> and <span style={{ color: '#cbd5e1' }}>Chatter</span> appear in Market News and the news feed.
                  </p>
                  <form onSubmit={handleMarketNewsSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Post Type</label>
                      <select value={marketNewsForm.type} onChange={(e) => setMarketNewsForm(prev => ({ ...prev, type: e.target.value }))} className="w-full px-4 py-3 rounded-lg" style={inputStyle}>
                        <option value="unconfirmed">Market Chatter (Unconfirmed)</option>
                        <option value="confirmed">Market News (Confirmed)</option>
                        <option value="breaking">🚨 Breaking News</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                        {marketNewsForm.type === 'breaking' ? 'Headline' : 'Content'}
                      </label>
                      <textarea value={marketNewsForm.content} onChange={(e) => setMarketNewsForm(prev => ({ ...prev, content: e.target.value }))} placeholder={marketNewsForm.type === 'breaking' ? 'Enter the breaking news headline...' : 'Enter news content...'} rows={4} className="w-full px-4 py-3 rounded-lg resize-none" style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Category</label>
                      <select value={marketNewsForm.category} onChange={(e) => setMarketNewsForm(prev => ({ ...prev, category: e.target.value }))} className="w-full px-4 py-3 rounded-lg" style={inputStyle}>
                        <option value="General">General</option>
                        <option value="Regulatory">Regulatory</option>
                        <option value="XRP">XRP</option>
                        <option value="ETF">ETF</option>
                        <option value="Government">Government</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Source (e.g. Reuters, Bloomberg, X/Twitter)</label>
                        <input type="text" value={marketNewsForm.source} onChange={(e) => setMarketNewsForm(prev => ({ ...prev, source: e.target.value }))} placeholder="Reuters" className="w-full px-4 py-3 rounded-lg" style={inputStyle} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Source URL (Optional)</label>
                        <input type="url" value={marketNewsForm.source_url} onChange={(e) => setMarketNewsForm(prev => ({ ...prev, source_url: e.target.value }))} placeholder="https://..." className="w-full px-4 py-3 rounded-lg" style={inputStyle} />
                      </div>
                    </div>
                    <button type="submit" disabled={loading} className="px-6 py-3 rounded-lg font-medium disabled:opacity-50" style={btnPrimary}>{loading ? 'Posting...' : marketNewsForm.type === 'breaking' ? 'Post Breaking News' : 'Post'}</button>
                  </form>
                </div>
              )}

              {activeSection === 'morning-brief' && (
                <div className="rounded-xl p-6" style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid #334155' }}>
                  <h2 className="text-xl font-semibold mb-2" style={{ color: '#eceef5' }}>Publish Morning Brief</h2>
                  <p className="text-sm mb-6" style={{ color: '#9aa8be' }}>Headline = the bold title. Summary = the paragraph members read. Key Points = bullet list (one per line).</p>
                  <form onSubmit={handleMorningBriefSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Headline</label>
                      <input type="text" value={morningBriefForm.headline} onChange={(e) => setMorningBriefForm(prev => ({ ...prev, headline: e.target.value }))} placeholder="e.g. Crypto Holds Steady as XRP Consolidates Above $1.40" className="w-full px-4 py-3 rounded-lg" style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Summary (Main Content)</label>
                      <textarea value={morningBriefForm.summary} onChange={(e) => setMorningBriefForm(prev => ({ ...prev, summary: e.target.value }))} placeholder="Write the main summary paragraph here..." rows={6} className="w-full px-4 py-3 rounded-lg resize-none" style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Key Points (One per line — Optional)</label>
                      <textarea value={morningBriefForm.catalysts} onChange={(e) => setMorningBriefForm(prev => ({ ...prev, catalysts: e.target.value }))} placeholder={"BTC and XRP trading within recent ranges\nNo new ETF flow data overnight\nWatch for Fed commentary today"} rows={4} className="w-full px-4 py-3 rounded-lg resize-none" style={inputStyle} />
                      <p className="text-xs mt-1.5" style={{ color: '#6b7a96' }}>Each line becomes a bullet point in the published brief.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Publication Date</label>
                      <input type="date" value={morningBriefForm.date} onChange={(e) => setMorningBriefForm(prev => ({ ...prev, date: e.target.value }))} className="w-full px-4 py-3 rounded-lg" style={inputStyle} />
                    </div>
                    <button type="submit" disabled={loading} className="px-6 py-3 rounded-lg font-medium disabled:opacity-50" style={btnPrimary}>{loading ? 'Publishing...' : 'Publish Morning Brief'}</button>
                  </form>
                </div>
              )}

              {activeSection === 'daily-wrap' && (
                <div className="rounded-xl p-6" style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid #334155' }}>
                  <h2 className="text-xl font-semibold mb-2" style={{ color: '#eceef5' }}>Publish Daily Wrap</h2>
                  <p className="text-sm mb-6" style={{ color: '#9aa8be' }}>Headline = the bold title. Summary = the paragraph members read. Key Events = bullet list (one per line).</p>
                  <form onSubmit={handleDailyWrapSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Headline</label>
                      <input type="text" value={dailyWrapForm.headline} onChange={(e) => setDailyWrapForm(prev => ({ ...prev, headline: e.target.value }))} placeholder="e.g. Crypto Rallies Through Session as BTC and XRP Extend Gains" className="w-full px-4 py-3 rounded-lg" style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Summary (Main Content)</label>
                      <textarea value={dailyWrapForm.summary} onChange={(e) => setDailyWrapForm(prev => ({ ...prev, summary: e.target.value }))} placeholder="Write the main summary paragraph here..." rows={6} className="w-full px-4 py-3 rounded-lg resize-none" style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Key Events (One per line — Optional)</label>
                      <textarea value={dailyWrapForm.catalysts} onChange={(e) => setDailyWrapForm(prev => ({ ...prev, catalysts: e.target.value }))} placeholder={"BTC and XRP both moved higher into the close\nPrice action confirmed continuation\nNo confirmed ETF flow updates"} rows={4} className="w-full px-4 py-3 rounded-lg resize-none" style={inputStyle} />
                      <p className="text-xs mt-1.5" style={{ color: '#6b7a96' }}>Each line becomes a bullet point in the published wrap.</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Publication Date</label>
                      <input type="date" value={dailyWrapForm.date} onChange={(e) => setDailyWrapForm(prev => ({ ...prev, date: e.target.value }))} className="w-full px-4 py-3 rounded-lg" style={inputStyle} />
                    </div>
                    <button type="submit" disabled={loading} className="px-6 py-3 rounded-lg font-medium disabled:opacity-50" style={btnPrimary}>{loading ? 'Publishing...' : 'Publish Daily Wrap'}</button>
                  </form>
                </div>
              )}

              {activeSection === 'market-signals' && (
                <div className="rounded-xl p-6" style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid #334155' }}>
                  <h2 className="text-xl font-semibold mb-2" style={{ color: '#eceef5' }}>Update Market Signals</h2>
                  <p className="text-sm mb-6" style={{ color: '#9aa8be' }}>
                    Pick a Signal and a Value. Color is applied automatically: <span style={{ color: '#10b981' }}>Bullish = Green</span>, <span style={{ color: '#ef4444' }}>Bearish = Red</span>, <span style={{ color: '#f59e0b' }}>Neutral = Yellow</span>, <span style={{ color: '#3b82f6' }}>Cautious = Blue</span>.
                  </p>
                  <form onSubmit={handleSaveSignal} className="space-y-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Signal</label>
                        <select value={signalForm.signal_name} onChange={(e) => setSignalForm(prev => ({ ...prev, signal_name: e.target.value }))} className="w-full px-4 py-3 rounded-lg" style={inputStyle}>
                          {SIGNAL_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Value</label>
                        <select value={signalForm.signal_value} onChange={(e) => setSignalForm(prev => ({ ...prev, signal_value: e.target.value }))} className="w-full px-4 py-3 rounded-lg" style={inputStyle}>
                          {SIGNAL_VALUES.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: '#0f172a', border: '1px solid #475569' }}>
                      <span className="text-sm" style={{ color: '#9aa8be' }}>Preview:</span>
                      <span className="font-medium" style={{ color: '#eceef5' }}>{signalForm.signal_name}</span>
                      <span className="px-3 py-1 rounded text-sm font-semibold ml-auto" style={{ background: previewColor.bg, color: previewColor.text }}>{signalForm.signal_value}</span>
                    </div>
                    <button type="submit" disabled={loading} className="px-6 py-3 rounded-lg font-medium disabled:opacity-50" style={btnPrimary}>{loading ? 'Saving...' : 'Save Signal'}</button>
                  </form>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium mb-4" style={{ color: '#eceef5' }}>Current Signals</h3>
                    {marketSignals.length === 0 ? (
                      <p className="text-sm" style={{ color: '#6b7a96' }}>No signals set yet.</p>
                    ) : (
                      marketSignals.map(s => {
                        var c = colorPreviewMap[s.color] || colorPreviewMap.blue
                        return (
                          <div key={s.signal_name} className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#1e293b', border: '1px solid #475569' }}>
                            <span className="font-medium" style={{ color: '#eceef5' }}>{s.signal_name}</span>
                            <div className="flex items-center gap-3">
                              <span className="px-3 py-1 rounded text-sm font-semibold" style={{ background: c.bg, color: c.text }}>{s.signal_value}</span>
                              <button onClick={() => handleDeleteSignal(s.signal_name)} className="p-2 rounded-lg" style={{ color: '#ef4444' }} title="Remove"><Trash2 size={14} /></button>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )}

              {activeSection === 'etf-snapshots' && (
                <div className="rounded-xl p-6" style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid #334155' }}>
                  <h2 className="text-xl font-semibold mb-2" style={{ color: '#eceef5' }}>ETF Daily Data</h2>
                  <p className="text-sm mb-6" style={{ color: '#9aa8be' }}>
                    Update each ETF's XRP locked + AUM (in dollars) once per day. The system automatically calculates 24h, 7d, and 30d inflows / outflows / net flow by comparing to past snapshots. <span style={{ color: '#cbd5e1' }}>Source links are next to each ETF name.</span>
                  </p>

                  <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.3)' }}>
                    <p className="text-sm" style={{ color: '#cbd5e1' }}>
                      <strong style={{ color: '#3b82f6' }}>Quick workflow:</strong> Open CoinGlass (or each issuer's site), copy today's XRP locked + AUM, paste here, click Save All. Takes ~60 seconds.
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Snapshot Date</label>
                    <input type="date" value={snapshotDate} onChange={(e) => setSnapshotDate(e.target.value)} className="w-full md:w-64 px-4 py-3 rounded-lg" style={inputStyle} />
                    <p className="text-xs mt-1.5" style={{ color: '#6b7a96' }}>Selecting an existing date will show those values for editing.</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    {etfList.length === 0 ? (
                      <p className="text-sm" style={{ color: '#6b7a96' }}>No ETFs found. Run the migration SQL first.</p>
                    ) : (
                      etfList.map(etf => {
                        var src = ETF_SOURCES[etf.ticker] || { name: 'source', url: '#' }
                        var s = snapshots[etf.ticker] || {}
                        return (
                          <div key={etf.ticker} className="p-4 rounded-lg" style={{ background: '#1e293b', border: '1px solid #475569' }}>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-2 h-10 rounded-full flex-shrink-0" style={{ background: etf.color || '#3b82f6' }} />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold" style={{ color: '#eceef5' }}>{etf.etf_name}</p>
                                <div className="flex items-center gap-2 text-xs">
                                  <span style={{ color: '#9aa8be' }}>{etf.ticker}</span>
                                  <span style={{ color: '#475569' }}>·</span>
                                  <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6' }}>{src.name} official site →</a>
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: '#cbd5e1' }}>XRP Locked</label>
                                <input type="text" value={s.xrp_locked != null ? s.xrp_locked : ''} onChange={(e) => updateSnapshotField(etf.ticker, 'xrp_locked', e.target.value)} placeholder="229,068,373" className="w-full px-4 py-2.5 rounded-lg" style={innerInputStyle} />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: '#cbd5e1' }}>AUM ($ full dollars)</label>
                                <input type="text" value={s.aum_usd != null ? s.aum_usd : ''} onChange={(e) => updateSnapshotField(etf.ticker, 'aum_usd', e.target.value)} placeholder="329,634,413" className="w-full px-4 py-2.5 rounded-lg" style={innerInputStyle} />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: '#cbd5e1' }}>NAV (Optional)</label>
                                <input type="text" value={s.nav_per_share != null ? s.nav_per_share : ''} onChange={(e) => updateSnapshotField(etf.ticker, 'nav_per_share', e.target.value)} placeholder="16.10" className="w-full px-4 py-2.5 rounded-lg" style={innerInputStyle} />
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  <button onClick={handleSaveAllSnapshots} disabled={savingSnapshots || etfList.length === 0} className="px-6 py-3 rounded-lg font-medium disabled:opacity-50" style={btnPrimary}>
                    {savingSnapshots ? 'Saving + recalculating flows...' : 'Save All ETF Snapshots'}
                  </button>
                </div>
              )}

              {activeSection === 'etf-pipeline' && (
                <div className="rounded-xl p-6" style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid #334155' }}>
                  <h2 className="text-xl font-semibold mb-2" style={{ color: '#eceef5' }}>ETF Pipeline — High Priority Watch</h2>
                  <p className="text-sm mb-6" style={{ color: '#9aa8be' }}>Add, edit, and remove pipeline entries (BlackRock, Fidelity, Invesco, etc.)</p>
                  <div className="space-y-3 mb-6">
                    {etfPipeline.map(p => (
                      <div key={p.id} className="p-4 rounded-lg" style={{ background: '#1e293b', border: '1px solid #475569' }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div><label className="block text-xs font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Issuer Name</label><input type="text" value={p.issuer_name || ''} onChange={(e) => updateEtfPipelineField(p.id, 'issuer_name', e.target.value)} className="w-full px-4 py-2.5 rounded-lg" style={innerInputStyle} /></div>
                          <div><label className="block text-xs font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Priority</label><select value={p.priority || 'Medium'} onChange={(e) => updateEtfPipelineField(p.id, 'priority', e.target.value)} className="w-full px-4 py-2.5 rounded-lg" style={innerInputStyle}><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select></div>
                          <div className="md:col-span-2"><label className="block text-xs font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Status</label><select value={p.status || 'Not Filed'} onChange={(e) => updateEtfPipelineField(p.id, 'status', e.target.value)} className="w-full px-4 py-2.5 rounded-lg" style={innerInputStyle}><option value="Not Filed">Not Filed</option><option value="Filed">Filed</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option></select></div>
                        </div>
                        <div className="mb-3"><label className="block text-xs font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Notes</label><textarea value={p.notes || ''} onChange={(e) => updateEtfPipelineField(p.id, 'notes', e.target.value)} rows={2} className="w-full px-4 py-2.5 rounded-lg resize-none" style={innerInputStyle} /></div>
                        <div className="flex gap-2">
                          <button onClick={() => saveEtfPipelineRow(p)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: '#3b82f6', color: '#fff' }}>Save</button>
                          <button onClick={() => handleRemovePipeline(p.id)} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 rounded-lg" style={{ background: '#0f172a', border: '1px dashed #475569' }}>
                    <h3 className="text-sm font-semibold mb-4" style={{ color: '#cbd5e1' }}>Add Pipeline Entry</h3>
                    <form onSubmit={handleAddPipeline} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="block text-xs font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Issuer Name</label><input type="text" value={newPipeline.issuer_name} onChange={(e) => setNewPipeline(prev => ({ ...prev, issuer_name: e.target.value }))} placeholder="BlackRock" className="w-full px-4 py-2.5 rounded-lg" style={inputStyle} /></div>
                        <div><label className="block text-xs font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Priority</label><select value={newPipeline.priority} onChange={(e) => setNewPipeline(prev => ({ ...prev, priority: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg" style={inputStyle}><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></select></div>
                        <div className="md:col-span-2"><label className="block text-xs font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Status</label><select value={newPipeline.status} onChange={(e) => setNewPipeline(prev => ({ ...prev, status: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg" style={inputStyle}><option value="Not Filed">Not Filed</option><option value="Filed">Filed</option><option value="Approved">Approved</option><option value="Rejected">Rejected</option></select></div>
                      </div>
                      <div><label className="block text-xs font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Notes</label><textarea value={newPipeline.notes} onChange={(e) => setNewPipeline(prev => ({ ...prev, notes: e.target.value }))} placeholder="Why this issuer matters..." rows={2} className="w-full px-4 py-2.5 rounded-lg resize-none" style={inputStyle} /></div>
                      <button type="submit" disabled={addingPipeline} className="px-6 py-2.5 rounded-lg font-medium disabled:opacity-50" style={btnPrimary}>{addingPipeline ? 'Adding...' : 'Add to Pipeline'}</button>
                    </form>
                  </div>
                </div>
              )}

              {activeSection === 'youtube-intel' && (
                <div className="rounded-xl p-6" style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid #334155' }}>
                  <h2 className="text-xl font-semibold mb-6" style={{ color: '#eceef5' }}>Add YouTube Video</h2>
                  <form onSubmit={handleYouTubeSubmit} className="space-y-6 mb-8">
                    <div><label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Video Title</label><input type="text" value={youtubeForm.title} onChange={(e) => setYoutubeForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Enter title..." className="w-full px-4 py-3 rounded-lg" style={inputStyle} /></div>
                    <div><label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Description (Optional)</label><textarea value={youtubeForm.description} onChange={(e) => setYoutubeForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Brief description..." rows={3} className="w-full px-4 py-3 rounded-lg resize-none" style={inputStyle} /></div>
                    <div><label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>YouTube URL</label><input type="url" value={youtubeForm.youtube_url} onChange={(e) => setYoutubeForm(prev => ({ ...prev, youtube_url: e.target.value }))} placeholder="https://www.youtube.com/watch?v=..." className="w-full px-4 py-3 rounded-lg" style={inputStyle} /></div>
                    {youtubeForm.thumbnail_url && (
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Preview</label>
                        <div className="flex items-center gap-4 p-4 rounded-lg" style={{ background: '#1e293b', border: '1px solid #475569' }}>
                          <img src={youtubeForm.thumbnail_url} alt="thumbnail" className="w-24 h-18 object-cover rounded" onError={(e) => { e.target.src = 'https://img.youtube.com/vi/' + youtubeForm.video_id + '/hqdefault.jpg' }} />
                          <div>
                            <p className="font-medium" style={{ color: '#eceef5' }}>{youtubeForm.title || 'Video Title'}</p>
                            <p className="text-sm" style={{ color: '#9aa8be' }}>{youtubeForm.description || 'No description'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <button type="submit" disabled={loading} className="px-6 py-3 rounded-lg font-medium disabled:opacity-50" style={btnPrimary}>{loading ? 'Adding...' : 'Add Video'}</button>
                  </form>
                  <div className="border-t pt-6" style={{ borderColor: '#475569' }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: '#eceef5' }}>Manage Videos ({youtubeVideos.length})</h3>
                    {youtubeVideos.length === 0 ? (
                      <div className="text-center py-8" style={{ color: '#6b7a96' }}>No videos added yet.</div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {youtubeVideos.map(v => (
                          <div key={v.id} className="flex items-center gap-4 p-4 rounded-lg" style={{ background: '#1e293b', border: '1px solid #475569' }}>
                            <img src={v.thumbnail_url} alt={v.title} className="w-16 h-12 object-cover rounded" onError={(e) => { e.target.src = 'https://img.youtube.com/vi/' + v.video_id + '/hqdefault.jpg' }} />
                            <div className="flex-1 min-w-0"><h4 className="font-medium truncate" style={{ color: '#eceef5' }}>{v.title}</h4><p className="text-sm truncate" style={{ color: '#9aa8be' }}>{v.description || 'No description'}</p></div>
                            <button onClick={() => handleDeleteYouTubeVideo(v.id)} className="p-2 rounded-lg" style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeSection === 'master-watchlist' && (
                <div className="rounded-xl p-6" style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid #334155' }}>
                  <h2 className="text-xl font-semibold mb-6" style={{ color: '#eceef5' }}>Master Watchlist</h2>
                  <form onSubmit={handleAddSymbol} className="mb-6">
                    <div className="flex gap-3">
                      <input type="text" value={newSymbol} onChange={(e) => setNewSymbol(e.target.value)} placeholder="Enter symbol (e.g. ADA)" className="flex-1 px-4 py-3 rounded-lg" style={inputStyle} />
                      <button type="submit" disabled={loading} className="px-6 py-3 rounded-lg font-medium disabled:opacity-50" style={btnPrimary}><Plus size={18} /></button>
                    </div>
                  </form>
                  <div className="space-y-2">
                    {symbols.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#1e293b', border: '1px solid #475569' }}>
                        <span className="font-medium" style={{ color: '#eceef5' }}>{s.symbol}</span>
                        <button onClick={() => handleDeleteSymbol(s.id)} className="p-2 rounded-lg" style={{ color: '#ef4444' }}><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'notifications' && (
                <div className="rounded-xl p-6" style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid #334155' }}>
                  <h2 className="text-xl font-semibold mb-6" style={{ color: '#eceef5' }}>Send Notification</h2>
                  <form onSubmit={handleNotificationSubmit} className="space-y-6">
                    <div><label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Notification Title</label><input type="text" value={notificationForm.title} onChange={(e) => setNotificationForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Enter title..." className="w-full px-4 py-3 rounded-lg" style={inputStyle} /></div>
                    <div><label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Message</label><textarea value={notificationForm.message} onChange={(e) => setNotificationForm(prev => ({ ...prev, message: e.target.value }))} placeholder="Enter message..." rows={4} className="w-full px-4 py-3 rounded-lg resize-none" style={inputStyle} /></div>
                    <button type="submit" disabled={loading} className="px-6 py-3 rounded-lg font-medium disabled:opacity-50" style={btnPrimary}>{loading ? 'Sending...' : 'Send Notification'}</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
