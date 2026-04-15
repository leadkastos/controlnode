import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection, DataRow } from '../components/DetailPageLayout'
import { Badge } from '../components/UI'
import { Youtube, Plus, Trash2, ExternalLink } from 'lucide-react'
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

function YouTubeSection() {
  const [channels, setChannels] = useState([
    { id: 1, url: 'https://youtube.com/@EgragCrypto', name: 'EgragCrypto' },
    { id: 2, url: 'https://youtube.com/@darkdefender', name: 'darkdefender' },
  ])
  const [newUrl, setNewUrl] = useState('')
  const [error, setError] = useState('')
  const MAX = 4

  function addChannel() {
    if (!newUrl.trim()) return
    if (channels.length >= MAX) { setError('Maximum of ' + MAX + ' channels allowed.'); return }
    if (!newUrl.includes('youtube.com') && !newUrl.includes('youtu.be')) { setError('Please enter a valid YouTube channel URL.'); return }
    var name = newUrl.split('@')[1]?.split('/')[0] || newUrl
    setChannels([...channels, { id: Date.now(), url: newUrl.trim(), name }])
    setNewUrl(''); setError('')
  }

  return (
    <DetailSection title="YouTube Intel — Channel Settings">
      <div className="space-y-2 mb-4">
        {channels.map(function(ch) {
          return (
            <div key={ch.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ background: '#111318', border: '1px solid #1e2330' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(239,68,68,0.15)' }}><Youtube size={14} style={{ color: '#ef4444' }} /></div>
              <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate" style={{ color: '#eceef5' }}>@{ch.name}</p></div>
              <a href={ch.url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded" style={{ color: '#6b7a96' }}><ExternalLink size={13} /></a>
              <button onClick={function() { setChannels(channels.filter(function(c) { return c.id !== ch.id })) }} className="p-1.5 rounded hover:bg-red-500/10" style={{ color: '#6b7a96' }}><Trash2 size={13} /></button>
            </div>
          )
        })}
      </div>
      {channels.length < MAX && (
        <div className="flex gap-2">
          <input type="text" value={newUrl} onChange={function(e) { setNewUrl(e.target.value); setError('') }} placeholder="https://youtube.com/@channelname" className="flex-1 px-3 py-2.5 rounded-lg text-sm outline-none" style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }} onFocus={function(e) { e.target.style.borderColor = '#3b82f6' }} onBlur={function(e) { e.target.style.borderColor = '#1e2330' }} onKeyDown={function(e) { if (e.key === 'Enter') addChannel() }} />
          <button onClick={addChannel} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium" style={{ background: '#3b82f6', color: '#fff' }}><Plus size={14} />Add</button>
        </div>
      )}
      {error && <p className="text-xs mt-2" style={{ color: '#ef4444' }}>{error}</p>}
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

export function Admin() {
  return (
    <AdminLayout title="Admin Panel">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { href: '/admin/morning-brief', title: 'Morning Brief', desc: 'Publish the morning brief' },
          { href: '/admin/daily-wrap', title: 'Daily Wrap', desc: 'Publish the daily wrap' },
          { href: '/admin/domino-theory', title: 'Domino Theory', desc: 'Update domino statuses and notes' },
          { href: '/admin/geopolitical-watch', title: 'Geopolitical Watch', desc: 'Update flash points and weekly watch' },
          { href: '/admin/oil-yen', title: 'Oil vs Yen', desc: 'Update macro scenarios to monitor' },
          { href: '/admin/headlines', title: 'Top Headlines', desc: 'Manage headline feed' },
          { href: '/admin/watchlist', title: 'Master Watchlist', desc: 'Manage suggested symbols' },
          { href: '/admin/chatter', title: 'Market Chatter', desc: 'Moderate member posts' },
          { href: '/admin/etf-flows', title: 'XRP ETF Flows', desc: 'Update ETF data and flow numbers' },
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

export function AdminMorningBrief() {
  var dateState = useState(''); var date = dateState[0]; var setDate = dateState[1]
  var headlineState = useState(''); var headline = headlineState[0]; var setHeadline = headlineState[1]
  var summaryState = useState(''); var summary = summaryState[0]; var setSummary = summaryState[1]
  var catalystsState = useState(''); var catalysts = catalystsState[0]; var setCatalysts = catalystsState[1]
  var loadingState = useState(false); var loading = loadingState[0]; var setLoading = loadingState[1]
  var toastState = useState({ message: '', type: '' }); var toast = toastState[0]; var setToast = toastState[1]

  function showToast(m, t) { setToast({ message: m, type: t || 'success' }); setTimeout(function() { setToast({ message: '', type: '' }) }, 3000) }

  async function publish() {
    if (!date || !headline || !summary) { showToast('Date, headline, and summary are required.', 'error'); return }
    setLoading(true)
    var result = await supabase.from('morning_briefs').insert({ date: date, headline: headline, summary: summary, catalysts: catalysts.split('\n').map(function(c) { return c.trim() }).filter(Boolean), published: true })
    setLoading(false)
    if (result.error) { showToast('Error: ' + result.error.message, 'error'); return }
    showToast('Morning Brief published!'); setDate(''); setHeadline(''); setSummary(''); setCatalysts('')
  }

  return (
    <AdminLayout title="Morning Brief">
      <AdminCard title="Publish New Morning Brief">
        <Field label="Date"><TextInput value={date} onChange={setDate} placeholder="Monday, April 7, 2026" /></Field>
        <Field label="Headline"><TextInput value={headline} onChange={setHeadline} placeholder="Brief headline..." /></Field>
        <Field label="Summary"><TextArea value={summary} onChange={setSummary} placeholder="Summary paragraph..." rows={5} /></Field>
        <Field label="Catalysts (one per line)"><TextArea value={catalysts} onChange={setCatalysts} placeholder="Catalyst one" rows={4} /></Field>
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
  var toastState = useState({ message: '', type: '' }); var toast = toastState[0]; var setToast = toastState[1]

  function showToast(m, t) { setToast({ message: m, type: t || 'success' }); setTimeout(function() { setToast({ message: '', type: '' }) }, 3000) }

  async function publish() {
    if (!date || !headline || !summary) { showToast('Date, headline, and summary are required.', 'error'); return }
    setLoading(true)
    var result = await supabase.from('daily_wraps').insert({ date: date, headline: headline, summary: summary, catalysts: catalysts.split('\n').map(function(c) { return c.trim() }).filter(Boolean), published: true })
    setLoading(false)
    if (result.error) { showToast('Error: ' + result.error.message, 'error'); return }
    showToast('Daily Wrap published!'); setDate(''); setHeadline(''); setSummary(''); setCatalysts('')
  }

  return (
    <AdminLayout title="Daily Wrap">
      <AdminCard title="Publish New Daily Wrap">
        <Field label="Date"><TextInput value={date} onChange={setDate} placeholder="Monday, April 7, 2026" /></Field>
        <Field label="Headline"><TextInput value={headline} onChange={setHeadline} placeholder="Wrap headline..." /></Field>
        <Field label="Summary"><TextArea value={summary} onChange={setSummary} placeholder="Summary paragraph..." rows={5} /></Field>
        <Field label="Catalysts (one per line)"><TextArea value={catalysts} onChange={setCatalysts} placeholder="Catalyst one" rows={4} /></Field>
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
    setSaving(null)
    if (result.error) { showToast('Error: ' + result.error.message, 'error'); return }
    showToast(domino.domino_name + ' saved!')
  }

  return (
    <AdminLayout title="Domino Theory">
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
    setSaving(false)
    if (result.error) { showToast('Error: ' + result.error.message, 'error'); return }
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
    setSaving(false)
    if (result.error) { showToast('Error: ' + result.error.message, 'error'); return }
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
  var formState = useState({ headline: '', source: '', category: '', url: '' }); var form = formState[0]; var setForm = formState[1]
  var savingState = useState(false); var saving = savingState[0]; var setSaving = savingState[1]
  var toastState = useState({ message: '', type: '' }); var toast = toastState[0]; var setToast = toastState[1]

  function showToast(m, t) { setToast({ message: m, type: t || 'success' }); setTimeout(function() { setToast({ message: '', type: '' }) }, 3000) }

  async function load() {
    var res = await supabase.from('top_headlines').select('*').order('created_at', { ascending: false }).limit(20)
    if (res.data) setHeadlines(res.data)
    setLoading(false)
  }

  useEffect(function() { load() }, [])

  async function add() {
    if (!form.headline || !form.source) { showToast('Headline and source are required.', 'error'); return }
    setSaving(true)
    var result = await supabase.from('top_headlines').insert(form)
    setSaving(false)
    if (result.error) { showToast('Error: ' + result.error.message, 'error'); return }
    showToast('Headline added!')
    setForm({ headline: '', source: '', category: '', url: '' })
    load()
  }

  async function remove(id) { await supabase.from('top_headlines').delete().eq('id', id); showToast('Removed.'); load() }

  return (
    <AdminLayout title="Top Headlines">
      <AdminCard title="Add Headline">
        <Field label="Headline"><TextInput value={form.headline} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { headline: v }) }) }} placeholder="Headline text..." /></Field>
        <Field label="Source"><TextInput value={form.source} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { source: v }) }) }} placeholder="Reuters, Bloomberg..." /></Field>
        <Field label="Category"><TextInput value={form.category} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { category: v }) }) }} placeholder="Regulatory, Macro, ETF..." /></Field>
        <Field label="URL"><TextInput value={form.url} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { url: v }) }) }} placeholder="https://..." /></Field>
        <SaveButton onClick={add} loading={saving} label="Add Headline" />
      </AdminCard>
      <AdminCard title="Current Headlines">
        {loading ? <p style={{ color: '#6b7a96' }}>Loading...</p> : headlines.length === 0 ? <p style={{ color: '#6b7a96' }}>No headlines yet.</p> : (
          <div className="space-y-2">
            {headlines.map(function(h) {
              return (
                <div key={h.id} className="flex items-start justify-between gap-3 py-2" style={{ borderBottom: '1px solid #1e2330' }}>
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium" style={{ color: '#eceef5' }}>{h.headline}</p><p className="text-xs mt-0.5" style={{ color: '#6b7a96' }}>{h.source} · {h.category}</p></div>
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
  var formState = useState({ symbol: '', name: '', category: '' }); var form = formState[0]; var setForm = formState[1]
  var savingState = useState(false); var saving = savingState[0]; var setSaving = savingState[1]
  var toastState = useState({ message: '', type: '' }); var toast = toastState[0]; var setToast = toastState[1]

  function showToast(m, t) { setToast({ message: m, type: t || 'success' }); setTimeout(function() { setToast({ message: '', type: '' }) }, 3000) }

  async function load() {
    var res = await supabase.from('master_watchlist').select('*').order('symbol')
    if (res.data) setSymbols(res.data)
    setLoading(false)
  }

  useEffect(function() { load() }, [])

  async function add() {
    if (!form.symbol) { showToast('Symbol is required.', 'error'); return }
    setSaving(true)
    var result = await supabase.from('master_watchlist').insert(Object.assign({}, form, { symbol: form.symbol.toUpperCase() }))
    setSaving(false)
    if (result.error) { showToast('Error: ' + result.error.message, 'error'); return }
    showToast('Symbol added!')
    setForm({ symbol: '', name: '', category: '' })
    load()
  }

  async function remove(id) { await supabase.from('master_watchlist').delete().eq('id', id); showToast('Removed.'); load() }

  return (
    <AdminLayout title="Master Watchlist">
      <AdminCard title="Add Symbol">
        <Field label="Symbol"><TextInput value={form.symbol} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { symbol: v }) }) }} placeholder="XRP" /></Field>
        <Field label="Name"><TextInput value={form.name} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { name: v }) }) }} placeholder="XRP / USD" /></Field>
        <Field label="Category"><TextInput value={form.category} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { category: v }) }) }} placeholder="Crypto, Forex, Commodity..." /></Field>
        <SaveButton onClick={add} loading={saving} label="Add Symbol" />
      </AdminCard>
      <AdminCard title="Current Symbols">
        {loading ? <p style={{ color: '#6b7a96' }}>Loading...</p> : symbols.length === 0 ? <p style={{ color: '#6b7a96' }}>No symbols yet.</p> : (
          <div className="space-y-2">
            {symbols.map(function(s) {
              return (
                <div key={s.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #1e2330' }}>
                  <div><span className="text-sm font-bold mr-2" style={{ color: '#3b82f6' }}>{s.symbol}</span><span className="text-sm" style={{ color: '#eceef5' }}>{s.name}</span><span className="text-xs ml-2" style={{ color: '#6b7a96' }}>{s.category}</span></div>
                  <button onClick={function() { remove(s.id) }} className="text-xs px-3 py-1 rounded" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>Remove</button>
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
  var toastState = useState({ message: '', type: '' }); var toast = toastState[0]; var setToast = toastState[1]

  function showToast(m, t) { setToast({ message: m, type: t || 'success' }); setTimeout(function() { setToast({ message: '', type: '' }) }, 3000) }

  async function load() {
    var res = await supabase.from('market_chatter').select('*').order('created_at', { ascending: false }).limit(50)
    if (res.data) setPosts(res.data)
    setLoading(false)
  }

  useEffect(function() { load() }, [])

  return (
    <AdminLayout title="Market Chatter Moderation">
      <AdminCard title="Recent Posts">
        {loading ? <p style={{ color: '#6b7a96' }}>Loading...</p> : posts.length === 0 ? <p style={{ color: '#6b7a96' }}>No posts yet.</p> : (
          <div className="space-y-3">
            {posts.map(function(p) {
              return (
                <div key={p.id} className="rounded-lg p-4" style={{ background: '#111318', border: '1px solid ' + (p.flagged ? 'rgba(239,68,68,0.3)' : '#1e2330') }}>
                  <p className="text-xs mb-1" style={{ color: '#6b7a96' }}>{p.user_id} · {new Date(p.created_at).toLocaleString()}</p>
                  <p className="text-sm mb-2" style={{ color: '#eceef5' }}>{p.content}</p>
                  {p.flagged && <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>Flagged</span>}
                  <div className="flex gap-2 flex-wrap mt-2">
                    <button onClick={async function() { await supabase.from('market_chatter').update({ flagged: true }).eq('id', p.id); showToast('Warning issued.'); load() }} className="text-xs px-3 py-1.5 rounded" style={{ background: 'rgba(234,179,8,0.1)', color: '#eab308' }}>Warn</button>
                    <button onClick={async function() { await supabase.from('market_chatter').delete().eq('id', p.id); showToast('Post removed.'); load() }} className="text-xs px-3 py-1.5 rounded" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>Remove Post</button>
                    <button onClick={async function() { await supabase.from('profiles').update({ is_banned: true }).eq('id', p.user_id); showToast('User banned.'); load() }} className="text-xs px-3 py-1.5 rounded" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>Ban User</button>
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
    setSaving(null)
    if (result.error) { showToast('Error: ' + result.error.message, 'error'); return }
    showToast(etf.etf_name + ' saved!')
  }

  return (
    <AdminLayout title="XRP ETF Flows">
      <div className="rounded-lg px-4 py-3 mb-6 text-sm" style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)', color: '#9aa8be' }}>
        Update each ETF's numbers below. Check SoSoValue.com for the latest flow data. All dollar amounts in full numbers (e.g. 1240000000 for $1.24B).
      </div>
      {loading ? <p style={{ color: '#6b7a96' }}>Loading ETFs...</p> : etfs.map(function(etf) {
        return (
          <AdminCard key={etf.id} title={etf.etf_name + ' (' + etf.ticker + ')'}>
            <div className="grid grid-cols-2 gap-4">
              <Field label="AUM (USD)">
                <TextInput value={String(etf.aum || '')} onChange={function(v) { updateField(etf.id, 'aum', v) }} placeholder="1240000000" />
              </Field>
              <Field label="XRP Holdings">
                <TextInput value={String(etf.xrp_holdings || '')} onChange={function(v) { updateField(etf.id, 'xrp_holdings', v) }} placeholder="536900000" />
              </Field>
              <Field label="Net Flow 24h (USD)">
                <TextInput value={String(etf.flow_24h || '')} onChange={function(v) { updateField(etf.id, 'flow_24h', v) }} placeholder="42000000 or -8000000" />
              </Field>
              <Field label="Net Flow 7d (USD)">
                <TextInput value={String(etf.flow_7d || '')} onChange={function(v) { updateField(etf.id, 'flow_7d', v) }} placeholder="187000000" />
              </Field>
              <Field label="Net Flow 30d (USD)">
                <TextInput value={String(etf.flow_30d || '')} onChange={function(v) { updateField(etf.id, 'flow_30d', v) }} placeholder="412000000" />
              </Field>
              <Field label="Price Change %">
                <TextInput value={String(etf.price_change || '')} onChange={function(v) { updateField(etf.id, 'price_change', v) }} placeholder="3.4 or -1.2" />
              </Field>
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

export function AdminUpdates() { return <AdminDailyWrap /> }
