import React, { useState, useRef, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const { user } = useAuth()
  const ref = useRef(null)

  async function load() {
    if (!user) return
    var res = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50) // Increased limit to show more notifications
    if (res.data) setNotifications(res.data)
  }

  useEffect(function() {
    load()
  }, [user])

  useEffect(function() {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return function() { document.removeEventListener('mousedown', handleClick) }
  }, [])

  async function markRead(id) {
    await supabase.from('notifications').update({ read: true }).eq('id', id)
    setNotifications(function(prev) {
      return prev.map(function(n) { return n.id === id ? Object.assign({}, n, { read: true }) : n })
    })
  }

  async function markAllRead() {
    if (!user) return
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id)
    setNotifications(function(prev) { return prev.map(function(n) { return Object.assign({}, n, { read: true }) }) })
  }

  async function clearAllNotifications() {
    if (!user) return
    await supabase.from('notifications').delete().eq('user_id', user.id)
    setNotifications([])
  }

  var unreadCount = notifications.filter(function(n) { return !n.read }).length

  function timeAgo(ts) {
    var diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
    if (diff < 3600) return Math.floor(diff / 60) + ' min ago'
    if (diff < 86400) return Math.floor(diff / 3600) + ' hrs ago'
    return Math.floor(diff / 86400) + ' days ago'
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={function() { setOpen(!open); if (!open) load() }}
        className="relative p-2 rounded-lg transition-colors"
        style={{ color: '#9aa8be', background: open ? '#161a22' : 'transparent' }}
      >
        <Bell size={18} strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full flex items-center justify-center text-white" style={{ fontSize: '10px', background: '#ef4444', fontWeight: 600 }}>
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl shadow-2xl z-50 overflow-hidden" style={{ background: '#161a22', border: '1px solid #1e2330' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid #1e2330' }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: '#eceef5' }}>Notifications</span>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>{unreadCount} new</span>
                )}
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs hover:underline" style={{ color: '#6b7a96' }}>Mark all read</button>
                )}
              </div>
            </div>
          </div>
          {/* SCROLLABLE NOTIFICATIONS CONTAINER */}
          <div className="max-h-96 overflow-y-auto divide-y" style={{ borderColor: '#1e2330' }}>
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-sm" style={{ color: '#6b7a96' }}>No notifications yet.</p>
              </div>
            ) : (
              notifications.map(function(n) {
                return (
                  <button
                    key={n.id}
                    onClick={function() { markRead(n.id) }}
                    className="w-full px-4 py-3 text-left transition-colors hover:bg-white/5 flex gap-3"
                    style={{ opacity: n.read ? 0.5 : 1 }}
                  >
                    {!n.read && <div className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#3b82f6' }} />}
                    {n.read && <div className="mt-1.5 w-1.5 h-1.5 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: '#eceef5' }}>{n.title}</p>
                      <p className="text-xs mt-0.5 leading-snug" style={{ color: '#9aa8be' }}>{n.message}</p>
                      <p className="text-xs mt-1" style={{ color: '#6b7a96' }}>{timeAgo(n.created_at)}</p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
          {/* FOOTER WITH ACTIONS */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 flex justify-between items-center" style={{ borderTop: '1px solid #1e2330' }}>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs hover:underline" style={{ color: '#3b82f6' }}>
                  Mark all as read
                </button>
              )}
              <button onClick={clearAllNotifications} className="text-xs hover:underline ml-auto" style={{ color: '#ef4444' }}>
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
