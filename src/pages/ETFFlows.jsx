import React from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection, DataRow, BulletList } from '../components/DetailPageLayout'
import { Badge } from '../components/UI'

const xrpEtfFilings = [
  { institution: 'Blackrock', ticker: 'XRPA', status: 'Filed', date: 'Feb 2026', inflow: null, outflow: null },
  { institution: 'Fidelity', ticker: 'FXRP', status: 'Filed', date: 'Jan 2026', inflow: null, outflow: null },
  { institution: 'Franklin Templeton', ticker: 'FXRP', status: 'Filed', date: 'Mar 2026', inflow: null, outflow: null },
]

export default function ETFFlows() {
  return (
    <AppLayout>
      <DetailPageLayout
        title="XRP ETF Flow Tracker"
        subtitle="Tracking XRP ETF filings, SEC review status, and projected flow data. For informational purposes only."
        badge="XRP ETFs ONLY"
        badgeColor="blue"
      >
        {/* Status Banner */}
        <div
          className="rounded-xl p-4 mb-4 flex items-start gap-3"
          style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}
        >
          <div className="flex-1">
            <p className="text-sm font-semibold mb-1" style={{ color: '#f59e0b' }}>XRP ETF Status — Pending SEC Approval</p>
            <p className="text-xs leading-relaxed" style={{ color: '#8892a4' }}>
              No XRP ETF has been approved as of March 2026. Three institutional filings are currently under SEC review. Inflow and outflow data will populate upon approval. All figures below are projections only.
            </p>
          </div>
        </div>

        {/* Active Filings */}
        <DetailSection title="Active XRP ETF Filings">
          <div className="space-y-2">
            <div
              className="grid gap-2 pb-2 text-xs font-semibold uppercase tracking-wide"
              style={{ color: '#4a5568', borderBottom: '1px solid #1e2330', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}
            >
              <span>Institution</span>
              <span>Ticker</span>
              <span>Filed</span>
              <span>Status</span>
            </div>
            {xrpEtfFilings.map((e) => (
              <div
                key={e.institution}
                className="grid gap-2 py-2 text-sm items-center"
                style={{ borderBottom: '1px solid rgba(30,35,48,0.5)', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}
              >
                <span style={{ color: '#e8eaf0' }}>{e.institution}</span>
                <span className="text-xs font-mono" style={{ color: '#8892a4' }}>{e.ticker}</span>
                <span className="text-xs" style={{ color: '#8892a4' }}>{e.date}</span>
                <Badge color="yellow">{e.status}</Badge>
              </div>
            ))}
          </div>
        </DetailSection>

        {/* Inflow / Outflow placeholder */}
        <DetailSection title="Daily Inflow / Outflow (Post-Approval)">
          <div
            className="rounded-lg p-5 text-center"
            style={{ background: '#111318', border: '1px solid #1e2330' }}
          >
            <p className="text-sm font-semibold mb-2" style={{ color: '#4a5568' }}>Awaiting ETF Approval</p>
            <p className="text-xs leading-relaxed" style={{ color: '#4a5568' }}>
              Daily net inflow and outflow data will appear here once an XRP ETF is approved and begins trading. This section will show per-fund and aggregate flow data updated daily.
            </p>
          </div>
        </DetailSection>

        {/* Projected Impact */}
        <DetailSection title="Projected Impact (Analyst Estimates)">
          <div className="space-y-0">
            <DataRow label="Projected AUM — First 90 Days" value="$2B – $5B" />
            <DataRow label="Projected AUM — First Year" value="$10B – $20B" />
            <DataRow label="Approval Probability (est.)" value="~65%" valueColor="#10b981" />
            <DataRow label="Estimated Timeline" value="6–12 months" />
            <DataRow label="Comparable (BTC ETF Day 1)" value="$4.6B inflow" />
          </div>
          <p className="text-xs mt-3" style={{ color: '#4a5568' }}>
            All projections are analyst estimates only. Not predictive of actual outcomes. Not financial advice.
          </p>
        </DetailSection>

        {/* Why it matters */}
        <DetailSection title="Why This Matters for XRP">
          <BulletList items={[
            'An approved XRP ETF would create direct institutional access to XRP without requiring crypto wallets or exchange accounts.',
            'BTC ETF approval in January 2024 resulted in $4.6B inflow on day one — XRP ETF scale would depend on market conditions at time of approval.',
            'ETF approval is tracked as Stage 2 completion in the ControlNode Domino Theory framework.',
            'Three simultaneous filings from major institutions signals serious institutional intent.',
            'SEC review timeline is the primary variable — no guaranteed approval date exists.',
          ]} />
        </DetailSection>

        {/* Recent ETF News */}
        <DetailSection title="Recent XRP ETF News">
          <div className="space-y-3">
            {[
              { headline: 'BlackRock Files XRP ETF Application with SEC', source: 'Bloomberg', time: '2 days ago' },
              { headline: 'Franklin Templeton Joins XRP ETF Race — Third Major Filing', source: 'Reuters', time: '4 days ago' },
              { headline: 'SEC Acknowledges XRP ETF Filings — Review Clock Starts', source: 'CoinDesk', time: '1 week ago' },
              { headline: 'Fidelity XRP ETF Filing Details Revealed — Structure Similar to FBTC', source: 'The Block', time: '2 weeks ago' },
            ].map((n, i) => (
              <div key={i} className="flex items-start justify-between gap-3 py-2" style={{ borderBottom: '1px solid #1e2330' }}>
                <div>
                  <p className="text-sm" style={{ color: '#e8eaf0' }}>{n.headline}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-medium" style={{ color: '#3b82f6' }}>{n.source}</span>
                    <span className="text-xs" style={{ color: '#4a5568' }}>{n.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DetailSection>
      </DetailPageLayout>
    </AppLayout>
  )
}
