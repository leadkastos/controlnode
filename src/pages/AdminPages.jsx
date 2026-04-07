import React, { useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import { supabase } from '../lib/supabase'

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

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
      style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}
      onFocus={e => e.target.style.borderColor = '#3b82f6'}
      onBlur={e => e.target.style.borderColor = '#1e2330'}
    />
  )
}

function TextArea({ value, onChange, placeholder, rows = 5 }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
      style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}
      onFocus={e => e.target.style.borderColor = '#3b82f6'}
      onBlur={e => e.target.style.borderColor = '#1e2330'}
    />
  )
}

function SaveButton({ onClick, loading, label }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-6 py-2.5 rounded-lg text-sm font-semibold"
      style={{ background: loading ? '#1e2330' : '#3b82f6', color: loading ? '#6b7a96' : '#fff' }}
    >
      {loading ? 'Saving...' : label}
    </button>
  )
}

function Toast({ message, type }) {
  if (!message) return null
  return (
    <div
      className="fixed bottom-6 right-6 px-5 py-3 rounded-lg text-sm font-medium z-50"
      style={{ background: type === 'error' ? '#ef4444' : '#10b981', color: '#fff' }}
    >
      {message}
    </div>
  )
}

export function Admin() {
  const links = [
    { label: 'Morning Brief', route: '/admin/morning-brief', desc: 'Publish the morning brief' },
    { label: 'Daily Wrap', route: '/admin/daily-wrap', desc: 'Publish the daily wrap' },
    { label: 'Domino Theory', route: '/admin/domino-theory', desc: 'Update domino statuses and notes' },
    { label: 'Top Headlines', route: '/admin/headlines', desc: 'Manage headline feed' },
    { label: 'Master Watchlist', route: '/admin/watchlist', desc: 'Manage suggested symbols' },
    { label: 'Market Chatter', route: '/admin/chatter', desc: 'Moderate member posts' },
    { label: 'XRP ETF Flows', route: '/admin/etf-flows', desc: 'Manual override for ETF flow data' },
  ]
  return (
    <AdminLayout title="Admin Panel">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {links.map(function(l) {
          return (
            
              key={l.label}
              href={l.route}
              className="rounded-xl p-5 block"
              style={{ background: '#0d1117', border: '1px solid #1e2330' }}
            >
              <p className="font-semibold mb-1" style={{ color: '#eceef5' }}>{l.label}</p>
              <p className="text-sm" style={{ color: '#6b7a96' }}>{l.desc}</p>
            </a>
          )
        })}
      </div>
    </AdminLayout>
  )
}

export function AdminMorningBrief() {
  const [date, setDate] = useState('')
  const [headline, setHeadline] = useState('')
  const [summary, setSummary] = useState('')
  const [catalysts, setCatalysts] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ message: '', type: '' })

  function showToast(message, type) {
    setToast({ message, type: type || 'success' })
    setTimeout(function() { setToast({ message: '', type: '' }) }, 3000)
  }

  async function publish() {
    if (!date || !headline || !summary) return showToast('Date, headline, and summary are required.', 'error')
    setLoading(true)
    const catalystArray = catalysts.split('\n').map(function(c) { return c.trim() }).filter(Boolean)
    const { error } = await supabase.from('morning_briefs').insert({ date, headline, summary, catalysts: catalystArray, published: true })
    setLoading(false)
    if (error) return showToast('Error: ' + error.message, 'error')
    showToast('Morning Brief published!', 'success')
    setDate(''); setHeadline(''); setSummary(''); setCatalysts('')
  }

  return (
    <AdminLayout title="Morning Brief">
      <AdminCard title="Publish New Morning Brief">
        <Field label="Date"><TextInput value={date} onChange={setDate} placeholder="Monday, April 7, 2026" /></Field>
        <Field label="Headline"><TextInput value={headline} onChange={setHeadline} placeholder="Brief headline..." /></Field>
        <Field label="Summary"><TextArea value={summary} onChange={setSummary} placeholder="Summary paragraph..." /></Field>
        <Field label="Catalysts (one per line)"><TextArea value={catalysts} onChange={setCatalysts} placeholder="Catalyst one" rows={4} /></Field>
        <SaveButton onClick={publish} loading={loading} label="Publish" />
      </AdminCard>
      <Toast message={toast.message} type={toast.type} />
    </AdminLayout>
  )
}

