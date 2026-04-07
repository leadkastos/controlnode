import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection, DataRow } from '../components/DetailPageLayout'
import { Badge } from '../components/UI'
import { Youtube, Plus, Trash2, ExternalLink } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

function InputField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#6b7a96' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
        style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}
        onFocus={e => e.target.style.borderColor = '#3b82f6'}
        onBlur={e => e.target.style.borderColor = '#1e2330'}
      />
    </div>
  )
}

function Toggle({ enabled, onToggle }) {
  return (
    <div
      onClick={onToggle}
      className="w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-all"
      style={{ background: enabled ? '#3b82f6' : '#1e2330' }}
    >
      <div
        className="w-4 h-4 rounded-full"
        style={{ background: '#fff', transform: enabled ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.15s' }}
      />
    </div>
  )
}

function EmailNotificationsSection() {
  const { user } = useAuth()
  const [morningBrief, setMorningBrief] = useState(false)
  const [dailyWrap, setDailyWrap] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(function() {
    if (!user) return
    supabase.from('profiles').select('email_morning_brief, email_daily_wrap').eq('id', user.id).single().then(function(res) {
      if (res.data) {
        setMorningBrief(res.data.email_morning_brief || false)
        setDailyWrap(res.data.email_daily_wrap || false)
      }
    })
  }, [user])

  async function save(field, value) {
    if (!user) return
    setSaving(true)
    const update = {}
    update[field] = value
    await supabase.from('profiles').update(update).eq('id', user.id)
    setSaving(false)
    setToast('Saved!')
    setTimeout(function() { setToast('') }, 2000)
  }

  function toggleMorning() {
    const next = !morningBrief
    setMorningBrief(next)
    save('email_morning_brief', next)
  }

  function toggleWrap() {
    const next = !dailyWrap
    setDailyWrap(next)
    save('email_daily_wrap', next)
  }

  return (
    <DetailSection title="Email Notifications">
      <div
        className="rounded-lg px-4 py-3 mb-4 text-xs leading-relaxed"
        style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.15)', color: '#9aa8be' }}
      >
        <span style={{ color: '#3b82f6', fontWeight: 600 }}>How this works: </span>
        Toggle on Morning Brief or Daily Wrap to receive them by email when published. Your email address on file will be used.
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #1e2330' }}>
          <div>
            <p className="text-sm font-medium" style={{ color: '#eceef5' }}>Morning Brief</p>
            <p className="text-xs" style={{ color: '#9aa8be' }}>Delivered to your email each morning when published</p>
          </div>
          <Toggle enabled={morningBrief} onToggle={toggleMorning} />
        </div>
        <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #1e2330' }}>
          <div>
            <p className="text-sm font-medium" style={{ color: '#eceef5' }}>Daily Wrap</p>
            <p className="text-xs" style={{ color: '#9aa8be' }}>Delivered to your email each evening when published</p>
          </div>
          <Toggle enabled={dailyWrap} onToggle={toggleWrap} />
        </div>
      </div>
      {toast && <p className="text-xs mt-3" style={{ color: '#10b981' }}>{toast}</p>}
    </DetailSection>
  )
}

function YouTubeSection() {
  const [channels, setChannels] = useState([
    { id: 1, url: 'https://youtube.com/@EgragCrypto', name: 'Egrag Crypto' },
    { id: 2, url: 'https://youtube.com/@darkdefender', name: 'Dark Defender' },
  ])
  const [newUrl, setNewUrl] = useState('')
  const [error, setError] = useState('')
  const MAX = 4

  function addChannel() {
    if (!newUrl.trim()) return
    if (channels.length >= MAX) { setError('Maximum of ' + MAX + ' channels allowed.'); return }
    if (!newUrl.includes('youtube.com') && !newUrl.includes('youtu.be')) { setError('Please enter a valid YouTube channel URL.'); return }
    const name = newUrl.split('@')[1]?.split('/')[0] || newUrl
    setChannels([...channels, { id: Date.now(), url: newUrl.trim(), name }])
    setNewUrl('')
    setError('')
  }

  function removeChannel(id) { setChannels(channels.filter(c => c.id !== id)) }

  return (
    <DetailSection title="YouTube Intel — Channel Settings">
      <div className="rounded-lg px-4 py-3 mb-4 text-xs leading-relaxed" style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', color: '#9aa8be' }}>
        <span style={{ color: '#ef4444', fontWeight: 600 }}>How this works: </span>
        Add up to 4 YouTube channels below. ControlNode checks for new videos 4 times daily (6AM, 12PM, 6PM, 12AM CT). When a new video is posted, your notification bell will light up and the YouTube Intel card on your dashboard will update.
      </div>
      <div className="space-y-2 mb-4">
        {channels.map((ch) => (
          <div key={ch.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ background: '#111318', border: '1px solid #1e2330' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.15)' }}>
              <Youtube size={14} style={{ color: '#ef4444' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: '#eceef5' }}>@{ch.name}</p>
              <p className="text-xs truncate" style={{ color: '#6b7a96' }}>{ch.url}</p>
            </div>
            <a href={ch.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded" style={{ color: '#6b7a96' }}>
              <ExternalLink size={13} />
            </a>
            <button onClick={() => removeChannel(ch.id)} className="p-1.5 rounded transition-colors hover:bg-red-500/10" style={{ color: '#6b7a96' }}>
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        {Array.from({ length: MAX - channels.length }).map((_, i) => (
          <div key={'empty-' + i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ background: '#0d0f14', border: '1px dashed #1e2330' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#161a22' }}>
              <Youtube size={14} style={{ color: '#4a5870' }} />
            </div>
            <p className="text-xs" style={{ color: '#4a5870' }}>Empty slot</p>
          </div>
        ))}
      </div>
      {channels.length < MAX && (
        <div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newUrl}
              onChange={e => { setNewUrl(e.target.value); setError('') }}
              placeholder="https://youtube.com/@channelname"
              className="flex-1 px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#1e2330'}
              onKeyDown={e => e.key === 'Enter' && addChannel()}
            />
            <button onClick={addChannel} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium" style={{ background: '#3b82f6', color: '#fff' }}>
              <Plus size={14} />
              Add
            </button>
          </div>
          {error && <p className="text-xs mt-2" style={{ color: '#ef4444' }}>{error}</p>}
          <p className="text-xs mt-2" style={{ color: '#6b7a96' }}>{channels.length} of {MAX} channels used</p>
        </div>
      )}
      {channels.length >= MAX && (
        <div className="rounded-lg px-4 py-3 text-xs text-center" style={{ background: '#111318', border: '1px solid #1e2330', color: '#6b7a96' }}>
          Maximum of 4 channels reached. Remove a channel to add a new one.
        </div>
      )}
      <div className="mt-4 pt-4" style={{ borderTop: '1px solid #1e2330' }}>
        <p className="text-xs" style={{ color: '#6b7a96' }}>Check schedule: 6:00 AM · 12:00 PM · 6:00 PM · 12:00 AM (CT)</p>
      </div>
    </DetailSection>
  )
}

export function Account() {
  const { user, profile } = useAuth()
  const initials = profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase() : 'CN'

  return (
    <AppLayout hideRightSidebar>
      <DetailPageLayout title="My Profile" subtitle="Manage your ControlNode account and notification preferences.">
        <DetailSection title="Profile Information">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff' }}>
              {initials}
            </div>
            <div>
              <p className="font-semibold" style={{ color: '#eceef5' }}>{profile?.full_name || 'Member'}</p>
              <p className="text-sm" style={{ color: '#9aa8be' }}>{user?.email || ''}</p>
              <div className="mt-1"><Badge color="blue">{profile?.subscription_status === 'active' ? 'Active' : 'Trial'}</Badge></div>
            </div>
          </div>
          <div className="space-y-0">
            <DataRow label="Plan" value="ControlNode Pro" />
            <DataRow label="Status" value={profile?.subscription_status === 'active' ? 'Active' : 'Trial'} valueColor="#10b981" />
          </div>
        </DetailSection>
        <DetailSection title="Account Settings">
          <div className="space-y-3">
            {['Email Address', 'Display Name', 'Reset Password', 'Timezone'].map((field) => (
              <div key={field} className="flex items-center justify-between py-1">
                <span className="text-sm" style={{ color: '#9aa8be' }}>{field}</span>
                <button className="text-xs px-3 py-1.5 rounded-lg border transition-colors" style={{ color: '#3b82f6', borderColor: '#1e2330' }}>
                  {field === 'Reset Password' ? 'Send Reset Email' : 'Edit'}
                </button>
              </div>
            ))}
          </div>
        </DetailSection>
        <EmailNotificationsSection />
        <YouTubeSection />
      </DetailPageLayout>
    </AppLayout>
  )
}

export function Billing() {
  return (
    <AppLayout hideRightSidebar>
      <DetailPageLayout title="Billing" subtitle="Manage your subscription, payment methods, and invoices.">
        <DetailSection title="Current Plan">
          <div className="rounded-lg p-4 mb-4" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold" style={{ color: '#eceef5' }}>ControlNode Pro</p>
                <p className="text-sm" style={{ color: '#9aa8be' }}>$19.95/month</p>
              </div>
              <Badge color="blue">Active</Badge>
            </div>
          </div>
          <div className="space-y-0">
            <DataRow label="Payment Method" value="Managed via GoHighLevel" />
          </div>
        </DetailSection>
      </DetailPageLayout>
    </AppLayout>
  )
}

export function Settings() {
  return (
    <AppLayout hideRightSidebar>
      <DetailPageLayout title="Settings" subtitle="Configure your ControlNode experience.">
        <DetailSection title="Display">
          <div className="space-y-0">
            <DataRow label="Theme" value="Dark (Default)" />
            <DataRow label="Currency" value="USD" />
            <DataRow label="Timezone" value="CT (Chicago)" />
          </div>
        </DetailSection>
        <DetailSection title="Data & Privacy">
          <div className="space-y-2">
            {['Export My Data', 'Delete Account'].map((action) => (
              <button key={action} className="text-sm px-4 py-2 rounded-lg border w-full text-left" style={{ color: action === 'Delete Account' ? '#ef4444' : '#8892a4', borderColor: '#1e2330' }}>
                {action}
              </button>
            ))}
          </div>
        </DetailSection>
      </DetailPageLayout>
    </AppLayout>
  )
}
