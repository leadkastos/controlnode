import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { TrendingUp, TrendingDown } from 'lucide-react'

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
  return n.toFixed(2)
}

function StatRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid #1e2330' }}>
      <span className="text-sm" style={{ color: '#9aa8be' }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: color || '#eceef5' }}>{value}</span>
    </div>
  )
}

export default function SmartMoneyFlow() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [txList, setTxList] = useState([])

  useEffect(function () {
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
        let totalInflow = 0
        let totalOutflow = 0
        const payments = []

        txs.forEach(function (t) {
          const tx = t.tx || t.transaction || {}
          if (tx.TransactionType === 'Payment' && typeof tx.Amount === 'string') {
            const amt = parseInt(tx.Amount) / 1e6
            if (!isNaN(amt)) {
              if (amt > largestAmount) largestAmount = amt
              if (tx.Destination === 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh') {
                totalInflow += amt
              } else {
                totalOutflow += amt
              }
              payments.push({
                amount: amt,
                direction: tx.Destination === 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh' ? 'inflow' : 'outflow',
                from: KNOWN_EXCHANGES[tx.Account] || tx.Account?.slice(0, 12) + '...',
                to: KNOWN_EXCHANGES[tx.Destination] || tx.Destination?.slice(0, 12) + '...',
              })
            }
          }
        })

        const netFlow = totalOutflow - totalInflow
        const flowLabel = netFlow > 0 ? 'Net Outflow' : netFlow < 0 ? 'Net Inflow' : 'Neutral'
        const flowValue = Math.abs(netFlow)
        const flowBullish = netFlow > 0

        setData({ flowLabel, flowValue, flowBullish, largestAmount, totalInflow, totalOutflow })
        setTxList(payments)
      } catch (e) {
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
    <div className="flex h-screen overflow-hidden" style={{ background: '#0d0f14' }}>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden lg:ml-56">
        <TopBar title="Smart Money Flow" />
        <main className="flex-1 overflow-y-auto p-6">

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: '#10b98120', color: '#10b981' }}>LIVE</span>
              <h1 className="text-xl font-bold" style={{ color: '#eceef5' }}>Smart Money Flow</h1>
            </div>
            <p className="text-sm" style={{ color: '#6b7a96' }}>
              Real-time XRP on-chain flow tracking. Exchange inflows, outflows, whale transfers, and escrow activity sourced from the XRPL public ledger.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="rounded-xl p-5 border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
              <h2 className="text-sm font-semibold mb-4" style={{ color: '#eceef5' }}>Exchange Flow Summary</h2>
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3,4].map(i => <div key={i} className="h-5 rounded animate-pulse" style={{ background: '#1e2330' }} />)}
                </div>
              ) : !data ? (
                <p className="text-sm" style={{ color: '#6b7a96' }}>Unable to load XRPL data.</p>
              ) : (
                <div>
                  <StatRow
                    label="Net Exchange Flow"
                    value={`${data.flowLabel}: ${fmt(data.flowValue)} XRP`}
                    color={data.flowBullish ? bullishColor : data.flowLabel === 'Neutral' ? neutralColor : bearishColor}
                  />
                  <StatRow label="Total Inflow (window)" value={`${fmt(data.totalInflow)} XRP`} color={bearishColor} />
                  <StatRow label="Total Outflow (window)" value={`${fmt(data.totalOutflow)} XRP`} color={bullishColor} />
                  <StatRow label="Largest Single Transfer" value={data.largestAmount > 0 ? `${fmt(data.largestAmount)} XRP` : '—'} />
                </div>
              )}
            </div>

            <div className="rounded-xl p-5 border" style={{ background: '#161a22', borderColor: '#1e2330' }}>
              <h2 className="text-sm font-semibold mb-4" style={{ color: '#eceef5' }}>Escrow & Unlock Schedule</h2>
              <StatRow label="Total Escrow Locked" value="~38B XRP" color={neutralColor} />
              <StatRow label="Next Monthly Unlock" value="1B XRP" color={neutralColor} />
              <StatRow label="Unlock Frequency" value="Monthly (1st)" />
              <StatRow label="Remaining Escrow Period" value="~38 months" />
              <p className="text-xs mt-4" style={{ color: '#6b7a96' }}>
                Escrow data sourced from Ripple public disclosures. For informational purposes only.
              </p>
            </div>

            <div className="rounded-xl p-5 border lg:col-span-2" style={{ background: '#161a22', borderColor: '#1e2330' }}>
              <h2 className="text-sm font-semibold mb-4" style={{ color: '#eceef5' }}>Recent Transfers — Binance Hot Wallet</h2>
              {loading ? (
                <div className="space-y-3">
                  {[1,2,3,4,5].map(i => <div key={i} className="h-5 rounded animate-pulse" style={{ background: '#1e2330' }} />)}
                </div>
              ) : txList.length === 0 ? (
                <p className="text-sm" style={{ color: '#6b7a96' }}>No recent XRP payment transactions found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ borderBottom: '1px solid #1e2330' }}>
                        <th className="text-left pb-2 font-medium" style={{ color: '#6b7a96' }}>Direction</th>
                        <th className="text-left pb-2 font-medium" style={{ color: '#6b7a96' }}>Amount</th>
                        <th className="text-left pb-2 font-medium" style={{ color: '#6b7a96' }}>From</th>
                        <th className="text-left pb-2 font-medium" style={{ color: '#6b7a96' }}>To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {txList.map(function (tx, i) {
                        return (
                          <tr key={i} style={{ borderBottom: '1px solid #1e2330' }}>
                            <td className="py-2">
                              <span className="flex items-center gap-1" style={{ color: tx.direction === 'inflow' ? bearishColor : bullishColor }}>
                                {tx.direction === 'inflow' ? <TrendingDown size={11} /> : <TrendingUp size={11} />}
                                {tx.direction === 'inflow' ? 'Inflow' : 'Outflow'}
                              </span>
                            </td>
                            <td className="py-2 font-medium" style={{ color: '#eceef5' }}>{fmt(tx.amount)} XRP</td>
                            <td className="py-2" style={{ color: '#9aa8be' }}>{tx.from}</td>
                            <td className="py-2" style={{ color: '#9aa8be' }}>{tx.to}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="text-xs mt-4" style={{ color: '#6b7a96' }}>
                Source: XRPL public ledger via xrplcluster.com · Live data · For informational purposes only.
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
