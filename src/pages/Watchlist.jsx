import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { TrendingUp, TrendingDown } from 'lucide-react'

const COINGECKO_IDS = {
  XRP: 'ripple', BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana',
  XLM: 'stellar', HBAR: 'hedera-hashgraph', ADA: 'cardano',
  DOT: 'polkadot', MATIC: 'matic-network', AVAX: 'avalanche-2',
  LINK: 'chainlink', LTC: 'litecoin', BCH: 'bitcoin-cash',
  UNI: 'uniswap', ATOM: 'cosmos', ALGO: 'algorand',
  VET: 'vechain', FIL: 'filecoin', ICP: 'internet-computer',
  NEAR: 'near', DOGE: 'dogecoin', SHIB: 'shiba-inu',
  TRX: 'tron', TON: 'the-open-network', SUI: 'sui',
  APT: 'aptos', OP: 'optimism', ARB: 'arbitrum',
}

const SYMBOL_NAMES = {
  XRP: 'XRP / Ripple', BTC: 'Bitcoin', ETH: 'Ethereum', SOL: 'Solana',
  XLM: 'Stellar', HBAR: 'Hedera', ADA: 'Cardano', DOT: 'Polkadot',
  MATIC: 'Polygon', AVAX: 'Avalanche', LINK: 'Chainlink', LTC: 'Litecoin',
  BCH: 'Bitcoin Cash', UNI: 'Uniswap', ATOM: 'Cosmos', ALGO: 'Algorand',
  VET: 'VeChain', FIL: 'Filecoin', ICP: 'Internet Computer', NEAR: 'NEAR Protocol',
  DOGE: 'Dogecoin', SHIB: 'Shiba Inu', TRX: 'TRON', TON: 'Toncoin',
  SUI: 'Sui', APT: 'Aptos', OP: 'Optimism', ARB: 'Arbitrum',
}

function fmt(n) {
  if (n === null || n === undefined) return '—'
  if (n >= 1000) return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
  if (n >= 1) return '$' + n.toFixed(2)
  return '$' + n.toFixed(4)
}

function fmtVol(n) {
  if (!n) return '—'
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(0) + 'M'
  return '$' + n.toLocaleString()
}

export default function Watchlist() {
  const [symbols, setSymbols] = useState([])
  const [prices, setPrices] = useState({})
  const [loading, setLoading] = useState(true)

  // Load symbols from admin master_watchlist table
  useEffect(function() {
    async function loadWatchlist() {
      try {
        var result = await supabase
          .from('master_watchlist')
          .select('symbol')
          .order('symbol')

        if (result.data) {
          setSymbols(result.data.map(function(d) { return d.symbol }))
        }
      } catch(e) {
        console.error('Error loading master watchlist:', e)
      }
      setLoading(false)
    }

    loadWatchlist()

    // Refresh every 30 seconds when admin updates
    var interval = setInterval(loadWatchlist, 30 * 1000)
    return function() { clearInterval(interval) }
  }, [])

  useEffect(function() {
    if (symbols.length === 0) return
    async function fetchPrices() {
      var ids = symbols
        .map(function(s) { return COINGECKO_IDS[s] })
        .filter(Boolean)
        .join(',')
      if (!ids) return
      try {
        // Delay slightly to avoid competing with other API calls
        await new Promise(function(resolve) { setTimeout(resolve, 1500) })
        var res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=' + ids + '&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true'
        )
        var data = await res.json()
        setPrices(data)
      } catch(e) {
        console.error('Watchlist CoinGecko error:', e)
      }
    }
    fetchPrices()
    var interval = setInterval(fetchPrices, 60 * 1000)
    return function() { clearInterval(interval) }
  }, [symbols])

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>Watchlist</h1>
        <p className="text-sm" style={{ color: '#9aa8be' }}>Your tracked crypto assets with live prices and key levels.</p>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: '#161a22', borderColor: '#1e2330' }}>
        <div className="grid grid-cols-6 gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wide"
          style={{ color: '#6b7a96', borderBottom: '1px solid #1e2330', background: '#111318' }}>
          <span className="col-span-2">Asset</span>
          <span className="text-right">Price</span>
          <span className="text-right">24h</span>
          <span className="text-right">Volume</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm" style={{ color: '#6b7a96' }}>Loading watchlist...</p>
          </div>
        ) : symbols.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm" style={{ color: '#6b7a96' }}>No assets in watchlist yet.</p>
            <p className="text-xs mt-1" style={{ color: '#6b7a96' }}>Admin can add symbols via the admin panel.</p>
          </div>
        ) : (
          symbols.map(function(symbol, i) {
            var cgId = COINGECKO_IDS[symbol]
            var p = cgId ? prices[cgId] : null
            var price = p ? p.usd : null
            var change = p ? p.usd_24h_change : null
            var vol = p ? p.usd_24h_vol : null
            var up = (change || 0) >= 0

            return (
              <div
                key={symbol}
                className="grid grid-cols-6 gap-4 px-5 py-4 items-center transition-colors hover:bg-white/5"
                style={{ borderBottom: i < symbols.length - 1 ? '1px solid #1e2330' : 'none' }}
              >
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
                    {symbol.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#eceef5' }}>{symbol}</p>
                    <p className="text-xs" style={{ color: '#6b7a96' }}>{SYMBOL_NAMES[symbol] || symbol}</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-right" style={{ color: '#eceef5' }}>
                  {price !== null ? fmt(price) : '—'}
                </p>
                <div className="flex items-center justify-end gap-1">
                  {change !== null ? (
                    <span className="flex items-center gap-1">
                      {up ? <TrendingUp size={12} style={{ color: '#10b981' }} /> : <TrendingDown size={12} style={{ color: '#ef4444' }} />}
                      <span className="text-sm font-medium" style={{ color: up ? '#10b981' : '#ef4444' }}>
                        {up ? '+' : ''}{change.toFixed(2)}%
                      </span>
                    </span>
                  ) : <span style={{ color: '#6b7a96' }}>—</span>}
                </div>
                <p className="text-sm text-right" style={{ color: '#9aa8be' }}>{fmtVol(vol)}</p>
                <div className="flex justify-end">
                  <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                    Admin Controlled
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </AppLayout>
  )
}
