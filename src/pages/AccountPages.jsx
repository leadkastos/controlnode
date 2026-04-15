import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection, DataRow } from '../components/DetailPageLayout'
import { Badge } from '../components/UI'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

function Toggle({ enabled, onToggle }) {
  return (
    <div onClick={onToggle} className="w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-all" style={{ background: enabled ? '#3b82f6' : '#1e2330' }}>
      <div className="w-4 h-4 rounded-full" style={{ background: '#fff', transform: enabled ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.15s' }} />
    </div>
  )
}

function EmailNotificationsSection() {
  const { user } = useAuth()
  const [morningBrief, setMorningBrief] = useState(false)
  const [dailyWrap, setDailyWrap] = useState(false)
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
    var update = {}
    update[field] = value
    await supabase.from('profiles').update(update).eq('id', user.id)
    setToast('Saved!')
    setTimeout(function() { setToast('') }, 2000)
  }

  return (
    <DetailSection title="Email Notifications">
      <div className="rounded-lg px-4 py-3 mb-4 text-xs leading-relaxed" style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.15)', color: '#9aa8be' }}>
        <span style={{ color: '#3b82f6', fontWeight: 600 }}>How this works: </span>
        Toggle on Morning Brief or Daily Wrap to receive them by email when published. Your email address on file will be used.
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #1e2330' }}>
          <div>
            <p className="text-sm font-medium" style={{ color: '#eceef5' }}>Morning Brief</p>
            <p className="text-xs" style={{ color: '#9aa8be' }}>Delivered to your email each morning when published</p>
          </div>
          <Toggle enabled={morningBrief} onToggle={function() { var n = !morningBrief; setMorningBrief(n); save('email_morning_brief', n) }} />
        </div>
        <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #1e2330' }}>
          <div>
            <p className="text-sm font-medium" style={{ color: '#eceef5' }}>Daily Wrap</p>
            <p className="text-xs" style={{ color: '#9aa8be' }}>Delivered to your email each evening when published</p>
          </div>
          <Toggle enabled={dailyWrap} onToggle={function() { var n = !dailyWrap; setDailyWrap(n); save('email_daily_wrap', n) }} />
        </div>
      </div>
      {toast && <p className="text-xs mt-3" style={{ color: '#10b981' }}>{toast}</p>}
    </DetailSection>
  )
}

export function Account() {
  const { user, profile } = useAuth()
  var initials = profile?.full_name ? profile.full_name.split(' ').map(function(n) { return n[0] }).join('').toUpperCase() : 'CN'
  return (
    <AppLayout hideRightSidebar>
      <DetailPageLayout title="My Profile" subtitle="Manage your ControlNode account and notification preferences.">
        <DetailSection title="Profile Information">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff' }}>{initials}</div>
            <div>
              <p className="font-semibold" style={{ color: '#eceef5' }}>{profile?.full_name || 'Member'}</p>
              <p className="text-sm" style={{ color: '#9aa8be' }}>{user?.email || ''}</p>
              <div className="mt-1"><Badge color="blue">{profile?.subscription_status === 'active' ? 'Active' : 'Trial'}</Badge></div>
            </div>
          </div>
          <DataRow label="Plan" value="ControlNode Pro" />
          <DataRow label="Status" value={profile?.subscription_status === 'active' ? 'Active' : 'Trial'} valueColor="#10b981" />
        </DetailSection>
        <DetailSection title="Account Settings">
          <div className="space-y-3">
            {['Email Address', 'Display Name', 'Reset Password', 'Timezone'].map(function(field) {
              return (
                <div key={field} className="flex items-center justify-between py-1">
                  <span className="text-sm" style={{ color: '#9aa8be' }}>{field}</span>
                  <button className="text-xs px-3 py-1.5 rounded-lg border" style={{ color: '#3b82f6', borderColor: '#1e2330' }}>{field === 'Reset Password' ? 'Send Reset Email' : 'Edit'}</button>
                </div>
              )
            })}
          </div>
        </DetailSection>
        <EmailNotificationsSection />
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
              <div><p className="font-semibold" style={{ color: '#eceef5' }}>ControlNode Pro</p><p className="text-sm" style={{ color: '#9aa8be' }}>$29/month</p></div>
              <Badge color="blue">Active</Badge>
            </div>
          </div>
          <DataRow label="Payment Method" value="Managed via GoHighLevel" />
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
          <DataRow label="Theme" value="Dark (Default)" />
          <DataRow label="Currency" value="USD" />
          <DataRow label="Timezone" value="CT (Chicago)" />
        </DetailSection>
        <DetailSection title="Data & Privacy">
          <div className="space-y-2">
            {['Export My Data', 'Delete Account'].map(function(action) {
              return <button key={action} className="text-sm px-4 py-2 rounded-lg border w-full text-left" style={{ color: action === 'Delete Account' ? '#ef4444' : '#8892a4', borderColor: '#1e2330' }}>{action}</button>
            })}
          </div>
        </DetailSection>
      </DetailPageLayout>
    </AppLayout>
  )
}
