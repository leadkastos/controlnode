import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const KNOWN_EXCHANGES = {
  'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh': 'Binance',
  'rEy8TFcrAHeK231YJqhFXFgMGMTn8gfhB3': 'Coinbase',
  'rLNaPoKeeBjZe2qs6x52yVPZpZ8td4dc6w': 'Binance',
  'rPVMhWBsfF9iMXYj3aAzJVkPDTFNSyWdKy': 'Kraken',
  'r3kmLJN5D28dHuH8vZNUZpMC4JbiEzgxKB': 'Ripple Escrow',
  'rN7n3473SaZBCG4dFL83w7PB5myjMDuWCR': 'Bitstamp',
  'rrpNnNLKrartuEqfJGpqyDwPj1BBN1ue7i': 'Bitstamp',
}

function fmt(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K'
  return n.toString()
}

export default function SmartMoneyCard() {
  const nav = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(function() {
    async function fetchData() {
      try {
        const res = await fetch('https://xrplcluster.com/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: 'account_tx',
            params: [{
              account: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
              limit: 20,
              ledger_index_min: -1,
              ledger_index_max: -1,
            }]
          })
        })
        const json = await res.json()
        const txs = json?.result?.transactions || []

        let largestAmount = 0
        let largestTx = null
        let totalInflow = 0
        let totalOutflow = 0

        txs.forEach(function(t) {
          const tx = t.tx || t.transaction || {}
          if (tx.TransactionType === 'Payment' && tx.Amount) {
            const amt = parseInt(tx.Amount) / 1e6
            if (amt > largestAmount) {
              largestAmount = amt
              largestTx = tx
            }
            if (tx.Destination === 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh') {
              totalInflow += amt
            } else {
              totalOutflow += amt
            }
          }
        })

        const netFlow = totalOutflow - totalInflow
        const flowLabel = netFlow > 0 ? 'Net Outflow' : netFlow < 0 ? 'Net Inflow' : 'Neutral'
        const flowValue = Math.abs(netFlow)
        const flowBullish = netFlow > 0

        setData({
          flowLabel,
          flowValue,
          flowBullish,
          largestAmount,
          largestTx,
          totalInflow,
          totalOutflow,
        })
      } catch(e) {
        setData(null)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const bullishColor = '#10b981'
  const bearishColor = '#ef4444'
  const neutralColor = '#f59e0b'

  return (
    <div
      className="rounded-xl p-5 border flex flex-col gap-4 cursor-pointer group transition-all duration-200"
      style={{ background: '#161a22', borderColor: '#1e2330' }}
      onClick={function() { nav('/xrp-intelligence') }}
      onMouseEnter={function(e) { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)' }}
      onMouseLeave={function(e) { e.currentTarget.style.borderColor = '#1e2330' }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: '#eceef5' }}>Smart Money Flow</h3>
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#10b981' }} />
      </div>

      {loading ? (
        <div className="space-y-2 flex-1">
          {[1,2,3,4].map(function(i) {
            return <div key={i} className="h-4 rounded animate-pulse" style={{ background: '#1e2330' }} />
          })}
        </div>
      ) : !data ? (
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs" style={{ color: '#9aa8be' }}>Net Exchange Flow</span>
            <span className="text-xs font-medium" style={{ color: '#f59e0b' }}>Monitoring</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs" style={{ color: '#9aa8be' }}>Whale Activity</span>
            <span className="text-xs font-medium" style={{ color: '#8892a4' }}>Loading XRPL</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs" style={{ color: '#9aa8be' }}>Escrow Watch</span>
            <span className="text-xs font-medium" style={{ color: '#8892a4' }}>~38B XRP locked</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs" style={{ color: '#9aa8be' }}>Next Unlock</span>
            <span className="text-xs font-medium" style={{ color: '#8892a4' }}>1B XRP monthly</span>
          </div>
        </div>
      ) : (
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs" style={{ color: '#9aa8be' }}>Net Exchange Flow</span>
            <span className="flex items-center gap-1 text-xs font-medium" style={{ color: data.flowBullish ? bullishColor : bearishColor }}>
              {data.flowBullish ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {data.flowLabel}: {fmt(data.flowValue)} XRP
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs" style={{ color: '#9aa8be' }}>Largest Transfer</span>
            <span className="text-xs font-medium" style={{ color: '#eceef5' }}>
              {data.largestAmount > 0 ? fmt(data.largestAmount) + ' XRP' : '—'}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs" style={{ color: '#9aa8be' }}>Escrow Watch</span>
            <span className="text-xs font-medium" style={{ color: '#8892a4' }}>~38B XRP locked</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs" style={{ color: '#9aa8be' }}>Next Unlock</span>
            <span className="text-xs font-medium" style={{ color: neutralColor }}>1B XRP monthly</span>
          </div>
        </div>
      )}

      <button className="flex items-center gap-1.5 text-xs font-medium mt-auto transition-colors" style={{ color: '#3b82f6' }}>
        View Details
        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  )
}
