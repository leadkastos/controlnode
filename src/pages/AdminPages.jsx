import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { Plus, Trash2, Bell, MessageCircle, PlaySquare, FileText, BarChart3, TrendingUp, Calendar, Database, Pencil, X } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const SIGNAL_NAMES = ['Market Sentiment', 'Risk Environment', 'Technical Outlook']
const SIGNAL_VALUE_COLORS = { Bullish: 'green', Bearish: 'red', Neutral: 'yellow', Cautious: 'blue' }
const SIGNAL_VALUES = Object.keys(SIGNAL_VALUE_COLORS)

export default function AdminPages() {
  const { profile } = useAuth()
  const [activeSection, setActiveSection] = useState('market-news')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [marketNewsForm, setMarketNewsForm] = useState({ type: 'unconfirmed', content: '', category: 'General', source: '', source_url: '' })
  const [editingNewsId, setEditingNewsId] = useState(null)
  const [recentNews, setRecentNews] = useState([])

  const [youtubeForm, setYoutubeForm] = useState({ title: '', description: '', youtube_url: '', video_id: '', thumbnail_url: '' })
  const [youtubeVideos, setYoutubeVideos] = useState([])
  const [symbols, setSymbols] = useState([])
  const [newSymbol, setNewSymbol] = useState('')
  const [notificationForm, setNotificationForm] = useState({ title: '', message: '' })

  const [morningBriefForm, setMorningBriefForm] = useState({ headline: '', summary: '', catalysts: '', date: '' })
  const [editingBriefId, setEditingBriefId] = useState(null)
  const [recentBriefs, setRecentBriefs] = useState([])

  const [dailyWrapForm, setDailyWrapForm] = useState({ headline: '', summary: '', catalysts: '', date: '' })
  const [editingWrapId, setEditingWrapId] = useState(null)
  const [recentWraps, setRecentWraps] = useState([])

  const [marketSignals, setMarketSignals] = useState([])
  const [signalForm, setSignalForm] = useState({ signal_name: 'Market Sentiment', signal_value: 'Bullish' })

  const [etfList, setEtfList] = useState([])
  const [snapshotDate, setSnapshotDate] = useState('')
  const [snapshots, setSnapshots] = useState({})
  const [savingSnapshots, setSavingSnapshots] = useState(false)

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

  useEffect(() => {
    loadMasterSymbols()
    loadMarketSignals()
    loadYouTubeVideos()
    loadEtfData()
    loadRecentNews()
    loadRecentBriefs()
    loadRecentWraps()
  }, [])

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
  async function loadRecentNews() {
    const r = await supabase.from('market_news').select('*').order('created_at', { ascending: false }).limit(20)
    if (r.data) setRecentNews(r.data)
  }
  async function loadRecentBriefs() {
    const r = await supabase.from('morning_briefs').select('*').order('date', { ascending: false }).limit(10)
    if (r.data) setRecentBriefs(r.data)
  }
  async function loadRecentWraps() {
    const r = await supabase.from('daily_wraps').select('*').order('date', { ascending: false }).limit(10)
    if (r.data) setRecentWraps(r.data)
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
          inflow_usd: s.inflow_usd,
          outflow_usd: s.outflow_usd
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
      var aum = parseFloat(String(s.aum_usd || '').replace(/,/g, '')) || 0
      var xrp = parseFloat(String(s.xrp_locked || '').replace(/,/g, '')) || 0
      var inflow = parseFloat(String(s.inflow_usd || '').replace(/,/g, '')) || 0
      var outflow = parseFloat(String(s.outflow_usd || '').replace(/,/g, '')) || 0

      if (aum === 0 && xrp === 0 && inflow === 0 && outflow === 0) continue

      rows.push({
        ticker: etf.ticker,
        etf_name: etf.etf_name,
        snapshot_date: snapshotDate,
        xrp_locked: xrp,
        aum_usd: aum,
        inflow_usd: inflow,
        outflow_usd: outflow,
        data_source: 'manual',
        created_by: profile.id
      })
    }

    if (rows.length === 0) {
      setSavingSnapshots(false)
      setMessage('Nothing to save — enter numbers for at least one ETF')
      return
    }

    const { error: snapErr } = await supabase
      .from('etf_daily_snapshots')
      .upsert(rows, { onConflict: 'ticker,snapshot_date' })

    if (snapErr) {
      setSavingSnapshots(false)
      setMessage('Error saving snapshots: ' + snapErr.message)
      return
    }

    for (var j = 0; j < rows.length; j++) {
      var r = rows[j]
      await supabase.from('etf_aum').update({
        aum: r.aum_usd / 1000000,
        updated_at: new Date().toISOString()
      }).eq('ticker', r.ticker)
    }

    var totalAumUsd = rows.reduce((s, r) => s + r.aum_usd, 0)
    var totalXrpLocked = rows.reduce((s, r) => s + r.xrp_locked, 0)

    var summaryPayload = {
      total_aum: totalAumUsd / 1000000,
      xrp_in_etfs: totalXrpLocked / 1000000,
      updated_at: new Date().toISOString()
    }

    const { data: existing } = await supabase.from('etf_summary').select('id').limit(1).maybeSingle()
    if (existing) {
      await supabase.from('etf_summary').update(summaryPayload).eq('id', existing.id)
    } else {
      await supabase.from('etf_summary').insert([summaryPayload])
    }

    setSavingSnapshots(false)
    setMessage('Saved ' + rows.length + ' ETF snapshots! Member page and dashboard now reflect updated numbers.')
  }

  async function handleMarketNewsSubmit(e) {
    e.preventDefault()
    if (!marketNewsForm.content.trim()) { setMessage('Content is required'); return }
    setLoading(true)
    const payload = {
      type: marketNewsForm.type,
      content: marketNewsForm.content,
      category: marketNewsForm.category,
      source: marketNewsForm.source || null,
      source_url: marketNewsForm.source_url || null
    }
    var error
    if (editingNewsId) {
      const r = await supabase.from('market_news').update(payload).eq('id', editingNewsId)
      error = r.error
    } else {
      payload.created_by = profile.id
      const r = await supabase.from('market_news').insert([payload])
      error = r.error
    }
    setLoading(false)
    if (error) { setMessage('Error: ' + error.message); return }
    var label = marketNewsForm.type === 'breaking' ? 'Breaking news' : marketNewsForm.type === 'confirmed' ? 'Market news' : 'Market chatter'
    setMessage(editingNewsId ? label + ' updated successfully!' : label + ' posted successfully!')
    setMarketNewsForm({ type: 'unconfirmed', content: '', category: 'General', source: '', source_url: '' })
    setEditingNewsId(null)
    loadRecentNews()
  }

  function handleEditNews(post) {
    setEditingNewsId(post.id)
    setMarketNewsForm({
      type: post.type || 'unconfirmed',
      content: post.content || '',
      category: post.category || 'General',
      source: post.source || '',
      source_url: post.source_url || ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEditNews() {
    setEditingNewsId(null)
    setMarketNewsForm({ type: 'unconfirmed', content: '', category: 'General', source: '', source_url: '' })
  }

  async function handleDeleteNews(id) {
    if (!confirm('Delete this post? This cannot be undone.')) return
    const { error } = await supabase.from('market_news').delete().eq('id', id)
    if (error) { setMessage('Error deleting: ' + error.message); return }
    setMessage('Post deleted')
    if (editingNewsId === id) handleCancelEditNews()
    loadRecentNews()
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

  function catalystsToText(arr) {
    if (!arr || !Array.isArray(arr)) return ''
    return arr.join('\n')
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
      published_at: new Date().toISOString()
    }
    var error
    if (editingBriefId) {
      const r = await supabase.from('morning_briefs').update(payload).eq('id', editingBriefId)
      error = r.error
    } else {
      payload.created_by = profile.id
      const r = await supabase.from('morning_briefs').insert([payload])
      error = r.error
    }
    setLoading(false)
    if (error) { setMessage('Error: ' + error.message); return }
    setMessage(editingBriefId ? 'Morning Brief updated!' : 'Morning Brief published!')
    var today = new Date().toISOString().split('T')[0]
    setMorningBriefForm({ headline: '', summary: '', catalysts: '', date: today })
    setEditingBriefId(null)
    loadRecentBriefs()
  }

  function handleEditBrief(brief) {
    setEditingBriefId(brief.id)
    setMorningBriefForm({
      headline: brief.headline || '',
      summary: brief.summary || '',
      catalysts: catalystsToText(brief.catalysts),
      date: brief.date || ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEditBrief() {
    setEditingBriefId(null)
    var today = new Date().toISOString().split('T')[0]
    setMorningBriefForm({ headline: '', summary: '', catalysts: '', date: today })
  }

  async function handleDeleteBrief(id) {
    if (!confirm('Delete this Morning Brief? This cannot be undone.')) return
    const { error } = await supabase.from('morning_briefs').delete().eq('id', id)
    if (error) { setMessage('Error deleting: ' + error.message); return }
    setMessage('Morning Brief deleted')
    if (editingBriefId === id) handleCancelEditBrief()
    loadRecentBriefs()
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
      published_at: new Date().toISOString()
    }
    var error
    if (editingWrapId) {
      const r = await supabase.from('daily_wraps').update(payload).eq('id', editingWrapId)
      error = r.error
    } else {
      payload.created_by = profile.id
      const r = await supabase.from('daily_wraps').insert([payload])
      error = r.error
    }
    setLoading(false)
    if (error) { setMessage('Error: ' + error.message); return }
    setMessage(editingWrapId ? 'Daily Wrap updated!' : 'Daily Wrap published!')
    var today = new Date().toISOString().split('T')[0]
    setDailyWrapForm({ headline: '', summary: '', catalysts: '', date: today })
    setEditingWrapId(null)
    loadRecentWraps()
  }

  function handleEditWrap(wrap) {
    setEditingWrapId(wrap.id)
    setDailyWrapForm({
      headline: wrap.headline || '',
      summary: wrap.summary || '',
      catalysts: catalystsToText(wrap.catalysts),
      date: wrap.date || ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancelEditWrap() {
    setEditingWrapId(null)
    var today = new Date().toISOString().split('T')[0]
    setDailyWrapForm({ headline: '', summary: '', catalysts: '', date: today })
  }

  async function handleDeleteWrap(id) {
    if (!confirm('Delete this Daily Wrap? This cannot be undone.')) return
    const { error } = await supabase.from('daily_wraps').delete().eq('id', id)
    if (error) { setMessage('Error deleting: ' + error.message); return }
    setMessage('Daily Wrap deleted')
    if (editingWrapId === id) handleCancelEditWrap()
    loadRecentWraps()
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

  const ETF_SOURCES = {
    'XRP':  { name: 'Bitwise',           url: 'https://bitxrpetf.com/' },
    'XRPC': { name: 'Canary',            url: 'https://canaryetfs.com/xrpc/' },
    'XRPZ': { name: 'Franklin Templeton',url: 'https://www.franklintempleton.com/investments/options/exchange-traded-funds/products/47318/SINGLCLASS/franklin-xrp-etf/XRPZ' },
    'TOXR': { name: '21Shares',          url: 'https://www.21shares.com/en-us/products-us/toxr' },
    'GXRP': { name: 'Grayscale',         url: 'https://etfs.grayscale.com/gxrp' },
    'XRPR': { name: 'REX-Osprey',        url: 'https://www.rexshares.com/xrpr/' }
  }

  function newsTypeBadge(type) {
    if (type === 'breaking') return { label: '🚨 BREAKING', bg: 'rgba(239,68,68,0.20)', color: '#ef4444' }
    if (type === 'confirmed') return { label: 'NEWS', bg: 'rgba(59,130,246,0.20)', color: '#3b82f6' }
    return { label: 'CHATTER', bg: 'rgba(245,158,11,0.20)', color: '#f59e0b' }
  }

  // FIXED: Date-only fields (YYYY-MM-DD) need 'T00:00:00' appended to parse as local time, not UTC.
  // Without this fix, "2026-04-28" gets parsed as midnight UTC, then converted to local time
  // (e.g. CT) which shifts back 5+ hours and displays as "Apr 27".
  function formatDate(d) {
    if (!d) return ''
    try {
      // Detect plain date strings (YYYY-MM-DD) and force local-time parsing
      var dt
      if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
        dt = new Date(d + 'T00:00:00')
      } else {
        dt = new Date(d)
      }
      return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch (e) { return d }
  }

  // formatDateTime is used for created_at timestamps which already include time + timezone,
  // so they don't have the day-shift problem. Kept as-is.
  function formatDateTime(d) {
    if (!d) return ''
    try {
      var dt = new Date(d)
      return dt.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    } catch (e) { return d }
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
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold" style={{ color: '#eceef5' }}>
                      {editingNewsId ? 'Edit Market News Post' : 'Post Market News'}
                    </h2>
                    {editingNewsId && (
                      <button onClick={handleCancelEditNews} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm" style={{ background: 'rgba(148,163,184,0.15)', color: '#cbd5e1' }}>
                        <X size={14} /> Cancel Edit
                      </button>
                    )}
                  </div>
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
                    <button type="submit" disabled={loading} className="px-6 py-3 rounded-lg font-medium disabled:opacity-50" style={btnPrimary}>
                      {loading ? (editingNewsId ? 'Updating...' : 'Posting...') : (editingNewsId ? 'Update Post' : (marketNewsForm.type === 'breaking' ? 'Post Breaking News' : 'Post'))}
                    </button>
                  </form>

                  <div className="mt-10 pt-6 border-t" style={{ borderColor: '#475569' }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: '#eceef5' }}>Recent Posts ({recentNews.length})</h3>
                    {recentNews.length === 0 ? (
                      <p className="text-sm" style={{ color: '#6b7a96' }}>No posts yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {recentNews.map(post => {
                          var badge = newsTypeBadge(post.type)
                          var isEditing = editingNewsId === post.id
                          return (
                            <div key={post.id} className="p-4 rounded-lg" style={{ background: isEditing ? 'rgba(59,130,246,0.10)' : '#1e293b', border: '1px solid ' + (isEditing ? '#3b82f6' : '#475569') }}>
                              <div className="flex items-start gap-3">
                                <span className="px-2 py-1 rounded text-xs font-bold flex-shrink-0" style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm mb-2" style={{ color: '#eceef5' }}>{post.content}</p>
                                  <div className="flex items-center gap-3 text-xs" style={{ color: '#9aa8be' }}>
                                    <span>{post.category}</span>
                                    {post.source && <><span style={{ color: '#475569' }}>·</span><span>{post.source}</span></>}
                                    <span style={{ color: '#475569' }}>·</span>
                                    <span>{formatDateTime(post.created_at)}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <button onClick={() => handleEditNews(post)} className="p-2 rounded-lg" style={{ background: 'rgba(59,130,246,0.10)', color: '#3b82f6' }} title="Edit"><Pencil size={14} /></button>
                                  <button onClick={() => handleDeleteNews(post.id)} className="p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.10)', color: '#ef4444' }} title="Delete"><Trash2 size={14} /></button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeSection === 'morning-brief' && (
                <div className="rounded-xl p-6" style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid #334155' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold" style={{ color: '#eceef5' }}>
                      {editingBriefId ? 'Edit Morning Brief' : 'Publish Morning Brief'}
                    </h2>
                    {editingBriefId && (
                      <button onClick={handleCancelEditBrief} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm" style={{ background: 'rgba(148,163,184,0.15)', color: '#cbd5e1' }}>
                        <X size={14} /> Cancel Edit
                      </button>
                    )}
                  </div>
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
                    <button type="submit" disabled={loading} className="px-6 py-3 rounded-lg font-medium disabled:opacity-50" style={btnPrimary}>
                      {loading ? (editingBriefId ? 'Updating...' : 'Publishing...') : (editingBriefId ? 'Update Morning Brief' : 'Publish Morning Brief')}
                    </button>
                  </form>

                  <div className="mt-10 pt-6 border-t" style={{ borderColor: '#475569' }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: '#eceef5' }}>Recent Morning Briefs ({recentBriefs.length})</h3>
                    {recentBriefs.length === 0 ? (
                      <p className="text-sm" style={{ color: '#6b7a96' }}>No briefs published yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {recentBriefs.map(brief => {
                          var isEditing = editingBriefId === brief.id
                          return (
                            <div key={brief.id} className="p-4 rounded-lg" style={{ background: isEditing ? 'rgba(59,130,246,0.10)' : '#1e293b', border: '1px solid ' + (isEditing ? '#3b82f6' : '#475569') }}>
                              <div className="flex items-start gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>{formatDate(brief.date)}</span>
                                  </div>
                                  <p className="font-medium mb-1" style={{ color: '#eceef5' }}>{brief.headline}</p>
                                  <p className="text-sm line-clamp-2" style={{ color: '#9aa8be' }}>{brief.summary}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <button onClick={() => handleEditBrief(brief)} className="p-2 rounded-lg" style={{ background: 'rgba(59,130,246,0.10)', color: '#3b82f6' }} title="Edit"><Pencil size={14} /></button>
                                  <button onClick={() => handleDeleteBrief(brief.id)} className="p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.10)', color: '#ef4444' }} title="Delete"><Trash2 size={14} /></button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeSection === 'daily-wrap' && (
                <div className="rounded-xl p-6" style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid #334155' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-semibold" style={{ color: '#eceef5' }}>
                      {editingWrapId ? 'Edit Daily Wrap' : 'Publish Daily Wrap'}
                    </h2>
                    {editingWrapId && (
                      <button onClick={handleCancelEditWrap} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm" style={{ background: 'rgba(148,163,184,0.15)', color: '#cbd5e1' }}>
                        <X size={14} /> Cancel Edit
                      </button>
                    )}
                  </div>
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
                    <button type="submit" disabled={loading} className="px-6 py-3 rounded-lg font-medium disabled:opacity-50" style={btnPrimary}>
                      {loading ? (editingWrapId ? 'Updating...' : 'Publishing...') : (editingWrapId ? 'Update Daily Wrap' : 'Publish Daily Wrap')}
                    </button>
                  </form>

                  <div className="mt-10 pt-6 border-t" style={{ borderColor: '#475569' }}>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: '#eceef5' }}>Recent Daily Wraps ({recentWraps.length})</h3>
                    {recentWraps.length === 0 ? (
                      <p className="text-sm" style={{ color: '#6b7a96' }}>No wraps published yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {recentWraps.map(wrap => {
                          var isEditing = editingWrapId === wrap.id
                          return (
                            <div key={wrap.id} className="p-4 rounded-lg" style={{ background: isEditing ? 'rgba(59,130,246,0.10)' : '#1e293b', border: '1px solid ' + (isEditing ? '#3b82f6' : '#475569') }}>
                              <div className="flex items-start gap-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}>{formatDate(wrap.date)}</span>
                                  </div>
                                  <p className="font-medium mb-1" style={{ color: '#eceef5' }}>{wrap.headline}</p>
                                  <p className="text-sm line-clamp-2" style={{ color: '#9aa8be' }}>{wrap.summary}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <button onClick={() => handleEditWrap(wrap)} className="p-2 rounded-lg" style={{ background: 'rgba(59,130,246,0.10)', color: '#3b82f6' }} title="Edit"><Pencil size={14} /></button>
                                  <button onClick={() => handleDeleteWrap(wrap.id)} className="p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.10)', color: '#ef4444' }} title="Delete"><Trash2 size={14} /></button>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
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
                    Update each ETF's <span style={{ color: '#cbd5e1' }}>XRP Locked</span>, <span style={{ color: '#cbd5e1' }}>AUM</span>, <span style={{ color: '#cbd5e1' }}>Inflow $</span>, and <span style={{ color: '#cbd5e1' }}>Outflow $</span> twice daily. Net flow is auto-calculated. Source links are next to each ETF name.
                  </p>

                  <div className="mb-6 p-4 rounded-lg" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.3)' }}>
                    <p className="text-sm" style={{ color: '#cbd5e1' }}>
                      <strong style={{ color: '#3b82f6' }}>Quick workflow:</strong> Open xrp-insights.com (or each issuer's site), copy today's XRP Locked + AUM + Inflows + Outflows, paste here, click Save All. Takes ~90 seconds.
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
                        var inflow = parseFloat(String(s.inflow_usd || '').replace(/,/g, '')) || 0
                        var outflow = parseFloat(String(s.outflow_usd || '').replace(/,/g, '')) || 0
                        var net = inflow - outflow
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
                              {(inflow !== 0 || outflow !== 0) && (
                                <div className="text-right flex-shrink-0">
                                  <p className="text-xs" style={{ color: '#9aa8be' }}>Net flow</p>
                                  <p className="text-sm font-bold" style={{ color: net >= 0 ? '#10b981' : '#ef4444' }}>
                                    {net >= 0 ? '+' : '−'}${Math.abs(net).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                  </p>
                                </div>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                              <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: '#cbd5e1' }}>XRP Locked</label>
                                <input type="text" value={s.xrp_locked != null ? s.xrp_locked : ''} onChange={(e) => updateSnapshotField(etf.ticker, 'xrp_locked', e.target.value)} placeholder="229,068,373" className="w-full px-4 py-2.5 rounded-lg" style={innerInputStyle} />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: '#cbd5e1' }}>AUM ($ full dollars)</label>
                                <input type="text" value={s.aum_usd != null ? s.aum_usd : ''} onChange={(e) => updateSnapshotField(etf.ticker, 'aum_usd', e.target.value)} placeholder="329,634,413" className="w-full px-4 py-2.5 rounded-lg" style={innerInputStyle} />
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: '#10b981' }}>Inflow $ (today)</label>
                                <input type="text" value={s.inflow_usd != null ? s.inflow_usd : ''} onChange={(e) => updateSnapshotField(etf.ticker, 'inflow_usd', e.target.value)} placeholder="5,200,000" className="w-full px-4 py-2.5 rounded-lg" style={innerInputStyle} />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1.5" style={{ color: '#ef4444' }}>Outflow $ (today)</label>
                                <input type="text" value={s.outflow_usd != null ? s.outflow_usd : ''} onChange={(e) => updateSnapshotField(etf.ticker, 'outflow_usd', e.target.value)} placeholder="0" className="w-full px-4 py-2.5 rounded-lg" style={innerInputStyle} />
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  <button onClick={handleSaveAllSnapshots} disabled={savingSnapshots || etfList.length === 0} className="px-6 py-3 rounded-lg font-medium disabled:opacity-50" style={btnPrimary}>
                    {savingSnapshots ? 'Saving...' : 'Save All ETF Snapshots'}
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
