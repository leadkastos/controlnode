import React, { useState, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { mockNotifications } from '../data/mockData'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const unreadCount = mockNotifications.filter(n => n.unread).length

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg transition-colors"
        style={{ color: '#8892a4', background: open ? '#161a22' : 'transparent' }}
      >
        <Bell size={18} strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span
            className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-white"
            style={{ fontSize: '10px', background: '#ef4444', fontWeight: 600 }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-80 rounded-xl shadow-2xl z-50 overflow-hidden"
          style={{ background: '#161a22', border: '1px solid #1e2330' }}
        >
          <div className="px-4 py-3" style={{ borderBottom: '1px solid #1e2330' }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: '#e8eaf0' }}>Notifications</span>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}
              >
                {unreadCount} new
              </span>
            </div>
          </div>

          <div className="divide-y" style={{ borderColor: '#1e2330' }}>
            {mockNotifications.map((n) => (
              <button
                key={n.id}
                className="w-full px-4 py-3 text-left transition-colors hover:bg-white/5 flex gap-3"
              >
                {n.unread && (
                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#3b82f6' }} />
                )}
                {!n.unread && <div className="mt-1.5 w-1.5 h-1.5 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: '#e8eaf0' }}>{n.title}</p>
                  <p className="text-xs mt-0.5 leading-snug" style={{ color: '#8892a4' }}>{n.snippet}</p>
                  <p className="text-xs mt-1" style={{ color: '#4a5568' }}>{n.time}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="px-4 py-2.5" style={{ borderTop: '1px solid #1e2330' }}>
            <button className="text-xs w-full text-center" style={{ color: '#3b82f6' }}>
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
