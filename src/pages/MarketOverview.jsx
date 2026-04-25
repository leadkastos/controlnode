import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { usePrices, COINGECKO_IDS } from '../contexts/PriceContext'
import { supabase } from '../lib/supabase'

const ASSET_LIST = [
  { name: 'XRP', cgId: 'ripple' },
  { name: 'Bitcoin', cgId: 'bitcoin' },
  { name: 'Ethereum', cgId: 'ethereum' },
  { name: 'Solana', cgId: 'solana' },
  { name: 'BNB', cgId: 'binancecoin' },
  { name: 'Cardano', cgId: 'cardano' },
]

function fmt(n, prefix, suffix, decimals) {
  prefix = prefix || ''
  suffix = suffix || ''
  decimals = decimals !== undefined ? decimals : 2
  if (n === null || n === undefined) return '—'
  var num = parseFloat(n)
  if (isNaN(num)) return '—'
  if (Math.abs(num) >= 1e12) return prefix + (num / 1e12).toFixed(2) + 'T' + suffix
  if (Math.abs(num) >= 1e9) return prefix + (num / 1e9).toFixed(2) + 'B' + suffix
  if (Math.abs(num) >= 1e6) return prefix + (num / 1e6).toFixed(2) + 'M' + suffix
  if (Math.abs(num) >= 1000) return prefix + num.toLocaleString('en-US', { maximumFractionDigits: decimals }) + suffix
  return prefix + num.toFixed(decimals) + suffix
}

function fmtPrice(n) {
  if (n === null || n === undefined) return '—'
  if (n >= 1000) return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
  if (n >= 1) return '$' + n.toFixed(2)
  return '$' + n.toFixed(4)
}

function DataRow({ label, value, valueColor }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #1e2330' }}>
      <span className="text-sm" style={{ color: '#9aa8be' }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: valueColor || '#eceef5' }}>{value}</span>
    </div>
  )
}

