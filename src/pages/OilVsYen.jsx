import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'

function DataRow({ label, value, valueColor }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #1e2330' }}>
      <span className="text-sm" style={{ color: '#9aa8be' }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: valueColor || '#eceef5' }}>{value}</span>
    </div>
  )
}

function BulletList({ items }) {
  return (
    <div className="space-y-2">
      {items.map(function(item, i) {
        return (
          <div key={i} className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#3b82f6' }} />
            <p className="text-sm leading-relaxed" style={{ color: '#9aa8be' }}>{item}</p>
          </div>
        )
      })}
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="rounded-xl p-5 border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
      <h2 className="text-sm font-semibold mb-4" style={{ color: '#eceef5' }}>{title}</h2>
      {children}
    </div>
  )
}

function fmt(val, prefix, suffix, decimals) {
  prefix = prefix || ''
  suffix = suffix || ''
  decimals = decimals !== undefined ? decimals : 2
  if (val === null || val === undefined) return '—'
  var n = parseFloat(val)
  if (isNaN(n)) return '—'
  if (Math.abs(n) >= 1000) return prefix + n.toLocaleString('en-US', { maximumFractionDigits: decimals }) + suffix
  return prefix + n.toFixed(decimals) + suffix
}

export default function OilVsYen() {
  const [macro, setMacro] = useState({})

  useEffect(function() {
    async function fetchMacro() {
      try {
        var tdKey = import.meta.env.VITE_TWELVE_DATA_API_KEY
        var res = await fetch(
          'https://api.twelvedata.com/price?symbol=BRENT,USOIL,USD/JPY,EUR/JPY&apikey=' + tdKey
        )
        var data = await res.json()
        setMacro(data)
      } catch(e) {
        console.error('OilVsYen macro error:', e)
      }
    }
    fetchMacro()
    var interval = setInterval(fetchMacro, 60 * 60 * 1000)
    return function() { clearInterval(interval) }
  }, [])

  function tdp(sym) {
    return macro && macro[sym] && macro[sym].price ? parseFloat(macro[sym].price) : null
  }

  var brent = tdp('BRENT')
  var wti = tdp('USOIL')
  var usdjpy = tdp('USD/JPY')
  var eurjpy = tdp('EUR/JPY')

  return (
    <AppLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}>MACRO LENS</span>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>Oil vs Yen</h1>
        </div>
        <p className="text-sm" style={{ color: '#9aa8be' }}>Tracking the relationship between oil prices, USD/JPY, and their historical correlation to crypto market conditions. For informational purposes only.</p>
      </div>

      <div className="space-y-6">

        <Section title="Current Readings">
          <DataRow label="Brent Crude" value={brent ? fmt(brent, '$', '', 2) : '—'} valueColor={brent ? '#10b981' : '#6b7a96'} />
          <DataRow label="WTI Crude" value={wti ? fmt(wti, '$', '', 2) : '—'} valueColor={wti ? '#10b981' : '#6b7a96'} />
          <DataRow label="USD/JPY" value={usdjpy ? fmt(usdjpy, '', '', 2) : '—'} valueColor={usdjpy ? '#f59e0b' : '#6b7a96'} />
          <DataRow label="EUR/JPY" value={eurjpy ? fmt(eurjpy, '', '', 2) : '—'} />
          <DataRow label="BOJ Rate" value="0.5% (Hold)" />
          <DataRow label="OPEC+ Stance" value="Production cuts maintained" />
          <p className="text-xs mt-3" style={{ color: '#6b7a96' }}>
            Oil and forex data: Twelve Data · Updates hourly · BOJ Rate and OPEC+ manually updated · For informational purposes only.
          </p>
        </Section>

        <Section title="The Framework: Observed Correlations">
          <p className="text-sm leading-relaxed mb-3" style={{ color: '#9aa8be' }}>
            The Oil–Yen–XRP relationship is a macro correlation that has been historically observed. The chain of relationships:
          </p>
          <BulletList items={[
            'Rising oil → Inflationary pressure context → Central bank policy considerations.',
            'BOJ rate differential vs Fed → Yen weakening pressure (USD/JPY rises).',
            'Yen weakness → Japanese and Korean investors historically increase exposure to dollar-denominated assets.',
            "Ripple's ODL corridors run through Japan/Korea exchanges — corridor utilization is a data point to watch.",
            'Historical observation: Rising oil + weak yen has coincided with positive XRP price periods.',
          ]} />
          <p className="text-xs mt-3" style={{ color: '#6b7a96' }}>Historical correlations are observational only and do not guarantee future outcomes.</p>
        </Section>

        <Section title="Historical Correlation Notes">
          <DataRow label="Oil up + Yen weak (current)" value="Historically observed positive XRP periods" />
          <DataRow label="Oil down + Yen strong" value="Historically observed negative XRP periods" />
          <DataRow label="Oil up + Yen strong" value="Mixed historical outcomes" />
          <DataRow label="Correlation Confidence" value="Moderate (6-month observation window)" />
          <p className="text-xs mt-3" style={{ color: '#6b7a96' }}>Past correlations are not predictive of future market behavior.</p>
        </Section>

        <Section title="OPEC+ & Supply Context">
          <BulletList items={[
            'OPEC+ maintaining current production cuts through Q2 2026.',
            'Saudi Arabia fiscal breakeven around $80+ oil — supply discipline context.',
            'Russia sanctions creating alternative trade routes through India/China.',
            'US shale production at record highs — partial supply offset.',
            'Demand: China recovery trajectory uneven. EU demand remains soft.',
          ]} />
        </Section>

        <Section title="Macro Scenarios to Monitor">
          <div className="space-y-3">
            {[
              { scenario: 'Oil spikes to $95+ (supply shock)', context: 'Short-term risk-off potential, followed by yen weakness context', color: '#f59e0b' },
              { scenario: 'Oil falls to $75 (demand concern)', context: 'Broader risk-off signal across asset classes', color: '#ef4444' },
              { scenario: 'Oil holds $85-90 (base case)', context: 'Current conditions maintain — yen dynamics continue', color: '#10b981' },
              { scenario: 'BOJ surprise rate hike', context: 'Yen strengthens, carry trade dynamics reverse — risk asset impact likely', color: '#ef4444' },
            ].map(function(s, i) {
              return (
                <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1e2330' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#eceef5' }}>{s.scenario}</p>
                  <p className="text-xs" style={{ color: s.color }}>{s.context}</p>
                </div>
              )
            })}
          </div>
          <p className="text-xs mt-3" style={{ color: '#6b7a96' }}>Scenarios are observational frameworks only — not predictions or recommendations.</p>
        </Section>

      </div>
    </AppLayout>
  )
}
