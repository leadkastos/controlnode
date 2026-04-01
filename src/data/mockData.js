export const mockNotifications = [
  {
    id: 1,
    title: 'New Morning Brief Available',
    snippet: 'XRP technical structure and macro context reviewed. BRICS developments noted.',
    time: '8 min ago',
    unread: true,
  },
  {
    id: 2,
    title: 'XRP ETF Flow Update Posted',
    snippet: 'XRP ETF applications: SEC review timeline updated.',
    time: '42 min ago',
    unread: true,
  },
  {
    id: 3,
    title: 'Geopolitical Alert Updated',
    snippet: 'USD/JPY breaks 152 — BOJ intervention context updated.',
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

export const mockNewsFeed = [
  {
    id: 1,
    headline: 'SEC Drops Final Appeal in XRP Lawsuit — Ripple Fully Cleared',
    source: 'Reuters',
    category: 'Regulatory',
    time: '2 hrs ago',
    url: 'https://reuters.com',
  },
  {
    id: 2,
    headline: 'Senate Banking Committee Schedules Crypto Framework Hearing',
    source: 'Congress.gov',
    category: 'Government',
    time: '4 hrs ago',
    url: 'https://congress.gov',
  },
  {
    id: 3,
    headline: 'BRICS Summit: Digital Settlement Framework Language Introduced',
    source: 'Financial Times',
    category: 'Geopolitical',
    time: '6 hrs ago',
    url: 'https://ft.com',
  },
  {
    id: 4,
    headline: 'BlackRock Files for XRP ETF — Third Institution This Month',
    source: 'Bloomberg',
    category: 'ETF',
    time: '1 day ago',
    url: 'https://bloomberg.com',
  },
  {
    id: 5,
    headline: 'BOJ Holds Rates — Yen Carry Trade Dynamics Remain in Focus',
    source: 'WSJ',
    category: 'Macro',
    time: '1 day ago',
    url: 'https://wsj.com',
  },
]

export const morningBriefSnippet = {
  date: 'Monday, March 23, 2026',
  headline: 'XRP Holds Key Level as Macro Turns — Domino Theory Activates',
  snippet: 'Three developments converged overnight. XRP held the $2.18 area on elevated volume, the BOJ signaled a policy hold, and a major BRICS summit opened with digital asset settlement language for the first time.',
  catalysts: [
    'XRP price action at $2.18 area — technically significant reference zone',
    'BOJ holds rates; USD/JPY moves to 153.4 — yen dynamics in focus',
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
      { label: 'Overhead Reference', value: '$2.55' },
    ],
  },
  {
    id: 'technical',
    title: 'Daily Technical Analysis',
    route: '/xrp-intelligence',
    data: [
      { label: 'Structure', value: 'Uptrend Observed' },
      { label: 'RSI (14)', value: '61.4 — Mid-range' },
      { label: 'Reference Level', value: '$2.18 Area' },
    ],
  },
  {
    id: 'news',
    title: 'XRP & Ripple News',
    route: '/xrp-intelligence',
    data: [
      { label: 'Top Story', value: 'SEC drops retail lawsuit' },
      { label: 'Ripple IPO', value: 'Early-stage discussions noted' },
      { label: 'ODL Volume', value: '+18% WoW' },
    ],
  },
  {
    id: 'domino',
    title: 'Domino Theory',
    route: '/domino-theory',
    data: [
      { label: 'Stage', value: 'Stage 3 — Activating' },
      { label: 'Context', value: 'BOJ policy divergence' },
      { label: 'Next Watch', value: 'Yen carry dynamics' },
    ],
  },
  {
    id: 'geopolitical',
    title: 'Geopolitical Watch',
    route: '/geopolitical-watch',
    data: [
      { label: 'Focus', value: 'USD/JPY at 153.4' },
      { label: 'BRICS Summit', value: 'Digital asset framework' },
      { label: 'Context Level', value: 'Elevated', warning: true },
    ],
  },
  {
    id: 'etf',
    title: 'XRP ETF Flow Tracker',
    route: '/etf-flows',
    data: [
      { label: 'Filings Active', value: '3 institutions', positive: true },
      { label: 'SEC Status', value: 'Under review' },
      { label: 'Est. AUM (approval)', value: '$2–5B projected' },
    ],
  },
  {
    id: 'media',
    title: 'Media Intelligence',
    route: '/media-narratives',
    data: [
      { label: 'Dominant Narrative', value: 'Crypto regulation clarity' },
      { label: 'Sentiment Reading', value: 'Cautiously Bullish' },
      { label: 'Contrarian Note', value: 'Sentiment elevated' },
    ],
  },
  {
    id: 'oilyen',
    title: 'Oil vs Yen',
    route: '/oil-vs-yen',
    data: [
      { label: 'Brent Crude', value: '$87.40 (+1.2%)' },
      { label: 'USD/JPY', value: '153.4' },
      { label: 'Oil in JPY', value: '¥13,407/barrel' },
    ],
  },
  {
    id: 'youtube',
    title: 'YouTube Intel',
    route: '/account',
    data: [
      { label: 'Following', value: '0 channels' },
      { label: 'Latest Video', value: 'Add channels in profile' },
      { label: 'Next Check', value: '6:00 AM' },
    ],
  },
]
