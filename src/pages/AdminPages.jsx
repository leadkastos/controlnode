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
      onChange={function(e) { onChange(e.target.value) }}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
      style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}
      onFocus={function(e) { e.target.style.borderColor = '#3b82f6' }}
      onBlur={function(e) { e.target.style.borderColor = '#1e2330' }}
    />
  )
}

function TextArea({ value, onChange, placeholder, rows }) {
  return (
    <textarea
      value={value}
      onChange={function(e) { onChange(e.target.value) }}
      placeholder={placeholder}
      rows={rows || 5}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
      style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}
      onFocus={function(e) { e.target.style.borderColor = '#3b82f6' }}
      onBlur={function(e) { e.target.style.borderColor = '#1e2330' }}
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
  return (
    <AdminLayout title="Admin Panel">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a href="/admin/morning-brief" className="rounded-xl p-5 block" style={{ background: '#0d1117', border: '1px solid #1e2330' }}>
          <p className="font-semibold mb-1" style={{ color: '#eceef5' }}>Morning Brief</p>
          <p className="text-sm" style={{ color: '#6b7a96' }}>Publish the morning brief</p>
        </a>
        <a href="/admin/daily-wrap" className="rounded-xl p-5 block" style={{ background: '#0d1117', border: '1px solid #1e2330' }}>
          <p className="font-semibold mb-1" style={{ color: '#eceef5' }}>Daily Wrap</p>
          <p className="text-sm" style={{ color: '#6b7a96' }}>Publish the daily wrap</p>
        </a>
        <a href="/admin/domino-theory" className="rounded-xl p-5 block" style={{ background: '#0d1117', border: '1px solid #1e2330' }}>
          <p className="font-semibold mb-1" style={{ color: '#eceef5' }}>Domino Theory</p>
          <p className="text-sm" style={{ color: '#6b7a96' }}>Update domino statuses and notes</p>
        </a>
        <a href="/admin/headlines" className="rounded-xl p-5 block" style={{ background: '#0d1117', border: '1px solid #1e2330' }}>
          <p className="font-semibold mb-1" style={{ color: '#eceef5' }}>Top Headlines</p>
          <p className="text-sm" style={{ color: '#6b7a96' }}>Manage headline feed</p>
        </a>
        <a href="/admin/watchlist" className="rounded-xl p-5 block" style={{ background: '#0d1117', border: '1px solid #1e2330' }}>
          <p className="font-semibold mb-1" style={{ color: '#eceef5' }}>Master Watchlist</p>
          <p className="text-sm" style={{ color: '#6b7a96' }}>Manage suggested symbols</p>
        </a>
        <a href="/admin/chatter" className="rounded-xl p-5 block" style={{ background: '#0d1117', border: '1px solid #1e2330' }}>
          <p className="font-semibold mb-1" style={{ color: '#eceef5' }}>Market Chatter</p>
          <p className="text-sm" style={{ color: '#6b7a96' }}>Moderate member posts</p>
        </a>
        <a href="/admin/etf-flows" className="rounded-xl p-5 block" style={{ background: '#0d1117', border: '1px solid #1e2330' }}>
          <p className="font-semibold mb-1" style={{ color: '#eceef5' }}>XRP ETF Flows</p>
          <p className="text-sm" style={{ color: '#6b7a96' }}>Manual override for ETF flow data</p>
        </a>
      </div>
    </AdminLayout>
  )
}

