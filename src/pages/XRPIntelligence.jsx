import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection, DataRow } from '../components/DetailPageLayout'
import { ExternalLink } from 'lucide-react'

function LiveMarketData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    fetch('https://api.coingecko.com/api/v3/coins/ripple?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false')
      .then(function(r) { return r.json() })
      .then(function(json) {
        if (json && json.market_data) setData(json.market_data)
        setLoading(false)
      })
      .catch(function() { setLoading(false) })
  }, [])

  function fmt(n) {
    if (!n) return '—'
    if (Math.abs(n) >= 1e9) return '$' + (n/1e9).toFixed(2) + 'B'
    if (Math.abs(n) >= 1e6) return '$' + (n/1e6).toFixed(0) + 'M'
    return '$' + n.toFixed(4)
  }

  return (
    <DetailSection title="Live Market Data">
      <div className="rounded-lg px-4 py-3 mb-4 text-xs leading-relaxed" style={{ background: 'rgba(139,92,246,0.07)', border: '1px solid rgba(139,92,246,0.15)', color: '#9aa8be' }}>
        <span style={{ color: '#8b5cf6', fontWeight: 600 }}>Live data: </span>
        Real-time XRP market data including price, volume, market cap, and price changes. Sourced from CoinGecko.
      </div>
      {loading ? (
        <p style={{ color: '#6b7a96' }}>Loading market data...</p>
      ) : !data ? (
        <p style={{ color: '#6b7a96' }}>Data unavailable.</p>
      ) : (
        <div className="space-y-0">
          <DataRow label="Current Price" value={fmt(data.current_price?.usd)} valueColor="#eceef5" />
          <DataRow label="24h Change" value={(data.price_change_percentage_24h >= 0 ? '+' : '') + data.price_change_percentage_24h?.toFixed(2) + '%'} valueColor={data.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444'} />
          <DataRow label="7d Change" value={(data.price_change_percentage_7d >= 0 ? '+' : '') + data.price_change_percentage_7d?.toFixed(2) + '%'} valueColor={data.price_change_percentage_7d >= 0 ? '#10b981' : '#ef4444'} />
          <DataRow label="Market Cap" value={fmt(data.market_cap?.usd)} />
          <DataRow label="24h Volume" value={fmt(data.total_volume?.usd)} />
          <DataRow label="Circulating Supply" value={data.circulating_supply ? (data.circulating_supply / 1e9).toFixed(2) + 'B XRP' : '—'} />
          <DataRow label="All Time High" value={fmt(data.ath?.usd)} />
        </div>
      )}
      <p className="text-xs mt-3" style={{ color: '#6b7a96' }}>Source: CoinGecko · Live data · For informational purposes only.</p>
    </DetailSection>
  )
}

function NewsSection({ title, categories }) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    var key = import.meta.env.VITE_CRYPTOCOMPARE_API_KEY
    fetch('https://min-api.cryptocompare.com/data/v2/news/?categories=' + categories + '&excludeCategories=Sponsored&lang=EN&api_key=' + key)
      .then(function(r) { return r.json() })
      .then(function(json) {
        if (json && json.Data) setArticles(json.Data.slice(0, 6))
        setLoading(false)
      })
      .catch(function() { setLoading(false) })
  }, [])

  function timeAgo(ts) {
    var diff = Math.floor((Date.now() / 1000) - ts)
    if (diff < 3600) return Math.floor(diff / 60) + ' min ago'
    if (diff < 86400) return Math.floor(diff / 3600) + ' hrs ago'
    return Math.floor(diff / 86400) + ' days ago'
  }

  return (
    <DetailSection title={title}>
      <p className="text-xs mb-4" style={{ color: '#6b7a96' }}>Live feed from reputable global crypto news sources.</p>
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(function(i) { return <div key={i} className="h-12 rounded animate-pulse" style={{ background: '#1e2330' }} /> })}</div>
      ) : articles.length === 0 ? (
        <p style={{ color: '#6b7a96' }}>No articles available right now.</p>
      ) : (
        <div className="space-y-0">
          {articles.map(function(article, i) {
            var sourceName = article.source_info ? article.source_info.name : article.source
            return (
              <a key={i} href={article.url} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between gap-3 py-2.5 block hover:bg-white/5 -mx-2 px-2 rounded transition-colors" style={{ borderBottom: '1px solid #1e2330', textDecoration: 'none' }}>
                <div className="flex-1">
                  <p className="text-sm leading-snug mb-1" style={{ color: '#eceef5' }}>{article.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium" style={{ color: '#3b82f6' }}>{sourceName}</span>
                    <span className="text-xs" style={{ color: '#6b7a96' }}>{timeAgo(article.published_on)}</span>
                  </div>
                </div>
                <ExternalLink size={13} style={{ color: '#6b7a96', flexShrink: 0, marginTop: '2px' }} />
              </a>
            )
          })}
        </div>
      )}
      <p className="text-xs mt-4" style={{ color: '#6b7a96' }}>Source: CryptoCompare · Live feed · For informational purposes only.</p>
    </DetailSection>
  )
}

export default function XRPIntelligence() {
  return (
    <AppLayout>
      <DetailPageLayout
        title="XRP Intelligence"
        subtitle="Live XRP market data, Ripple corporate news, and XRP market news from reputable global sources. For informational purposes only."
        badge="XRP FOCUS"
        badgeColor="blue"
      >
        <LiveMarketData />
        <NewsSection title="Ripple News" categories="Ripple,XRP" />
        <NewsSection title="XRP Market News" categories="XRP,ETF,Regulation" />
      </DetailPageLayout>
    </AppLayout>
  )
}
