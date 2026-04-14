import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { TrendingUp, TrendingDown, X, Search, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { usePrices, COINGECKO_IDS } from '../contexts/PriceContext'

const DEFAULT_SYMBOLS = ['XRP', 'BTC', 'SOL', 'ETH', 'HBAR', 'XLM']

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
  const { user } = useAuth()
  const prices = usePrices()
  const [symbols, setSymbols] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(function() {
    if (!user) return
    async function loadWatchlist() {
      var result = await supabase
        .from('user_watchlist')
        .select('symbol')
        .eq('user_id', user.id)
        .order('added_at', { ascending: true })

      if (result.error) {
        setSymbols(DEFAULT_SYMBOLS)
        setLoading(false)
        return
      }

      if (!result.data || result.data.length === 0) {
        var inserts = DEFAULT_SYMBOLS.map(function(s) {
          return { user_id: user.id, symbol: s }
        })
        await supabase.from('user_watchlist').insert(inserts)
        setSymbols(DEFAULT_SYMBOLS)
      } else {
        setSymbols(result.data.map(function(d) { return d.symbol }))
      }
      setLoading(false)
    }
    loadWatchlist()
  }, [user])

  async function removeAsset(symbol) {
    setSymbols(function(prev) { return prev.filter(function(s) { return s !== symbol }) })
    await supabase
      .from('user_watchlist')
      .delete()
      .eq('user_id', user.id)
      .eq('symbol', symbol)
  }

  async function addAsset(symbol) {
    if (symbols.includes(symbol)) return
    setAdding(true)
    var result = await supabase
      .from('user_watchlist')
      .insert({ user_id: user.id, symbol: symbol })
    if (!result.error) {
      setSymbols(function(prev) { return [...prev, symbol] })
    }
    setAdding(false)
    setShowModal(false)
    setSearch('')
  }

  var availableSymbols = Object.keys(COINGECKO_IDS).filter(function(s) {
    return !symbols.includes(s) &&
      (s.toLowerCase().includes(search.toLowerCase()) ||
        (SYMBOL_NAMES[s] || '').toLowerCase().includes(search.toLowerCase()))
  })

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
            <p className="text-sm" style={{ color: '#6b7a96' }}>No assets in your watchlist yet.</p>
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
                  <button
                    onClick={function() { removeAsset(symbol) }}
                    className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
                    style={{ color: '#6b7a96' }}
                    title="Remove from watchlist"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={function() { setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)' }}
        >
          <Plus size={14} />
          Add Asset
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={function() { setShowModal(false) }}>
          <div
            className="w-full max-w-md rounded-xl border overflow-hidden"
            style={{ background: '#161a22', borderColor: '#1e2330' }}
            onClick={function(e) { e.stopPropagation() }}
          >
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #1e2330' }}>
              <h2 className="text-sm font-semibold" style={{ color: '#eceef5' }}>Add Asset to Watchlist</h2>
              <button onClick={function() { setShowModal(false) }} style={{ color: '#6b7a96' }}>
                <X size={16} />
              </button>
            </div>

            <div className="mx-5 mt-4 px-4 py-3 rounded-lg text-xs" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#9aa8be' }}>
              <span style={{ color: '#3b82f6', fontWeight: 600 }}>Crypto assets only. </span>
              Macro data (Gold, Oil, Forex, Indices, ETFs) is available on the live ticker at the top of every page.
            </div>

            <div className="px-5 py-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: '#111318', border: '1px solid #1e2330' }}>
                <Search size={14} style={{ color: '#6b7a96' }} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search crypto symbol or name..."
                  value={search}
                  onChange={function(e) { setSearch(e.target.value) }}
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: '#eceef5' }}
                />
              </div>
            </div>

            <div className="px-5 pb-4 space-y-1 overflow-y-auto" style={{ maxHeight: '300px' }}>
              {availableSymbols.length === 0 ? (
                <p className="text-sm py-4 text-center" style={{ color: '#6b7a96' }}>
                  {search ? 'No matching assets found.' : 'All available assets are already in your watchlist.'}
                </p>
              ) : (
                availableSymbols.map(function(symbol) {
                  return (
                    <button
                      key={symbol}
                      onClick={function() { addAsset(symbol) }}
                      disabled={adding}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors hover:bg-white/5"
                      style={{ border: '1px solid transparent' }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
                          {symbol.slice(0, 2)}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold" style={{ color: '#eceef5' }}>{symbol}</p>
                          <p className="text-xs" style={{ color: '#6b7a96' }}>{SYMBOL_NAMES[symbol] || symbol}</p>
                        </div>
                      </div>
                      <Plus size={14} style={{ color: '#3b82f6' }} />
                    </button>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
