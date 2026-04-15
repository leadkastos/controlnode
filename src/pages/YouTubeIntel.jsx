import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { ExternalLink, Clock, Youtube } from 'lucide-react'
import { supabase } from '../lib/supabase'

const channelColors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b']

function timeAgo(dateStr) {
  if (!dateStr) return ''
  var diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 3600) return Math.floor(diff / 60) + ' min ago'
  if (diff < 86400) return Math.floor(diff / 3600) + ' hrs ago'
  return Math.floor(diff / 86400) + ' days ago'
}

function formatViews(n) {
  if (!n) return ''
  var num = parseInt(n)
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M views'
  if (num >= 1000) return Math.floor(num / 1000) + 'K views'
  return num + ' views'
}

function parseDuration(iso) {
  if (!iso) return ''
  var match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return ''
  var h = parseInt(match[1] || 0)
  var m = parseInt(match[2] || 0)
  var s = parseInt(match[3] || 0)
  if (h > 0) return h + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0')
  return m + ':' + String(s).padStart(2, '0')
}

function VideoCard({ video, color }) {
  return (
    <div className="rounded-xl overflow-hidden border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
      <a href={'https://youtube.com/watch?v=' + video.video_id} target="_blank" rel="noopener noreferrer" className="block relative w-full" style={{ paddingBottom: '56.25%', textDecoration: 'none' }}>
        <div className="absolute inset-0">
          <img
            src={video.thumbnail_url || ('https://img.youtube.com/vi/' + video.video_id + '/hqdefault.jpg')}
            alt={video.title}
            className="w-full h-full object-cover"
            onError={function(e) { e.target.src = 'https://img.youtube.com/vi/' + video.video_id + '/hqdefault.jpg' }}
          />
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.35)' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.9)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
            </div>
          </div>
          {video.duration && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs font-mono font-medium" style={{ background: 'rgba(0,0,0,0.85)', color: '#fff' }}>
              {parseDuration(video.duration)}
            </div>
          )}
        </div>
      </a>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: color + '20' }}>
            <Youtube size={12} style={{ color: color }} />
          </div>
          <span className="text-xs font-semibold" style={{ color: color }}>{video.channel_name}</span>
          <span className="text-xs" style={{ color: '#6b7a96' }}>{video.channel_handle}</span>
        </div>
        <p className="text-sm font-medium leading-snug mb-3" style={{ color: '#eceef5' }}>{video.title}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs" style={{ color: '#6b7a96' }}>
              <Clock size={11} />{timeAgo(video.published_at)}
            </span>
            <span className="text-xs" style={{ color: '#6b7a96' }}>{formatViews(video.view_count)}</span>
          </div>
          <a href={'https://youtube.com/watch?v=' + video.video_id} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs" style={{ color: '#3b82f6' }}>
            <ExternalLink size={11} />YouTube
          </a>
        </div>
      </div>
    </div>
  )
}

export default function YouTubeIntel() {
  const [videos, setVideos] = useState([])
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    async function load() {
      var chRes = await supabase.from('youtube_channels').select('*').eq('active', true).order('sort_order', { ascending: true })
      var ch = chRes.data || []
      setChannels(ch)

      var vidRes = await supabase.from('youtube_videos').select('*').order('published_at', { ascending: false })
      setVideos(vidRes.data || [])
      setLoading(false)
    }
    load()
  }, [])

  // Get latest video per channel in channel order
  function getDisplayVideos() {
    var result = []
    channels.forEach(function(ch) {
      var chVideos = videos.filter(function(v) { return v.channel_handle === ch.channel_handle })
      if (chVideos.length > 0) result.push(chVideos[0])
    })
    return result
  }

  var displayVideos = getDisplayVideos()

  function getColor(video) {
    var idx = channels.findIndex(function(ch) { return ch.channel_handle === video.channel_handle })
    return channelColors[idx >= 0 ? idx : 0]
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)' }}>
            <Youtube size={16} style={{ color: '#ef4444' }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>YouTube Intel</h1>
        </div>
        <p className="text-sm" style={{ color: '#9aa8be' }}>Latest videos from curated XRP and crypto channels. Updated hourly during market hours.</p>
        <div className="flex items-center gap-2 mt-3">
          <div className="w-2 h-2 rounded-full" style={{ background: '#10b981' }} />
          <span className="text-xs" style={{ color: '#6b7a96' }}>Following {channels.length} channel{channels.length !== 1 ? 's' : ''} · Updates every hour 7AM–9PM CT</span>
        </div>
      </div>

      <div className="rounded-lg px-4 py-3 mb-6 text-xs" style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.15)', color: '#9aa8be' }}>
        <span style={{ color: '#3b82f6', fontWeight: 600 }}>Note: </span>
        Videos below are from independent creators. Third-party content is provided for informational purposes only. ControlNode does not own or control this content. Nothing presented here constitutes financial advice. Always do your own research.
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[1,2,3,4].map(function(i) {
            return <div key={i} className="rounded-xl animate-pulse" style={{ background: '#161a22', height: '320px' }} />
          })}
        </div>
      ) : displayVideos.length === 0 ? (
        <div className="rounded-xl p-8 text-center border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
          <Youtube size={32} style={{ color: '#6b7a96', margin: '0 auto 12px' }} />
          <p className="text-sm font-medium mb-1" style={{ color: '#eceef5' }}>No videos yet</p>
          <p className="text-xs" style={{ color: '#6b7a96' }}>Videos will appear here once channels are configured and fetched from the admin panel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {displayVideos.map(function(video) {
            return <VideoCard key={video.id} video={video} color={getColor(video)} />
          })}
        </div>
      )}
    </AppLayout>
  )
}
