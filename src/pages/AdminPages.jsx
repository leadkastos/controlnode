import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { Plus, Trash2, Bell, MessageCircle, PlaySquare, FileText, BarChart3, TrendingUp, Calendar } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

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

  // Morning Brief — matches actual DB columns: headline, summary, catalysts (array), date, published
  const [morningBriefForm, setMorningBriefForm] = useState({ headline: '', summary: '', catalysts: '', date: '' })

  // Daily Wrap — same schema as morning_briefs
  const [dailyWrapForm, setDailyWrapForm] = useState({ headline: '', summary: '', catalysts: '', date: '' })

  const [marketSignals, setMarketSignals] = useState([])
  const [newSignal, setNewSignal] = useState({ signal_name: '', signal_value: '', color: 'blue' })

  // ETF FLOWS state
  const [etfSummary, setEtfSummary] = useState(null)
  const [etfSummarySaving, setEtfSummarySaving] = useState(false)
  const [etfAumList, setEtfAumList] = useState([])
  const [etfAumSaving, setEtfAumSaving] = useState(null)
  const [newEtf, setNewEtf] = useState({ etf_name: '', ticker: '', etf_type: 'Spot', aum: 0, color: '#3b82f6' })
  const [addingEtf, setAddingEtf] = useState(false)
  const [etfPipeline, setEtfPipeline] = useState([])
  const [newPipeline, setNewPipeline] = useState({ issuer_name: '', priority: 'Medium', notes: '', status: 'Not Filed' })
  const [addingPipeline, setAddingPipeline] = useState(false)

  function extractVideoId(url) {
    if (!url) return ''
    const patterns = [/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/, /youtube\.com\/v\/([^&\n?#]+)/]
    for (const p of patterns) { const m = url.match(p); if (m) return m[1] }
    return ''
  }

  // Default the date to today (YYYY-MM-DD) when forms first load
  useEffect(() => {
    var today = new Date().toISOString().split('T')[0]
    setMorningBriefForm(prev => ({ ...prev, date: prev.date || today }))
    setDailyWrapForm(prev => ({ ...prev, date: prev.date || today }))
  }, [])

  useEffect(() => {
    const id = extractVideoId(youtubeForm.youtube_url)
    if (id) setYoutubeForm(prev => ({ ...prev, video_id: id, thumbnail_url: 'https://img.youtube.com/vi/' + id + '/maxresdefault.jpg' }))
    else setYoutubeForm(prev => ({ ...prev, video_id: '', thumbnail_url: '' }))
  }, [youtubeForm.youtube_url])

  useEffect(() => { loadMasterSymbols(); loadMarketSignals(); loadYouTubeVideos(); loadEtfData() }, [])

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
    const s = await supabase.from('etf_summary').select('*').limit(1).single()
    if (s.data) setEtfSummary(s.data)
    const a = await supabase.from('etf_aum').select('*').order('sort_order', { ascending: true })
    if (a.data) setEtfAumList(a.data)
    const p = await supabase.from('etf_pipeline').select('*').order('sort_order', { ascending: true })
    if (p.data) setEtfPipeline(p.data)
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

  // Convert textarea catalysts (one per line) to a Postgres array
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

  async function handleAddMarketSignal(e) {
    e.preventDefault()
    if (!newSignal.signal_name.trim() || !newSignal.signal_value.trim()) { setMessage('Name and value required'); return }
    setLoading(true)
    const { error } = await supabase.from('market_signals').upsert([{ signal_name: newSignal.signal_name, signal_value: newSignal.signal_value, color: newSignal.color }], { onConflict: 'signal_name' })
    setLoading(false)
    if (error) { setMessage('Error updating'); return }
    setMessage('Signal updated!'); setNewSignal({ signal_name: '', signal_value: '', color: 'blue' }); loadMarketSignals()
  }

  // ETF FLOWS handlers
  function updateEtfSummaryField(field, value) {
    setEtfSummary(prev => prev ? { ...prev, [field]: value } : prev)
  }

  async function saveEtfSummary() {
    if (!etfSummary) return
    setEtfSummarySaving(true)
    const payload = {
      total_aum: parseFloat(etfSummary.total_aum) || 0,
      xrp_in_etfs: parseFloat(etfSummary.xrp_in_etfs) || 0,
      net_flow_24h: parseFloat(etfSummary.net_flow_24h) || 0,
      net_flow_7d: parseFloat(etfSummary.net_flow_7d) || 0,
      net_flow_30d: parseFloat(etfSummary.net_flow_30d) || 0,
      updated_at: new Date().toISOString()
    }
    const { error } = await supabase.from('etf_summary').update(payload).eq('id', etfSummary.id)
    setEtfSummarySaving(false)
    if (error) { setMessage('Error saving ETF summary'); return }
    setMessage('ETF summary saved!'); loadEtfData()
  }

  function updateEtfAumField(id, field, value) {
    setEtfAumList(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a))
  }

  async function saveEtfAumRow(etf) {
    setEtfAumSaving(etf.id)
    const { error } = await supabase.from('etf_aum').update({ aum: parseFloat(etf.aum) || 0, updated_at: new Date().toISOString() }).eq('id', etf.id)
    setEtfAumSaving(null)
    if (error) { setMessage('Error saving ' + etf.etf_name); return }
    setMessage(etf.etf_name + ' saved!'); loadEtfData()
  }

  async function toggleEtfAumActive(etf) {
    setEtfAumSaving(etf.id)
    const { error } = await supabase.from('etf_aum').update({ active: !etf.active }).eq('id', etf.id)
    setEtfAumSaving(null)
    if (error) { setMessage('Error'); return }
    setMessage(etf.etf_name + (!etf.active ? ' shown' : ' hidden')); loadEtfData()
  }

  async function handleAddEtf(e) {
    e.preventDefault()
    if (!newEtf.etf_name || !newEtf.ticker) { setMessage('Name and ticker required'); return }
    setAddingEtf(true)
    const nextOrder = etfAumList.length > 0 ? Math.max(...etfAumList.map(a => a.sort_order || 0)) + 1 : 1
    const { error } = await supabase.from('etf_aum').insert([{ etf_name: newEtf.etf_name, ticker: newEtf.ticker.toUpperCase(), etf_type: newEtf.etf_type, aum: parseFloat(newEtf.aum) || 0, color: newEtf.color, sort_order: nextOrder, active: true }])
    setAddingEtf(false)
    if (error) { setMessage('Error adding ETF'); return }
    setMessage('ETF added!'); setNewEtf({ etf_name: '', ticker: '', etf_type: 'Spot', aum: 0, color: '#3b82f6' }); loadEtfData()
  }

  async function handleRemoveEtf(id) {
    if (!confirm('Permanently delete this ETF?')) return
    const { error } = await supabase.from('etf_aum').delete().eq('id', id)
    if (error) { setMessage('Error removing'); return }
    setMessage('ETF removed'); loadEtfData()
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
    { id: 'etf-flows', label: 'ETF Flows', icon: TrendingUp },
    { id: 'master-watchlist', label: 'Master Watchlist', icon: Plus },
    { id: 'notifications', label: 'Send Notification', icon: Bell },
  ]

  const inputStyle = { background: '#1e293b', border: '1px solid #475569', color: '#eceef5' }
  const innerInputStyle = { background: '#0f172a', border: '1px solid #475569', color: '#eceef5' }
  const btnPrimary = { background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff' }

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
                  <p className="text-sm mb-6" style={{ color: '#9aa8be' }}>
                    Headline = the bold title. Summary = the paragraph members read. Key Points = bullet list (one per line).
                  </p>
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
                      <p className="text-xs mt-1.5" style={{ color: '#6b7a96' }}>Each line becomes a bullet point in the published brief. Leading dashes/bullets are stripped automatically.</p>
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
                  <p className="text-sm mb-6" style={{ color: '#9aa8be' }}>
                    Headline = the bold title. Summary = the paragraph members read. Key Events = bullet list (one per line).
                  </p>
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
                      <p className="text-xs mt-1.5" style={{ color: '#6b7a96' }}>Each line becomes a bullet point in the published wrap. Leading dashes/bullets are stripped automatically.</p>
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
                  <h2 className="text-xl font-semibold mb-6" style={{ color: '#eceef5' }}>Update Market Signals</h2>
                  <form onSubmit={handleAddMarketSignal} className="space-y-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div><label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Signal Name</label><input type="text" value={newSignal.signal_name} onChange={(e) => setNewSignal(prev => ({ ...prev, signal_name: e.target.value }))} placeholder="Market Sentiment" className="w-full px-4 py-3 rounded-lg" style={inputStyle} /></div>
                      <div><label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Signal Value</label><input type="text" value={newSignal.signal_value} onChange={(e) => setNewSignal(prev => ({ ...prev, signal_value: e.target.value }))} placeholder="Bullish" className="w-full px-4 py-3 rounded-lg" style={inputStyle} /></div>
                      <div><label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Color</label><select value={newSignal.color} onChange={(e) => setNewSignal(prev => ({ ...prev, color: e.target.value }))} className="w-full px-4 py-3 rounded-lg" style={inputStyle}><option value="green">Green</option><option value="yellow">Yellow</option><option value="red">Red</option><option value="blue">Blue</option></select></div>
                    </div>
                    <button type="submit" disabled={loading} className="px-6 py-3 rounded-lg font-medium disabled:opacity-50" style={btnPrimary}>{loading ? 'Updating...' : 'Update Signal'}</button>
                  </form>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium mb-4" style={{ color: '#eceef5' }}>Current Signals</h3>
                    {marketSignals.map(s => (
                      <div key={s.signal_name} className="flex items-center justify-between p-3 rounded-lg" style={{ background: '#1e293b', border: '1px solid #475569' }}>
                        <span className="font-medium" style={{ color: '#eceef5' }}>{s.signal_name}</span>
                        <span className="px-3 py-1 rounded text-sm font-semibold" style={{ background: s.color === 'green' ? 'rgba(16,185,129,0.2)' : s.color === 'red' ? 'rgba(239,68,68,0.2)' : s.color === 'yellow' ? 'rgba(245,158,11,0.2)' : 'rgba(59,130,246,0.2)', color: s.color === 'green' ? '#10b981' : s.color === 'red' ? '#ef4444' : s.color === 'yellow' ? '#f59e0b' : '#3b82f6' }}>{s.signal_value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'etf-flows' && (
                <div className="space-y-6">
                  <div className="rounded-xl p-6" style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid #334155' }}>
                    <h2 className="text-xl font-semibold mb-2" style={{ color: '#eceef5' }}>1. Summary Numbers (Five Cards on Member Page)</h2>
                    <p className="text-sm mb-6" style={{ color: '#9aa8be' }}>All dollar amounts in $ millions (e.g. 980 = $980M, 3290 = $3.29B)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div><label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Total ETF AUM ($M)</label><input type="text" value={etfSummary && etfSummary.total_aum != null ? etfSummary.total_aum : ''} onChange={(e) => updateEtfSummaryField('total_aum', e.target.value)} placeholder="3290" className="w-full px-4 py-3 rounded-lg" style={inputStyle} /></div>
                      <div><label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>XRP in ETFs (Millions of XRP)</label><input type="text" value={etfSummary && etfSummary.xrp_in_etfs != null ? etfSummary.xrp_in_etfs : ''} onChange={(e) => updateEtfSummaryField('xrp_in_etfs', e.target.value)} placeholder="1350" className="w-full px-4 py-3 rounded-lg" style={inputStyle} /></div>
                      <div><label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Net Flow 24h ($M)</label><input type="text" value={etfSummary && etfSummary.net_flow_24h != null ? etfSummary.net_flow_24h : ''} onChange={(e) => updateEtfSummaryField('net_flow_24h', e.target.value)} placeholder="101 or -25" className="w-full px-4 py-3 rounded-lg" style={inputStyle} /></div>
                      <div><label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Net Flow 7d ($M)</label><input type="text" value={etfSummary && etfSummary.net_flow_7d != null ? etfSummary.net_flow_7d : ''} onChange={(e) => updateEtfSummaryField('net_flow_7d', e.target.value)} placeholder="544" className="w-full px-4 py-3 rounded-lg" style={inputStyle} /></div>
                      <div><label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>Net Flow 30d ($M)</label><input type="text" value={etfSummary && etfSummary.net_flow_30d != null ? etfSummary.net_flow_30d : ''} onChange={(e) => updateEtfSummaryField('net_flow_30d', e.target.value)} placeholder="1230" className="w-full px-4 py-3 rounded-lg" style={inputStyle} /></div>
                    </div>
                    <button onClick={saveEtfSummary} disabled={etfSummarySaving} className="px-6 py-3 rounded-lg font-medium disabled:opacity-50" style={btnPrimary}>{etfSummarySaving ? 'Saving...' : 'Save Summary'}</button>
                  </div>

                  <div className="rounded-xl p-6" style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid #334155' }}>
                    <h2 className="text-xl font-semibold mb-2" style={{ color: '#eceef5' }}>2. ETF AUM (Percentages auto-calculated for pie chart)</h2>
                    <p className="text-sm mb-6" style={{ color: '#9aa8be' }}>Enter each ETF's assets under management in $ millions.</p>
                    <div className="space-y-3 mb-6">
                      {etfAumList.map(etf => (
                        <div key={etf.id} className="p-4 rounded-lg" style={{ background: '#1e293b', border: '1px solid #475569', opacity: etf.active ? 1 : 0.5 }}>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ background: etf.color || '#3b82f6' }} />
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold" style={{ color: '#eceef5' }}>{etf.etf_name}</p>
                              <p className="text-xs" style={{ color: '#9aa8be' }}>{etf.ticker} · {etf.etf_type}</p>
                            </div>
                          </div>
                          <div className="flex items-end gap-2">
                            <div className="flex-1">
                              <label className="block text-xs font-medium mb-1.5" style={{ color: '#cbd5e1' }}>AUM ($M)</label>
                              <input type="text" value={etf.aum != null ? etf.aum : ''} onChange={(e) => updateEtfAumField(etf.id, 'aum', e.target.value)} placeholder="980" className="w-full px-4 py-2.5 rounded-lg" style={innerInputStyle} />
                            </div>
                            <button onClick={() => saveEtfAumRow(etf)} disabled={etfAumSaving === etf.id} className="px-4 py-2.5 rounded-lg font-medium text-sm" style={{ background: '#3b82f6', color: '#fff' }}>{etfAumSaving === etf.id ? '...' : 'Save'}</button>
                            <button onClick={() => toggleEtfAumActive(etf)} className="px-3 py-2.5 rounded-lg text-xs font-medium" style={{ background: etf.active ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)', color: etf.active ? '#f59e0b' : '#10b981' }}>{etf.active ? 'Hide' : 'Show'}</button>
                            <button onClick={() => handleRemoveEtf(etf.id)} className="px-3 py-2.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}><Trash2 size={16} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 rounded-lg" style={{ background: '#0f172a', border: '1px dashed #475569' }}>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: '#cbd5e1' }}>Add New ETF</h3>
                      <form onSubmit={handleAddEtf} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><label className="block text-xs font-medium mb-1.5" style={{ color: '#cbd5e1' }}>ETF Name</label><input type="text" value={newEtf.etf_name} onChange={(e) => setNewEtf(prev => ({ ...prev, etf_name: e.target.value }))} placeholder="WisdomTree XRP ETF" className="w-full px-4 py-2.5 rounded-lg" style={inputStyle} /></div>
                          <div><label className="block text-xs font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Ticker</label><input type="text" value={newEtf.ticker} onChange={(e) => setNewEtf(prev => ({ ...prev, ticker: e.target.value }))} placeholder="WXRP" className="w-full px-4 py-2.5 rounded-lg" style={inputStyle} /></div>
                          <div><label className="block text-xs font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Type</label><select value={newEtf.etf_type} onChange={(e) => setNewEtf(prev => ({ ...prev, etf_type: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg" style={inputStyle}><option value="Spot">Spot</option><option value="Futures">Futures</option></select></div>
                          <div><label className="block text-xs font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Starting AUM ($M)</label><input type="text" value={newEtf.aum} onChange={(e) => setNewEtf(prev => ({ ...prev, aum: e.target.value }))} placeholder="0" className="w-full px-4 py-2.5 rounded-lg" style={inputStyle} /></div>
                          <div className="md:col-span-2"><label className="block text-xs font-medium mb-1.5" style={{ color: '#cbd5e1' }}>Pie Chart Color</label><select value={newEtf.color} onChange={(e) => setNewEtf(prev => ({ ...prev, color: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg" style={inputStyle}><option value="#3b82f6">Blue</option><option value="#8b5cf6">Purple</option><option value="#10b981">Green</option><option value="#f59e0b">Orange</option><option value="#ef4444">Red</option><option value="#06b6d4">Cyan</option><option value="#ec4899">Pink</option><option value="#6366f1">Indigo</option><option value="#84cc16">Lime</option></select></div>
                        </div>
                        <button type="submit" disabled={addingEtf} className="px-6 py-2.5 rounded-lg font-medium disabled:opacity-50" style={btnPrimary}>{addingEtf ? 'Adding...' : 'Add ETF'}</button>
                      </form>
                    </div>
                  </div>

                  <div className="rounded-xl p-6" style={{ background: 'rgba(30,41,59,0.3)', border: '1px solid #334155' }}>
                    <h2 className="text-xl font-semibold mb-2" style={{ color: '#eceef5' }}>3. ETF Pipeline — High Priority Watch</h2>
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
