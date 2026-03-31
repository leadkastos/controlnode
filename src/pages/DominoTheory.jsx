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
    desc: 'BTC ETF at $60B+ AUM. ETH ETF growing. XRP ETF applications filed by 3 major institutions. Institutional access layer now exists.',
  },
  {
    num: '03',
    title: 'BRICS De-Dollarization',
    status: 'Activating',
    color: '#f59e0b',
    badge: 'yellow',
    desc: 'BRICS summit opened with digital settlement framework language. XRP as a neutral bridge currency in non-USD corridors is the long-term thesis trigger.',
  },
  {
    num: '04',
    title: 'Sovereign Adoption',
    status: 'Pending',
    color: '#4a5568',
    badge: 'blue',
    desc: 'Watch for central bank or sovereign wealth fund announcements. When one sovereign adopts XRP-based settlement, the cascade begins.',
  },
  {
    num: '05',
    title: 'Retail FOMO Cycle',
    status: 'Pending',
    color: '#4a5568',
    badge: 'blue',
    desc: 'Final stage. Retail re-enters after institutional positioning complete. Media narrative reaches saturation. Parabolic price discovery.',
  },
]

export default function DominoTheory() {
  return (
    <AppLayout>
      <DetailPageLayout
        title="Domino Theory"
        subtitle="The framework for understanding the sequential catalysts that drive XRP's long-term price thesis."
        badge="STAGE 3 — ACTIVATING"
        badgeColor="yellow"
      >
        <DetailSection title="Framework Overview">
          <p className="text-sm leading-relaxed mb-3">
            The Domino Theory is ControlNode's proprietary framework for tracking sequential macro and regulatory catalysts. Each "domino" represents a structural change that makes the next one more probable. We are currently in Stage 3.
          </p>
        </DetailSection>

        {/* Domino Cards */}
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
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold" style={{ color: '#e8eaf0' }}>{d.title}</h3>
                  <Badge color={d.badge}>{d.status}</Badge>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#8892a4' }}>{d.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <DetailSection title="Current Stage Analysis — Stage 3">
          <BulletList items={[
            'The BRICS summit language on "digital settlement frameworks" is the Stage 3 catalyst trigger.',
            'This does not mean XRP is officially adopted — it means the narrative and political will is forming.',
            'Stage 3 historically lasts 3–9 months before Stage 4 (Sovereign Adoption) signals emerge.',
            'Price behavior in Stage 3: volatile accumulation with higher lows. Range: $2.00 – $3.50.',
            'Catalyst to watch: Any G20 or BRICS nation announcing XRP or RLUSD integration.',
          ]} />
        </DetailSection>

        <DetailSection title="Risks to the Thesis">
          <BulletList items={[
            'USD strengthens significantly and BRICS framework stalls — delays Stage 3 → 4 transition.',
            'XRP ETF applications denied — removes institutional access catalyst.',
            'Competing technology (SWIFT GPI upgrade, CBDC interoperability) reduces XRP\'s edge.',
            'Macro recession scenario — risk asset selloff delays entire sequence by 12–18 months.',
          ]} />
        </DetailSection>
      </DetailPageLayout>
    </AppLayout>
  )
}
