import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { Plus, Trash2, Save, Bell, MessageCircle, PlaySquare } from 'lucide-react'
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

  // Extract YouTube video ID from URL
  function extractVideoId(url) {
    if (!url) return ''
    
    // Handle various YouTube URL formats
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

  // Load master watchlist
  useEffect(() => {
    loadMasterSymbols()
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

      // Send notification if enabled
      if (marketNewsForm.send_notification) {
        await supabase
          .from('notifications')
          .insert([{
            title: marketNewsForm.type === 'confirmed' ? 'New Confirmed Market News' : 'New Market Chatter',
            message: marketNewsForm.content.substring(0, 100) + (marketNewsForm.content.length > 100 ? '...' : ''),
            type: 'market_news',
            created_by: profile.id
          }])
      }
    } catch (error) {
      console.error('Error posting market news:', error)
      setMessage('Error posting market news')
    } finally {
      setLoading(false)
    }
  }

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
          created_by: profile.id
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

  async function handleAddSymbol(e) {
    e.preventDefault()
    if (!newSymbol.trim()) return

    const symbol = newSymbol.toUpperCase().trim()
    
    // Check if symbol already exists
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
    { id: 'youtube-intel', label: 'YouTube Intel', icon: PlaySquare },
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

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="send_notification"
                        checked={marketNewsForm.send_notification || false}
                        onChange={(e) => setMarketNewsForm(prev => ({ ...prev, send_notification: e.target.checked }))}
                        className="rounded"
                      />
                      <label htmlFor="send_notification" className="text-sm" style={{ color: '#cbd5e1' }}>
                        Send bell notification to all active members
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
                      {loading ? 'Posting...' : 'Post'}
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
