import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection, DataRow } from '../components/DetailPageLayout'
import { Badge } from '../components/UI'
import { Trash2, ExternalLink, Bell } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

function AdminLayout({ title, children }) {
  return (
    <AppLayout hideRightSidebar>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>{title}</h1>
          <p className="text-sm mt-1" style={{ color: '#6b7a96' }}>Admin Panel</p>
        </div>
        {children}
      </div>
    </AppLayout>
  )
}

function AdminCard({ title, children }) {
  return (
    <div className="rounded-xl p-6 mb-6" style={{ background: '#0d1117', border: '1px solid #1e2330' }}>
      <h2 className="text-sm font-semibold uppercase tracking-widest mb-4" style={{ color: '#6b7a96' }}>{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#6b7a96' }}>{label}</label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type }) {
  return (
    <input type={type || 'text'} value={value} onChange={function(e) { onChange(e.target.value) }} placeholder={placeholder} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }} onFocus={function(e) { e.target.style.borderColor = '#3b82f6' }} onBlur={function(e) { e.target.style.borderColor = '#1e2330' }} />
  )
}

function DatePicker({ value, onChange }) {
  return (
    <input type="date" value={value} onChange={function(e) { onChange(e.target.value) }} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }} onFocus={function(e) { e.target.style.borderColor = '#3b82f6' }} onBlur={function(e) { e.target.style.borderColor = '#1e2330' }} />
  )
}

function TextArea({ value, onChange, placeholder, rows }) {
  return (
    <textarea value={value} onChange={function(e) { onChange(e.target.value) }} placeholder={placeholder} rows={rows || 5} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none" style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }} onFocus={function(e) { e.target.style.borderColor = '#3b82f6' }} onBlur={function(e) { e.target.style.borderColor = '#1e2330' }} />
  )
}

function SaveButton({ onClick, loading, label }) {
  return (
    <button onClick={onClick} disabled={loading} className="px-6 py-2.5 rounded-lg text-sm font-semibold" style={{ background: loading ? '#1e2330' : '#3b82f6', color: loading ? '#6b7a96' : '#fff' }}>
      {loading ? 'Saving...' : label}
    </button>
  )
}

