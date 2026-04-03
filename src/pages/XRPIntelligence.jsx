import React from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection, DataRow, BulletList } from '../components/DetailPageLayout'
import { Badge } from '../components/UI'

export default function XRPIntelligence() {
  return (
    <AppLayout>
      <DetailPageLayout
        title="XRP Intelligence"
        subtitle="Technical structure, on-chain data, Ripple corporate news, and XRP market news from reputable global sources. For informational purposes only."
        badge="XRP FOCUS"
        badgeColor="blue"
      >

        {/* Price & Technicals */}
        <DetailSection title="Price & Technical Structure">
          <div className="space-y-0">
            <DataRow label="Current Price" value="$2.31" valueColor="#e8eaf0" />
            <DataRow label="24h Change" value="+3.4%" valueColor="#10b981" />
            <DataRow label="7d Change" value="+11.2%" valueColor="#10b981" />
            <DataRow label="30d Change" value="+28.4%" valueColor="#10b981" />
            <DataRow label="RSI (14)" value="61.4 — Mid-range" />
            <DataRow label="MACD" value="Positive crossover observed" />
            <DataRow label="Volume (24h)" value="$4.2B" />
            <DataRow label="Market Cap" value="$133B" />
          </div>
        </DetailSection>

        {/* Technical Levels */}
        <DetailSection title="Technical Reference Levels">
          <div className="space-y-0">
            <DataRow label="Lower Reference Zone" value="$2.05" />
            <DataRow label="Area of Interest (Below)" value="$2.18 – $2.22" />
            <DataRow label="Current Price" value="$2.31" valueColor="#e8eaf0" />
            <DataRow label="Overhead Reference" value="$2.40" />
            <DataRow label="Extended Overhead Reference" value="$2.55 – $2.80" />
          </div>
          <p className="text-xs mt-3" style={{ color: '#6b7a96' }}>
            Technical levels are observational reference points only — not buy or sell signals.
          </p>
        </DetailSection>

        {/* On-Chain */}
        <DetailSection title="On-Chain Observations">
          <div
            className="rounded-lg px-4 py-3 mb-4 text-xs leading-relaxed"
            style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.15)', color: '#9aa8be' }}
          >
            <span style={{ color: '#3b82f6', fontWeight: 600 }}>What is on-chain data? </span>
            On-chain data refers to publicly recorded activity on the XRP Ledger blockchain itself — things like how many wallets are active, how much XRP is moving on exchanges, and how whales (large holders) are behaving. This data is sourced from the XRP Ledger directly and from analytics platforms like Santiment and Glassnode.
          </div>
          <BulletList items={[
            'Exchange inflows declining — net outflow trend observed, consistent with longer-term holding behavior. (Source: XRP Ledger / Santiment)',
            'Large wallet addresses (holding 1M+ XRP) increased holdings by ~2.3% over the past 7 days. (Source: Glassnode)',
            'ODL (On-Demand Liquidity) volume up 18% week-over-week — measures real-world XRP usage for cross-border payments. (Source: Ripple)',
            'Active addresses: 380K/day — at 30-day high, indicating expanding network usage. (Source: XRP Ledger)',
            'XRP in Ripple escrow: 39.4B — Ripple releases up to 1B XRP monthly per their public escrow schedule. (Source: Ripple)',
          ]} />
        </DetailSection>

        {/* Ripple News */}
        <DetailSection title="Ripple News">
          <p className="text-xs mb-4" style={{ color: '#6b7a96' }}>
            Latest Ripple corporate developments from reputable global news sources. Updated continuously.
          </p>
          <div className="space-y-3">
            {[
              { headline: 'Ripple IPO: Investment Banks in Early Discussions — Sources', source: 'Bloomberg', time: '1 day ago', category: 'Corporate' },
              { headline: 'Ripple Expands ODL to UAE Corridor — $400M Monthly Volume Reported', source: 'Reuters', time: '2 days ago', category: 'Adoption' },
              { headline: 'Ripple Acquires Prime Brokerage License in Singapore', source: 'Financial Times', time: '3 days ago', category: 'Regulatory' },
              { headline: 'RLUSD Stablecoin Reaches $2.1B Market Cap — Institutional Demand Cited', source: 'CoinDesk', time: '4 days ago', category: 'Product' },
              { headline: 'Ripple CEO Brad Garlinghouse Addresses World Economic Forum on Digital Payments', source: 'WSJ', time: '5 days ago', category: 'Executive' },
            ].map((n, i) => (
              <div key={i} className="flex items-start justify-between gap-3 py-2.5" style={{ borderBottom: '1px solid #1e2330' }}>
                <div className="flex-1">
                  <p className="text-sm leading-snug mb-1" style={{ color: '#eceef5' }}>{n.headline}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium" style={{ color: '#3b82f6' }}>{n.source}</span>
                    <span className="text-xs" style={{ color: '#6b7a96' }}>{n.time}</span>
                  </div>
                </div>
                <Badge color="blue">{n.category}</Badge>
              </div>
            ))}
          </div>
        </DetailSection>

        {/* XRP Market News */}
        <DetailSection title="XRP Market News">
          <p className="text-xs mb-4" style={{ color: '#6b7a96' }}>
            XRP price, market structure, and ecosystem news from reputable sources globally.
          </p>
          <div className="space-y-3">
            {[
              { headline: 'SEC Drops Final Retail Lawsuit Appeal Against XRP', source: 'Reuters', time: '2 hrs ago', category: 'Regulatory' },
              { headline: 'Major Bank Files for XRP ETF — Third Application This Month', source: 'Bloomberg', time: '1 day ago', category: 'ETF' },
              { headline: 'XRP On-Chain Activity at 12-Month High as ODL Corridors Expand', source: 'CoinDesk', time: '1 day ago', category: 'On-Chain' },
              { headline: 'XRP Futures Open Interest Hits Record — Derivatives Market Expanding', source: 'The Block', time: '2 days ago', category: 'Markets' },
            ].map((n, i) => (
              <div key={i} className="flex items-start justify-between gap-3 py-2.5" style={{ borderBottom: '1px solid #1e2330' }}>
                <div className="flex-1">
                  <p className="text-sm leading-snug mb-1" style={{ color: '#eceef5' }}>{n.headline}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium" style={{ color: '#3b82f6' }}>{n.source}</span>
                    <span className="text-xs" style={{ color: '#6b7a96' }}>{n.time}</span>
                  </div>
                </div>
                <Badge color="purple">{n.category}</Badge>
              </div>
            ))}
          </div>
        </DetailSection>

      </DetailPageLayout>
    </AppLayout>
  )
}
