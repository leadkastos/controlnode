import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import MorningBrief from './pages/MorningBrief'
import MarketOverview from './pages/MarketOverview'
import XRPIntelligence from './pages/XRPIntelligence'
import DominoTheory from './pages/DominoTheory'
import GeopoliticalWatch from './pages/GeopoliticalWatch'
import OilVsYen from './pages/OilVsYen'
import MediaNarratives from './pages/MediaNarratives'
import ETFFlows from './pages/ETFFlows'
import Watchlist from './pages/Watchlist'
import YouTubeIntel from './pages/YouTubeIntel'
import MarketChatter from './pages/MarketChatter'
import { Account, Billing, Settings } from './pages/AccountPages'
import { Admin, AdminMorningBrief, AdminUpdates } from './pages/AdminPages'
import { AdminDominoTheory } from './pages/AdminPages'
import AdminChatter from './pages/AdminChatter'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/morning-brief" element={<MorningBrief />} />
        <Route path="/market-overview" element={<MarketOverview />} />
        <Route path="/xrp-intelligence" element={<XRPIntelligence />} />
        <Route path="/domino-theory" element={<DominoTheory />} />
        <Route path="/geopolitical-watch" element={<GeopoliticalWatch />} />
        <Route path="/oil-vs-yen" element={<OilVsYen />} /> {/* Display name: Energy Intel */}
        <Route path="/media-narratives" element={<MediaNarratives />} />
        <Route path="/etf-flows" element={<ETFFlows />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/youtube-intel" element={<YouTubeIntel />} />
        <Route path="/market-chatter" element={<MarketChatter />} />
        <Route path="/account" element={<Account />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/morning-brief" element={<AdminMorningBrief />} />
        <Route path="/admin/updates" element={<AdminUpdates />} />
        <Route path="/admin/domino-theory" element={<AdminDominoTheory />} />
        <Route path="/admin/chatter" element={<AdminChatter />} />
      </Routes>
    </BrowserRouter>
  )
}
