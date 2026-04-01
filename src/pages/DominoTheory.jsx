import React from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection, DataRow, BulletList } from '../components/DetailPageLayout'
import { Badge } from '../components/UI'

const dominoes = [
  {
    num: '01',
    title: 'Regulatory Clarity',
    status: 'Complete',
    color: '#10b981',
    badge: 'green',
    desc: 'SEC case resolved. XRP classified as non-security in secondary markets. Ripple free to operate. Legal overhang cleared.',
  },
  {
    num: '02',
    title: 'Institutional ETF Flows',
    status: 'Active',
    color: '#3b82f6',
    badge: 'blue',
    desc: 'BTC ETF at $60B+ AUM. ETH ETF growing. XRP ETF applications filed by multiple institutions. Institutional access infrastructure developing.',
  },
  {
    num: '03',
    title: 'BRICS De-Dollarization',
    status: 'Activating',
    color: '#f59e0b',
    badge: 'yellow',
    desc: 'BRICS summit opened with digital settlement framework language. Cross-border payment infrastructure context developing for non-USD corridors.',
  },
  {
    num: '04',
    title: 'Sovereign Adoption',
    status: 'Monitoring',
    color: '#4a5568',
    badge: 'blue',
    desc: 'Watching for central bank or sovereign wealth fund engagement with XRP-based settlement infrastructure. Not yet active.',
  },
  {
    num: '05',
    title: 'Broader Market Participation',
    status: 'Monitoring',
    color: '#4a5568',
    badge: 'blue',
    desc: 'Final stage context. Broader market participation typically follows institutional positioning. Media narrative and search interest would be observable signals.',
  },
]

export default function DominoTheory() {
  return (
    <AppLayout>
      <DetailPageLayout
        title="Domino Theory"
        subtitle="A framework for tracking sequential macro and regulatory developments. For informational and educational purposes only — not financial advice."
        badge="STAGE 3 — ACTIVATING"
        badgeColor="yellow"
      >
        <DetailSection title="Framework Overview">
          <p className="text-sm leading-relaxed mb-3">
            The Domino Theory is ControlNode's observational framework for tracking sequential macro and regulatory developments. Each stage represents a structural shift that contextually supports the next. We are currently observing Stage 3 conditions.
          </p>
          <p className="text-xs" style={{ color: '#4a5568' }}>
            This framework is for educational context only. It does not constitute a prediction of future price movements or a recommendation of any kind.
          </p>
        </DetailSection>

        <div className="space-y-3 mb-4">
          {dominoes.map((d) => (
            <div
              key={d.num}
              className="rounded-xl p-4 border flex gap-4"
              style={{ background: '#161a22', borderColor: '#1e2330', borderLeft: `3px solid ${d.color}` }}
            >
              <div className="text-2xl font-bold flex-shrink-0 w-10" style={{ fontFamily: 'JetBrains Mono', color: d.color, opacity: 0.6 }}>
                {d.num}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-sm font-semibold" style={{ color: '#e8eaf0' }}>{d.title}</h3>
                  <Badge color={d.badge}>{d.status}</Badge>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#8892a4' }}>{d.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <DetailSection title="Stage 3 Context">
          <BulletList items={[
            'BRICS summit language on digital settlement frameworks represents the Stage 3 observational trigger.',
            'This does not indicate official XRP adoption — it indicates geopolitical narrative formation around non-USD settlement infrastructure.',
            'Stage 3 periods historically involve increased volatility and institutional positioning activity.',
            'Price ranges during such periods have historically been wide — precise ranges are not predictable.',
            'Key development to watch: Any G20 or BRICS nation making formal digital settlement announcements.',
          ]} />
        </DetailSection>

        <DetailSection title="Contextual Risk Factors">
          <BulletList items={[
            'USD strengthening significantly could delay BRICS framework momentum.',
            'XRP ETF application denials would affect the Stage 2 institutional access thesis.',
            'Competing infrastructure (SWIFT upgrades, CBDC interoperability) could reduce the relative opportunity.',
            'Broader macro downturn could affect all risk assets and delay sequential development.',
          ]} />
        </DetailSection>
      </DetailPageLayout>
    </AppLayout>
  )
}
