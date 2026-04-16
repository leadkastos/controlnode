import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { supabase } from '../lib/supabase'

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

export default function OilVsYen() {
  const [wti, setWti] = useState(null)
  const [brent, setBrent] = useState(null)
  const [usdjpy, setUsdjpy] = useState(null)
  const [scenarios, setScenarios] = useState([])

  useEffect(function() {
    async function load() {
      var res = await supabase.from('market_data').select('*')
      if (res.data && res.data.length > 0) {
        var cached = {}
        res.data.forEach(function(row) { cached[row.key] = parseFloat(row.value) })
        var age = Date.now() - new Date(res.data[0].updated_at).getTime()
        if (cached.WTI_USD > 0 && age < 5 * 60 * 1000) {
          setWti(cached.WTI_USD)
          setBrent(cached.BRENT_USD)
          setUsdjpy(cached.USD_JPY)
          return
        }
      }
      var oilKey = import.meta.env.VITE_OIL_PRICE_API_KEY
      try {
        var fxRes = await fetch('https://open.er-api.com/v6/latest/USD')
        var fx = await fxRes.json()
        if (fx && fx.rates && fx.rates.JPY) setUsdjpy(fx.rates.JPY)
      } catch(e) {}
      try {
        var wtiRes = await fetch('https://api.oilpriceapi.com/v1/prices/latest?by_code=WTI_USD', {
          headers: { 'Authorization': 'Token ' + oilKey, 'Content-Type': 'application/json' }
        })
        var wtiData = await wtiRes.json()
        if (wtiData && wtiData.data && wtiData.data.price) setWti(wtiData.data.price)
      } catch(e) {}
      try {
        var brentRes = await fetch('https://api.oilpriceapi.com/v1/prices/latest?by_code=BRENT_CRUDE_USD', {
          headers: { 'Authorization': 'Token ' + oilKey, 'Content-Type': 'application/json' }
        })
        var brentData = await brentRes.json()
        if (brentData && brentData.data && brentData.data.price) setBrent(brentData.data.price)
      } catch(e) {}
    }
    load()
    supabase.from('oil_yen_scenarios').select('*').order('sort_order', { ascending: true }).then(function(res) {
      if (res.data) setScenarios(res.data)
    })
  }, [])

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
          <DataRow label="Brent Crude" value={brent ? '$' + brent.toFixed(2) : '—'} valueColor={brent ? '#10b981' : '#6b7a96'} />
          <DataRow label="WTI Crude" value={wti ? '$' + wti.toFixed(2) : '—'} valueColor={wti ? '#10b981' : '#6b7a96'} />
          <DataRow label="USD/JPY" value={usdjpy ? usdjpy.toFixed(2) : '—'} valueColor={usdjpy ? '#f59e0b' : '#6b7a96'} />
          <DataRow label="BOJ Rate" value="0.5% (Hold)" />
          <DataRow label="OPEC+ Stance" value="Production cuts maintained" />
          <p className="text-xs mt-3" style={{ color: '#6b7a96' }}>
            Oil: OilPriceAPI · Forex: ExchangeRate API · Updates every 5 min · BOJ Rate and OPEC+ manually updated · For informational purposes only.
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
          <DataRow label="Oil up + Yen weak" value="Historically observed positive XRP periods" />
          <DataRow label="Oil down + Yen strong" value="Historically observed negative XRP periods" />
          <DataRow label="Oil up + Yen strong" value="Mixed historical outcomes" />
          <DataRow label="Correlation Confidence" value="Moderate (6-month observation window)" />
          <p className="text-xs mt-3" style={{ color: '#6b7a96' }}>Past correlations are not predictive of future market behavior.</p>
        </Section>

        <Section title="Macro Scenarios to Monitor">
          {scenarios.length === 0 ? (
            <p className="text-sm" style={{ color: '#6b7a96' }}>No scenarios added yet. Check back soon.</p>
          ) : (
            <div className="space-y-3">
              {scenarios.map(function(s) {
                return (
                  <div key={s.id} className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #1e2330' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#eceef5' }}>{s.scenario}</p>
                    <p className="text-xs" style={{ color: s.color || '#f59e0b' }}>{s.context}</p>
                  </div>
                )
              })}
            </div>
          )}
          <p className="text-xs mt-3" style={{ color: '#6b7a96' }}>Scenarios are observational frameworks only — not predictions or recommendations.</p>
        </Section>
      </div>
    </AppLayout>
  )
}
