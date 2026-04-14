import React, { createContext, useContext, useState, useEffect } from 'react'

const PriceContext = createContext({})

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

export { COINGECKO_IDS }

export function PriceProvider({ children }) {
  const [prices, setPrices] = useState({})

  useEffect(function() {
    async function fetchPrices() {
      try {
        var ids = Object.values(COINGECKO_IDS).join(',')
        var res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=' + ids + '&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true'
        )
        var data = await res.json()
        setPrices(data)
      } catch(e) {
        console.error('PriceContext fetch error:', e)
      }
    }
    fetchPrices()
    var interval = setInterval(fetchPrices, 90 * 1000)
    return function() { clearInterval(interval) }
  }, [])

  return (
    <PriceContext.Provider value={prices}>
      {children}
    </PriceContext.Provider>
  )
}

export function usePrices() {
  return useContext(PriceContext)
}
