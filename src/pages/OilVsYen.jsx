import React from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection, DataRow, BulletList } from '../components/DetailPageLayout'

export default function OilVsYen() {
  return (
    <AppLayout>
      <DetailPageLayout
        title="Oil vs Yen"
        subtitle="Tracking the relationship between oil prices, USD/JPY, and their impact on XRP and crypto market structure."
        badge="MACRO LENS"
        badgeColor="purple"
      >
        <DetailSection title="Current Readings">
          <div className="space-y-0">
            <DataRow label="Brent Crude (WTI)" value="$87.40 (+1.2%)" valueColor="#10b981" />
            <DataRow label="WTI Crude" value="$83.20 (+0.9%)" valueColor="#10b981" />
            <DataRow label="USD/JPY" value="153.4" valueColor="#f59e0b" />
            <DataRow label="EUR/JPY" value="165.8" />
            <DataRow label="BOJ Rate" value="0.1% (Hold)" />
            <DataRow label="OPEC+ Stance" value="Production cuts maintained" />
          </div>
        </DetailSection>

        <DetailSection title="The Framework: Why This Matters for XRP">
          <p className="text-sm leading-relaxed mb-3">
            The Oil–Yen–XRP correlation is a macro arbitrage relationship. Here's the chain:
          </p>
          <BulletList items={[
            'Rising oil → Inflationary pressure → Central banks hold rates higher for longer.',
            'BOJ holds rates while Fed remains elevated → Yen weakens (USD/JPY rises).',
            'Yen weakness → Japanese and Korean investors seek dollar-denominated yield and risk assets.',
            'Ripple\'s ODL corridors run heavily through Japan/Korea → Increased utilization.',
            'Net effect: Rising oil + weak yen has historically been an XRP bullish setup.',
          ]} />
        </DetailSection>

        <DetailSection title="Historical Correlation">
          <div className="space-y-0">
            <DataRow label="Oil up + Yen weak (current)" value="XRP historically +15-40%" valueColor="#10b981" />
            <DataRow label="Oil down + Yen strong" value="XRP historically -10-25%" valueColor="#ef4444" />
            <DataRow label="Oil up + Yen strong" value="Mixed — watch DXY" valueColor="#f59e0b" />
            <DataRow label="Correlation Confidence" value="Moderate (6-month window)" />
          </div>
        </DetailSection>

        <DetailSection title="OPEC+ & Supply Watch">
          <BulletList items={[
            'OPEC+ maintaining current production cuts through Q2 2026 — floor under oil prices.',
            'Saudi Arabia needs $80+ oil to balance budget — supply discipline likely to continue.',
            'Russia sanctions creating secondary market routes through India/China — mild supply fragmentation.',
            'US shale production at record highs — partial offset to OPEC cuts.',
            'Demand: China recovery uneven but positive. EU demand soft.',
          ]} />
        </DetailSection>

        <DetailSection title="Scenarios & XRP Impact">
          <div className="space-y-3">
            {[
              { scenario: 'Oil spikes to $95+ (supply shock)', impact: 'Short-term bearish crypto (risk-off), then bullish via yen weakness', color: '#f59e0b' },
              { scenario: 'Oil falls to $75 (demand collapse)', impact: 'Risk-off signal, watch crypto selloff', color: '#ef4444' },
              { scenario: 'Oil holds $85-90 (base case)', impact: 'Yen stays weak, XRP bullish bias maintained', color: '#10b981' },
              { scenario: 'BOJ hikes (surprise)', impact: 'Yen surges, carry unwind, crypto drops sharply', color: '#ef4444' },
            ].map((s, i) => (
              <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1e2330' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: '#e8eaf0' }}>{s.scenario}</p>
                <p className="text-xs" style={{ color: s.color }}>{s.impact}</p>
              </div>
            ))}
          </div>
        </DetailSection>
      </DetailPageLayout>
    </AppLayout>
  )
}
