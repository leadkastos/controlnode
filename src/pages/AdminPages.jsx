import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { Plus, Trash2, Save, Bell, MessageCircle, PlaySquare, FileText, BarChart3, Globe, Zap, Target, TrendingUp, Calendar } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function AdminPages() {
  const { profile } = useAuth()
  const [activeSection, setActiveSection] = useState('market-news')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Market News state
  const [marketNewsForm, setMarketNewsForm] = useState({
    type: 'chatter',
    content: '',
    category: 'General',
    source: '',
    source_url: ''
  })

  // YouTube Video state
  const [youtubeForm, setYoutubeForm] = useState({
    title: '',
    description: '',
    youtube_url: '',
    video_id: '',
    thumbnail_url: ''
  })

  // Master Watchlist state
  const [symbols, setSymbols] = useState([])
  const [newSymbol, setNewSymbol] = useState('')

  // Notification state
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    send_email: true
  })

  // Morning Brief state
  const [morningBriefForm, setMorningBriefForm] = useState({
    title: '',
    content: '',
    key_points: '',
    market_outlook: ''
  })

  // Daily Wrap state
  const [dailyWrapForm, setDailyWrapForm] = useState({
    title: '',
    content: '',
    key_events: '',
    tomorrow_outlook: ''
  })

  // Market Signals state
  const [marketSignals, setMarketSignals] = useState([])
  const [newSignal, setNewSignal] = useState({
    signal_name: '',
    signal_value: '',
    color: 'blue'
  })

  // Breaking News state
  const [breakingNewsForm, setBreakingNewsForm] = useState({
    headline: '',
    content: '',
    urgency: 'medium',
    show_ticker: true
  })

  // ETF Flows state
  const [etfFlowsForm, setEtfFlowsForm] = useState({
    date: '',
    inflow_outflow: '',
    total_aum: '',
    notes: ''
  })

  // Extract YouTube video ID from URL
  function extractVideoId(url) {
    if (!url) return ''
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return ''
  }

  // Update video ID and thumbnail when URL changes
  useEffect(() => {
    const videoId = extractVideoId(youtubeForm.youtube_url)
    if (videoId) {
      setYoutubeForm(prev => ({
        ...prev,
        video_id: videoId,
        thumbnail_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      }))
    } else {
      setYoutubeForm(prev => ({
        ...prev,
        video_id: '',
        thumbnail_url: ''
      }))
    }
  }, [youtubeForm.youtube_url])

  // Load data on mount
  useEffect(() => {
    loadMasterSymbols()
    loadMarketSignals()
  }, [])

  async function loadMasterSymbols() {
    try {
      const result = await supabase
        .from('master_watchlist')
        .select('*')
        .order('symbol')
      
      if (result.data) {
        setSymbols(result.data)
      }
    } catch (error) {
      console.error('Error loading symbols:', error)
      setMessage('Error loading watchlist symbols')
    }
  }

  async function loadMarketSignals() {
    try {
      const result = await supabase
        .from('market_signals')
        .select('*')
        .order('signal_name')
      
      if (result.data) {
        setMarketSignals(result.data)
      }
    } catch (error) {
      console.error('Error loading market signals:', error)
    }
  }

  // Market News Submit
  async function handleMarketNewsSubmit(e) {
    e.preventDefault()
    if (!marketNewsForm.content.trim()) {
      setMessage('Content is required')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('market_news')
        .insert([{
          type: marketNewsForm.type,
          content: marketNewsForm.content,
          category: marketNewsForm.category,
          source: marketNewsForm.source || null,
          source_url: marketNewsForm.source_url || null,
          created_by: profile.id
        }])

      if (error) throw error

      setMessage('Market news posted successfully!')
      setMarketNewsForm({
        type: 'chatter',
        content: '',
        category: 'General',
        source: '',
        source_url: ''
      })
    } catch (error) {
      console.error('Error posting market news:', error)
      setMessage('Error posting market news')
    } finally {
      setLoading(false)
    }
  }

  // YouTube Submit
  async function handleYouTubeSubmit(e) {
    e.preventDefault()
    if (!youtubeForm.title.trim() || !youtubeForm.youtube_url.trim()) {
      setMessage('Title and YouTube URL are required')
      return
    }

    if (!youtubeForm.video_id) {
      setMessage('Please enter a valid YouTube URL')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('youtube_videos')
        .insert([{
          title: youtubeForm.title,
          description: youtubeForm.description || null,
          youtube_url: youtubeForm.youtube_url,
          video_id: youtubeForm.video_id,
          thumbnail_url: youtubeForm.thumbnail_url,
          channel_handle: 'unknown',
          channel_name: 'Unknown Channel',
          created_by: '1d52916a-3b7d-4c0d-8290-cd7fb6f16d20'
        }])

      if (error) throw error

      setMessage('YouTube video added successfully!')
      setYoutubeForm({
        title: '',
        description: '',
        youtube_url: '',
        video_id: '',
        thumbnail_url: ''
      })
    } catch (error) {
      console.error('Error adding YouTube video:', error)
      setMessage('Error adding YouTube video')
    } finally {
      setLoading(false)
    }
  }

  // Master Watchlist Functions
  async function handleAddSymbol(e) {
    e.preventDefault()
    if (!newSymbol.trim()) return

    const symbol = newSymbol.toUpperCase().trim()
    
    if (symbols.some(s => s.symbol === symbol)) {
      setMessage('Symbol already exists')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('master_watchlist')
        .insert([{ symbol }])

      if (error) throw error

      setMessage('Symbol added successfully!')
      setNewSymbol('')
      loadMasterSymbols()
    } catch (error) {
      console.error('Error adding symbol:', error)
      setMessage('Error adding symbol')
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteSymbol(id) {
    if (!confirm('Are you sure you want to delete this symbol?')) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('master_watchlist')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMessage('Symbol deleted successfully!')
      loadMasterSymbols()
    } catch (error) {
      console.error('Error deleting symbol:', error)
      setMessage('Error deleting symbol')
    } finally {
      setLoading(false)
    }
  }

  // Morning Brief Submit
  async function handleMorningBriefSubmit(e) {
    e.preventDefault()
    if (!morningBriefForm.title.trim() || !morningBriefForm.content.trim()) {
      setMessage('Title and content are required')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('morning_briefs')
        .insert([{
          title: morningBriefForm.title,
          content: morningBriefForm.content,
          key_points: morningBriefForm.key_points || null,
          market_outlook: morningBriefForm.market_outlook || null,
          created_by: profile.id
        }])

      if (error) throw error

      setMessage('Morning Brief published successfully!')
      setMorningBriefForm({
        title: '',
        content: '',
        key_points: '',
        market_outlook: ''
      })
    } catch (error) {
      console.error('Error publishing morning brief:', error)
      setMessage('Error publishing morning brief')
    } finally {
      setLoading(false)
    }
  }

  // Daily Wrap Submit
  async function handleDailyWrapSubmit(e) {
    e.preventDefault()
    if (!dailyWrapForm.title.trim() || !dailyWrapForm.content.trim()) {
      setMessage('Title and content are required')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('daily_wraps')
        .insert([{
          title: dailyWrapForm.title,
          content: dailyWrapForm.content,
          key_events: dailyWrapForm.key_events || null,
          tomorrow_outlook: dailyWrapForm.tomorrow_outlook || null,
          created_by: profile.id
        }])

      if (error) throw error

      setMessage('Daily Wrap published successfully!')
      setDailyWrapForm({
        title: '',
        content: '',
        key_events: '',
        tomorrow_outlook: ''
      })
    } catch (error) {
      console.error('Error publishing daily wrap:', error)
      setMessage('Error publishing daily wrap')
    } finally {
      setLoading(false)
    }
  }

  // Market Signal Functions
  async function handleAddMarketSignal(e) {
    e.preventDefault()
    if (!newSignal.signal_name.trim() || !newSignal.signal_value.trim()) {
      setMessage('Signal name and value are required')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('market_signals')
        .upsert([{
          signal_name: newSignal.signal_name,
          signal_value: newSignal.signal_value,
          color: newSignal.color
        }], { onConflict: 'signal_name' })

      if (error) throw error

      setMessage('Market signal updated successfully!')
      setNewSignal({
        signal_name: '',
        signal_value: '',
        color: 'blue'
      })
      loadMarketSignals()
    } catch (error) {
      console.error('Error updating market signal:', error)
      setMessage('Error updating market signal')
    } finally {
      setLoading(false)
    }
  }

  // Breaking News Submit
  async function handleBreakingNewsSubmit(e) {
    e.preventDefault()
    if (!breakingNewsForm.headline.trim()) {
      setMessage('Headline is required')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('top_headlines')
        .insert([{
          headline: breakingNewsForm.headline,
          content: breakingNewsForm.content || null,
          urgency: breakingNewsForm.urgency,
          show_ticker: breakingNewsForm.show_ticker,
          created_by: profile.id
        }])

      if (error) throw error

      setMessage('Breaking news posted successfully!')
      setBreakingNewsForm({
        headline: '',
        content: '',
        urgency: 'medium',
        show_ticker: true
      })
    } catch (error) {
      console.error('Error posting breaking news:', error)
      setMessage('Error posting breaking news')
    } finally {
      setLoading(false)
    }
  }

  // ETF Flows Submit
  async function handleETFFlowsSubmit(e) {
    e.preventDefault()
    if (!etfFlowsForm.date || !etfFlowsForm.inflow_outflow) {
      setMessage('Date and flow amount are required')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('xrp_etf_flows')
        .insert([{
          date: etfFlowsForm.date,
          inflow_outflow: parseFloat(etfFlowsForm.inflow_outflow),
          total_aum: etfFlowsForm.total_aum ? parseFloat(etfFlowsForm.total_aum) : null,
          notes: etfFlowsForm.notes || null,
          created_by: profile.id
        }])

      if (error) throw error

      setMessage('ETF flows data added successfully!')
      setEtfFlowsForm({
        date: '',
        inflow_outflow: '',
        total_aum: '',
        notes: ''
      })
    } catch (error) {
      console.error('Error adding ETF flows:', error)
      setMessage('Error adding ETF flows')
    } finally {
      setLoading(false)
    }
  }

  // Notification Submit
  async function handleNotificationSubmit(e) {
    e.preventDefault()
    if (!notificationForm.title.trim() || !notificationForm.message.trim()) {
      setMessage('Title and message are required')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([{
          title: notificationForm.title,
          message: notificationForm.message,
          type: 'admin_broadcast',
          created_by: profile.id
        }])

      if (error) throw error

      setMessage('Notification sent successfully!')
      setNotificationForm({
        title: '',
        message: '',
        send_email: true
      })
    } catch (error) {
      console.error('Error sending notification:', error)
      setMessage('Error sending notification')
    } finally {
      setLoading(false)
    }
  }

  const sections = [
    { id: 'market-news', label: 'Market News', icon: MessageCircle },
    { id: 'morning-brief', label: 'Morning Brief', icon: FileText },
    { id: 'daily-wrap', label: 'Daily Wrap', icon: Calendar },
    { id: 'market-signals', label: 'Market Signals', icon: BarChart3 },
    { id: 'breaking-news', label: 'Breaking News', icon: Zap },
    { id: 'youtube-intel', label: 'YouTube Intel', icon: PlaySquare },
    { id: 'etf-flows', label: 'ETF Flows', icon: TrendingUp },
    { id: 'master-watchlist', label: 'Master Watchlist', icon: Plus },
    { id: 'notifications', label: 'Send Notification', icon: Bell },
  ]

  return (
    <AppLayout>
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>
              Admin Panel
            </h1>
            <p style={{ color: '#9aa8be' }}>Manage your ControlNode platform content and settings.</p>
          </div>

          {message && (
            <div 
              className="mb-6 px-4 py-3 rounded-lg"
              style={{ 
                background: message.includes('Error') ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                border: `1px solid ${message.includes('Error') ? '#ef4444' : '#10b981'}`,
                color: message.includes('Error') ? '#ef4444' : '#10b981'
              }}
            >
              {message}
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 flex-shrink-0">
              <nav className="space-y-2">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id)
                      setMessage('')
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/50'
                        : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
                    }`}
                    style={{ border: '1px solid', borderColor: activeSection === section.id ? '#3b82f6' : '#475569' }}
                  >
                    <section.icon size={18} style={{ color: activeSection === section.id ? '#3b82f6' : '#94a3b8' }} />
                    <span style={{ color: activeSection === section.id ? '#eceef5' : '#cbd5e1' }}>
                      {section.label}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Market News Section */}
              {activeSection === 'market-news' && (
                <div className="bg-slate-800/30 rounded-xl p-6" style={{ border: '1px solid #334155' }}>
                  <h2 className="text-xl font-semibold mb-6" style={{ color: '#eceef5' }}>
                    Post Market News
                  </h2>
                  
                  <form onSubmit={handleMarketNewsSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                        Post Type
                      </label>
                      <select
                        value={marketNewsForm.type}
                        onChange={(e) => setMarketNewsForm(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg border"
                        style={{ 
                          background: '#1e293b', 
                          border: '1px solid #475569', 
                          color: '#eceef5' 
                        }}
                      >
                        <option value="chatter">Market Chatter (Unconfirmed)</option>
                        <option value="confirmed">Market News (Confirmed)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                        Content
                      </label>
                      <textarea
                        value={marketNewsForm.content}
                        onChange={(e) => setMarketNewsForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Enter news content..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border resize-none"
                        style={{ 
                          background: '#1e293b', 
                          border: '1px solid #475569', 
                          color: '#eceef5' 
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                        Category
                      </label>
                      <select
                        value={marketNewsForm.category}
                        onChange={(e) => setMarketNewsForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg border"
                        style={{ 
                          background: '#1e293b', 
                          border: '1px solid #475569', 
                          color: '#eceef5' 
                        }}
                      >
                        <option value="General">General</option>
                        <option value="Regulatory">Regulatory</option>
                        <option value="XRP">XRP</option>
                        <option value="ETF">ETF</option>
                        <option value="Government">Government</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                          Source (e.g. Reuters, Bloomberg, X/Twitter)
                        </label>
                        <input
                          type="text"
                          value={marketNewsForm.source}
                          onChange={(e) => setMarketNewsForm(prev => ({ ...prev, source: e.target.value }))}
                          placeholder="Reuters"
                          className="w-full px-4 py-3 rounded-lg border"
                          style={{ 
                            background: '#1e293b', 
                            border: '1px solid #475569', 
                            color: '#eceef5' 
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                          Source URL (Optional)
                        </label>
                        <input
                          type="url"
                          value={marketNewsForm.source_url}
                          onChange={(e) => setMarketNewsForm(prev => ({ ...prev, source_url: e.target.value }))}
                          placeholder="https://..."
                          className="w-full px-4 py-3 rounded-lg border"
                          style={{ 
                            background: '#1e293b', 
                            border: '1px solid #475569', 
                            color: '#eceef5' 
                          }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        color: '#fff'
                      }}
                    >
                      {loading ? 'Posting...' : 'Post'}
                    </button>
                  </form>
                </div>
              )}

              {/* Morning Brief Section */}
              {activeSection === 'morning-brief' && (
                <div className="bg-slate-800/30 rounded-xl p-6" style={{ border: '1px solid #334155' }}>
                  <h2 className="text-xl font-semibold mb-6" style={{ color: '#eceef5' }}>
                    Publish Morning Brief
                  </h2>
                  
                  <form onSubmit={handleMorningBriefSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                        Title
                      </label>
                      <input
                        type="text"
                        value={morningBriefForm.title}
                        onChange={(e) => setMorningBriefForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter morning brief title..."
                        className="w-full px-4 py-3 rounded-lg border"
                        style={{ 
                          background: '#1e293b', 
                          border: '1px solid #475569', 
                          color: '#eceef5' 
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                        Content
                      </label>
                      <textarea
                        value={morningBriefForm.content}
                        onChange={(e) => setMorningBriefForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Enter morning brief content..."
                        rows={6}
                        className="w-full px-4 py-3 rounded-lg border resize-none"
                        style={{ 
                          background: '#1e293b', 
                          border: '1px solid #475569', 
                          color: '#eceef5' 
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                        Key Points (Optional)
                      </label>
                      <textarea
                        value={morningBriefForm.key_points}
                        onChange={(e) => setMorningBriefForm(prev => ({ ...prev, key_points: e.target.value }))}
                        placeholder="• Key point 1&#10;• Key point 2&#10;• Key point 3"
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border resize-none"
                        style={{ 
                          background: '#1e293b', 
                          border: '1px solid #475569', 
                          color: '#eceef5' 
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                        Market Outlook (Optional)
                      </label>
                      <textarea
                        value={morningBriefForm.market_outlook}
                        onChange={(e) => setMorningBriefForm(prev => ({ ...prev, market_outlook: e.target.value }))}
                        placeholder="Today's market outlook and expectations..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border resize-none"
                        style={{ 
                          background: '#1e293b', 
                          border: '1px solid #475569', 
                          color: '#eceef5' 
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        color: '#fff'
                      }}
                    >
                      {loading ? 'Publishing...' : 'Publish Morning Brief'}
                    </button>
                  </form>
                </div>
              )}

              {/* Daily Wrap Section */}
              {activeSection === 'daily-wrap' && (
                <div className="bg-slate-800/30 rounded-xl p-6" style={{ border: '1px solid #334155' }}>
                  <h2 className="text-xl font-semibold mb-6" style={{ color: '#eceef5' }}>
                    Publish Daily Wrap
                  </h2>
                  
                  <form onSubmit={handleDailyWrapSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                        Title
                      </label>
                      <input
                        type="text"
                        value={dailyWrapForm.title}
                        onChange={(e) => setDailyWrapForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter daily wrap title..."
                        className="w-full px-4 py-3 rounded-lg border"
                        style={{ 
                          background: '#1e293b', 
                          border: '1px solid #475569', 
                          color: '#eceef5' 
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                        Content
                      </label>
                      <textarea
                        value={dailyWrapForm.content}
                        onChange={(e) => setDailyWrapForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Enter daily wrap content..."
                        rows={6}
                        className="w-full px-4 py-3 rounded-lg border resize-none"
                        style={{ 
                          background: '#1e293b', 
                          border: '1px solid #475569', 
                          color: '#eceef5' 
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                        Key Events (Optional)
                      </label>
                      <textarea
                        value={dailyWrapForm.key_events}
                        onChange={(e) => setDailyWrapForm(prev => ({ ...prev, key_events: e.target.value }))}
                        placeholder="• Event 1&#10;• Event 2&#10;• Event 3"
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border resize-none"
                        style={{ 
                          background: '#1e293b', 
                          border: '1px solid #475569', 
                          color: '#eceef5' 
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                        Tomorrow's Outlook (Optional)
                      </label>
                      <textarea
                        value={dailyWrapForm.tomorrow_outlook}
                        onChange={(e) => setDailyWrapForm(prev => ({ ...prev, tomorrow_outlook: e.target.value }))}
                        placeholder="What to watch for tomorrow..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border resize-none"
                        style={{ 
                          background: '#1e293b', 
                          border: '1px solid #475569', 
                          color: '#eceef5' 
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        color: '#fff'
                      }}
                    >
                      {loading ? 'Publishing...' : 'Publish Daily Wrap'}
                    </button>
                  </form>
                </div>
              )}

              {/* Market Signals Section */}
              {activeSection === 'market-signals' && (
                <div className="bg-slate-800/30 rounded-xl p-6" style={{ border: '1px solid #334155' }}>
                  <h2 className="text-xl font-semibold mb-6" style={{ color: '#eceef5' }}>
                    Update Market Signals
                  </h2>
                  
                  <form onSubmit={handleAddMarketSignal} className="space-y-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                          Signal Name
                        </label>
                        <input
                          type="text"
                          value={newSignal.signal_name}
                          onChange={(e) => setNewSignal(prev => ({ ...prev, signal_name: e.target.value }))}
                          placeholder="Market Sentiment"
                          className="w-full px-4 py-3 rounded-lg border"
                          style={{ 
                            background: '#1e293b', 
                            border: '1px solid #475569', 
                            color: '#eceef5' 
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                          Signal Value
                        </label>
                        <input
                          type="text"
                          value={newSignal.signal_value}
                          onChange={(e) => setNewSignal(prev => ({ ...prev, signal_value: e.target.value }))}
                          placeholder="Bullish"
                          className="w-full px-4 py-3 rounded-lg border"
                          style={{ 
                            background: '#1e293b', 
                            border: '1px solid #475569', 
                            color: '#eceef5' 
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                          Color
                        </label>
                        <select
                          value={newSignal.color}
                          onChange={(e) => setNewSignal(prev => ({ ...prev, color: e.target.value }))}
                          className="w-full px-4 py-3 rounded-lg border"
                          style={{ 
                            background: '#1e293b', 
                            border: '1px solid #475569', 
                            color: '#eceef5' 
                          }}
                        >
                          <option value="green">Green</option>
                          <option value="yellow">Yellow</option>
                          <option value="red">Red</option>
                          <option value="blue">Blue</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        color: '#fff'
                      }}
                    >
                      {loading ? 'Updating...' : 'Update Signal'}
                    </button>
                  </form>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium mb-4" style={{ color: '#eceef5' }}>Current Signals</h3>
                    {marketSignals.map(signal => (
                      <div
                        key={signal.signal_name}
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{ background: '#1e293b', border: '1px solid #475569' }}
                      >
                        <span className="font-medium" style={{ color: '#eceef5' }}>
                          {signal.signal_name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className="px-3 py-1 rounded text-sm font-semibold"
                            style={{
                              background: signal.color === 'green' ? 'rgba(16,185,129,0.2)' : 
                                         signal.color === 'red' ? 'rgba(239,68,68,0.2)' : 
                                         signal.color === 'yellow' ? 'rgba(245,158,11,0.2)' : 'rgba(59,130,246,0.2)',
                              color: signal.color === 'green' ? '#10b981' : 
                                     signal.color === 'red' ? '#ef4444' : 
                                     signal.color === 'yellow' ? '#f59e0b' : '#3b82f6'
                            }}
                          >
                            {signal.signal_value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Breaking News Section */}
              {activeSection === 'breaking-news' && (
                <div className="bg-slate-800/30 rounded-xl p-6" style={{ border: '1px solid #334155' }}>
                  <h2 className="text-xl font-semibold mb-6" style={{ color: '#eceef5' }}>
                    Post Breaking News
                  </h2>
                  
                  <form onSubmit={handleBreakingNewsSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                        Headline
                      </label>
                      <input
                        type="text"
                        value={breakingNewsForm.headline}
                        onChange={(e) => setBreakingNewsForm(prev => ({ ...prev, headline: e.target.value }))}
                        placeholder="Enter breaking news headline..."
                        className="w-full px-4 py-3 rounded-lg border"
                        style={{ 
                          background: '#1e293b', 
                          border: '1px solid #475569', 
                          color: '#eceef5' 
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                        Content (Optional)
                      </label>
                      <textarea
                        value={breakingNewsForm.content}
                        onChange={(e) => setBreakingNewsForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Additional details..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border resize-none"
                        style={{ 
                          background: '#1e293b', 
                          border: '1px solid #475569', 
                          color: '#eceef5' 
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                        Urgency Level
                      </label>
                      <select
                        value={breakingNewsForm.urgency}
                        onChange={(e) => setBreakingNewsForm(prev => ({ ...prev, urgency: e.target.value }))}
                        className="w-full px-4 py-3 rounded-lg border"
                        style={{ 
                          background: '#1e293b', 
                          border: '1px solid #475569', 
                          color: '#eceef5' 
                        }}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="show_ticker"
                        checked={breakingNewsForm.show_ticker}
                        onChange={(e) => setBreakingNewsForm(prev => ({ ...prev, show_ticker: e.target.checked }))}
                        className="rounded"
                      />
                      <label htmlFor="show_ticker" className="text-sm" style={{ color: '#cbd5e1' }}>
                        Show in top ticker banner
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        color: '#fff'
                      }}
                    >
                      {loading ? 'Posting...' : 'Post Breaking News'}
                    </button>
                  </form>
                </div>
              )}

              {/* ETF Flows Section */}
              {activeSection === 'etf-flows' && (
                <div className="bg-slate-800/30 rounded-xl p-6" style={{ border: '1px solid #334155' }}>
                  <h2 className="text-xl font-semibold mb-6" style={{ color: '#eceef5' }}>
                    Update ETF Flows
                  </h2>
                  
                  <form onSubmit={handleETFFlowsSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                          Date
                        </label>
                        <input
                          type="date"
                          value={etfFlowsForm.date}
                          onChange={(e) => setEtfFlowsForm(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full px-4 py-3 rounded-lg border"
                          style={{ 
                            background: '#1e293b', 
                            border: '1px solid #475569', 
                            color: '#eceef5' 
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                          Inflow/Outflow ($ millions)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={etfFlowsForm.inflow_outflow}
                          onChange={(e) => setEtfFlowsForm(prev => ({ ...prev, inflow_outflow: e.target.value }))}
                          placeholder="25.5 (positive = inflow)"
                          className="w-full px-4 py-3 rounded-lg border"
                          style={{ 
                            background: '#1e293b', 
                            border: '1px solid #475569', 
                            color: '#eceef5' 
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                        Total AUM ($ millions, Optional)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={etfFlowsForm.total_aum}
                        onChange={(e) => setEtfFlowsForm(prev => ({ ...prev, total_aum: e.target.value }))}
                        placeholder="1250.75"
                        className="w-full px-4 py-3 rounded-lg border"
                        style={{ 
                          background: '#1e293b', 
                          border: '1px solid #475569', 
                          color: '#eceef5' 
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                        Notes (Optional)
                      </label>
                      <textarea
                        value={etfFlowsForm.notes}
                        onChange={(e) => setEtfFlowsForm(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Additional context or notes..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border resize-none"
                        style={{ 
                          background: '#1e293b', 
                          border: '1px solid #475569', 
                          color: '#eceef5' 
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        color: '#fff'
                      }}
                    >
                      {loading ? 'Adding...' : 'Add ETF Flow Data'}
                    </button>
                  </form>
                </div>
              )}

              {/* YouTube Intel Section */}
              {activeSection === 'youtube-intel' && (
                <div className="bg-slate-800/30 rounded-xl p-6" style={{ border: '1px solid #334155' }}>
                  <h2 className="text-xl font-semibold mb-6" style={{ color: '#eceef5' }}>
                    Add YouTube Video
                  </h2>
                  
                  <form onSubmit={handleYouTubeSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                        Video Title
                      </label>
                      <input
                        type="text"
                        value={youtubeForm.title}
                        onChange={(e) => setYoutubeForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter video title..."
                        className="w-full px-4 py-3 rounded-lg border"
                        style={{ 
                          background: '#1e293b', 
                          border: '1px solid #475569', 
                          color: '#eceef5' 
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                        Description (Optional)
                      </label>
                      <textarea
                        value={youtubeForm.description}
                        onChange={(e) => setYoutubeForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of the video..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-lg border resize-none"
                        style={{ 
                          background: '#1e293b', 
                          border: '1px solid #475569', 
                          color: '#eceef5' 
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                        YouTube URL
                      </label>
                      <input
                        type="url"
                        value={youtubeForm.youtube_url}
                        onChange={(e) => setYoutubeForm(prev => ({ ...prev, youtube_url: e.target.value }))}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-4 py-3 rounded-lg border"
                        style={{ 
                          background: '#1e293b', 
                          border: '1px solid #475569', 
                          color: '#eceef5' 
                        }}
                      />
                    </div>

                    {youtubeForm.thumbnail_url && (
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                          Preview
                        </label>
                        <div className="flex items-center gap-4 p-4 rounded-lg" style={{ background: '#1e293b', border: '1px solid #475569' }}>
                          <img
                            src={youtubeForm.thumbnail_url}
                            alt="Video thumbnail"
                            className="w-24 h-18 object-cover rounded"
                            onError={(e) => {
                              e.target.src = `https://img.youtube.com/vi/${youtubeForm.video_id}/hqdefault.jpg`
                            }}
                          />
                          <div>
                            <p className="font-medium" style={{ color: '#eceef5' }}>
                              {youtubeForm.title || 'Video Title'}
                            </p>
                            <p className="text-sm" style={{ color: '#9aa8be' }}>
                              {youtubeForm.description || 'No description'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        color: '#fff'
                      }}
                    >
                      {loading ? 'Adding...' : 'Add Video'}
                    </button>
                  </form>
                </div>
              )}

              {/* Master Watchlist Section */}
              {activeSection === 'master-watchlist' && (
                <div className="bg-slate-800/30 rounded-xl p-6" style={{ border: '1px solid #334155' }}>
                  <h2 className="text-xl font-semibold mb-6" style={{ color: '#eceef5' }}>
                    Master Watchlist
                  </h2>
                  
                  <form onSubmit={handleAddSymbol} className="mb-6">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newSymbol}
                        onChange={(e) => setNewSymbol(e.target.value)}
                        placeholder="Enter symbol (e.g. ADA)"
                        className="flex-1 px-4 py-3 rounded-lg border"
                        style={{ 
                          background: '#1e293b', 
                          border: '1px solid #475569', 
                          color: '#eceef5' 
                        }}
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                          color: '#fff'
                        }}
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2">
                    {symbols.map(symbol => (
                      <div
                        key={symbol.id}
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{ background: '#1e293b', border: '1px solid #475569' }}
                      >
                        <span className="font-medium" style={{ color: '#eceef5' }}>
                          {symbol.symbol}
                        </span>
                        <button
                          onClick={() => handleDeleteSymbol(symbol.id)}
                          className="p-2 rounded-lg transition-colors hover:bg-red-600/20"
                          style={{ color: '#ef4444' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="bg-slate-800/30 rounded-xl p-6" style={{ border: '1px solid #334155' }}>
                  <h2 className="text-xl font-semibold mb-6" style={{ color: '#eceef5' }}>
                    Send Notification
                  </h2>
                  
                  <form onSubmit={handleNotificationSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                        Notification Title
                      </label>
                      <input
                        type="text"
                        value={notificationForm.title}
                        onChange={(e) => setNotificationForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter notification title..."
                        className="w-full px-4 py-3 rounded-lg border"
                        style={{ 
                          background: '#1e293b', 
                          border: '1px solid #475569', 
                          color: '#eceef5' 
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: '#cbd5e1' }}>
                        Message
                      </label>
                      <textarea
                        value={notificationForm.message}
                        onChange={(e) => setNotificationForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Enter notification message..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border resize-none"
                        style={{ 
                          background: '#1e293b', 
                          border: '1px solid #475569', 
                          color: '#eceef5' 
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                        color: '#fff'
                      }}
                    >
                      {loading ? 'Sending...' : 'Send Notification'}
                    </button>
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
