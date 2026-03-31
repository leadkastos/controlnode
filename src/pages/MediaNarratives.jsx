import React from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection, DataRow, BulletList } from '../components/DetailPageLayout'
import { Badge } from '../components/UI'

const narratives = [
  { title: 'Crypto Regulation Clarity', momentum: 'Rising', sentiment: 'Bullish', badge: 'green' },
  { title: 'XRP Legal Resolution', momentum: 'Fading (priced in)', sentiment: 'Neutral', badge: 'yellow' },
  { title: 'BRICS De-Dollarization', momentum: 'Rising', sentiment: 'Bullish (LT)', badge: 'green' },
  { title: 'Bitcoin ETF as TradFi Gateway', momentum: 'Sustained', sentiment: 'Bullish', badge: 'green' },
  { title: 'AI + Crypto Convergence', momentum: 'Peaking', sentiment: 'Caution', badge: 'yellow' },
  { title: 'Retail FOMO Incoming', momentum: 'Early Signs', sentiment: 'Watch', badge: 'blue' },
]

export default function MediaNarratives() {
  return (
    <AppLayout>
      <DetailPageLayout
        title="Media & Narratives"
        subtitle="Tracking dominant narratives, media sentiment, and contrarian signals across crypto coverage."
        badge="INTELLIGENCE"
        badgeColor="purple"
      >
        <DetailSection title="Dominant Narratives">
          <div className="space-y-2">
            {narratives.map((n, i) => (
              <div key={i} className="flex items-center justify-between gap-3 py-2" style={{ borderBottom: '1px solid #1e2330' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#e8eaf0' }}>{n.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#8892a4' }}>Momentum: {n.momentum}</p>
                </div>
                <Badge color={n.badge}>{n.sentiment}</Badge>
              </div>
            ))}
          </div>
        </DetailSection>

        <DetailSection title="Media Sentiment Pulse">
          <div className="space-y-0">
            <DataRow label="Crypto Coverage Tone" value="Cautiously Bullish" valueColor="#10b981" />
            <DataRow label="XRP Coverage Tone" value="Positive (legal resolution)" valueColor="#10b981" />
            <DataRow label="Bitcoin Coverage" value="Mainstream / Institutional" />
            <DataRow label="Contrarian Signal" value="⚠️ Retail FOMO rising" valueColor="#f59e0b" />
            <DataRow label="Fear & Greed Index" value="68 — Greed (watch)" valueColor="#f59e0b" />
          </div>
        </DetailSection>

        <DetailSection title="Top Headlines (Last 48 Hours)">
          <div className="space-y-3">
            {[
              { source: 'Bloomberg', headline: 'Crypto Regulation Bill Gains Senate Momentum — Vote Expected Q2', sentiment: 'Bullish' },
              { source: 'Reuters', headline: 'BRICS Nations Discuss Digital Asset Settlement at Annual Summit', sentiment: 'Bullish' },
              { source: 'CNBC', headline: 'Bitcoin ETF Sees Third Largest Inflow Week on Record', sentiment: 'Bullish' },
              { source: 'WSJ', headline: 'Ripple Explores IPO as Legal Battles Fade — Bankers Approach', sentiment: 'Bullish' },
              { source: 'FT', headline: 'BOJ Hold Sparks Yen Selloff; Carry Traders Return to Risk Assets', sentiment: 'Bullish' },
              { source: 'CoinDesk', headline: 'XRP On-Chain Activity at 12-Month High as ODL Corridors Expand', sentiment: 'Bullish' },
            ].map((h, i) => (
              <div key={i} className="py-2" style={{ borderBottom: '1px solid #1e2330' }}>
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-xs font-semibold" style={{ color: '#4a5568' }}>{h.source}</span>
                  <Badge color="green">{h.sentiment}</Badge>
                </div>
                <p className="text-sm" style={{ color: '#e8eaf0' }}>{h.headline}</p>
              </div>
            ))}
          </div>
        </DetailSection>

        <DetailSection title="Contrarian Watch — What the Crowd is Missing">
          <BulletList items={[
            'Sentiment is too bullish short-term — Fear & Greed at 68 suggests near-term consolidation likely.',
            'XRP legal narrative is fully priced in. Next catalyst must be utility/adoption-driven.',
            'AI token narrative is peaking — capital rotation into L1s and RWA assets already underway.',
            'Mainstream media not yet covering crypto bullishly at scale — retail FOMO cycle still ahead.',
            'Contrarian edge: While crowd is focused on BTC ETF, smart money is positioning in XRP/RWA infrastructure.',
          ]} />
        </DetailSection>
      </DetailPageLayout>
    </AppLayout>
  )
}
