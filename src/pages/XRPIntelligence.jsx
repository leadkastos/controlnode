import React from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection, DataRow, BulletList } from '../components/DetailPageLayout'
import { Badge } from '../components/UI'

export default function XRPIntelligence() {
  return (
    <AppLayout>
      <DetailPageLayout
        title="XRP Intelligence"
        subtitle="Deep-dive technical analysis, on-chain data, Ripple corporate updates, and ODL corridor tracking."
        badge="XRP FOCUS"
        badgeColor="blue"
      >
        <DetailSection title="Price & Technicals">
          <div className="space-y-0">
            <DataRow label="Current Price" value="$2.31" valueColor="#e8eaf0" />
            <DataRow label="24h Change" value="+3.4%" valueColor="#10b981" />
            <DataRow label="7d Change" value="+11.2%" valueColor="#10b981" />
            <DataRow label="30d Change" value="+28.4%" valueColor="#10b981" />
            <DataRow label="RSI (14)" value="61.4 — Neutral/Bullish" valueColor="#f59e0b" />
            <DataRow label="MACD" value="Bullish Crossover" valueColor="#10b981" />
            <DataRow label="Volume (24h)" value="$4.2B" />
            <DataRow label="Market Cap" value="$133B" />
          </div>
        </DetailSection>

        <DetailSection title="Key Levels">
          <div className="space-y-0">
            <DataRow label="🔴 Hard Support" value="$2.05" valueColor="#ef4444" />
            <DataRow label="🟡 Support Zone" value="$2.18 – $2.22" valueColor="#f59e0b" />
            <DataRow label="Current Price" value="$2.31" valueColor="#e8eaf0" />
            <DataRow label="🟡 Resistance" value="$2.40" valueColor="#f59e0b" />
            <DataRow label="🟢 Bull Target" value="$2.55 → $2.80" valueColor="#10b981" />
            <DataRow label="🚀 Extended Target" value="$3.00+" valueColor="#10b981" />
          </div>
        </DetailSection>

        <DetailSection title="On-Chain Data">
          <BulletList items={[
            'Exchange inflows declining — net outflow trend suggests accumulation behavior.',
            'Large wallet (whale) addresses increased holdings by ~2.3% over past 7 days.',
            'ODL (On-Demand Liquidity) volume up 18% WoW — real utility growth continues.',
            'Active addresses: 380K/day (30-day high) — network usage expanding.',
            'XRP locked in escrow: 39.4B (Ripple monthly release cadence on track).',
          ]} />
        </DetailSection>

        <DetailSection title="Ripple Corporate">
          <BulletList items={[
            'SEC case effectively resolved — Ripple operating without legal overhang for first time since 2020.',
            'Ripple IPO speculation: Investment banks reportedly in early conversations. Timeline: H2 2026 earliest.',
            'RLUSD (Ripple stablecoin): $2.1B market cap, growing. On-ramp for institutional XRP flows.',
            'New ODL corridors: Philippines, Brazil, and UAE activations confirmed in Q1 2026.',
            'Ripple acquiring prime brokerage licenses in 3 new jurisdictions (details pending).',
          ]} />
        </DetailSection>

        <DetailSection title="XRP News">
          <div className="space-y-3">
            {[
              { headline: 'SEC Drops Final Retail Lawsuit Appeal Against XRP', time: '2 hrs ago', tag: 'Regulatory' },
              { headline: 'Ripple Expands ODL to UAE Corridor — $400M Monthly Volume', time: '5 hrs ago', tag: 'Adoption' },
              { headline: 'Major Bank Files for XRP ETF — Third Application This Month', time: '1 day ago', tag: 'ETF' },
              { headline: 'Ripple IPO Speculation Grows as Investment Banks Circle', time: '2 days ago', tag: 'Corporate' },
            ].map((n, i) => (
              <div key={i} className="flex items-start justify-between gap-3 py-2" style={{ borderBottom: '1px solid #1e2330' }}>
                <div>
                  <p className="text-sm" style={{ color: '#e8eaf0' }}>{n.headline}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#4a5568' }}>{n.time}</p>
                </div>
                <Badge color="blue">{n.tag}</Badge>
              </div>
            ))}
          </div>
        </DetailSection>
      </DetailPageLayout>
    </AppLayout>
  )
}