export function AdminMorningBrief() {
  var dateState = useState('')
  var date = dateState[0]
  var setDate = dateState[1]
  var headlineState = useState('')
  var headline = headlineState[0]
  var setHeadline = headlineState[1]
  var summaryState = useState('')
  var summary = summaryState[0]
  var setSummary = summaryState[1]
  var catalystsState = useState('')
  var catalysts = catalystsState[0]
  var setCatalysts = catalystsState[1]
  var loadingState = useState(false)
  var loading = loadingState[0]
  var setLoading = loadingState[1]
  var toastState = useState({ message: '', type: '' })
  var toast = toastState[0]
  var setToast = toastState[1]

  function showToast(message, type) {
    setToast({ message: message, type: type || 'success' })
    setTimeout(function() { setToast({ message: '', type: '' }) }, 3000)
  }

  async function publish() {
    if (!date || !headline || !summary) { showToast('Date, headline, and summary are required.', 'error'); return }
    setLoading(true)
    var catalystArray = catalysts.split('\n').map(function(c) { return c.trim() }).filter(Boolean)
    var result = await supabase.from('morning_briefs').insert({ date: date, headline: headline, summary: summary, catalysts: catalystArray, published: true })
    setLoading(false)
    if (result.error) { showToast('Error: ' + result.error.message, 'error'); return }
    showToast('Morning Brief published!', 'success')
    setDate(''); setHeadline(''); setSummary(''); setCatalysts('')
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
  var dateState = useState('')
  var date = dateState[0]
  var setDate = dateState[1]
  var headlineState = useState('')
  var headline = headlineState[0]
  var setHeadline = headlineState[1]
  var summaryState = useState('')
  var summary = summaryState[0]
  var setSummary = summaryState[1]
  var catalystsState = useState('')
  var catalysts = catalystsState[0]
  var setCatalysts = catalystsState[1]
  var loadingState = useState(false)
  var loading = loadingState[0]
  var setLoading = loadingState[1]
  var toastState = useState({ message: '', type: '' })
  var toast = toastState[0]
  var setToast = toastState[1]

  function showToast(message, type) {
    setToast({ message: message, type: type || 'success' })
    setTimeout(function() { setToast({ message: '', type: '' }) }, 3000)
  }

  async function publish() {
    if (!date || !headline || !summary) { showToast('Date, headline, and summary are required.', 'error'); return }
    setLoading(true)
    var catalystArray = catalysts.split('\n').map(function(c) { return c.trim() }).filter(Boolean)
    var result = await supabase.from('daily_wraps').insert({ date: date, headline: headline, summary: summary, catalysts: catalystArray, published: true })
    setLoading(false)
    if (result.error) { showToast('Error: ' + result.error.message, 'error'); return }
    showToast('Daily Wrap published!', 'success')
    setDate(''); setHeadline(''); setSummary(''); setCatalysts('')
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
  var dominoesState = useState([])
  var dominoes = dominoesState[0]
  var setDominoes = dominoesState[1]
  var loadingState = useState(true)
  var loading = loadingState[0]
  var setLoading = loadingState[1]
  var savingState = useState(null)
  var saving = savingState[0]
  var setSaving = savingState[1]
  var toastState = useState({ message: '', type: '' })
  var toast = toastState[0]
  var setToast = toastState[1]

  function showToast(message, type) {
    setToast({ message: message, type: type || 'success' })
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
      return prev.map(function(d) {
        if (d.id === id) { var u = Object.assign({}, d); u[field] = value; return u }
        return d
      })
    })
  }

  async function save(domino) {
    setSaving(domino.id)
    var result = await supabase.from('domino_theory').update({ status: domino.status, assessment: domino.assessment }).eq('id', domino.id)
    setSaving(null)
    if (result.error) { showToast('Error: ' + result.error.message, 'error'); return }
    showToast(domino.name + ' saved!', 'success')
  }

  return (
    <AdminLayout title="Domino Theory">
      {loading ? (<p style={{ color: '#6b7a96' }}>Loading...</p>) : dominoes.map(function(d) {
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
      })}
      <Toast message={toast.message} type={toast.type} />
    </AdminLayout>
  )
}

