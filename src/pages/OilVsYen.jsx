import React from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection, DataRow, BulletList } from '../components/DetailPageLayout'

export default function OilVsYen() {
  return (
    <AppLayout>
      <DetailPageLayout
        title="Oil vs Yen"
        subtitle="Tracking the relationship between oil prices, USD/JPY, and their historical correlation to crypto market conditions. For informational purposes only."
        badge="MACRO LENS"
        badgeColor="purple"
      >
        <DetailSection title="Current Readings">
          <div className="space-y-0">
            <DataRow label="Brent Crude" value="$87.40 (+1.2%)" valueColor="#10b981" />
            <DataRow label="WTI Crude" value="$83.20 (+0.9%)" valueColor="#10b981" />
            <DataRow label="USD/JPY" value="153.4" valueColor="#f59e0b" />
            <DataRow label="EUR/JPY" value="165.8" />
            <DataRow label="BOJ Rate" value="0.1% (Hold)" />
            <DataRow label="OPEC+ Stance" value="Production cuts maintained" />
          </div>
        </DetailSection>

        <DetailSection title="The Framework: Observed Correlations">
          <p className="text-sm leading-relaxed mb-3">
            The Oil–Yen–XRP relationship is a macro correlation that has been historically observed. The chain of relationships:
          </p>
          <BulletList items={[
            'Rising oil → Inflationary pressure context → Central bank policy considerations.',
            'BOJ rate differential vs Fed → Yen weakening pressure (USD/JPY rises).',
            'Yen weakness → Japanese and Korean investors historically increase exposure to dollar-denominated assets.',
            "Ripple's ODL corridors run through Japan/Korea exchanges — corridor utilization is a data point to watch.",
            'Historical observation: Rising oil + weak yen has coincided with positive XRP price periods.',
          ]} />
          <p className="text-xs mt-3" style={{ color: '#4a5568' }}>
            Historical correlations are observational only and do not guarantee future outcomes.
          </p>
        </DetailSection>

        <DetailSection title="Historical Correlation Notes">
          <div className="space-y-0">
            <DataRow label="Oil up + Yen weak (current)" value="Historically observed positive XRP periods" />
            <DataRow label="Oil down + Yen strong" value="Historically observed negative XRP periods" />
            <DataRow label="Oil up + Yen strong" value="Mixed historical outcomes" />
            <DataRow label="Correlation Confidence" value="Moderate (6-month observation window)" />
          </div>
          <p className="text-xs mt-3" style={{ color: '#4a5568' }}>
            Past correlations are not predictive of future market behavior.
          </p>
        </DetailSection>

        <DetailSection title="OPEC+ & Supply Context">
          <BulletList items={[
            'OPEC+ maintaining current production cuts through Q2 2026.',
            'Saudi Arabia fiscal breakeven around $80+ oil — supply discipline context.',
            'Russia sanctions creating alternative trade routes through India/China.',
            'US shale production at record highs — partial supply offset.',
            'Demand: China recovery trajectory uneven. EU demand remains soft.',
          ]} />
        </DetailSection>

        <DetailSection title="Macro Scenarios to Monitor">
          <div className="space-y-3">
            {[
              { scenario: 'Oil spikes to $95+ (supply shock)', context: 'Short-term risk-off potential, followed by yen weakness context', color: '#f59e0b' },
              { scenario: 'Oil falls to $75 (demand concern)', context: 'Broader risk-off signal across asset classes', color: '#ef4444' },
              { scenario: 'Oil holds $85-90 (base case)', context: 'Current conditions maintain — yen dynamics continue', color: '#10b981' },
              { scenario: 'BOJ surprise rate hike', context: 'Yen strengthens, carry trade dynamics reverse — risk asset impact likely', color: '#ef4444' },
            ].map((s, i) => (
              <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1e2330' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: '#e8eaf0' }}>{s.scenario}</p>
                <p className="text-xs" style={{ color: s.color }}>{s.context}</p>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: '#4a5568' }}>
            Scenarios are observational frameworks only — not predictions or recommendations.
          </p>
        </DetailSection>
      </DetailPageLayout>
    </AppLayout>
  )
}
