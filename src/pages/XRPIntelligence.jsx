import React from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection, DataRow, BulletList } from '../components/DetailPageLayout'
import { Badge } from '../components/UI'

export default function XRPIntelligence() {
  return (
    <AppLayout>
      <DetailPageLayout
        title="XRP Intelligence"
        subtitle="Technical structure, on-chain data, Ripple corporate updates, and ODL corridor tracking. For informational purposes only."
        badge="XRP FOCUS"
        badgeColor="blue"
      >
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

        <DetailSection title="Technical Reference Levels">
          <div className="space-y-0">
            <DataRow label="Lower Reference Zone" value="$2.05" />
            <DataRow label="Area of Interest (Below)" value="$2.18 – $2.22" />
            <DataRow label="Current Price" value="$2.31" valueColor="#e8eaf0" />
            <DataRow label="Overhead Reference" value="$2.40" />
            <DataRow label="Extended Overhead Reference" value="$2.55 – $2.80" />
          </div>
          <p className="text-xs mt-3" style={{ color: '#4a5568' }}>
            These are technical observation levels only. Not buy or sell signals.
          </p>
        </DetailSection>

        <DetailSection title="On-Chain Observations">
          <BulletList items={[
            'Exchange inflows declining — net outflow trend observed, consistent with longer-term holding behavior.',
            'Large wallet addresses increased holdings by approximately 2.3% over the past 7 days.',
            'ODL (On-Demand Liquidity) volume up 18% week-over-week — network utility data point.',
            'Active addresses: 380K/day — at 30-day high, network usage expanding.',
            'XRP in escrow: 39.4B — Ripple monthly release cadence continuing as scheduled.',
          ]} />
        </DetailSection>

        <DetailSection title="Ripple Corporate">
          <BulletList items={[
            'SEC case effectively resolved — Ripple operating without active legal proceedings for first time since 2020.',
            'Ripple IPO: Early-stage conversations with investment banks reported. No confirmed timeline.',
            'RLUSD (Ripple stablecoin): $2.1B market cap. Functioning as institutional on-ramp to XRP ecosystem.',
            'New ODL corridors: Philippines, Brazil, and UAE activations confirmed in Q1 2026.',
            'Ripple pursuing prime brokerage licenses in additional jurisdictions.',
          ]} />
        </DetailSection>

        <DetailSection title="Recent News">
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
