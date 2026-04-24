import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { Play, ExternalLink, Calendar } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function YouTubeIntel() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVideos()
  }, [])

  async function loadVideos() {
    try {
      const { data, error } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('published_at', { ascending: false })

      if (error) {
        console.error('Query error:', error)
        throw error
      }

      console.log('Loaded videos:', data)
      setVideos(data || [])
    } catch (error) {
      console.error('Error loading videos:', error)
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateString) {
    if (!dateString) return 'Unknown date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  function openVideo(url) {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>
                YouTube Intel
              </h1>
              <p style={{ color: '#9aa8be' }}>Curated XRP and crypto video analysis.</p>
            </div>

            {/* Loading Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="rounded-xl overflow-hidden" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                  <div className="aspect-video animate-pulse" style={{ background: '#334155' }} />
                  <div className="p-4 space-y-3">
                    <div className="h-4 rounded animate-pulse" style={{ background: '#334155', width: '80%' }} />
                    <div className="h-3 rounded animate-pulse" style={{ background: '#334155', width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>
              YouTube Intel
            </h1>
            <p style={{ color: '#9aa8be' }}>
              Curated XRP and crypto video analysis for intelligent market insights.
            </p>
            
            {/* Disclaimer */}
            <div className="mt-4 p-4 rounded-lg" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)' }}>
              <p className="text-sm" style={{ color: '#60a5fa' }}>
                <strong>Note:</strong> Videos below are from independent creators. Third-party content is provided for informational purposes only. ControlNode does not own or control this content. Nothing presented here constitutes financial advice. Always do your own research.
              </p>
            </div>
          </div>

          {videos.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
                <Play size={24} style={{ color: '#8b5cf6' }} />
              </div>
              <h2 className="text-xl font-semibold mb-2" style={{ color: '#eceef5' }}>
                No videos yet
              </h2>
              <p style={{ color: '#9aa8be' }}>
                Admin can add curated YouTube videos for member analysis.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map(video => (
                <div
                  key={video.id}
                  onClick={() => openVideo(video.youtube_url)}
                  className="group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                  style={{ 
                    background: '#1e293b', 
                    border: '1px solid #334155',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                  }}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback to different thumbnail quality if maxres fails
                        if (e.target.src.includes('maxresdefault')) {
                          e.target.src = `https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`
                        }
                      }}
                    />
                    
                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Play size={24} className="text-white ml-1" fill="currentColor" />
                      </div>
                    </div>

                    {/* External link indicator */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                        <ExternalLink size={14} className="text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors" style={{ color: '#eceef5' }}>
                      {video.title}
                    </h3>
                    
                    {video.description && (
                      <p className="text-sm mb-3 line-clamp-2 leading-relaxed" style={{ color: '#9aa8be' }}>
                        {video.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs" style={{ color: '#6b7a96' }}>
                      <Calendar size={12} />
                      <span>Added {formatDate(video.published_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-12 text-center">
            <p className="text-sm leading-relaxed max-w-2xl mx-auto" style={{ color: '#4a5870' }}>
              Videos are curated for educational and informational purposes only. Content represents third-party opinions and should not be considered financial advice. Always conduct your own research and consult with qualified professionals before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
