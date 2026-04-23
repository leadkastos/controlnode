import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { ExternalLink, Clock, Tag } from 'lucide-react'
import { supabase } from '../lib/supabase'

function timeAgo(ts) {
  var diff = Math.floor((Date.now() - ts * 1000) / 60000)
  if (diff < 60) return diff + ' min ago'
  if (diff < 1440) return Math.floor(diff / 60) + ' hrs ago'
  return Math.floor(diff / 1440) + ' days ago'
}

function getCategoryColor(category) {
  const colors = {
    'ETF Rumor': { bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
    'Ripple Rumor': { bg: 'rgba(139,92,246,0.12)', text: '#8b5cf6' },
    'XRP Rumor': { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
    'Regulatory': { bg: 'rgba(139,92,246,0.12)', text: '#8b5cf6' },
    'Exchange': { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
    'Macro': { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
    'Social Buzz': { bg: 'rgba(236,72,153,0.12)', text: '#ec4899' },
    'General': { bg: 'rgba(107,114,128,0.12)', text: '#6b7280' }
  }
  return colors[category] || colors['General']
}

export default function MarketNews() {
  const [marketNews, setMarketNews] = useState([])
  const [marketChatter, setMarketChatter] = useState([])
  const [liveFeed, setLiveFeed] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    async function loadData() {
      try {
        // Load admin-posted confirmed news
        var newsRes = await supabase
          .from('market_news')
          .select('*')
          .eq('type', 'confirmed')
          .order('created_at', { ascending: false })
          .limit(20)
        
        if (newsRes.data) setMarketNews(newsRes.data)

        // Load admin-posted market chatter
        var chatterRes = await supabase
          .from('market_news')
          .select('*')
          .eq('type', 'chatter')
          .order('created_at', { ascending: false })
          .limit(50)
        
        if (chatterRes.data) setMarketChatter(chatterRes.data)

        // Load live crypto news feed
        var key = import.meta.env.VITE_CRYPTOCOMPARE_API_KEY
        var newsResponse = await fetch(
          'https://min-api.cryptocompare.com/data/v2/news/?categories=XRP,Ripple,Regulation&excludeCategories=Sponsored&lang=EN&api_key=' + key
        )
        var newsData = await newsResponse.json()
        if (newsData && newsData.Data) {
          setLiveFeed(newsData.Data.slice(0, 20))
        }
      } catch(e) {
        console.error('Error loading market news:', e)
      }
      setLoading(false)
    }

    loadData()
    
    // Refresh every 5 minutes
    var interval = setInterval(loadData, 5 * 60 * 1000)
    return function() { clearInterval(interval) }
  }, [])

  function NewsItem({ item, type }) {
    var categoryColor = type === 'live' ? 
      { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' } : 
      getCategoryColor(item.category)

    var timeDisplay = type === 'live' ? 
      timeAgo(item.published_on) : 
      new Date(item.created_at).toLocaleDateString()

    var sourceName = type === 'live' ? 
      (item.source_info ? item.source_info.name : item.source) : 
      item.source

    var title = type === 'live' ? item.title : item.content
    var url = type === 'live' ? item.url : item.source_url

    return (
      <div className="p-4 rounded-lg border transition-colors hover:bg-white/2" style={{ background: '#161a22', borderColor: '#1e2330' }}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {item.category && (
              <span className="text-xs font-semibold px-2 py-1 rounded" style={{ background: categoryColor.bg, color: categoryColor.text }}>
                {type === 'live' ? (item.categories ? item.categories.split('|')[0].trim() : 'Crypto') : item.category}
              </span>
            )}
            <div className="flex items-center gap-1 text-xs" style={{ color: '#6b7a96' }}>
              <Clock size={10} />
              <span>{timeDisplay}</span>
            </div>
          </div>
          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs hover:opacity-80" style={{ color: '#3b82f6' }}>
              <ExternalLink size={12} />
            </a>
          )}
        </div>

        <p className="text-sm leading-relaxed mb-2" style={{ color: '#eceef5' }}>
          {title}
        </p>

        {sourceName && (
          <div className="flex items-center gap-1">
            <Tag size={10} style={{ color: '#6b7a96' }} />
            <span className="text-xs font-medium" style={{ color: '#3b82f6' }}>{sourceName}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>Market News</h1>
        <p className="text-sm" style={{ color: '#9aa8be' }}>Confirmed reports, market chatter, and live crypto news feed.</p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-sm" style={{ color: '#6b7a96' }}>Loading market news...</p>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Confirmed Market News */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold" style={{ color: '#eceef5' }}>Confirmed Market News</h2>
              <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                Verified Sources
              </span>
            </div>
            {marketNews.length === 0 ? (
              <div className="text-center py-8 rounded-lg" style={{ background: '#161a22', border: '1px solid #1e2330' }}>
                <p className="text-sm" style={{ color: '#6b7a96' }}>No confirmed news articles yet.</p>
                <p className="text-xs mt-1" style={{ color: '#6b7a96' }}>Admin can add verified news from Reuters, Bloomberg, etc.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {marketNews.map(function(item) {
                  return <NewsItem key={item.id} item={item} type="confirmed" />
                })}
              </div>
            )}
          </section>

          {/* Market Chatter */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold" style={{ color: '#eceef5' }}>Market Chatter</h2>
              <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
                Unconfirmed Reports
              </span>
            </div>
            {marketChatter.length === 0 ? (
              <div className="text-center py-8 rounded-lg" style={{ background: '#161a22', border: '1px solid #1e2330' }}>
                <p className="text-sm" style={{ color: '#6b7a96' }}>No market chatter yet.</p>
                <p className="text-xs mt-1" style={{ color: '#6b7a96' }}>Rumors, social buzz, and unconfirmed reports appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {marketChatter.map(function(item) {
                  return <NewsItem key={item.id} item={item} type="chatter" />
                })}
              </div>
            )}
          </section>

          {/* Live Crypto Feed */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold" style={{ color: '#eceef5' }}>Live Crypto Feed</h2>
              <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}>
                Automated
              </span>
            </div>
            {liveFeed.length === 0 ? (
              <div className="text-center py-8 rounded-lg" style={{ background: '#161a22', border: '1px solid #1e2330' }}>
                <p className="text-sm" style={{ color: '#6b7a96' }}>Loading live feed...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {liveFeed.map(function(item) {
                  return <NewsItem key={item.id} item={item} type="live" />
                })}
              </div>
            )}
          </section>

        </div>
      )}
    </AppLayout>
  )
}
