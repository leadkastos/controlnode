import React from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import RightSidebar from './RightSidebar'
import Footer from './Footer'

export default function AppLayout({ children, hideRightSidebar = false }) {
  return (
    <div className="min-h-screen flex" style={{ background: '#0a0b0f' }}>
      <Sidebar />
      <div className={`flex-1 flex flex-col min-h-screen lg:ml-56 ${!hideRightSidebar ? 'lg:mr-64' : ''}`}>
        <TopBar />
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
        <Footer />
      </div>
      {!hideRightSidebar && <RightSidebar />}
    </div>
  )
}
