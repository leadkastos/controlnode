import React from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import RightSidebar from './RightSidebar'

export default function AppLayout({ children, hideRightSidebar = false }) {
  return (
    <div className="min-h-screen flex" style={{ background: '#0a0b0f' }}>
      <Sidebar />
      <div
        className="flex-1 flex flex-col min-h-screen"
        style={{ marginLeft: '224px', marginRight: hideRightSidebar ? '0' : '256px' }}
      >
        <TopBar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
      {!hideRightSidebar && <RightSidebar />}
    </div>
  )
}