function NotifyToggle({ enabled, onToggle }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg mb-4" style={{ background: enabled ? 'rgba(59,130,246,0.07)' : '#111318', border: '1px solid ' + (enabled ? 'rgba(59,130,246,0.2)' : '#1e2330') }}>
      <Bell size={14} style={{ color: enabled ? '#3b82f6' : '#6b7a96' }} />
      <div className="flex-1">
        <p className="text-xs font-semibold" style={{ color: enabled ? '#3b82f6' : '#6b7a96' }}>Send bell notification to all active members</p>
      </div>
      <div onClick={onToggle} className="w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-all" style={{ background: enabled ? '#3b82f6' : '#1e2330' }}>
        <div className="w-4 h-4 rounded-full" style={{ background: '#fff', transform: enabled ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.15s' }} />
      </div>
    </div>
  )
}

function Toast({ message, type }) {
  if (!message) return null
  return <div className="fixed bottom-6 right-6 px-5 py-3 rounded-lg text-sm font-medium z-50" style={{ background: type === 'error' ? '#ef4444' : '#10b981', color: '#fff' }}>{message}</div>
}

function Toggle({ enabled, onToggle }) {
  return (
    <div onClick={onToggle} className="w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-all" style={{ background: enabled ? '#3b82f6' : '#1e2330' }}>
      <div className="w-4 h-4 rounded-full" style={{ background: '#fff', transform: enabled ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.15s' }} />
    </div>
  )
}

async function sendNotificationToAllMembers(title, message, type) {
  var res = await supabase.from('profiles').select('id').eq('subscription_status', 'active')
  if (!res.data || res.data.length === 0) return
  var notifications = res.data.map(function(p) {
    return { user_id: p.id, type: type, title: title, message: message, read: false }
  })
  await supabase.from('notifications').insert(notifications)
}

function EmailNotificationsSection() {
  const { user } = useAuth()
  const [morningBrief, setMorningBrief] = useState(false)
  const [dailyWrap, setDailyWrap] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(function() {
    if (!user) return
    supabase.from('profiles').select('email_morning_brief, email_daily_wrap').eq('id', user.id).single().then(function(res) {
      if (res.data) { setMorningBrief(res.data.email_morning_brief || false); setDailyWrap(res.data.email_daily_wrap || false) }
    })
  }, [user])

  async function save(field, value) {
    if (!user) return
    var update = {}; update[field] = value
    await supabase.from('profiles').update(update).eq('id', user.id)
    setToast('Saved!'); setTimeout(function() { setToast('') }, 2000)
  }

  return (
    <DetailSection title="Email Notifications">
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #1e2330' }}>
          <div><p className="text-sm font-medium" style={{ color: '#eceef5' }}>Morning Brief</p><p className="text-xs" style={{ color: '#9aa8be' }}>Delivered to your email each morning when published</p></div>
          <Toggle enabled={morningBrief} onToggle={function() { var n = !morningBrief; setMorningBrief(n); save('email_morning_brief', n) }} />
        </div>
        <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #1e2330' }}>
          <div><p className="text-sm font-medium" style={{ color: '#eceef5' }}>Daily Wrap</p><p className="text-xs" style={{ color: '#9aa8be' }}>Delivered to your email each evening when published</p></div>
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
              <div><p className="font-semibold" style={{ color: '#eceef5' }}>ControlNode Pro</p><p className="text-sm" style={{ color: '#9aa8be' }}>$29.99/month</p></div>
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

export function Admin() {
  return (
    <AdminLayout title="Admin Panel">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { href: '/admin/morning-brief', title: 'Morning Brief', desc: 'Publish the morning brief' },
          { href: '/admin/daily-wrap', title: 'Daily Wrap', desc: 'Publish the daily wrap' },
          { href: '/admin/market-signals', title: 'Market Signals', desc: 'Update market intelligence signals' },
          { href: '/admin/domino-theory', title: 'Domino Theory', desc: 'Update domino statuses and notes' },
          { href: '/admin/geopolitical-watch', title: 'Geopolitical Watch', desc: 'Update flash points and weekly watch' },
          { href: '/admin/oil-yen', title: 'Oil vs Yen', desc: 'Update macro scenarios to monitor' },
          { href: '/admin/headlines', title: 'Breaking News', desc: 'Post breaking news and headlines' },
          { href: '/admin/watchlist', title: 'Master Watchlist', desc: 'Manage suggested symbols' },
          { href: '/admin/chatter', title: 'Market News', desc: 'Post confirmed news and manage market chatter' }
          { href: '/admin/etf-flows', title: 'XRP ETF Flows', desc: 'Update ETF data and flow numbers' },
          { href: '/admin/youtube', title: 'YouTube Intel', desc: 'Manage YouTube channels for all members' },
          { href: '/admin/smart-money', title: 'Smart Money Flow', desc: 'Post whale alerts and update escrow data' },
        ].map(function(item) {
          return (
            <a key={item.href} href={item.href} className="rounded-xl p-5 block" style={{ background: '#0d1117', border: '1px solid #1e2330' }}>
              <p className="font-semibold mb-1" style={{ color: '#eceef5' }}>{item.title}</p>
              <p className="text-sm" style={{ color: '#6b7a96' }}>{item.desc}</p>
            </a>
          )
        })}
      </div>
    </AdminLayout>
  )
}

export function AdminMarketSignals() {
  var signalsState = useState([]); var signals = signalsState[0]; var setSignals = signalsState[1]
  var loadingState = useState(true); var loading = loadingState[0]; var setLoading = loadingState[1]
  var savingState = useState(null); var saving = savingState[0]; var setSaving = savingState[1]
  var notifyState = useState(false); var notify = notifyState[0]; var setNotify = notifyState[1]
  var toastState = useState({ message: '', type: '' }); var toast = toastState[0]; var setToast = toastState[1]

  function showToast(m, t) { setToast({ message: m, type: t || 'success' }); setTimeout(function() { setToast({ message: '', type: '' }) }, 3000) }

  useEffect(function() {
    supabase.from('market_signals').select('*').order('signal_name').then(function(res) {
      if (res.data) setSignals(res.data)
      setLoading(false)
    })
  }, [])

  function updateField(id, field, value) {
    setSignals(function(prev) { return prev.map(function(s) { if (s.id === id) { var u = Object.assign({}, s); u[field] = value; return u } return s }) })
  }

  function getColorForValue(value) {
    if (value === 'Bullish') return 'green'
    if (value === 'Bearish') return 'red'
    if (value === 'Cautious') return 'yellow'
    return 'blue'
  }

  async function save(signal) {
    setSaving(signal.id)
    var color = getColorForValue(signal.signal_value)
    var result = await supabase.from('market_signals').update({ 
      signal_value: signal.signal_value, 
      color: color, 
      updated_at: new Date().toISOString() 
    }).eq('id', signal.id)
    if (result.error) { setSaving(null); showToast('Error: ' + result.error.message, 'error'); return }
    if (notify) { await sendNotificationToAllMembers('Market Signal Update', signal.signal_name + ' changed to ' + signal.signal_value, 'market_signals') }
    setSaving(null)
    showToast(signal.signal_name + ' saved!')
    // Update the color in local state
    updateField(signal.id, 'color', color)
  }

  return (
    <AdminLayout title="Market Signals">
      <div className="rounded-lg px-4 py-3 mb-6 text-sm" style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)', color: '#9aa8be' }}>
        Update market intelligence signals shown in the right sidebar. These are your editorial intelligence calls based on your analysis of market conditions.
      </div>
      <NotifyToggle enabled={notify} onToggle={function() { setNotify(!notify) }} />
      {loading ? <p style={{ color: '#6b7a96' }}>Loading...</p> : signals.length === 0 ? <p style={{ color: '#6b7a96' }}>No signals found.</p> : signals.map(function(s) {
        return (
          <AdminCard key={s.id} title={s.signal_name}>
            <Field label="Signal Value">
              <select value={s.signal_value || 'Neutral'} onChange={function(e) { updateField(s.id, 'signal_value', e.target.value) }} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}>
                <option value="Bullish">Bullish</option>
                <option value="Neutral">Neutral</option>
                <option value="Cautious">Cautious</option>
                <option value="Bearish">Bearish</option>
              </select>
            </Field>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs" style={{ color: '#6b7a96' }}>Preview:</span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded"
                style={{ 
                  background: s.signal_value === 'Bullish' ? 'rgba(16,185,129,0.12)' : 
                             s.signal_value === 'Bearish' ? 'rgba(239,68,68,0.12)' :
                             s.signal_value === 'Cautious' ? 'rgba(245,158,11,0.12)' : 
                             'rgba(59,130,246,0.12)',
                  color: s.signal_value === 'Bullish' ? '#10b981' : 
                        s.signal_value === 'Bearish' ? '#ef4444' :
                        s.signal_value === 'Cautious' ? '#f59e0b' : 
                        '#3b82f6'
                }}
              >
                {s.signal_value || 'Neutral'}
              </span>
            </div>
            <SaveButton onClick={function() { save(s) }} loading={saving === s.id} label="Save" />
          </AdminCard>
        )
      })}
      <Toast message={toast.message} type={toast.type} />
    </AdminLayout>
  )
}

export function AdminMorningBrief() {
  var dateState = useState(''); var date = dateState[0]; var setDate = dateState[1]
  var headlineState = useState(''); var headline = headlineState[0]; var setHeadline = headlineState[1]
  var summaryState = useState(''); var summary = summaryState[0]; var setSummary = summaryState[1]
  var catalystsState = useState(''); var catalysts = catalystsState[0]; var setCatalysts = catalystsState[1]
  var loadingState = useState(false); var loading = loadingState[0]; var setLoading = loadingState[1]
  var notifyState = useState(true); var notify = notifyState[0]; var setNotify = notifyState[1]
  var toastState = useState({ message: '', type: '' }); var toast = toastState[0]; var setToast = toastState[1]

  function showToast(m, t) { setToast({ message: m, type: t || 'success' }); setTimeout(function() { setToast({ message: '', type: '' }) }, 3000) }

  async function publish() {
    if (!date || !headline || !summary) { showToast('Date, headline, and summary are required.', 'error'); return }
    setLoading(true)
    var formattedDate = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    var result = await supabase.from('morning_briefs').insert({ date: formattedDate, headline: headline, summary: summary, catalysts: catalysts.split('\n').map(function(c) { return c.trim() }).filter(Boolean), published: true })
    if (result.error) { setLoading(false); showToast('Error: ' + result.error.message, 'error'); return }
    if (notify) { await sendNotificationToAllMembers('New Morning Brief', headline, 'morning_brief') }
    setLoading(false)
    showToast('Morning Brief published!'); setDate(''); setHeadline(''); setSummary(''); setCatalysts('')
  }

  return (
    <AdminLayout title="Morning Brief">
      <AdminCard title="Publish New Morning Brief">
        <Field label="Date"><DatePicker value={date} onChange={setDate} /></Field>
        <Field label="Headline"><TextInput value={headline} onChange={setHeadline} placeholder="Brief headline..." /></Field>
        <Field label="Summary"><TextArea value={summary} onChange={setSummary} placeholder="Summary paragraph..." rows={5} /></Field>
        <Field label="Catalysts (one per line)"><TextArea value={catalysts} onChange={setCatalysts} placeholder="Catalyst one" rows={4} /></Field>
        <NotifyToggle enabled={notify} onToggle={function() { setNotify(!notify) }} />
        <SaveButton onClick={publish} loading={loading} label="Publish" />
      </AdminCard>
      <Toast message={toast.message} type={toast.type} />
    </AdminLayout>
  )
}

export function AdminDailyWrap() {
  var dateState = useState(''); var date = dateState[0]; var setDate = dateState[1]
  var headlineState = useState(''); var headline = headlineState[0]; var setHeadline = headlineState[1]
  var summaryState = useState(''); var summary = summaryState[0]; var setSummary = summaryState[1]
  var catalystsState = useState(''); var catalysts = catalystsState[0]; var setCatalysts = catalystsState[1]
  var loadingState = useState(false); var loading = loadingState[0]; var setLoading = loadingState[1]
  var notifyState = useState(true); var notify = notifyState[0]; var setNotify = notifyState[1]
  var toastState = useState({ message: '', type: '' }); var toast = toastState[0]; var setToast = toastState[1]

  function showToast(m, t) { setToast({ message: m, type: t || 'success' }); setTimeout(function() { setToast({ message: '', type: '' }) }, 3000) }

  async function publish() {
    if (!date || !headline || !summary) { showToast('Date, headline, and summary are required.', 'error'); return }
    setLoading(true)
    var formattedDate = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    var result = await supabase.from('daily_wraps').insert({ date: formattedDate, headline: headline, summary: summary, catalysts: catalysts.split('\n').map(function(c) { return c.trim() }).filter(Boolean), published: true })
    if (result.error) { setLoading(false); showToast('Error: ' + result.error.message, 'error'); return }
    if (notify) { await sendNotificationToAllMembers('New Daily Wrap', headline, 'daily_wrap') }
    setLoading(false)
    showToast('Daily Wrap published!'); setDate(''); setHeadline(''); setSummary(''); setCatalysts('')
  }

  return (
    <AdminLayout title="Daily Wrap">
      <AdminCard title="Publish New Daily Wrap">
        <Field label="Date"><DatePicker value={date} onChange={setDate} /></Field>
        <Field label="Headline"><TextInput value={headline} onChange={setHeadline} placeholder="Wrap headline..." /></Field>
        <Field label="Summary"><TextArea value={summary} onChange={setSummary} placeholder="Summary paragraph..." rows={5} /></Field>
        <Field label="Catalysts (one per line)"><TextArea value={catalysts} onChange={setCatalysts} placeholder="Catalyst one" rows={4} /></Field>
        <NotifyToggle enabled={notify} onToggle={function() { setNotify(!notify) }} />
        <SaveButton onClick={publish} loading={loading} label="Publish" />
      </AdminCard>
      <Toast message={toast.message} type={toast.type} />
    </AdminLayout>
  )
}

export function AdminDominoTheory() {
  var dominoesState = useState([]); var dominoes = dominoesState[0]; var setDominoes = dominoesState[1]
  var loadingState = useState(true); var loading = loadingState[0]; var setLoading = loadingState[1]
  var savingState = useState(null); var saving = savingState[0]; var setSaving = savingState[1]
  var notifyState = useState(false); var notify = notifyState[0]; var setNotify = notifyState[1]
  var toastState = useState({ message: '', type: '' }); var toast = toastState[0]; var setToast = toastState[1]

  function showToast(m, t) { setToast({ message: m, type: t || 'success' }); setTimeout(function() { setToast({ message: '', type: '' }) }, 3000) }

  useEffect(function() {
    supabase.from('domino_theory').select('*').order('domino_number').then(function(res) {
      if (res.data) setDominoes(res.data)
      setLoading(false)
    })
  }, [])

  function updateField(id, field, value) {
    setDominoes(function(prev) { return prev.map(function(d) { if (d.id === id) { var u = Object.assign({}, d); u[field] = value; return u } return d }) })
  }

  async function save(domino) {
    setSaving(domino.id)
    var result = await supabase.from('domino_theory').update({ status: domino.status, notes: domino.notes }).eq('id', domino.id)
    if (result.error) { setSaving(null); showToast('Error: ' + result.error.message, 'error'); return }
    if (notify) { await sendNotificationToAllMembers('Domino Theory Update', 'Domino ' + domino.domino_number + ' — ' + domino.domino_name + ' status changed to ' + domino.status, 'domino_theory') }
    setSaving(null)
    showToast(domino.domino_name + ' saved!')
  }

  return (
    <AdminLayout title="Domino Theory">
      <NotifyToggle enabled={notify} onToggle={function() { setNotify(!notify) }} />
      {loading ? <p style={{ color: '#6b7a96' }}>Loading...</p> : dominoes.length === 0 ? <p style={{ color: '#6b7a96' }}>No dominoes found.</p> : dominoes.map(function(d) {
        return (
          <AdminCard key={d.id} title={'Domino ' + d.domino_number + ' — ' + d.domino_name}>
            <Field label="Status">
              <select value={d.status || 'Standing'} onChange={function(e) { updateField(d.id, 'status', e.target.value) }} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}>
                <option value="Standing">Standing</option>
                <option value="Tipping">Tipping</option>
                <option value="Fallen">Fallen</option>
              </select>
            </Field>
            <Field label="Assessment Notes"><TextArea value={d.notes || ''} onChange={function(v) { updateField(d.id, 'notes', v) }} placeholder="Assessment notes..." rows={3} /></Field>
            <SaveButton onClick={function() { save(d) }} loading={saving === d.id} label="Save" />
          </AdminCard>
        )
      })}
      <Toast message={toast.message} type={toast.type} />
    </AdminLayout>
  )
}