export function AdminDailyWrap() {
  const [date, setDate] = useState('')
  const [headline, setHeadline] = useState('')
  const [summary, setSummary] = useState('')
  const [catalysts, setCatalysts] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ message: '', type: '' })

  function showToast(message, type) {
    setToast({ message, type: type || 'success' })
    setTimeout(function() { setToast({ message: '', type: '' }) }, 3000)
  }

  async function publish() {
    if (!date || !headline || !summary) return showToast('Date, headline, and summary are required.', 'error')
    setLoading(true)
    const catalystArray = catalysts.split('\n').map(function(c) { return c.trim() }).filter(Boolean)
    const { error } = await supabase.from('daily_wraps').insert({ date, headline, summary, catalysts: catalystArray, published: true })
    setLoading(false)
    if (error) return showToast('Error: ' + error.message, 'error')
    showToast('Daily Wrap published!', 'success')
    setDate(''); setHeadline(''); setSummary(''); setCatalysts('')
  }

  return (
    <AdminLayout title="Daily Wrap">
      <AdminCard title="Publish New Daily Wrap">
        <Field label="Date"><TextInput value={date} onChange={setDate} placeholder="Monday, April 7, 2026" /></Field>
        <Field label="Headline"><TextInput value={headline} onChange={setHeadline} placeholder="Wrap headline..." /></Field>
        <Field label="Summary"><TextArea value={summary} onChange={setSummary} placeholder="Summary paragraph..." /></Field>
        <Field label="Catalysts (one per line)"><TextArea value={catalysts} onChange={setCatalysts} placeholder="Catalyst one" rows={4} /></Field>
        <SaveButton onClick={publish} loading={loading} label="Publish" />
      </AdminCard>
      <Toast message={toast.message} type={toast.type} />
    </AdminLayout>
  )
}

export function AdminDominoTheory() {
  const [dominoes, setDominoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)
  const [toast, setToast] = useState({ message: '', type: '' })

  function showToast(message, type) {
    setToast({ message, type: type || 'success' })
    setTimeout(function() { setToast({ message: '', type: '' }) }, 3000)
  }

  useEffect(function() {
    supabase.from('domino_theory').select('*').order('order_index').then(function(res) {
      if (res.data) setDominoes(res.data)
      setLoading(false)
    })
  }, [])

  function updateField(id, field, value) {
    setDominoes(function(prev) {
      return prev.map(function(d) { return d.id === id ? Object.assign({}, d, { [field]: value }) : d })
    })
  }

  async function save(domino) {
    setSaving(domino.id)
    const { error } = await supabase.from('domino_theory').update({ status: domino.status, assessment: domino.assessment }).eq('id', domino.id)
    setSaving(null)
    if (error) return showToast('Error: ' + error.message, 'error')
    showToast(domino.name + ' saved!', 'success')
  }

  return (
    <AdminLayout title="Domino Theory">
      {loading ? (
        <p style={{ color: '#6b7a96' }}>Loading...</p>
      ) : (
        dominoes.map(function(d) {
          return (
            <AdminCard key={d.id} title={'Domino ' + d.order_index + ' — ' + d.name}>
              <Field label="Status">
                <select
                  value={d.status}
                  onChange={function(e) { updateField(d.id, 'status', e.target.value) }}
                  className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                  style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}
                >
                  <option value="standing">Standing</option>
                  <option value="tipping">Tipping</option>
                  <option value="fallen">Fallen</option>
                </select>
              </Field>
              <Field label="Assessment Notes">
                <TextArea value={d.assessment || ''} onChange={function(v) { updateField(d.id, 'assessment', v) }} placeholder="Assessment notes..." rows={3} />
              </Field>
              <SaveButton onClick={function() { save(d) }} loading={saving === d.id} label="Save" />
            </AdminCard>
          )
        })
      )}
      <Toast message={toast.message} type={toast.type} />
    </AdminLayout>
  )
}

