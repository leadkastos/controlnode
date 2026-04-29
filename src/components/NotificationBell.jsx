import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell, X, FileText, Calendar, MessageCircle,
  AlertTriangle, LineChart, Megaphone
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

// Icon + color mapping per notification type — set by DB triggers in fan_out_notification()
//   morning_brief        → posted via trg_notify_morning_brief
//   daily_wrap           → posted via trg_notify_daily_wrap
//   market_news_breaking → posted via trg_notify_market_news (type='breaking')
//   market_news_confirmed→ posted via trg_notify_market_news (type='confirmed')
//   etf_snapshot         → posted via trg_notify_etf_snapshot
//   admin_broadcast      → posted manually from Admin → Send Notification
const TYPE_META = {
  morning_brief:         { icon: FileText,       color: '#3b82f6', label: 'Morning Brief' },
  daily_wrap:            { icon: Calendar,       color: '#8b5cf6', label: 'Daily Wrap' },
  market_news_breaking:  { icon: AlertTriangle,  color: '#ef4444', label: 'Breaking News' },
  market_news_confirmed: { icon: MessageCircle,  color: '#10b981', label: 'Market News' },
  etf_snapshot:          { icon: LineChart,      color: '#06b6d4', label: 'ETF Update' },
  admin_broadcast:       { icon: Megaphone,      color: '#f59e0b', label: 'Announcement' },
}

function getTypeMeta(type) {
  return TYPE_META[type] || { icon: Bell, color: '#9aa8be', label: 'Notification' }
}

function timeAgo(ts) {
  var diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return Math.floor(diff / 60) + ' min ago'
  if (diff < 86400) return Math.floor(diff / 3600) + ' hrs ago'
  return Math.floor(diff / 86400) + ' days ago'
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const { user } = useAuth()
  const navigate = useNavigate()
  const ref = useRef(null)

  async function load() {
    if (!user) return
    var res = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    if (res.data) setNotifications(res.data)
  }

  // Initial load + auto-refresh every 30s so new admin posts show up without a page refresh
  useEffect(function() {
    load()
    var interval = setInterval(load, 30 * 1000)
    return function() { clearInterval(interval) }
  }, [user])

  // Close dropdown when clicking outside
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
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false)
    setNotifications(function(prev) { return prev.map(function(n) { return Object.assign({}, n, { read: true }) }) })
  }

  async function deleteOne(id, e) {
    // Stop the click from bubbling up to the parent button (which would mark-read + navigate)
    if (e) e.stopPropagation()
    await supabase.from('notifications').delete().eq('id', id)
    setNotifications(function(prev) { return prev.filter(function(n) { return n.id !== id }) })
  }

  async function clearAllNotifications() {
    if (!user) return
    if (!confirm('Clear all notifications? This cannot be undone.')) return
    await supabase.from('notifications').delete().eq('user_id', user.id)
    setNotifications([])
  }

  // When user clicks a notification: mark as read THEN navigate to its link_to page
  async function handleNotificationClick(n) {
    // Optimistically mark read in UI
    if (!n.read) {
      await markRead(n.id)
    }
    setOpen(false)
    if (n.link_to) {
      navigate(n.link_to)
    }
  }

  var unreadCount = notifications.filter(function(n) { return !n.read }).length

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={function() { setOpen(!open); if (!open) load() }}
        className="relative p-2 rounded-lg transition-colors"
        style={{ color: '#9aa8be', background: open ? '#161a22' : 'transparent' }}
        aria-label="Notifications"
      >
        <Bell size={18} strokeWidth={1.8} />
        {unreadCount > 0 && (
          <span
            className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-white"
            style={{ fontSize: '10px', background: '#ef4444', fontWeight: 600 }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] rounded-xl shadow-2xl z-50 overflow-hidden"
          style={{ background: '#161a22', border: '1px solid #1e2330' }}
        >
          {/* Header */}
          <div className="px-4 py-3" style={{ borderBottom: '1px solid #1e2330' }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold" style={{ color: '#eceef5' }}>Notifications</span>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>
                    {unreadCount} new
                  </span>
                )}
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs hover:underline" style={{ color: '#6b7a96' }}>
                    Mark all read
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Scrollable notifications list */}
          <div className="max-h-96 overflow-y-auto" style={{ borderColor: '#1e2330' }}>
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell size={24} style={{ color: '#475569', margin: '0 auto 8px' }} />
                <p className="text-sm" style={{ color: '#6b7a96' }}>No notifications yet.</p>
                <p className="text-xs mt-1" style={{ color: '#475569' }}>You'll see updates here when admins post new content.</p>
              </div>
            ) : (
              notifications.map(function(n) {
                var meta = getTypeMeta(n.type)
                var Icon = meta.icon
                return (
                  <div
                    key={n.id}
                    className="px-4 py-3 transition-colors hover:bg-white/5 flex gap-3 items-start group cursor-pointer"
                    style={{
                      opacity: n.read ? 0.55 : 1,
                      borderBottom: '1px solid #1e2330',
                      background: !n.read ? 'rgba(59,130,246,0.04)' : 'transparent'
                    }}
                    onClick={function() { handleNotificationClick(n) }}
                  >
                    {/* Type icon */}
                    <div
                      className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: meta.color + '22' }}
                    >
                      <Icon size={14} style={{ color: meta.color }} strokeWidth={2} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="text-xs font-semibold uppercase tracking-wide"
                          style={{ color: meta.color }}
                        >
                          {meta.label}
                        </span>
                        {!n.read && (
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#3b82f6' }} />
                        )}
                      </div>
                      <p className="text-sm font-medium leading-snug" style={{ color: '#eceef5' }}>
                        {n.title}
                      </p>
                      {n.message && (
                        <p className="text-xs mt-1 leading-snug line-clamp-2" style={{ color: '#9aa8be' }}>
                          {n.message}
                        </p>
                      )}
                      <p className="text-xs mt-1" style={{ color: '#6b7a96' }}>
                        {timeAgo(n.created_at)}
                      </p>
                    </div>

                    {/* Delete button — appears on hover */}
                    <button
                      onClick={function(e) { deleteOne(n.id, e) }}
                      className="p-1 rounded transition-opacity opacity-0 group-hover:opacity-100 flex-shrink-0"
                      style={{ color: '#6b7a96' }}
                      title="Delete this notification"
                      aria-label="Delete notification"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 flex justify-between items-center" style={{ borderTop: '1px solid #1e2330' }}>
              <span className="text-xs" style={{ color: '#475569' }}>
                {notifications.length} total
              </span>
              <button
                onClick={clearAllNotifications}
                className="text-xs hover:underline"
                style={{ color: '#ef4444' }}
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