export function AdminGeopoliticalWatch() {
  var itemsState = useState([]); var items = itemsState[0]; var setItems = itemsState[1]
  var loadingState = useState(true); var loading = loadingState[0]; var setLoading = loadingState[1]
  var savingState = useState(false); var saving = savingState[0]; var setSaving = savingState[1]
  var notifyState = useState(false); var notify = notifyState[0]; var setNotify = notifyState[1]
  var toastState = useState({ message: '', type: '' }); var toast = toastState[0]; var setToast = toastState[1]
  var formState = useState({ section: 'flashpoint', title: '', subtitle: '', level: 'Elevated', confirmed: true, sort_order: 0 }); var form = formState[0]; var setForm = formState[1]

  function showToast(m, t) { setToast({ message: m, type: t || 'success' }); setTimeout(function() { setToast({ message: '', type: '' }) }, 3000) }

  async function load() {
    var res = await supabase.from('geopolitical_watch').select('*').order('sort_order', { ascending: true })
    if (res.data) setItems(res.data)
    setLoading(false)
  }

  useEffect(function() { load() }, [])

  async function add() {
    if (!form.title) { showToast('Title is required.', 'error'); return }
    setSaving(true)
    var result = await supabase.from('geopolitical_watch').insert(form)
    if (result.error) { setSaving(false); showToast('Error: ' + result.error.message, 'error'); return }
    if (notify) { await sendNotificationToAllMembers('Geopolitical Alert', form.title + (form.subtitle ? ' — ' + form.subtitle : ''), 'geopolitical_watch') }
    setSaving(false)
    showToast('Item added!')
    setForm({ section: 'flashpoint', title: '', subtitle: '', level: 'Elevated', confirmed: true, sort_order: 0 })
    load()
  }

  async function remove(id) { await supabase.from('geopolitical_watch').delete().eq('id', id); showToast('Removed.'); load() }

  var flashPoints = items.filter(function(i) { return i.section === 'flashpoint' })
  var weeklyWatch = items.filter(function(i) { return i.section === 'weekly_watch' })

  return (
    <AdminLayout title="Geopolitical Watch">
      <AdminCard title="Add Item">
        <Field label="Section">
          <select value={form.section} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { section: e.target.value }) }) }} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}>
            <option value="flashpoint">Active Flash Point</option>
            <option value="weekly_watch">What to Watch This Week</option>
          </select>
        </Field>
        <Field label="Title"><TextInput value={form.title} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { title: v }) }) }} placeholder="Region or event name..." /></Field>
        <Field label="Note / Impact"><TextInput value={form.subtitle} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { subtitle: v }) }) }} placeholder="Brief note or impact description..." /></Field>
        {form.section === 'flashpoint' && (
          <Field label="Risk Level">
            <select value={form.level} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { level: e.target.value }) }) }} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}>
              <option value="High">High</option>
              <option value="Elevated">Elevated</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
              <option value="Monitor">Monitor</option>
            </select>
          </Field>
        )}
        {form.section === 'weekly_watch' && (
          <Field label="Confirmed?">
            <select value={form.confirmed ? 'true' : 'false'} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { confirmed: e.target.value === 'true' }) }) }} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}>
              <option value="true">Confirmed</option>
              <option value="false">Unconfirmed</option>
            </select>
          </Field>
        )}
        <Field label="Sort Order"><TextInput value={String(form.sort_order)} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { sort_order: parseInt(v) || 0 }) }) }} placeholder="0" /></Field>
        <NotifyToggle enabled={notify} onToggle={function() { setNotify(!notify) }} />
        <SaveButton onClick={add} loading={saving} label="Add Item" />
      </AdminCard>
      <AdminCard title="Active Flash Points">
        {loading ? <p style={{ color: '#6b7a96' }}>Loading...</p> : flashPoints.length === 0 ? <p style={{ color: '#6b7a96' }}>No flash points yet.</p> : (
          <div className="space-y-2">
            {flashPoints.map(function(item) {
              return (
                <div key={item.id} className="flex items-start justify-between gap-3 py-2" style={{ borderBottom: '1px solid #1e2330' }}>
                  <div><p className="text-sm font-medium" style={{ color: '#eceef5' }}>{item.title}</p><p className="text-xs" style={{ color: '#6b7a96' }}>{item.subtitle} · <span style={{ color: '#f59e0b' }}>{item.level}</span></p></div>
                  <button onClick={function() { remove(item.id) }} className="text-xs px-3 py-1 rounded flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>Remove</button>
                </div>
              )
            })}
          </div>
        )}
      </AdminCard>
      <AdminCard title="What to Watch This Week">
        {loading ? <p style={{ color: '#6b7a96' }}>Loading...</p> : weeklyWatch.length === 0 ? <p style={{ color: '#6b7a96' }}>No items yet.</p> : (
          <div className="space-y-2">
            {weeklyWatch.map(function(item) {
              return (
                <div key={item.id} className="flex items-start justify-between gap-3 py-2" style={{ borderBottom: '1px solid #1e2330' }}>
                  <div><p className="text-sm font-medium" style={{ color: '#eceef5' }}>{item.title}</p><p className="text-xs" style={{ color: '#6b7a96' }}>{item.subtitle} · <span style={{ color: item.confirmed ? '#10b981' : '#ef4444' }}>{item.confirmed ? 'Confirmed' : 'Unconfirmed'}</span></p></div>
                  <button onClick={function() { remove(item.id) }} className="text-xs px-3 py-1 rounded flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>Remove</button>
                </div>
              )
            })}
          </div>
        )}
      </AdminCard>
      <Toast message={toast.message} type={toast.type} />
    </AdminLayout>
  )
}

