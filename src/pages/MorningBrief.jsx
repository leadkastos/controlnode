import React from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection, DataRow, BulletList } from '../components/DetailPageLayout'
import { Badge } from '../components/UI'

export default function MorningBrief() {
  return (
    <AppLayout>
      <DetailPageLayout
        title="XRP Holds Key Level as Macro Turns — Domino Theory Activates"
        subtitle="A comprehensive look at today's macro environment, XRP technical structure, and relevant market context."
        badge="MORNING BRIEF"
        badgeColor="blue"
      >
        <div
          className="mb-6 px-4 py-3 rounded-lg text-xs leading-relaxed"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#92400e' }}
        >
          <span style={{ color: '#f59e0b', fontWeight: 600 }}>Informational Only: </span>
          <span style={{ color: '#8892a4' }}>This brief is for educational and informational purposes only. Nothing here constitutes financial advice or a recommendation to buy or sell any asset.</span>
        </div>

        <p className="text-xs mb-6" style={{ color: '#4a5568' }}>Monday, March 23, 2026 · Published 6:45 AM CT</p>

        <DetailSection title="⚡ Key Catalysts">
          <BulletList items={[
            'XRP held the $2.18 area on elevated volume overnight — price structure in this zone continues to be observed closely.',
            'Bank of Japan held rates at 0.1% in a surprise hold decision. USD/JPY moved to 153.4 — yen carry dynamics remain in focus.',
            'BRICS summit opened with "digital settlement framework" language for the first time — a notable geopolitical development for cross-border payment infrastructure.',
            'BlackRock BTC ETF recorded $340M net inflow — the largest single-day figure in 3 weeks.',
          ]} />
        </DetailSection>

        <DetailSection title="📊 Market Snapshot">
          <div className="space-y-0">
            <DataRow label="XRP / USD" value="$2.31 (+3.4%)" valueColor="#10b981" />
            <DataRow label="BTC / USD" value="$67,420 (-1.2%)" valueColor="#ef4444" />
            <DataRow label="ETH / USD" value="$3,480 (+0.8%)" valueColor="#10b981" />
            <DataRow label="SOL / USD" value="$148.60 (+5.1%)" valueColor="#10b981" />
            <DataRow label="USD / JPY" value="153.4" valueColor="#f59e0b" />
            <DataRow label="Brent Crude" value="$87.40 (+1.2%)" />
            <DataRow label="BTC ETF Net Flow (24h)" value="+$340M" valueColor="#10b981" />
          </div>
        </DetailSection>

        <DetailSection title="🧠 Context & Observations">
          <p className="text-sm leading-relaxed mb-3">
            The combination of BOJ inaction and rising oil has historically created macro conditions that affect risk asset flows in Asia. Ripple's ODL corridors run through Japanese and Korean exchanges, making yen dynamics worth monitoring for corridor utilization context.
          </p>
          <p className="text-sm leading-relaxed">
            The BRICS language around digital settlement is a narrative development worth tracking. Movement toward non-USD settlement infrastructure is contextually relevant to cross-border payment rails. This is a long-term narrative signal, not an immediate market driver.
          </p>
        </DetailSection>

        <DetailSection title="📐 Technical Levels to Watch">
          <div className="space-y-0">
            <DataRow label="Area of Interest (Below)" value="$2.18" />
            <DataRow label="Secondary Level" value="$2.05" />
            <DataRow label="Overhead Resistance" value="$2.40" />
            <DataRow label="Extended Resistance" value="$2.55" />
            <DataRow label="Range Context" value="$2.05 – $2.55 observed range" />
          </div>
          <p className="text-xs mt-3" style={{ color: '#4a5568' }}>
            Technical levels are observational reference points only. They do not represent buy or sell signals.
          </p>
        </DetailSection>

        <DetailSection title="🌐 Macro Signals">
          <BulletList items={[
            'DXY (Dollar Index) showing mild softness — historically correlated with broader crypto market moves.',
            'US 10Y yield at 4.32% — within recent range, no significant deviation.',
            'Gold at $2,310 — modest safe-haven positioning present.',
            'Crypto Fear & Greed Index: 68 (Greed) — elevated sentiment reading worth noting.',
          ]} />
        </DetailSection>

        <DetailSection title="🎯 Domino Theory Update">
          <div className="flex items-center gap-2 mb-3">
            <Badge color="purple">Stage 3 — Activating</Badge>
          </div>
          <p className="text-sm leading-relaxed mb-3">
            The Domino Theory framework is tracking Stage 3 activation. Earlier stages (regulatory clarity, ETF access) have progressed. Current focus is on macro geopolitical signals.
          </p>
          <BulletList items={[
            'Stage 1 (Regulatory): Progressed — SEC case resolved.',
            'Stage 2 (ETF Flows): Active — BTC ETF now $60B+ AUM, XRP ETF filings in process.',
            'Stage 3 (BRICS / De-dollarization): Activating — summit language noted as Stage 3 context.',
            'Stage 4 (Sovereign Adoption): Not yet active — monitoring.',
          ]} />
        </DetailSection>

        <DetailSection title="⚠️ Risk Factors to Monitor">
          <BulletList items={[
            'Price structure below $2.18 on a sustained basis would change the technical context being observed.',
            'BOJ policy surprise: Any unexpected rate change could affect yen carry dynamics and broader risk asset flows.',
            'Macro: CPI data release (March 28) could impact dollar strength and market conditions broadly.',
            'Regulatory: Ongoing monitoring of SEC posture on XRP ETF applications.',
          ]} />
        </DetailSection>

        <DetailSection title="🔵 ControlNode Observations">
          <div
            className="rounded-lg p-4"
            style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <p className="text-sm leading-relaxed" style={{ color: '#e8eaf0' }}>
              The current macro setup — yen weakness, oil strength, and BRICS digital settlement language — aligns with the contextual conditions outlined in the Domino Theory Stage 3 framework. The $2.18 area continues to be a technically significant reference point that market participants appear to be watching.
            </p>
            <p className="text-sm leading-relaxed mt-3" style={{ color: '#e8eaf0' }}>
              The $2.40 overhead level represents the next significant technical reference. Price behavior around these levels may provide context for the next directional move.
            </p>
            <p className="text-xs mt-3 font-semibold" style={{ color: '#4a5568' }}>
              This is market context and observation only — not a recommendation or financial advice.
            </p>
          </div>
        </DetailSection>
      </DetailPageLayout>
    </AppLayout>
  )
}
