import React from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection, DataRow, BulletList } from '../components/DetailPageLayout'
import { Badge } from '../components/UI'

const flashPoints = [
  { region: 'Japan / USD-JPY', level: 'High', color: 'red', note: 'BOJ hold → Yen weakness. Carry trade unwind risk elevated.' },
  { region: 'BRICS Summit', level: 'Elevated', color: 'yellow', note: 'Digital settlement framework language introduced. Monitoring.' },
  { region: 'Middle East', level: 'Moderate', color: 'yellow', note: 'Oil supply disruption risk. Brent at $87.40.' },
  { region: 'US–China Trade', level: 'Low', color: 'green', note: 'Tariff talks ongoing. No new escalation in 30 days.' },
  { region: 'Taiwan Strait', level: 'Monitor', color: 'blue', note: 'No new incidents. Background risk persists.' },
]

export default function GeopoliticalWatch() {
  return (
    <AppLayout>
      <DetailPageLayout
        title="Geopolitical Watch"
        subtitle="Tracking macro geopolitical events that directly and indirectly influence crypto market structure."
        badge="RISK LEVEL: ELEVATED"
        badgeColor="yellow"
      >
        <DetailSection title="Active Flash Points">
          <div className="space-y-3">
            {flashPoints.map((fp) => (
              <div key={fp.region} className="flex items-start justify-between gap-3 py-2" style={{ borderBottom: '1px solid #1e2330' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#e8eaf0' }}>{fp.region}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#8892a4' }}>{fp.note}</p>
                </div>
                <Badge color={fp.color}>{fp.level}</Badge>
              </div>
            ))}
          </div>
        </DetailSection>

        <DetailSection title="BRICS Summit — Key Developments">
          <BulletList items={[
            'First mention of "digital settlement framework" in official BRICS communiqué — significant language shift.',
            'India and Brazil both signaled openness to non-USD settlement pilots for bilateral trade.',
            'No specific technology or protocol named — XRP/RLUSD not mentioned directly.',
            'Next BRICS finance ministers meeting: Q3 2026 — watch for technical working group formation.',
            'ControlNode Assessment: Narrative catalyst, not yet structural. Timeline to material impact: 12–24 months.',
          ]} />
        </DetailSection>

        <DetailSection title="BOJ / Yen Watch">
          <div className="space-y-0">
            <DataRow label="USD/JPY" value="153.4" valueColor="#f59e0b" />
            <DataRow label="BOJ Rate Decision" value="Hold at 0.1% (Surprise)" />
            <DataRow label="Intervention Risk" value="Elevated above 155" valueColor="#ef4444" />
            <DataRow label="Carry Trade Unwind Risk" value="Moderate-High" valueColor="#f59e0b" />
            <DataRow label="Impact on XRP" value="Yen weakness = bullish" valueColor="#10b981" />
          </div>
        </DetailSection>

        <DetailSection title="Crypto Policy Developments">
          <BulletList items={[
            'EU MiCA implementation complete — clarity for European institutional participants.',
            'US Senate crypto bill progressing — bipartisan support strengthening.',
            'UAE establishing itself as crypto hub — attracting Ripple and other corridor operators.',
            'Brazil and Argentina: Stablecoin adoption accelerating due to local currency weakness.',
          ]} />
        </DetailSection>

        <DetailSection title="What to Watch This Week">
          <BulletList items={[
            'USD/JPY approaching 155 — if breached, watch for BOJ verbal intervention.',
            'BRICS technical working group announcement expected Tuesday.',
            'US CPI (March 28) — potential macro shock catalyst.',
            'Ripple RLUSD expansion announcement expected this week (unconfirmed).',
          ]} />
        </DetailSection>
      </DetailPageLayout>
    </AppLayout>
  )
}
