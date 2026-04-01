import React from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import RightSidebar from './RightSidebar'

function Disclaimer() {
  return (
    <div
      className="px-4 lg:px-6 py-4 text-center"
      style={{ borderTop: '1px solid #1e2330' }}
    >
      <p className="text-xs leading-relaxed" style={{ color: '#4a5568' }}>
        ControlNode provides market intelligence and analysis for <span style={{ color: '#6b7280' }}>informational purposes only</span>. Nothing on this platform constitutes financial advice, investment advice, or a recommendation to buy or sell any asset. Always consult a qualified financial advisor before making any investment decisions. Past market observations are not indicative of future results.
      </p>
    </div>
  )
}

export default function AppLayout({ children, hideRightSidebar = false }) {
  return (
    <div className="min-h-screen flex" style={{ background: '#0a0b0f' }}>
      <Sidebar />
      <div className={`flex-1 flex flex-col min-h-screen lg:ml-56 ${!hideRightSidebar ? 'lg:mr-64' : ''}`}>
        <TopBar />
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
        <Disclaimer />
      </div>
      {!hideRightSidebar && <RightSidebar />}
    </div>
  )
}