export function AdminOilYen() {
  var itemsState = useState([]); var items = itemsState[0]; var setItems = itemsState[1]
  var loadingState = useState(true); var loading = loadingState[0]; var setLoading = loadingState[1]
  var savingState = useState(false); var saving = savingState[0]; var setSaving = savingState[1]
  var notifyState = useState(false); var notify = notifyState[0]; var setNotify = notifyState[1]
  var toastState = useState({ message: '', type: '' }); var toast = toastState[0]; var setToast = toastState[1]
  var formState = useState({ scenario: '', context: '', color: '#f59e0b', sort_order: 0 }); var form = formState[0]; var setForm = formState[1]

  function showToast(m, t) { setToast({ message: m, type: t || 'success' }); setTimeout(function() { setToast({ message: '', type: '' }) }, 3000) }

  async function load() {
    var res = await supabase.from('oil_yen_scenarios').select('*').order('sort_order', { ascending: true })
    if (res.data) setItems(res.data)
    setLoading(false)
  }

  useEffect(function() { load() }, [])

  async function add() {
    if (!form.scenario || !form.context) { showToast('Scenario and context are required.', 'error'); return }
    setSaving(true)
    var result = await supabase.from('oil_yen_scenarios').insert(form)
    if (result.error) { setSaving(false); showToast('Error: ' + result.error.message, 'error'); return }
    if (notify) { await sendNotificationToAllMembers('Oil vs Yen Update', form.scenario, 'oil_yen') }
    setSaving(false)
    showToast('Scenario added!')
    setForm({ scenario: '', context: '', color: '#f59e0b', sort_order: 0 })
    load()
  }

  async function remove(id) { await supabase.from('oil_yen_scenarios').delete().eq('id', id); showToast('Removed.'); load() }

  return (
    <AdminLayout title="Oil vs Yen — Macro Scenarios">
      <AdminCard title="Add Scenario">
        <Field label="Scenario"><TextInput value={form.scenario} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { scenario: v }) }) }} placeholder="Oil spikes to $95+ (supply shock)" /></Field>
        <Field label="Context / Impact"><TextInput value={form.context} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { context: v }) }) }} placeholder="Short-term risk-off potential..." /></Field>
        <Field label="Color">
          <select value={form.color} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { color: e.target.value }) }) }} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}>
            <option value="#f59e0b">Yellow (Caution)</option>
            <option value="#10b981">Green (Positive)</option>
            <option value="#ef4444">Red (Risk)</option>
            <option value="#3b82f6">Blue (Neutral)</option>
          </select>
        </Field>
        <Field label="Sort Order"><TextInput value={String(form.sort_order)} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { sort_order: parseInt(v) || 0 }) }) }} placeholder="0" /></Field>
        <NotifyToggle enabled={notify} onToggle={function() { setNotify(!notify) }} />
        <SaveButton onClick={add} loading={saving} label="Add Scenario" />
      </AdminCard>
      <AdminCard title="Current Scenarios">
        {loading ? <p style={{ color: '#6b7a96' }}>Loading...</p> : items.length === 0 ? <p style={{ color: '#6b7a96' }}>No scenarios yet.</p> : (
          <div className="space-y-2">
            {items.map(function(item) {
              return (
                <div key={item.id} className="flex items-start justify-between gap-3 py-2" style={{ borderBottom: '1px solid #1e2330' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#eceef5' }}>{item.scenario}</p>
                    <p className="text-xs" style={{ color: item.color }}>{item.context}</p>
                  </div>
                  <button onClick={function() { remove(item.id) }} className="text-xs px-3 py-1 rounded flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>Remove</button>
                </div>
              )
            })}
          </div>
        )}
      </AdminCard>
      <Toast message={toast.message} type={toast.type} />
    </AdminLayout>
  )
}

