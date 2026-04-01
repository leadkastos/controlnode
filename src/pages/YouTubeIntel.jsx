import React, { useState } from 'react'
import AppLayout from '../components/AppLayout'
import { Play, ExternalLink, Clock, Youtube } from 'lucide-react'

const mockVideos = [
  {
    id: 1,
    channelName: 'Jake Claver',
    channelHandle: '@JakeClaver',
    title: 'XRP Is About To Do Something Nobody Is Expecting — Here\'s The Setup',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoId: 'dQw4w9WgXcQ',
    duration: '18:42',
    posted: '3 hours ago',
    views: '24K views',
    color: '#3b82f6',
  },
  {
    id: 2,
    channelName: 'Good Evening Crypto',
    channelHandle: '@GoodEveningCrypto',
    title: 'BREAKING: Major XRP News — This Changes Everything For The Lawsuit',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoId: 'dQw4w9WgXcQ',
    duration: '22:15',
    posted: '6 hours ago',
    views: '31K views',
    color: '#10b981',
  },
  {
    id: 3,
    channelName: 'Paul Barron Network',
    channelHandle: '@PaulBarronNetwork',
    title: 'XRP Price Target Revealed — Institutional Money Is Moving NOW',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoId: 'dQw4w9WgXcQ',
    duration: '31:08',
    posted: '9 hours ago',
    views: '18K views',
    color: '#8b5cf6',
  },
  {
    id: 4,
    channelName: 'Mikkel Thorup',
    channelHandle: '@MikkelThorup',
    title: 'XRP & The Global Reset — Why This Crypto Is Different From All Others',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoId: 'dQw4w9WgXcQ',
    duration: '26:33',
    posted: '12 hours ago',
    views: '14K views',
    color: '#f59e0b',
  },
]

function VideoCard({ video }) {
  const [playing, setPlaying] = useState(false)

  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{ background: '#161a22', borderColor: '#1e2330' }}
    >
      {/* Thumbnail / Player */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        {playing ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0">
            <img
              src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
              alt={video.title}
              className="w-full h-full object-cover"
              onError={e => {
                e.target.src = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`
              }}
            />
            {/* Overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer transition-all"
              style={{ background: 'rgba(0,0,0,0.4)' }}
              onClick={() => setPlaying(true)}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                style={{ background: 'rgba(239,68,68,0.9)' }}
              >
                <Play size={22} fill="white" style={{ color: 'white', marginLeft: '3px' }} />
              </div>
            </div>
            {/* Duration badge */}
            <div
              className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-xs font-mono font-medium"
              style={{ background: 'rgba(0,0,0,0.85)', color: '#fff' }}
            >
              {video.duration}
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        {/* Channel */}
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: `${video.color}20` }}
          >
            <Youtube size={12} style={{ color: video.color }} />
          </div>
          <span className="text-xs font-semibold" style={{ color: video.color }}>
            {video.channelName}
          </span>
          <span className="text-xs" style={{ color: '#4a5568' }}>{video.channelHandle}</span>
        </div>

        {/* Title */}
        <p className="text-sm font-medium leading-snug mb-3" style={{ color: '#e8eaf0' }}>
          {video.title}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs" style={{ color: '#4a5568' }}>
              <Clock size={11} />
              {video.posted}
            </span>
            <span className="text-xs" style={{ color: '#4a5568' }}>{video.views}</span>
          </div>
          <a
            href={`https://youtube.com/watch?v=${video.videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs transition-colors hover:opacity-80"
            style={{ color: '#3b82f6' }}
          >
            <ExternalLink size={11} />
            YouTube
          </a>
        </div>
      </div>
    </div>
  )
}

export default function YouTubeIntel() {
  return (
    <AppLayout>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(239,68,68,0.15)' }}
          >
            <Youtube size={16} style={{ color: '#ef4444' }} />
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#e8eaf0' }}>
            YouTube Intel
          </h1>
        </div>
        <p className="text-sm" style={{ color: '#8892a4' }}>
          Latest videos from your followed channels. Updated 4x daily — 6AM, 12PM, 6PM, 12AM CT.
        </p>
        <div className="flex items-center gap-2 mt-3">
          <div className="w-2 h-2 rounded-full" style={{ background: '#10b981' }} />
          <span className="text-xs" style={{ color: '#4a5568' }}>
            Following 4 channels · Last checked 6:00 AM CT · Next check 12:00 PM CT
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <div
        className="rounded-lg px-4 py-3 mb-6 text-xs"
        style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.15)', color: '#8892a4' }}
      >
        <span style={{ color: '#3b82f6', fontWeight: 600 }}>Note: </span>
        Videos below are from independent creators. ControlNode does not endorse the content of any video. Nothing presented here constitutes financial advice. Always do your own research.
      </div>

      {/* 2x2 Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {mockVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {/* Manage channels link */}
      <div className="mt-6 text-center">
        <p className="text-xs" style={{ color: '#4a5568' }}>
          Following 4 of 4 channels.{' '}
          <a href="/account" style={{ color: '#3b82f6' }}>
            Manage channels in your profile →
          </a>
        </p>
      </div>
    </AppLayout>
  )
}
