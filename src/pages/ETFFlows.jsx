import React from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection, DataRow, BulletList } from '../components/DetailPageLayout'
import { Badge } from '../components/UI'

const etfData = [
  { name: 'BlackRock iShares BTC ETF (IBIT)', flow: '+$340M', aum: '$28.4B', up: true },
  { name: 'Fidelity Wise Origin BTC (FBTC)', flow: '+$128M', aum: '$11.2B', up: true },
  { name: 'ARK 21Shares BTC ETF (ARKB)', flow: '+$44M', aum: '$3.8B', up: true },
  { name: 'Grayscale BTC Trust (GBTC)', flow: '-$62M', aum: '$18.1B', up: false },
  { name: 'BlackRock ETH ETF (ETHA)', flow: '+$82M', aum: '$3.1B', up: true },
  { name: 'Fidelity ETH ETF (FETH)', flow: '+$31M', aum: '$1.4B', up: true },
]

export default function ETFFlows() {
  return (
    <AppLayout>
      <DetailPageLayout
        title="ETF Flow Tracker"
        subtitle="Daily net flows for Bitcoin and Ethereum ETFs — the institutional demand signal."
        badge="INSTITUTIONAL FLOWS"
        badgeColor="blue"
      >
        <DetailSection title="Today's Net Flows">
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 pb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: '#4a5568', borderBottom: '1px solid #1e2330' }}>
              <span>ETF</span>
              <span className="text-right">Flow (24h)</span>
              <span className="text-right">AUM</span>
            </div>
            {etfData.map((e) => (
              <div key={e.name} className="grid grid-cols-3 gap-2 py-1.5 text-sm items-center" style={{ borderBottom: '1px solid rgba(30,35,48,0.5)' }}>
                <span className="text-xs" style={{ color: '#8892a4' }}>{e.name}</span>
                <span className="text-right text-xs font-medium" style={{ color: e.up ? '#10b981' : '#ef4444' }}>{e.flow}</span>
                <span className="text-right text-xs" style={{ color: '#e8eaf0' }}>{e.aum}</span>
              </div>
            ))}
          </div>
        </DetailSection>

        <DetailSection title="Aggregate Summary">
          <div className="space-y-0">
            <DataRow label="Total BTC ETF Net Flow (24h)" value="+$450M" valueColor="#10b981" />
            <DataRow label="Total ETH ETF Net Flow (24h)" value="+$113M" valueColor="#10b981" />
            <DataRow label="Total BTC ETF AUM" value="$61.5B" />
            <DataRow label="Total ETH ETF AUM" value="$4.5B" />
            <DataRow label="7-Day Flow Trend" value="Institutional accumulation" valueColor="#10b981" />
            <DataRow label="30-Day Flow Trend" value="Positive but slowing" valueColor="#f59e0b" />
          </div>
        </DetailSection>

        <DetailSection title="XRP ETF Pipeline">
          <BulletList items={[
            'Three major institutions have filed XRP ETF applications: Pending SEC review.',
            'Timeline estimate: 6–12 months to approval (optimistic scenario).',
            'If approved, analyst estimates suggest $2–5B AUM in first 90 days.',
            'Approval probability: ~65% given current regulatory environment.',
            'XRP ETF approval = Domino Theory Stage 2 completion signal.',
          ]} />
        </DetailSection>

        <DetailSection title="What Flows Are Telling Us">
          <BulletList items={[
            'BlackRock\'s $340M single-day inflow is the largest in 3 weeks — institutional buying resumed.',
            'GBTC outflows shrinking — the "exit legacy product" narrative largely complete.',
            'ETH ETF gaining traction after slow start — institutional rotation from BTC to ETH underway.',
            'Net positive flows for 12 consecutive days — structural demand, not one-time event.',
            'Contrarian note: When flows peak and sentiment is max bullish, expect short-term correction.',
          ]} />
        </DetailSection>
      </DetailPageLayout>
    </AppLayout>
  )
}
