import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import Dashboard from './pages/Dashboard'
import MorningBrief from './pages/MorningBrief'
import DailyWrap from './pages/DailyWrap'
import MarketOverview from './pages/MarketOverview'
import XRPIntelligence from './pages/XRPIntelligence'
import DominoTheory from './pages/DominoTheory'
import GeopoliticalWatch from './pages/GeopoliticalWatch'
import OilVsYen from './pages/OilVsYen'
import MediaNarratives from './pages/MediaNarratives'
import ETFFlows from './pages/ETFFlows'
import Watchlist from './pages/Watchlist'
import YouTubeIntel from './pages/YouTubeIntel'
import SmartMoneyFlow from './pages/SmartMoneyFlow'
import MarketChatter from './pages/MarketChatter'
import { Account, Billing, Settings } from './pages/AccountPages'
import {
  Admin,
  AdminMorningBrief,
  AdminDailyWrap,
  AdminDominoTheory,
  AdminHeadlines,
  AdminWatchlist,
  AdminChatter,
  AdminETFFlows,
  AdminUpdates,
} from './pages/AdminPages'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/morning-brief" element={<ProtectedRoute><MorningBrief /></ProtectedRoute>} />
        <Route path="/daily-wrap" element={<ProtectedRoute><DailyWrap /></ProtectedRoute>} />
        <Route path="/market-overview" element={<ProtectedRoute><MarketOverview /></ProtectedRoute>} />
        <Route path="/xrp-intelligence" element={<ProtectedRoute><XRPIntelligence /></ProtectedRoute>} />
        <Route path="/domino-theory" element={<ProtectedRoute><DominoTheory /></ProtectedRoute>} />
        <Route path="/geopolitical-watch" element={<ProtectedRoute><GeopoliticalWatch /></ProtectedRoute>} />
        <Route path="/oil-vs-yen" element={<ProtectedRoute><OilVsYen /></ProtectedRoute>} />
        <Route path="/media-narratives" element={<ProtectedRoute><MediaNarratives /></ProtectedRoute>} />
        <Route path="/etf-flows" element={<ProtectedRoute><ETFFlows /></ProtectedRoute>} />
        <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
        <Route path="/youtube-intel" element={<ProtectedRoute><YouTubeIntel /></ProtectedRoute>} />
        <Route path="/smart-money-flow" element={<ProtectedRoute><SmartMoneyFlow /></ProtectedRoute>} />
        <Route path="/market-chatter" element={<ProtectedRoute><MarketChatter /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
        <Route path="/admin/morning-brief" element={<ProtectedRoute adminOnly><AdminMorningBrief /></ProtectedRoute>} />
        <Route path="/admin/daily-wrap" element={<ProtectedRoute adminOnly><AdminDailyWrap /></ProtectedRoute>} />
        <Route path="/admin/domino-theory" element={<ProtectedRoute adminOnly><AdminDominoTheory /></ProtectedRoute>} />
        <Route path="/admin/headlines" element={<ProtectedRoute adminOnly><AdminHeadlines /></ProtectedRoute>} />
        <Route path="/admin/watchlist" element={<ProtectedRoute adminOnly><AdminWatchlist /></ProtectedRoute>} />
        <Route path="/admin/chatter" element={<ProtectedRoute adminOnly><AdminChatter /></ProtectedRoute>} />
        <Route path="/admin/etf-flows" element={<ProtectedRoute adminOnly><AdminETFFlows /></ProtectedRoute>} />
        <Route path="/admin/updates" element={<ProtectedRoute adminOnly><AdminUpdates /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