export function AdminHeadlines() {
  const [headlines, setHeadlines] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ headline: '', source: '', category: '', url: '' })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ message: '', type: '' })

  function showToast(message, type) {
    setToast({ message, type: type || 'success' })
    setTimeout(function() { setToast({ message: '', type: '' }) }, 3000)
  }

  async function load() {
    const { data } = await supabase.from('top_headlines').select('*').order('created_at', { ascending: false }).limit(20)
    if (data) setHeadlines(data)
    setLoading(false)
  }

  useEffect(function() { load() }, [])

  async function add() {
    if (!form.headline || !form.source) return showToast('Headline and source are required.', 'error')
    setSaving(true)
    const { error } = await supabase.from('top_headlines').insert(form)
    setSaving(false)
    if (error) return showToast('Error: ' + error.message, 'error')
    showToast('Headline added!', 'success')
    setForm({ headline: '', source: '', category: '', url: '' })
    load()
  }

  async function remove(id) {
    await supabase.from('top_headlines').delete().eq('id', id)
    showToast('Headline removed.', 'success')
    load()
  }

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
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: '#eceef5' }}>{h.headline}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6b7a96' }}>{h.source} · {h.category}</p>
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
  const [symbols, setSymbols] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ symbol: '', name: '', category: '' })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ message: '', type: '' })

  function showToast(message, type) {
    setToast({ message, type: type || 'success' })
    setTimeout(function() { setToast({ message: '', type: '' }) }, 3000)
  }

  async function load() {
    const { data } = await supabase.from('master_watchlist').select('*').order('symbol')
    if (data) setSymbols(data)
    setLoading(false)
  }

  useEffect(function() { load() }, [])

  async function add() {
    if (!form.symbol) return showToast('Symbol is required.', 'error')
    setSaving(true)
    const { error } = await supabase.from('master_watchlist').insert(Object.assign({}, form, { symbol: form.symbol.toUpperCase() }))
    setSaving(false)
    if (error) return showToast('Error: ' + error.message, 'error')
    showToast('Symbol added!', 'success')
    setForm({ symbol: '', name: '', category: '' })
    load()
  }

  async function remove(id) {
    await supabase.from('master_watchlist').delete().eq('id', id)
    showToast('Symbol removed.', 'success')
    load()
  }

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
                  <div>
                    <span className="text-sm font-bold mr-2" style={{ color: '#3b82f6' }}>{s.symbol}</span>
                    <span className="text-sm" style={{ color: '#eceef5' }}>{s.name}</span>
                    <span className="text-xs ml-2" style={{ color: '#6b7a96' }}>{s.category}</span>
                  </div>
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
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState({ message: '', type: '' })

  function showToast(message, type) {
    setToast({ message, type: type || 'success' })
    setTimeout(function() { setToast({ message: '', type: '' }) }, 3000)
  }

  async function load() {
    const { data } = await supabase.from('market_chatter').select('*').order('created_at', { ascending: false }).limit(50)
    if (data) setPosts(data)
    setLoading(false)
  }

  useEffect(function() { load() }, [])

  async function warn(post) {
    await supabase.from('market_chatter').update({ flagged: true }).eq('id', post.id)
    showToast('Warning issued.', 'success')
    load()
  }

  async function remove(id) {
    await supabase.from('market_chatter').delete().eq('id', id)
    showToast('Post removed.', 'success')
    load()
  }

  async function ban(userId) {
    await supabase.from('profiles').update({ is_banned: true }).eq('id', userId)
    showToast('User banned.', 'success')
    load()
  }

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
                    <button onClick={function() { warn(p) }} className="text-xs px-3 py-1.5 rounded" style={{ background: 'rgba(234,179,8,0.1)', color: '#eab308' }}>Warn</button>
                    <button onClick={function() { remove(p.id) }} className="text-xs px-3 py-1.5 rounded" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>Remove Post</button>
                    <button onClick={function() { ban(p.user_id) }} className="text-xs px-3 py-1.5 rounded" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', fontWeight: 600 }}>Ban User</button>
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
  const [form, setForm] = useState({ date: '', net_flow: '', total_aum: '', institutions: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ message: '', type: '' })

  function showToast(message, type) {
    setToast({ message, type: type || 'success' })
    setTimeout(function() { setToast({ message: '', type: '' }) }, 3000)
  }

  async function save() {
    if (!form.date) return showToast('Date is required.', 'error')
    setSaving(true)
    const { error } = await supabase.from('xrp_etf_flows').insert(form)
    setSaving(false)
    if (error) return showToast('Error: ' + error.message, 'error')
    showToast('ETF flow data saved!', 'success')
    setForm({ date: '', net_flow: '', total_aum: '', institutions: '', notes: '' })
  }

  return (
    <AdminLayout title="XRP ETF Flows">
      <AdminCard title="Manual Override — ETF Flow Entry">
        <Field label="Date"><TextInput value={form.date} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { date: v }) }) }} placeholder="2026-04-07" /></Field>
        <Field label="Net Flow (USD)"><TextInput value={form.net_flow} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { net_flow: v }) }) }} placeholder="1200000" /></Field>
        <Field label="Total AUM (USD)"><TextInput value={form.total_aum} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { total_aum: v }) }) }} placeholder="5000000000" /></Field>
        <Field label="Institutions"><TextInput value={form.institutions} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { institutions: v }) }) }} placeholder="3" /></Field>
        <Field label="Notes"><TextArea value={form.notes} onChange={function(v) { setForm(function(f) { return Object.assign({}, f, { notes: v }) }) }} placeholder="Any notes..." rows={3} /></Field>
        <SaveButton onClick={save} loading={saving} label="Save Entry" />
      </AdminCard>
      <Toast message={toast.message} type={toast.type} />
    </AdminLayout>
  )
}

export function AdminUpdates() { return <AdminDailyWrap /> }
