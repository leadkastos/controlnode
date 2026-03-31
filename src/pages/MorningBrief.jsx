import React from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection, DataRow, BulletList } from '../components/DetailPageLayout'
import { Badge } from '../components/UI'

export default function MorningBrief() {
  return (
    <AppLayout>
      <DetailPageLayout
        title="XRP Holds Key Level as Macro Turns — Domino Theory Activates"
        subtitle="A comprehensive look at today's macro environment, XRP technicals, and what it means for positioning."
        badge="MORNING BRIEF"
        badgeColor="blue"
      >
        {/* Date */}
        <p className="text-xs mb-6" style={{ color: '#4a5568' }}>Monday, March 23, 2026 · Published 6:45 AM CT</p>

        {/* Key Catalysts */}
        <DetailSection title="⚡ Key Catalysts">
          <BulletList items={[
            'XRP defended the $2.18 support zone on high volume overnight — bulls are actively defending this floor and the structure remains intact.',
            'Bank of Japan held rates at 0.1% in a surprise hold decision. USD/JPY spiked to 153.4 — yen carry trade unwind risk is now elevated.',
            'BRICS summit opened with explicit "digital settlement framework" language for the first time — a meaningful geopolitical signal for non-USD settlement rails.',
            'BlackRock\'s BTC ETF saw $340M net inflow — largest single-day print in 3 weeks — signaling continued institutional accumulation.',
          ]} />
        </DetailSection>

        {/* Market Snapshot */}
        <DetailSection title="📊 Market Snapshot">
          <div className="space-y-0">
            <DataRow label="XRP / USD" value="$2.31 (+3.4%)" valueColor="#10b981" />
            <DataRow label="BTC / USD" value="$67,420 (-1.2%)" valueColor="#ef4444" />
            <DataRow label="ETH / USD" value="$3,480 (+0.8%)" valueColor="#10b981" />
            <DataRow label="SOL / USD" value="$148.60 (+5.1%)" valueColor="#10b981" />
            <DataRow label="USD / JPY" value="153.4 (Risk ON)" valueColor="#f59e0b" />
            <DataRow label="Brent Crude" value="$87.40 (+1.2%)" />
            <DataRow label="BTC ETF Net Flow (24h)" value="+$340M" valueColor="#10b981" />
          </div>
        </DetailSection>

        {/* What This Means */}
        <DetailSection title="🧠 What This Means">
          <p className="text-sm leading-relaxed mb-3">
            The confluence of BOJ inaction and rising oil is a classic macro setup that has historically been bullish for XRP. When the yen weakens, risk assets in Asia broadly benefit, and Ripple's ODL corridors running through Japanese and Korean exchanges see increased utilization.
          </p>
          <p className="text-sm leading-relaxed">
            The BRICS language is the real story. Any movement toward non-USD settlement infrastructure is a long-term tailwind for the type of cross-border payment rails XRP is positioned to serve. This is a narrative catalyst, not an immediate price driver — but it matters for medium-term positioning.
          </p>
        </DetailSection>

        {/* Key Levels */}
        <DetailSection title="📐 Key Levels">
          <div className="space-y-0">
            <DataRow label="Critical Support" value="$2.18" valueColor="#ef4444" />
            <DataRow label="Support 2" value="$2.05" valueColor="#ef4444" />
            <DataRow label="Immediate Resistance" value="$2.40" valueColor="#f59e0b" />
            <DataRow label="Major Resistance" value="$2.55" valueColor="#f59e0b" />
            <DataRow label="Bull Target (breakout)" value="$2.80 – $3.00" valueColor="#10b981" />
          </div>
        </DetailSection>

        {/* Macro Signals */}
        <DetailSection title="🌐 Macro Signals">
          <BulletList items={[
            'DXY (Dollar Index) weakening slightly — historically bullish for crypto broadly.',
            'US 10Y yield at 4.32% — holding range, no pressure spike.',
            'Gold at $2,310 — mild risk-off hedge present, but not dominant.',
            'Crypto Fear & Greed Index: 68 (Greed) — elevated but not extreme.',
          ]} />
        </DetailSection>

        {/* Domino Theory Update */}
        <DetailSection title="🎯 Domino Theory Update">
          <div className="flex items-center gap-2 mb-3">
            <Badge color="purple">Stage 3 — Acceleration</Badge>
          </div>
          <p className="text-sm leading-relaxed mb-3">
            The Domino Theory framework is now in Stage 3. The initial dominoes (regulatory clarity, ETF approval) have fallen. We are now in the acceleration phase where institutional capital begins compounding.
          </p>
          <BulletList items={[
            'Domino 1 (Regulatory): Complete — SEC case resolved, Ripple operating freely.',
            'Domino 2 (ETF Flows): Active — BTC ETF now $60B+ AUM, XRP ETF filings in progress.',
            'Domino 3 (BRICS / De-dollarization): Activating — summit language is Stage 3 trigger.',
            'Domino 4 (Sovereign Adoption): Pending — watch for central bank announcements.',
          ]} />
        </DetailSection>

        {/* Risks */}
        <DetailSection title="⚠️ Risks to Watch">
          <BulletList items={[
            'If XRP loses $2.18 on a daily close, the bull case weakens significantly — stop structure invalidated.',
            'BOJ pivot risk: Any surprise rate hike would crush the yen carry unwind thesis and pressure risk assets globally.',
            'SEC appeal possibility remains, though probability is assessed as low (<15%).',
            'Macro: Hotter-than-expected CPI print (March 28) could spike DXY and pressure crypto broadly.',
          ]} />
        </DetailSection>

        {/* ControlNode Take */}
        <DetailSection title="🔵 ControlNode Take">
          <div
            className="rounded-lg p-4"
            style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <p className="text-sm leading-relaxed" style={{ color: '#e8eaf0' }}>
              The setup remains constructive. XRP defending $2.18 with macro tailwinds (weak yen, oil strength, BRICS narrative) aligns with the Domino Theory Stage 3 thesis. We are not chasing here — but any pullback to the $2.18–$2.25 zone on low volume remains a high-conviction accumulation zone.
            </p>
            <p className="text-sm leading-relaxed mt-3" style={{ color: '#e8eaf0' }}>
              Watch the $2.40 resistance. A clean break above on volume would open the path to $2.80. Until then, patience.
            </p>
            <p className="text-xs mt-3 font-semibold" style={{ color: '#3b82f6' }}>
              Positioning: Bullish bias. Accumulate dips. Hard stop below $2.05.
            </p>
          </div>
        </DetailSection>
      </DetailPageLayout>
    </AppLayout>
  )
}
