import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import RightSidebar from './RightSidebar'
import Footer from './Footer'

// AppLayout
// Desktop (lg breakpoint, 1024px+): keeps original 3-column layout exactly as before —
//   left sidebar 224px, right sidebar 256px, main content centered with fixed margins.
// Mobile/Tablet (under 1024px): both sidebars are hidden by default (each handles its own
//   slide-out drawer behavior internally). Main content fills full width with no reserved
//   margins so nothing looks empty/cropped.
export default function AppLayout({ children, hideRightSidebar = false }) {
  // Track whether we're on desktop (lg+) — apply margins only when sidebars are actually visible
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    function checkDesktop() {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  // Compute margins/width based on screen size and whether RightSidebar is shown
  var marginLeft = '0'
  var marginRight = '0'
  var width = '100%'

  if (isDesktop) {
    marginLeft = '224px'
    marginRight = hideRightSidebar ? '0' : '256px'
    width = hideRightSidebar
      ? 'calc(100% - 224px)'
      : 'calc(100% - 224px - 256px)'
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0b0f' }}>
      <Sidebar />

      {/* Main content area — margins only applied on desktop (1024px+) */}
      <div
        className="flex flex-col min-h-screen"
        style={{
          marginLeft: marginLeft,
          marginRight: marginRight,
          width: width,
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