export default function MarketOverview() {
  const prices = usePrices()
  const [globalData, setGlobalData] = useState(null)
  const [assetDetails, setAssetDetails] = useState({})
  const [macro, setMacro] = useState({ DXY: null, US_10Y: null, GOLD_USD: null, BRENT_USD: null, FEAR_GREED: null })

  // CoinGecko global market data
  useEffect(function() {
    async function fetchGlobal() {
      try {
        var res = await fetch('https://api.coingecko.com/api/v3/global')
        var data = await res.json()
        setGlobalData(data.data)
      } catch(e) {
        console.error('Global market data error:', e)
      }
    }
    fetchGlobal()
    var interval = setInterval(fetchGlobal, 5 * 60 * 1000)
    return function() { clearInterval(interval) }
  }, [])

  // Asset detail data
  useEffect(function() {
    async function fetchAssets() {
      try {
        var ids = 'ripple,bitcoin,ethereum,solana,binancecoin,cardano'
        var res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=' + ids + '&vs_currencies=usd&include_24hr_change=true&include_market_cap=true'
        )
        var data = await res.json()
        setAssetDetails(data)
      } catch(e) {
        console.error('Asset details error:', e)
      }
    }
    fetchAssets()
    var interval = setInterval(fetchAssets, 5 * 60 * 1000)
    return function() { clearInterval(interval) }
  }, [])

  // Macro data — reads from market_data table (single source of truth, populated by oil-price-updater Edge Function)
  useEffect(function() {
    async function loadMacro() {
      try {
        var res = await supabase
          .from('market_data')
          .select('key, value')
          .in('key', ['DXY', 'US_10Y', 'GOLD_USD', 'BRENT_USD', 'FEAR_GREED'])

        if (res.data && res.data.length > 0) {
          var lookup = {}
          res.data.forEach(function(row) { lookup[row.key] = row.value })
          setMacro({
            DXY: lookup.DXY || null,
            US_10Y: lookup.US_10Y || null,
            GOLD_USD: lookup.GOLD_USD || null,
            BRENT_USD: lookup.BRENT_USD || null,
            FEAR_GREED: lookup.FEAR_GREED || null
          })
        }
      } catch(e) {
        console.error('Macro data error:', e)
      }
    }
    loadMacro()
    var interval = setInterval(loadMacro, 60 * 1000)
    return function() { clearInterval(interval) }
  }, [])

  var totalMktCap = globalData ? fmt(globalData.total_market_cap && globalData.total_market_cap.usd, '$') : '—'
  var total24hVol = globalData ? fmt(globalData.total_volume && globalData.total_volume.usd, '$') : '—'
  var btcDominance = globalData ? (globalData.market_cap_percentage && globalData.market_cap_percentage.btc ? globalData.market_cap_percentage.btc.toFixed(1) + '%' : '—') : '—'

  var fgValue = macro.FEAR_GREED
  var fgLabel = '—'
  var fgColor = '#9aa8be'
  if (fgValue !== null) {
    var label
    if (fgValue <= 24) label = 'Extreme Fear'
    else if (fgValue <= 49) label = 'Fear'
    else if (fgValue <= 74) label = 'Greed'
    else label = 'Extreme Greed'
    fgLabel = fgValue + ' — ' + label
    fgColor = fgValue <= 49 ? '#ef4444' : '#10b981'
  }

  var dxy = macro.DXY ? parseFloat(macro.DXY) : null
  var us10y = macro.US_10Y ? parseFloat(macro.US_10Y) : null
  var gold = macro.GOLD_USD ? parseFloat(macro.GOLD_USD) : null
  var brent = macro.BRENT_USD ? parseFloat(macro.BRENT_USD) : null

  var macroItems = [
    dxy ? 'DXY: ' + dxy.toFixed(2) + ' — ' + (dxy < 100 ? 'mild dollar weakness, broadly supportive for risk assets.' : dxy < 104 ? 'dollar neutral, watch for movement.' : 'dollar strength, potential headwind for risk assets.') : 'DXY: Loading...',
    us10y ? 'US 10Y Yield: ' + us10y.toFixed(2) + '% — ' + (us10y < 4 ? 'yields subdued, supportive for growth assets.' : us10y < 4.5 ? 'stable, no rate shock pressure currently.' : 'elevated yields, watch for risk-off pressure.') : 'US 10Y Yield: Loading...',
    gold ? 'Gold: $' + gold.toLocaleString('en-US', { maximumFractionDigits: 0 }) + '/oz — ' + (gold > 3000 ? 'elevated safe-haven demand, macro uncertainty present.' : 'modest safe-haven demand, not alarming.') : 'Gold: Loading...',
    brent ? 'Oil (Brent): $' + brent.toFixed(2) + ' — ' + (brent > 90 ? 'elevated; watch for inflation re-acceleration risk.' : brent > 75 ? 'moderate, manageable inflation impact.' : 'subdued oil prices, inflation pressure easing.') : 'Oil (Brent): Loading...',
  ]

  return (
    <AppLayout>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>LIVE</span>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>Market Overview</h1>
        </div>
        <p className="text-sm" style={{ color: '#9aa8be' }}>A snapshot of the broader crypto market and macro conditions.</p>
      </div>
      <div className="space-y-6">
        {/* Total Crypto Market */}
        <div className="rounded-xl p-5 border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#eceef5' }}>Total Crypto Market</h2>
          <DataRow label="Total Market Cap" value={totalMktCap} />
          <DataRow label="24h Volume" value={total24hVol} />
          <DataRow label="BTC Dominance" value={btcDominance} />
          <DataRow label="Fear & Greed Index" value={fgLabel} valueColor={fgColor} />
        </div>

        {/* Top Assets */}
        <div className="rounded-xl p-5 border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#eceef5' }}>Top Assets</h2>
          <div className="grid grid-cols-4 gap-2 pb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7a96', borderBottom: '1px solid #1e2330' }}>
            <span>Asset</span>
            <span className="text-right">Price</span>
            <span className="text-right">24h</span>
            <span className="text-right">Mkt Cap</span>
          </div>
          {ASSET_LIST.map(function(asset) {
            var p = assetDetails[asset.cgId]
            var price = p ? p.usd : null
            var change = p ? p.usd_24h_change : null
            var mktCap = p ? p.usd_market_cap : null
            var up = (change || 0) >= 0
            return (
              <div key={asset.name} className="grid grid-cols-4 gap-2 py-2.5 text-sm" style={{ borderBottom: '1px solid rgba(30,35,48,0.5)' }}>
                <span style={{ color: '#eceef5' }}>{asset.name}</span>
                <span className="text-right" style={{ color: '#eceef5' }}>{fmtPrice(price)}</span>
                <span className="text-right" style={{ color: up ? '#10b981' : '#ef4444' }}>
                  {change !== null ? (up ? '+' : '') + change.toFixed(2) + '%' : '—'}
                </span>
                <span className="text-right" style={{ color: '#9aa8be' }}>{fmt(mktCap, '$')}</span>
              </div>
            )
          })}
          <p className="text-xs mt-3" style={{ color: '#6b7a96' }}>Source: CoinGecko · Live data · For informational purposes only.</p>
        </div>

        {/* Macro Context */}
        <div className="rounded-xl p-5 border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
          <h2 className="text-sm font-semibold mb-4" style={{ color: '#eceef5' }}>Macro Context</h2>
          <div className="space-y-2">
            {macroItems.map(function(item, i) {
              return (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#3b82f6' }} />
                  <p className="text-sm" style={{ color: '#9aa8be' }}>{item}</p>
                </div>
              )
            })}
          </div>
          <p className="text-xs mt-4" style={{ color: '#6b7a96' }}>
            Source: Yahoo Finance · Updates every 5 min · For informational purposes only.
          </p>
        </div>
      </div>
    </AppLayout>
  )
}
