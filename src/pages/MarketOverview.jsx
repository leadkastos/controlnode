import React from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection, DataRow, BulletList } from '../components/DetailPageLayout'
import { Badge } from '../components/UI'

const assets = [
  { name: 'XRP', price: '$2.31', change: '+3.4%', mktCap: '$133B', up: true },
  { name: 'Bitcoin', price: '$67,420', change: '-1.2%', mktCap: '$1.33T', up: false },
  { name: 'Ethereum', price: '$3,480', change: '+0.8%', mktCap: '$418B', up: true },
  { name: 'Solana', price: '$148.60', change: '+5.1%', mktCap: '$68B', up: true },
  { name: 'BNB', price: '$592', change: '+1.4%', mktCap: '$86B', up: true },
  { name: 'Cardano', price: '$0.61', change: '-0.3%', mktCap: '$21B', up: false },
]

export default function MarketOverview() {
  return (
    <AppLayout>
      <DetailPageLayout
        title="Market Overview"
        subtitle="A snapshot of the broader crypto market, macro conditions, and sector performance."
        badge="LIVE DATA (MOCK)"
        badgeColor="green"
      >
        <DetailSection title="Total Crypto Market">
          <div className="space-y-0">
            <DataRow label="Total Market Cap" value="$2.74T" />
            <DataRow label="24h Volume" value="$112B" />
            <DataRow label="BTC Dominance" value="48.6%" />
            <DataRow label="Fear & Greed Index" value="68 — Greed" valueColor="#f59e0b" />
            <DataRow label="Active Addresses (24h)" value="1.24M" />
          </div>
        </DetailSection>

        <DetailSection title="Top Assets">
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2 pb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7a96', borderBottom: '1px solid #1e2330' }}>
              <span>Asset</span>
              <span className="text-right">Price</span>
              <span className="text-right">24h</span>
              <span className="text-right">Mkt Cap</span>
            </div>
            {assets.map(a => (
              <div key={a.name} className="grid grid-cols-4 gap-2 py-1.5 text-sm" style={{ borderBottom: '1px solid rgba(30,35,48,0.5)' }}>
                <span style={{ color: '#eceef5' }}>{a.name}</span>
                <span className="text-right" style={{ color: '#eceef5' }}>{a.price}</span>
                <span className="text-right" style={{ color: a.up ? '#10b981' : '#ef4444' }}>{a.change}</span>
                <span className="text-right" style={{ color: '#9aa8be' }}>{a.mktCap}</span>
              </div>
            ))}
          </div>
        </DetailSection>

        <DetailSection title="Macro Context">
          <BulletList items={[
            'DXY: 103.2 — mild dollar weakness, broadly supportive for risk assets.',
            'US 10Y Yield: 4.32% — stable, no rate shock pressure currently.',
            'Gold: $2,310/oz — modest safe-haven demand, not alarming.',
            'Oil (Brent): $87.40 — elevated; watch for inflation re-acceleration risk.',
            'VIX: 16.4 — low volatility regime, equity market complacent.',
          ]} />
        </DetailSection>

        <DetailSection title="Sector Rotation">
          <div className="space-y-0">
            <DataRow label="Layer 1s" value="Outperforming" valueColor="#10b981" />
            <DataRow label="DeFi" value="Neutral" valueColor="#f59e0b" />
            <DataRow label="AI Tokens" value="Underperforming" valueColor="#ef4444" />
            <DataRow label="RWA (Real World Assets)" value="Outperforming" valueColor="#10b981" />
            <DataRow label="Stablecoins" value="Stable" />
          </div>
        </DetailSection>
      </DetailPageLayout>
    </AppLayout>
  )
}