export function AdminHeadlines() {
  var headlinesState = useState([])
  var headlines = headlinesState[0]
  var setHeadlines = headlinesState[1]
  var loadingState = useState(true)
  var loading = loadingState[0]
  var setLoading = loadingState[1]
  var formState = useState({ headline: '', source: '', category: '', url: '' })
  var form = formState[0]
  var setForm = formState[1]
  var savingState = useState(false)
  var saving = savingState[0]
  var setSaving = savingState[1]
  var toastState = useState({ message: '', type: '' })
  var toast = toastState[0]
  var setToast = toastState[1]

  function showToast(message, type) {
    setToast({ message: message, type: type || 'success' })
    setTimeout(function() { setToast({ message: '', type: '' }) }, 3000)
  }

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
        {loading ? (<p style={{ color: '#6b7a96' }}>Loading...</p>) : headlines.length === 0 ? (<p style={{ color: '#6b7a96' }}>No headlines yet.</p>) : (
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
  var symbolsState = useState([])
  var symbols = symbolsState[0]
  var setSymbols = symbolsState[1]
  var loadingState = useState(true)
  var loading = loadingState[0]
  var setLoading = loadingState[1]
  var formState = useState({ symbol: '', name: '', category: '' })
  var form = formState[0]
  var setForm = formState[1]
  var savingState = useState(false)
  var saving = savingState[0]
  var setSaving = savingState[1]
  var toastState = useState({ message: '', type: '' })
  var toast = toastState[0]
  var setToast = toastState[1]

  function showToast(message, type) {
    setToast({ message: message, type: type || 'success' })
    setTimeout(function() { setToast({ message: '', type: '' }) }, 3000)
  }

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
        {loading ? (<p style={{ color: '#6b7a96' }}>Loading...</p>) : symbols.length === 0 ? (<p style={{ color: '#6b7a96' }}>No symbols yet.</p>) : (
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
  var postsState = useState([])
  var posts = postsState[0]
  var setPosts = postsState[1]
  var loadingState = useState(true)
  var loading = loadingState[0]
  var setLoading = loadingState[1]
  var toastState = useState({ message: '', type: '' })
  var toast = toastState[0]
  var setToast = toastState[1]

  function showToast(message, type) {
    setToast({ message: message, type: type || 'success' })
    setTimeout(function() { setToast({ message: '', type: '' }) }, 3000)
  }

  async function load() {
    var res = await supabase.from('market_chatter').select('*').order('created_at', { ascending: false }).limit(50)
    if (res.data) setPosts(res.data)
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
        {loading ? (<p style={{ color: '#6b7a96' }}>Loading...</p>) : posts.length === 0 ? (<p style={{ color: '#6b7a96' }}>No posts yet.</p>) : (
          <div className="space-y-3">
            {posts.map(function(p) {
              return (
                <div key={p.id} className="rounded-lg p-4" style={{ background: '#111318', border: '1px solid ' + (p.flagged ? 'rgba(239,68,68,0.3)' : '#1e2330') }}>
                  <p className="text-xs mb-1" style={{ color: '#6b7a96' }}>{p.user_id} · {new Date(p.created_at).toLocaleString()}</p>
                  <p className="text-sm mb-2" style={{ color: '#eceef5' }}>{p.content}</p>
                  {p.flagged && (<span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>Flagged</span>)}
                  <div className="flex gap-2 flex-wrap mt-2">
                    <button onClick={function() { warn(p) }} className="text-xs px-3 py-1.5 rounded" style={{ background: 'rgba(234,179,8,0.1)', color: '#eab308' }}>Warn</button>
                    <button onClick={function() { remove(p.id) }} className="text-xs px-3 py-1.5 rounded" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>Remove Post</button>
                    <button onClick={function() { ban(p.user_id) }} className="text-xs px-3 py-1.5 rounded" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>Ban User</button>
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
  var formState = useState({ date: '', net_flow: '', total_aum: '', institutions: '', notes: '' })
  var form = formState[0]
  var setForm = formState[1]
  var savingState = useState(false)
  var saving = savingState[0]
  var setSaving = savingState[1]
  var toastState = useState({ message: '', type: '' })
  var toast = toastState[0]
  var setToast = toastState[1]

  function showToast(message, type) {
    setToast({ message: message, type: type || 'success' })
    setTimeout(function() { setToast({ message: '', type: '' }) }, 3000)
  }

  async function save() {
    if (!form.date) { showToast('Date is required.', 'error'); return }
    setSaving(true)
    var result = await supabase.from('xrp_etf_flows').insert(form)
    setSaving(false)
    if (result.error) { showToast('Error: ' + result.error.message, 'error'); return }
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
