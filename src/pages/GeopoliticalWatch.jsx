import React from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection, BulletList } from '../components/DetailPageLayout'
import { Badge } from '../components/UI'
import { ExternalLink } from 'lucide-react'

const flashPoints = [
  { region: 'Japan / USD-JPY', level: 'High', color: 'red', note: 'BOJ hold → Yen weakness. Carry trade unwind risk elevated.' },
  { region: 'BRICS Summit', level: 'Elevated', color: 'yellow', note: 'Digital settlement framework language introduced. Monitoring.' },
  { region: 'Middle East / Oil', level: 'Moderate', color: 'yellow', note: 'Oil supply disruption risk. Brent at $87.40.' },
  { region: 'US–China Trade', level: 'Low', color: 'green', note: 'Tariff talks ongoing. No new escalation in 30 days.' },
  { region: 'Taiwan Strait', level: 'Monitor', color: 'blue', note: 'No new incidents. Background risk persists.' },
]

const cryptoPolicyNews = [
  { region: 'United States', headline: 'Senate Banking Committee Schedules Crypto Market Structure Hearing', source: 'Congress.gov', time: '12 hrs ago', confirmed: true },
  { region: 'European Union', headline: 'EU MiCA Full Compliance Now Active — All Major Exchanges Regulated', source: 'Financial Times', time: '1 day ago', confirmed: true },
  { region: 'United Arab Emirates', headline: 'UAE VARA Issues New Crypto Broker License Framework', source: 'Reuters', time: '2 days ago', confirmed: true },
  { region: 'United States', headline: 'House Financial Services Committee Crypto Subcommittee Formed', source: 'Bloomberg', time: '3 days ago', confirmed: true },
  { region: 'Brazil', headline: 'Brazil Central Bank Announces Stablecoin Regulation Framework', source: 'Reuters', time: '4 days ago', confirmed: true },
]

const weeklyWatch = [
  { item: 'US CPI Data Release — March 28', impact: 'Could affect dollar strength and crypto broadly', confirmed: true },
  { item: 'BRICS Finance Ministers Meeting', impact: 'Digital settlement working group announcement expected', confirmed: false },
  { item: 'SEC XRP ETF Review Deadline', impact: 'Initial response window closes this week', confirmed: true },
  { item: 'Ripple RLUSD Expansion Announcement', impact: 'New market activations reportedly planned', confirmed: false },
]

export default function GeopoliticalWatch() {
  return (
    <AppLayout>
      <DetailPageLayout
        title="Geopolitical Watch"
        subtitle="Macro geopolitical events and crypto policy developments that may affect XRP and digital assets. Informational purposes only."
        badge="RISK LEVEL: ELEVATED"
        badgeColor="yellow"
      >

        {/* Flash Points */}
        <DetailSection title="Active Flash Points">
          <div className="space-y-2">
            {flashPoints.map((fp) => (
              <div key={fp.region} className="flex items-start justify-between gap-3 py-2.5" style={{ borderBottom: '1px solid #1e2330' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#eceef5' }}>{fp.region}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9aa8be' }}>{fp.note}</p>
                </div>
                <Badge color={fp.color}>{fp.level}</Badge>
              </div>
            ))}
          </div>
        </DetailSection>

        {/* Crypto Policy */}
        <DetailSection title="Crypto Policy Developments">
          <div className="space-y-1">
            {cryptoPolicyNews.map((item, i) => (
              <div key={i} className="py-2.5" style={{ borderBottom: '1px solid #1e2330' }}>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded"
                    style={{ background: 'rgba(59,130,246,0.12)', color: '#3b82f6' }}
                  >
                    {item.region}
                  </span>
                  {!item.confirmed && (
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded"
                      style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
                    >
                      Unconfirmed
                    </span>
                  )}
                </div>
                <p className="text-sm leading-snug mb-1" style={{ color: '#eceef5' }}>{item.headline}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium" style={{ color: '#3b82f6' }}>{item.source}</span>
                  <span className="text-xs" style={{ color: '#6b7a96' }}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </DetailSection>

        {/* What to Watch */}
        <DetailSection title="What to Watch This Week">
          <div className="space-y-2">
            {weeklyWatch.map((item, i) => (
              <div key={i} className="px-4 py-3 rounded-lg" style={{ background: '#111318', border: '1px solid #1e2330' }}>
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <p className="text-sm font-medium" style={{ color: '#eceef5' }}>{item.item}</p>
                  {!item.confirmed && (
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0"
                      style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
                    >
                      Unconfirmed
                    </span>
                  )}
                </div>
                <p className="text-xs mt-1" style={{ color: '#9aa8be' }}>{item.impact}</p>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: '#6b7a96' }}>
            Items marked Unconfirmed are based on developing reports. Always verify independently before acting on any information.
          </p>
        </DetailSection>

      </DetailPageLayout>
    </AppLayout>
  )
}
