import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import MorningBriefCard from '../components/MorningBriefCard'
import DailyWrapCard from '../components/DailyWrapCard'
import SmartMoneyCard from '../components/SmartMoneyCard'
import { supabase } from '../lib/supabase'
import {
  XRPPriceCard,
  TechnicalCard,
  XRPNewsCard,
  DominoTheoryCard,
  GeopoliticalCard,
  ETFFlowCard,
  MediaIntelCard,
  OilYenCard,
} from '../components/LiveDashboardCards'

function BreakingNewsCard() {
  const [breakingNews, setBreakingNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    async function loadBreakingNews() {
      try {
        var result = await supabase
          .from('market_news')
          .select('id, content, source, source_url, created_at')
          .eq('type', 'breaking')
          .order('created_at', { ascending: false })
          .limit(3)

        if (result.data) {
          setBreakingNews(result.data)
        }
      } catch(e) {
        console.error('Breaking news fetch error:', e)
      }
      setLoading(false)
    }

    loadBreakingNews()
    var interval = setInterval(loadBreakingNews, 30 * 1000)
    return function() { clearInterval(interval) }
  }, [])

  if (loading || breakingNews.length === 0) {
    return null
  }

  // Inner content for one breaking news item — badge + text + source
  function BreakingNewsRow({ news, showBadge }) {
    return (
      <span className="inline-flex items-center gap-3">
        {showBadge && (
          <span className="text-sm font-bold px-3 py-1.5 rounded-lg flex-shrink-0" style={{ background: '#ef4444', color: '#fff' }}>
            🚨 BREAKING NEWS
          </span>
        )}
        <span className="text-sm font-semibold" style={{ color: '#ef4444' }}>
          {news.content}
        </span>
        {news.source && (
          <span className="text-xs" style={{ color: '#9aa8be' }}>— {news.source}</span>
        )}
      </span>
    )
  }

  // Wraps a row in <a> if source_url exists, otherwise plain span
  function ClickableRow({ news, showBadge }) {
    if (news.source_url) {
      return (
        <a href={news.source_url} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" style={{ textDecoration: 'none' }}>
          <BreakingNewsRow news={news} showBadge={showBadge} />
        </a>
      )
    }
    return <BreakingNewsRow news={news} showBadge={showBadge} />
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-center">
        <div className="rounded-xl p-4 max-w-4xl w-full" style={{ background: 'rgba(239,68,68,0.08)', border: '2px solid rgba(239,68,68,0.2)' }}>
          {breakingNews.length === 1 ? (
            // Single breaking news — entire row clickable
            <div className="flex items-center justify-center">
              <ClickableRow news={breakingNews[0]} showBadge={true} />
            </div>
          ) : (
            // Multiple breaking news — scrolling ticker, each item fully clickable
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold px-3 py-1.5 rounded-lg flex-shrink-0" style={{ background: '#ef4444', color: '#fff' }}>
                🚨 BREAKING NEWS
              </span>
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="animate-marquee whitespace-nowrap">
                  {breakingNews.map(function(news, index) {
                    return (
                      <span key={news.id} className="inline-block">
                        <ClickableRow news={news} showBadge={false} />
                        {index < breakingNews.length - 1 && <span className="mx-8 text-sm" style={{ color: '#ef4444' }}>•</span>}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <MorningBriefCard />
        <DailyWrapCard />
      </div>

      <BreakingNewsCard />

      <div className="mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6b7a96' }}>
          Intelligence Modules
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <XRPPriceCard />
        <TechnicalCard />
        <XRPNewsCard />
        <DominoTheoryCard />
        <GeopoliticalCard />
        <ETFFlowCard />
        <MediaIntelCard />
        <OilYenCard />
        <SmartMoneyCard />
      </div>
    </AppLayout>
  )
}
