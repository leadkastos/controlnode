export const mockNotifications = [
  {
    id: 1,
    title: 'New Morning Brief Available',
    snippet: 'XRP faces key resistance at $2.40. Macro headwinds persist.',
    time: '8 min ago',
    unread: true,
  },
  {
    id: 2,
    title: 'ETF Flow Update Posted',
    snippet: 'BlackRock BTC ETF sees $340M inflow — largest in 3 weeks.',
    time: '42 min ago',
    unread: true,
  },
  {
    id: 3,
    title: 'Geopolitical Alert Updated',
    snippet: 'USD/JPY breaks 152 — BOJ intervention risk rising.',
    time: '2 hrs ago',
    unread: false,
  },
]

export const mockWatchlist = [
  { symbol: 'XRP', price: '$2.31', change: '+3.4%', up: true },
  { symbol: 'BTC', price: '$67,420', change: '-1.2%', up: false },
  { symbol: 'SOL', price: '$148.60', change: '+5.1%', up: true },
  { symbol: 'ETH', price: '$3,480', change: '+0.8%', up: true },
]

export const mockSignals = [
  { label: 'XRP Momentum', value: 'Bullish', color: 'green' },
  { label: 'BTC Dominance', value: 'Neutral', color: 'yellow' },
  { label: 'Risk Appetite', value: 'Cautious', color: 'red' },
]

export const mockTrendingNarratives = [
  'SEC drops XRP retail lawsuit — Ripple IPO speculation resurfaces',
  'BRICS nations accelerate de-dollarization via digital assets',
  'BlackRock expands tokenization play beyond BTC ETF',
]

export const morningBriefSnippet = {
  date: 'Monday, March 23, 2026',
  headline: 'XRP Holds Key Level as Macro Turns — Domino Theory Activates',
  snippet: 'Three catalysts converged overnight. XRP defended $2.18 support on heavy volume, the BOJ signaled a policy hold, and a major BRICS summit opened with digital asset language for the first time.',
  catalysts: [
    'XRP held $2.18 support — bulls defending critical floor',
    'BOJ holds rates; USD/JPY spikes to 153.4 — yen pressure building',
    'BRICS summit opens with "digital settlement framework" language',
  ],
}

export const dashboardCards = [
  {
    id: 'xrp-price',
    title: 'XRP Price Snapshot',
    route: '/xrp-intelligence',
    data: [
      { label: 'Current Price', value: '$2.31', highlight: true },
      { label: '24h Change', value: '+3.4%', positive: true },
      { label: 'Key Resistance', value: '$2.55' },
    ],
  },
  {
    id: 'technical',
    title: 'Daily Technical Analysis',
    route: '/xrp-intelligence',
    data: [
      { label: 'Trend', value: 'Bullish Structure Intact' },
      { label: 'RSI (14)', value: '61.4 — Not Overbought' },
      { label: 'Key Level', value: '$2.18 Support Holding' },
    ],
  },
  {
    id: 'news',
    title: 'XRP & Ripple News',
    route: '/xrp-intelligence',
    data: [
      { label: 'Top Story', value: 'SEC drops retail lawsuit' },
      { label: 'Ripple IPO', value: 'Speculation rising post-ruling' },
      { label: 'ODL Volume', value: '+18% WoW' },
    ],
  },
  {
    id: 'domino',
    title: 'Domino Theory',
    route: '/domino-theory',
    data: [
      { label: 'Stage', value: 'Stage 3 — Acceleration' },
      { label: 'Trigger', value: 'BOJ policy divergence' },
      { label: 'Next Domino', value: 'Yen carry unwind' },
    ],
  },
  {
    id: 'geopolitical',
    title: 'Geopolitical Watch',
    route: '/geopolitical-watch',
    data: [
      { label: 'Flash Point', value: 'USD/JPY at 153.4' },
      { label: 'BRICS Summit', value: 'Digital asset framework' },
      { label: 'Risk Level', value: 'Elevated', warning: true },
    ],
  },
  {
    id: 'etf',
    title: 'ETF Flow Tracker',
    route: '/etf-flows',
    data: [
      { label: 'BTC ETF Net', value: '+$340M (24h)', positive: true },
      { label: 'ETH ETF Net', value: '+$82M (24h)', positive: true },
      { label: 'Trend', value: 'Institutional accumulation' },
    ],
  },
  {
    id: 'media',
    title: 'Media Intelligence',
    route: '/media-narratives',
    data: [
      { label: 'Dominant Narrative', value: 'Crypto regulation clarity' },
      { label: 'Sentiment', value: 'Cautiously Bullish' },
      { label: 'Contrarian Signal', value: 'Retail FOMO rising' },
    ],
  },
  {
    id: 'oilyen',
    title: 'Oil vs Yen',
    route: '/oil-vs-yen',
    data: [
      { label: 'Brent Crude', value: '$87.40 (+1.2%)' },
      { label: 'USD/JPY', value: '153.4 (Risk ON)' },
      { label: 'Correlation', value: 'Oil up = XRP bullish' },
    ],
  },
]