export function AdminHeadlines() {
  var headlinesState = useState([]); var headlines = headlinesState[0]; var setHeadlines = headlinesState[1]
  var loadingState = useState(true); var loading = loadingState[0]; var setLoading = loadingState[1]
  var formState = useState({ title: '', source: '', category: '', url: '', is_breaking: false }); var form = formState[0]; var setForm = formState[1]
  var savingState = useState(false); var saving = savingState[0]; var setSaving = savingState[1]
  var notifyState = useState(false); var notify = notifyState[0]; var setNotify = notifyState[1]
  var toastState = useState({ message: '', type: '' }); var toast = toastState[0]; var setToast = toastState[1]

  function showToast(m, t) { setToast({ message: m, type: t || 'success' }); setTimeout(function() { setToast({ message: '', type: '' }) }, 3000) }

  async function load() {
    var res = await supabase.from('top_headlines').select('*').order('created_at', { ascending: false }).limit(20)
    if (res.data) setHeadlines(res.data)
    setLoading(false)
  }

  useEffect(function() { load() }, [])

  async function add() {
    if (!form.title || !form.source) { showToast('Title and source are required.', 'error'); return }
    setSaving(true)
    var result = await supabase.from('top_headlines').insert({
      title: form.title,
      source: form.source,
      category: form.category || 'General',
      url: form.url,
      is_breaking: form.is_breaking,
      active: true
    })
    if (result.error) { setSaving(false); showToast('Error: ' + result.error.message, 'error'); return }
    if (notify) { 
      var title = form.is_breaking ? 'BREAKING NEWS' : 'News Update'
      await sendNotificationToAllMembers(title, form.title, 'headline') 
    }
    setSaving(false)
    showToast(form.is_breaking ? 'Breaking news posted!' : 'Headline added!')
    setForm({ title: '', source: '', category: '', url: '', is_breaking: false })
    load()
  }

  async function remove(id) { await supabase.from('top_headlines').delete().eq('id', id); showToast('Removed.'); load() }

  return (
    <AdminLayout title="Breaking News">
      <AdminCard title="Add Breaking News or Headline">
        <Field label="Title"><TextInput value={form.title} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { title: v }) }) }} placeholder="Breaking: XRP ETF approved by SEC..." /></Field>
        <Field label="Source"><TextInput value={form.source} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { source: v }) }) }} placeholder="Reuters, Bloomberg, SEC..." /></Field>
        <Field label="Category"><TextInput value={form.category} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { category: v }) }) }} placeholder="Regulatory, Macro, ETF..." /></Field>
        <Field label="URL"><TextInput value={form.url} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { url: v }) }) }} placeholder="https://..." /></Field>
        <div className="flex items-center gap-3 mb-4 p-3 rounded-lg" style={{ background: form.is_breaking ? 'rgba(239,68,68,0.07)' : '#111318', border: '1px solid ' + (form.is_breaking ? 'rgba(239,68,68,0.2)' : '#1e2330') }}>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: form.is_breaking ? '#ef4444' : '#eceef5' }}>🚨 Breaking News</p>
            <p className="text-xs" style={{ color: form.is_breaking ? '#ef4444' : '#6b7a96' }}>Display prominently on dashboard</p>
          </div>
          <div onClick={function() { setForm(function(f) { return Object.assign({}, f, { is_breaking: !f.is_breaking }) }) }} className="w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-all" style={{ background: form.is_breaking ? '#ef4444' : '#1e2330' }}>
            <div className="w-4 h-4 rounded-full" style={{ background: '#fff', transform: form.is_breaking ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.15s' }} />
          </div>
        </div>
        <NotifyToggle enabled={notify} onToggle={function() { setNotify(!notify) }} />
        <SaveButton onClick={add} loading={saving} label={form.is_breaking ? "Post Breaking News" : "Add Headline"} />
      </AdminCard>
      <AdminCard title="Current Headlines">
        {loading ? <p style={{ color: '#6b7a96' }}>Loading...</p> : headlines.length === 0 ? <p style={{ color: '#6b7a96' }}>No headlines yet.</p> : (
          <div className="space-y-2">
            {headlines.map(function(h) {
              return (
                <div key={h.id} className="flex items-start justify-between gap-3 py-3 px-3 rounded-lg" style={{ background: h.is_breaking ? 'rgba(239,68,68,0.05)' : '#111318', border: '1px solid ' + (h.is_breaking ? 'rgba(239,68,68,0.2)' : '#1e2330') }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {h.is_breaking && <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>🚨 BREAKING</span>}
                      <span className="text-xs" style={{ color: '#6b7a96' }}>{h.category}</span>
                    </div>
                    <p className="text-sm font-medium mb-1" style={{ color: '#eceef5' }}>{h.title}</p>
                    <p className="text-xs" style={{ color: '#6b7a96' }}>{h.source} · {new Date(h.created_at).toLocaleDateString()}</p>
                  </div>
                  <button onClick={function() { remove(h.id) }} className="text-xs px-3 py-1 rounded" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>Remove</button>
                </div>
              )
            })}
          </div>
        )}
      </AdminCard>
      <Toast message={toast.message} type={toast.type} />
    </AdminLayout>
  )
}

export function AdminWatchlist() {
  var symbolsState = useState([]); var symbols = symbolsState[0]; var setSymbols = symbolsState[1]
  var loadingState = useState(true); var loading = loadingState[0]; var setLoading = loadingState[1]
  var symbolInputState = useState(''); var symbolInput = symbolInputState[0]; var setSymbolInput = symbolInputState[1]
  var savingState = useState(false); var saving = savingState[0]; var setSaving = savingState[1]
  var deletingState = useState(null); var deleting = deletingState[0]; var setDeleting = deletingState[1]
  var toastState = useState({ message: '', type: '' }); var toast = toastState[0]; var setToast = toastState[1]

  function showToast(m, t) { setToast({ message: m, type: t || 'success' }); setTimeout(function() { setToast({ message: '', type: '' }) }, 3000) }

  async function load() {
    var res = await supabase.from('master_watchlist').select('*').order('symbol')
    if (res.data) setSymbols(res.data)
    setLoading(false)
  }

  useEffect(function() { load() }, [])

  async function add() {
    var symbol = symbolInput.trim().toUpperCase()
    if (!symbol) { showToast('Symbol is required.', 'error'); return }
    if (symbols.find(function(s) { return s.symbol === symbol })) { showToast('Symbol already exists.', 'error'); return }
    
    setSaving(true)
    var result = await supabase.from('master_watchlist').insert({ symbol: symbol })
    setSaving(false)
    if (result.error) { showToast('Error: ' + result.error.message, 'error'); return }
    showToast('Symbol added!')
    setSymbolInput('')
    load()
  }

  async function remove(id, symbol) { 
    setDeleting(id)
    try {
      var result = await supabase.from('master_watchlist').delete().eq('id', id)
      if (result.error) { 
        showToast('Error: ' + result.error.message, 'error') 
      } else {
        showToast(symbol + ' removed!')
        load()
      }
    } catch(error) {
      showToast('Error removing symbol: ' + error.message, 'error')
    }
    setDeleting(null)
  }

  return (
    <AdminLayout title="Master Watchlist">
      <AdminCard title="Add Symbol">
        <Field label="Symbol">
          <TextInput 
            value={symbolInput} 
            onChange={setSymbolInput}
            placeholder="XRP, BTC, ETH, AVAX, etc." 
            onKeyPress={function(e) { if (e.key === 'Enter') add() }}
          />
        </Field>
        <SaveButton onClick={add} loading={saving} label="Add Symbol" />
      </AdminCard>
      <AdminCard title="Current Symbols">
        {loading ? <p style={{ color: '#6b7a96' }}>Loading symbols...</p> : symbols.length === 0 ? <p style={{ color: '#6b7a96' }}>No symbols in master watchlist yet.</p> : (
          <div className="space-y-3">
            {symbols.map(function(s) {
              return (
                <div key={s.id} className="flex items-center justify-between py-3 px-4 rounded-lg" style={{ background: '#111318', border: '1px solid #1e2330' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold px-3 py-2 rounded" style={{ background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>{s.symbol}</span>
                  </div>
                  <button 
                    onClick={function() { remove(s.id, s.symbol) }} 
                    disabled={deleting === s.id}
                    className="text-xs px-3 py-1.5 rounded font-medium transition-all hover:opacity-80" 
                    style={{ 
                      background: deleting === s.id ? 'rgba(107,122,150,0.1)' : 'rgba(239,68,68,0.1)', 
                      color: deleting === s.id ? '#6b7a96' : '#ef4444',
                      border: '1px solid ' + (deleting === s.id ? 'rgba(107,122,150,0.2)' : 'rgba(239,68,68,0.2)'),
                      cursor: deleting === s.id ? 'not-allowed' : 'pointer',
                      opacity: deleting === s.id ? 0.6 : 1
                    }}
                  >
                    {deleting === s.id ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </AdminCard>
      <Toast message={toast.message} type={toast.type} />
    </AdminLayout>
  )
}

export function AdminChatter() {
  var postsState = useState([]); var posts = postsState[0]; var setPosts = postsState[1]
  var loadingState = useState(true); var loading = loadingState[0]; var setLoading = loadingState[1]
  var savingState = useState(false); var saving = savingState[0]; var setSaving = savingState[1]
  var notifyState = useState(false); var notify = notifyState[0]; var setNotify = notifyState[1]
  var toastState = useState({ message: '', type: '' }); var toast = toastState[0]; var setToast = toastState[1]
  var formState = useState({ content: '', category: 'General', source: '', source_url: '' })
  var form = formState[0]; var setForm = formState[1]

  function showToast(m, t) { setToast({ message: m, type: t || 'success' }); setTimeout(function() { setToast({ message: '', type: '' }) }, 3000) }

  async function load() {
    var res = await supabase.from('market_news').select('*').order('created_at', { ascending: false }).limit(50)
    if (res.data) setPosts(res.data)
    setLoading(false)
  }

  useEffect(function() { load() }, [])

  async function post() {
    if (!form.content) { showToast('Content is required.', 'error'); return }
    setSaving(true)
    var result = await supabase.from('market_chatter').insert({
      content: form.content,
      category: form.category,
      source: form.source,
      source_url: form.source_url,
      flagged: false,
      fire_count: 0,
      thinking_count: 0,
      bullish_count: 0,
      warning_count: 0
    })
    if (result.error) { setSaving(false); showToast('Error: ' + result.error.message, 'error'); return }
    if (notify) { await sendNotificationToAllMembers('Market Chatter', form.content.slice(0, 80) + (form.content.length > 80 ? '...' : ''), 'market_chatter') }
    setSaving(false)
    showToast('Posted!')
    setForm({ content: '', category: 'General', source: '', source_url: '' })
    load()
  }

  async function remove(id) {
    await supabase.from('market_chatter').delete().eq('id', id)
    showToast('Post removed.')
    load()
  }

  return (
    <AdminLayout title="Market Chatter">
      <AdminCard title="Post New Chatter">
        <Field label="Content">
          <TextArea value={form.content} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { content: v }) }) }} placeholder="BlackRock internal memo allegedly references XRP ETF timeline — circulating on X, unverified..." rows={4} />
        </Field>
        <Field label="Category">
          <select value={form.category} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { category: e.target.value }) }) }} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}>
            <option value="ETF Rumor">ETF Rumor</option>
            <option value="Ripple Rumor">Ripple Rumor</option>
            <option value="XRP Rumor">XRP Rumor</option>
            <option value="Regulatory">Regulatory</option>
            <option value="Exchange">Exchange</option>
            <option value="Macro">Macro</option>
            <option value="Social Buzz">Social Buzz</option>
            <option value="General">General</option>
          </select>
        </Field>
        <Field label="Source (e.g. X / Twitter, Telegram)">
          <TextInput value={form.source} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { source: v }) }) }} placeholder="X / Twitter" />
        </Field>
        <Field label="Source URL (optional)">
          <TextInput value={form.source_url} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { source_url: v }) }) }} placeholder="https://x.com/..." />
        </Field>
        <NotifyToggle enabled={notify} onToggle={function() { setNotify(!notify) }} />
        <SaveButton onClick={post} loading={saving} label="Post" />
      </AdminCard>
      <AdminCard title="Current Posts">
        {loading ? <p style={{ color: '#6b7a96' }}>Loading...</p> : posts.length === 0 ? <p style={{ color: '#6b7a96' }}>No posts yet.</p> : (
          <div className="space-y-3">
            {posts.map(function(p) {
              return (
                <div key={p.id} className="rounded-lg p-4" style={{ background: '#111318', border: '1px solid #1e2330' }}>
                  <div className="flex items-center gap-2 mb-2">
                    {p.category && <span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}>{p.category}</span>}
                    {p.source && <span className="text-xs" style={{ color: '#3b82f6' }}>{p.source}</span>}
                    <span className="text-xs ml-auto" style={{ color: '#6b7a96' }}>{new Date(p.created_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm mb-3" style={{ color: '#eceef5' }}>{p.content}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: '#6b7a96' }}>🔥 {p.fire_count || 0} · 🤔 {p.thinking_count || 0} · 📈 {p.bullish_count || 0} · ⚠️ {p.warning_count || 0}</span>
                    <button onClick={function() { remove(p.id) }} className="text-xs px-3 py-1 rounded ml-auto" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>Remove</button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </AdminCard>
      <Toast message={toast.message} type={toast.type} />
    </AdminLayout>
  )
}

export function AdminETFFlows() {
  var etfsState = useState([]); var etfs = etfsState[0]; var setEtfs = etfsState[1]
  var loadingState = useState(true); var loading = loadingState[0]; var setLoading = loadingState[1]
  var savingState = useState(null); var saving = savingState[0]; var setSaving = savingState[1]
  var notifyState = useState(false); var notify = notifyState[0]; var setNotify = notifyState[1]
  var toastState = useState({ message: '', type: '' }); var toast = toastState[0]; var setToast = toastState[1]

  function showToast(m, t) { setToast({ message: m, type: t || 'success' }); setTimeout(function() { setToast({ message: '', type: '' }) }, 3000) }

  useEffect(function() {
    supabase.from('xrp_etf_flows').select('*').order('etf_name').then(function(res) {
      if (res.data) setEtfs(res.data)
      setLoading(false)
    })
  }, [])

  function updateField(id, field, value) {
    setEtfs(function(prev) {
      return prev.map(function(e) {
        if (e.id === id) { var u = Object.assign({}, e); u[field] = value; return u }
        return e
      })
    })
  }

  async function save(etf) {
    setSaving(etf.id)
    var result = await supabase.from('xrp_etf_flows').update({
      aum: parseFloat(etf.aum) || 0,
      xrp_holdings: parseFloat(etf.xrp_holdings) || 0,
      flow_24h: parseFloat(etf.flow_24h) || 0,
      flow_7d: parseFloat(etf.flow_7d) || 0,
      flow_30d: parseFloat(etf.flow_30d) || 0,
      price_change: parseFloat(etf.price_change) || 0,
      status: etf.status,
      date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString()
    }).eq('id', etf.id)
    if (result.error) { setSaving(null); showToast('Error: ' + result.error.message, 'error'); return }
    if (notify) { await sendNotificationToAllMembers('ETF Flow Update', etf.etf_name + ' data has been updated.', 'etf_flows') }
    setSaving(null)
    showToast(etf.etf_name + ' saved!')
  }

  return (
    <AdminLayout title="XRP ETF Flows">
      <div className="rounded-lg px-4 py-3 mb-4 text-sm" style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)', color: '#9aa8be' }}>
        Update each ETF's numbers below. Check SoSoValue.com for the latest flow data. All dollar amounts in full numbers (e.g. 1240000000 for $1.24B).
      </div>
      <NotifyToggle enabled={notify} onToggle={function() { setNotify(!notify) }} />
      {loading ? <p style={{ color: '#6b7a96' }}>Loading ETFs...</p> : etfs.map(function(etf) {
        return (
          <AdminCard key={etf.id} title={etf.etf_name + ' (' + etf.ticker + ')'}>
            <div className="grid grid-cols-2 gap-4">
              <Field label="AUM (USD)"><TextInput value={String(etf.aum || '')} onChange={function(v) { updateField(etf.id, 'aum', v) }} placeholder="1240000000" /></Field>
              <Field label="XRP Holdings"><TextInput value={String(etf.xrp_holdings || '')} onChange={function(v) { updateField(etf.id, 'xrp_holdings', v) }} placeholder="536900000" /></Field>
              <Field label="Net Flow 24h (USD)"><TextInput value={String(etf.flow_24h || '')} onChange={function(v) { updateField(etf.id, 'flow_24h', v) }} placeholder="42000000 or -8000000" /></Field>
              <Field label="Net Flow 7d (USD)"><TextInput value={String(etf.flow_7d || '')} onChange={function(v) { updateField(etf.id, 'flow_7d', v) }} placeholder="187000000" /></Field>
              <Field label="Net Flow 30d (USD)"><TextInput value={String(etf.flow_30d || '')} onChange={function(v) { updateField(etf.id, 'flow_30d', v) }} placeholder="412000000" /></Field>
              <Field label="Price Change %"><TextInput value={String(etf.price_change || '')} onChange={function(v) { updateField(etf.id, 'price_change', v) }} placeholder="3.4 or -1.2" /></Field>
            </div>
            <Field label="Status">
              <select value={etf.status || 'active'} onChange={function(e) { updateField(etf.id, 'status', e.target.value) }} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </Field>
            <SaveButton onClick={function() { save(etf) }} loading={saving === etf.id} label="Save" />
          </AdminCard>
        )
      })}
      <Toast message={toast.message} type={toast.type} />
    </AdminLayout>
  )
}

export function AdminYouTube() {
  var channelsState = useState([]); var channels = channelsState[0]; var setChannels = channelsState[1]
  var loadingState = useState(true); var loading = loadingState[0]; var setLoading = loadingState[1]
  var savingState = useState(false); var saving = savingState[0]; var setSaving = savingState[1]
  var fetchingState = useState(false); var fetching = fetchingState[0]; var setFetching = fetchingState[1]
  var toastState = useState({ message: '', type: '' }); var toast = toastState[0]; var setToast = toastState[1]
  var formState = useState({ channel_handle: '', channel_name: '', sort_order: 0 }); var form = formState[0]; var setForm = formState[1]

  function showToast(m, t) { setToast({ message: m, type: t || 'success' }); setTimeout(function() { setToast({ message: '', type: '' }) }, 3000) }

  async function load() {
    var res = await supabase.from('youtube_channels').select('*').order('sort_order', { ascending: true })
    if (res.data) setChannels(res.data)
    setLoading(false)
  }

  useEffect(function() { load() }, [])

  async function add() {
    if (!form.channel_handle || !form.channel_name) { showToast('Handle and name are required.', 'error'); return }
    if (channels.length >= 4) { showToast('Maximum 4 channels allowed.', 'error'); return }
    var handle = form.channel_handle.startsWith('@') ? form.channel_handle : '@' + form.channel_handle
    setSaving(true)
    var result = await supabase.from('youtube_channels').insert({ channel_handle: handle, channel_name: form.channel_name, sort_order: form.sort_order, active: true })
    setSaving(false)
    if (result.error) { showToast('Error: ' + result.error.message, 'error'); return }
    showToast('Channel added!')
    setForm({ channel_handle: '', channel_name: '', sort_order: 0 })
    load()
  }

  async function remove(id) {
    await supabase.from('youtube_channels').delete().eq('id', id)
    showToast('Channel removed.')
    load()
  }

  async function fetchNow() {
    setFetching(true)
    try {
      var res = await fetch('https://oubwxjhvqjlaxscqbutl.supabase.co/functions/v1/fetch-youtube-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + import.meta.env.VITE_SUPABASE_ANON_KEY },
        body: JSON.stringify({})
      })
      var data = await res.json()
      if (!res.ok) { showToast('Fetch error: ' + (data.error || 'Unknown error'), 'error') } else { showToast('Videos refreshed! Fetched ' + (data.videos_fetched || 0) + ' videos.') }
    } catch(e) {
      showToast('Fetch failed: ' + e.message, 'error')
    }
    setFetching(false)
  }

  return (
    <AdminLayout title="YouTube Intel">
      <div className="rounded-lg px-4 py-3 mb-6 text-sm" style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)', color: '#9aa8be' }}>
        Add up to 4 YouTube channels. Videos refresh automatically every hour (7AM–9PM CT) and every 3 hours overnight. All members see the same channels.
      </div>
      <AdminCard title="Add Channel">
        <Field label="Channel Handle (e.g. @JakeClaver)"><TextInput value={form.channel_handle} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { channel_handle: v }) }) }} placeholder="@JakeClaver" /></Field>
        <Field label="Display Name"><TextInput value={form.channel_name} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { channel_name: v }) }) }} placeholder="Jake Claver" /></Field>
        <Field label="Sort Order"><TextInput value={String(form.sort_order)} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { sort_order: parseInt(v) || 0 }) }) }} placeholder="0" /></Field>
        <SaveButton onClick={add} loading={saving} label="Add Channel" />
      </AdminCard>
      <AdminCard title={'Active Channels (' + channels.length + '/4)'}>
        {loading ? <p style={{ color: '#6b7a96' }}>Loading...</p> : channels.length === 0 ? <p style={{ color: '#6b7a96' }}>No channels added yet.</p> : (
          <div className="space-y-2 mb-4">
            {channels.map(function(ch) {
              return (
                <div key={ch.id} className="flex items-center justify-between gap-3 p-3 rounded-lg" style={{ background: '#111318', border: '1px solid #1e2330' }}>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#eceef5' }}>{ch.channel_name}</p>
                    <p className="text-xs" style={{ color: '#6b7a96' }}>{ch.channel_handle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={'https://youtube.com/' + ch.channel_handle} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded" style={{ color: '#6b7a96' }}><ExternalLink size={13} /></a>
                    <button onClick={function() { remove(ch.id) }} className="p-1.5 rounded" style={{ color: '#ef4444' }}><Trash2 size={13} /></button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        <button onClick={fetchNow} disabled={fetching} className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: fetching ? '#1e2330' : 'rgba(16,185,129,0.12)', color: fetching ? '#6b7a96' : '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
          {fetching ? 'Fetching...' : '⟳ Fetch Videos Now'}
        </button>
      </AdminCard>
      <Toast message={toast.message} type={toast.type} />
    </AdminLayout>
  )
}

export function AdminSmartMoney() {
  var observationsState = useState([]); var observations = observationsState[0]; var setObservations = observationsState[1]
  var loadingState = useState(true); var loading = loadingState[0]; var setLoading = loadingState[1]
  var savingState = useState(false); var saving = savingState[0]; var setSaving = savingState[1]
  var notifyState = useState(false); var notify = notifyState[0]; var setNotify = notifyState[1]
  var toastState = useState({ message: '', type: '' }); var toast = toastState[0]; var setToast = toastState[1]
  var formState = useState({ type: 'whale_alert', content: '', source: '' }); var form = formState[0]; var setForm = formState[1]
  var escrowState = useState({ total_locked: '', next_unlock: '', unlock_frequency: '', remaining_period: '' }); var escrow = escrowState[0]; var setEscrow = escrowState[1]
  var escrowIdState = useState(null); var escrowId = escrowIdState[0]; var setEscrowId = escrowIdState[1]
  var savingEscrowState = useState(false); var savingEscrow = savingEscrowState[0]; var setSavingEscrow = savingEscrowState[1]

  function showToast(m, t) { setToast({ message: m, type: t || 'success' }); setTimeout(function() { setToast({ message: '', type: '' }) }, 3000) }

  async function load() {
    var o = await supabase.from('smart_money_observations').select('*').order('created_at', { ascending: false }).limit(20)
    if (o.data) setObservations(o.data)
    var e = await supabase.from('escrow_data').select('*').single()
    if (e.data) { setEscrow({ total_locked: e.data.total_locked, next_unlock: e.data.next_unlock, unlock_frequency: e.data.unlock_frequency, remaining_period: e.data.remaining_period }); setEscrowId(e.data.id) }
    setLoading(false)
  }

  useEffect(function() { load() }, [])

  async function addObservation() {
    if (!form.content) { showToast('Content is required.', 'error'); return }
    setSaving(true)
    var result = await supabase.from('smart_money_observations').insert({ type: form.type, content: form.content, source: form.source })
    if (result.error) { setSaving(false); showToast('Error: ' + result.error.message, 'error'); return }
    if (notify) {
      var title = form.type === 'whale_alert' ? 'Whale Alert' : 'Exchange Flow Update'
      await sendNotificationToAllMembers(title, form.content, 'smart_money')
    }
    setSaving(false)
    showToast('Posted!')
    setForm({ type: 'whale_alert', content: '', source: '' })
    load()
  }

  async function removeObservation(id) {
    await supabase.from('smart_money_observations').delete().eq('id', id)
    showToast('Removed.')
    load()
  }

  async function saveEscrow() {
    setSavingEscrow(true)
    var result = await supabase.from('escrow_data').update({ total_locked: escrow.total_locked, next_unlock: escrow.next_unlock, unlock_frequency: escrow.unlock_frequency, remaining_period: escrow.remaining_period, updated_at: new Date().toISOString() }).eq('id', escrowId)
    setSavingEscrow(false)
    if (result.error) { showToast('Error: ' + result.error.message, 'error'); return }
    showToast('Escrow data saved!')
  }

  return (
    <AdminLayout title="Smart Money Flow">
      <AdminCard title="Post Whale Alert or Exchange Flow Note">
        <Field label="Type">
          <select value={form.type} onChange={function(e) { setForm(function(f) { return Object.assign({}, f, { type: e.target.value }) }) }} className="w-full px-3 py-2.5 rounded-lg text-sm outline-none" style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}>
            <option value="whale_alert">Whale Alert</option>
            <option value="exchange_flow">Exchange Flow Note</option>
          </select>
        </Field>
        <Field label="Content"><TextArea value={form.content} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { content: v }) }) }} placeholder="85M XRP moved from unknown wallet to Bitstamp — potential sell pressure..." rows={3} /></Field>
        <Field label="Source (optional)"><TextInput value={form.source} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { source: v }) }) }} placeholder="Whale Alert, XRP Scan, Bithomp..." /></Field>
        <NotifyToggle enabled={notify} onToggle={function() { setNotify(!notify) }} />
        <SaveButton onClick={addObservation} loading={saving} label="Post" />
      </AdminCard>
      <AdminCard title="Current Observations">
        {loading ? <p style={{ color: '#6b7a96' }}>Loading...</p> : observations.length === 0 ? <p style={{ color: '#6b7a96' }}>No observations posted yet.</p> : (
          <div className="space-y-2">
            {observations.map(function(o) {
              return (
                <div key={o.id} className="flex items-start justify-between gap-3 py-2" style={{ borderBottom: '1px solid #1e2330' }}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ background: o.type === 'whale_alert' ? 'rgba(139,92,246,0.12)' : 'rgba(59,130,246,0.12)', color: o.type === 'whale_alert' ? '#8b5cf6' : '#3b82f6' }}>{o.type === 'whale_alert' ? 'Whale Alert' : 'Exchange Flow'}</span>
                      {o.source && <span className="text-xs" style={{ color: '#3b82f6' }}>{o.source}</span>}
                    </div>
                    <p className="text-sm" style={{ color: '#eceef5' }}>{o.content}</p>
                  </div>
                  <button onClick={function() { removeObservation(o.id) }} className="text-xs px-3 py-1 rounded flex-shrink-0" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>Remove</button>
                </div>
              )
            })}
          </div>
        )}
      </AdminCard>
      <AdminCard title="Escrow & Unlock Schedule">
        <div className="rounded-lg px-4 py-3 mb-4 text-xs" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)', color: '#9aa8be' }}>
          Update these numbers monthly when Ripple publishes their quarterly XRP markets report.
        </div>
        <Field label="Total Escrow Locked"><TextInput value={escrow.total_locked} onChange={function(v) { setEscrow(function(e) { return Object.assign({}, e, { total_locked: v }) }) }} placeholder="~38B XRP" /></Field>
        <Field label="Next Monthly Unlock"><TextInput value={escrow.next_unlock} onChange={function(v) { setEscrow(function(e) { return Object.assign({}, e, { next_unlock: v }) }) }} placeholder="1B XRP" /></Field>
        <Field label="Unlock Frequency"><TextInput value={escrow.unlock_frequency} onChange={function(v) { setEscrow(function(e) { return Object.assign({}, e, { unlock_frequency: v }) }) }} placeholder="Monthly (1st)" /></Field>
        <Field label="Remaining Escrow Period"><TextInput value={escrow.remaining_period} onChange={function(v) { setEscrow(function(e) { return Object.assign({}, e, { remaining_period: v }) }) }} placeholder="~38 months" /></Field>
        <SaveButton onClick={saveEscrow} loading={savingEscrow} label="Save Escrow Data" />
      </AdminCard>
      <Toast message={toast.message} type={toast.type} />
    </AdminLayout>
  )
}

export function AdminUpdates() { return <AdminDailyWrap /> }
