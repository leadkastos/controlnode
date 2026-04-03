import React from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import RightSidebar from './RightSidebar'
import Footer from './Footer'

export default function AppLayout({ children, hideRightSidebar = false }) {
  return (
    <div className="min-h-screen flex" style={{ background: '#0a0b0f' }}>
      <Sidebar />

      {/* Main content area — fixed margins so it never overlaps sidebars */}
      <div
        className="flex flex-col min-h-screen"
        style={{
          marginLeft: '224px',
          marginRight: hideRightSidebar ? '0' : '256px',
          width: hideRightSidebar
            ? 'calc(100% - 224px)'
            : 'calc(100% - 224px - 256px)',
        }}
      >
        {/* TopBar is sticky within this column only */}
        <div className="sticky top-0 z-20">
          <TopBar />
        </div>

        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </div>

      {!hideRightSidebar && <RightSidebar />}
    </div>
  )
}
