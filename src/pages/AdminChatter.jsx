import React, { useState } from 'react'
import AppLayout from '../components/AppLayout'
import { Plus, Trash2, Eye, EyeOff, Star, AlertTriangle } from 'lucide-react'

const emptyForm = {
  source_url: '',
  source_type: 'x',
  category: 'xrp_rumor',
  custom_headline: '',
  admin_summary: '',
  admin_notes_internal: '',
  thumbnail_image_url: '',
  is_featured: false,
  is_published: true,
}

function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#6b7a96' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
      style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}
      onFocus={e => e.target.style.borderColor = '#8b5cf6'}
      onBlur={e => e.target.style.borderColor = '#1e2330'}
    />
  )
}

function Textarea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none resize-none"
      style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}
      onFocus={e => e.target.style.borderColor = '#8b5cf6'}
      onBlur={e => e.target.style.borderColor = '#1e2330'}
    />
  )
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
      style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

const mockItems = [
  { id: 1, custom_headline: 'BlackRock Internal Memo Allegedly References XRP ETF Timeline', source_type: 'x', category: 'etf_rumor', is_published: true, is_featured: true, date_added: '2 hours ago' },
  { id: 2, custom_headline: 'Ripple IPO Date Allegedly Leaked — H2 2026 Target Circulating', source_type: 'x', category: 'ripple_rumor', is_published: true, is_featured: false, date_added: '5 hours ago' },
  { id: 3, custom_headline: 'YouTube Creator Claims Insider Source on XRP Price Movement', source_type: 'youtube', category: 'xrp_rumor', is_published: true, is_featured: false, date_added: '8 hours ago' },
]

export default function AdminChatter() {
  const [form, setForm] = useState(emptyForm)
  const [items, setItems] = useState(mockItems)
  const [published, setPublished] = useState(false)
  const [showForm, setShowForm] = useState(false)

  function update(field) {
    return val => setForm(f => ({ ...f, [field]: val }))
  }

  function handlePublish() {
    if (!form.source_url || !form.custom_headline) return
    const newItem = {
      id: Date.now(),
      custom_headline: form.custom_headline,
      source_type: form.source_type,
      category: form.category,
      is_published: form.is_published,
      is_featured: form.is_featured,
      date_added: 'Just now',
    }
    setItems([newItem, ...items])
    setForm(emptyForm)
    setShowForm(false)
    setPublished(true)
    setTimeout(() => setPublished(false), 3000)
  }

  function togglePublish(id) {
    setItems(items.map(i => i.id === id ? { ...i, is_published: !i.is_published } : i))
  }

  function toggleFeatured(id) {
    setItems(items.map(i => i.id === id ? { ...i, is_featured: !i.is_featured } : i))
  }

  function deleteItem(id) {
    setItems(items.filter(i => i.id !== id))
  }

  return (
    <AppLayout hideRightSidebar>
      <div className="max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>
              Unconfirmed Market Chatter Manager
            </h1>
            <p className="text-sm mt-1" style={{ color: '#9aa8be' }}>
              Add, manage, and publish unconfirmed chatter items visible to all members.
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            style={{ background: '#8b5cf6', color: '#fff' }}
          >
            <Plus size={15} />
            Add New Item
          </button>
        </div>

        {published && (
          <div
            className="rounded-xl p-3 mb-4 text-sm font-medium text-center"
            style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}
          >
            ✓ Item published successfully
          </div>
        )}

        {/* Add form */}
        {showForm && (
          <div
            className="rounded-xl p-5 border mb-6"
            style={{ background: '#161a22', borderColor: '#8b5cf6' }}
          >
            <h2 className="text-sm font-semibold mb-4" style={{ color: '#eceef5' }}>New Chatter Item</h2>

            <Field label="Source URL *">
              <Input value={form.source_url} onChange={update('source_url')} placeholder="https://x.com/post/..." />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Source Type">
                <Select value={form.source_type} onChange={update('source_type')} options={[
                  { value: 'x', label: 'X / Twitter' },
                  { value: 'instagram', label: 'Instagram' },
                  { value: 'facebook', label: 'Facebook' },
                  { value: 'youtube', label: 'YouTube' },
                  { value: 'other', label: 'Other' },
                ]} />
              </Field>
              <Field label="Category">
                <Select value={form.category} onChange={update('category')} options={[
                  { value: 'etf_rumor', label: 'ETF Rumor' },
                  { value: 'ripple_rumor', label: 'Ripple Rumor' },
                  { value: 'xrp_rumor', label: 'XRP Rumor' },
                  { value: 'regulatory_chatter', label: 'Regulatory Chatter' },
                  { value: 'exchange_chatter', label: 'Exchange Chatter' },
                  { value: 'macro_chatter', label: 'Macro Chatter' },
                  { value: 'market_sentiment', label: 'Market Sentiment' },
                  { value: 'other', label: 'Other' },
                ]} />
              </Field>
            </div>

            <Field label="Custom Headline *">
              <Input value={form.custom_headline} onChange={update('custom_headline')} placeholder="Short descriptive headline for this chatter item..." />
            </Field>

            <Field label="Admin Summary (shown to members)">
              <Textarea value={form.admin_summary} onChange={update('admin_summary')} placeholder="Brief summary of what this is and why it's being monitored. Remind readers it is unconfirmed..." rows={4} />
            </Field>

            <Field label="Internal Notes (not shown to members)">
              <Textarea value={form.admin_notes_internal} onChange={update('admin_notes_internal')} placeholder="Private notes for admin use only — source credibility, follow-up actions, etc..." rows={3} />
            </Field>

            <Field label="Thumbnail Image URL (optional)">
              <Input value={form.thumbnail_image_url} onChange={update('thumbnail_image_url')} placeholder="https://..." />
            </Field>

            <div className="flex items-center gap-6 mb-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm" style={{ color: '#9aa8be' }}>Mark as Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm" style={{ color: '#9aa8be' }}>Publish immediately</span>
              </label>
            </div>

            <div
              className="rounded-lg px-4 py-3 mb-4 text-xs"
              style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', color: '#9aa8be' }}
            >
              <span style={{ color: '#ef4444', fontWeight: 600 }}>Reminder: </span>
              All items on this page are automatically labeled "Unconfirmed." Never present chatter as verified or endorsed by ControlNode.
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePublish}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                style={{ background: '#8b5cf6', color: '#fff' }}
              >
                Publish Item
              </button>
              <button
                onClick={() => { setForm(emptyForm); setShowForm(false) }}
                className="px-5 py-2.5 rounded-lg text-sm font-medium border transition-colors"
                style={{ color: '#9aa8be', borderColor: '#1e2330' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Items list */}
        <div className="rounded-xl border overflow-hidden" style={{ background: '#161a22', borderColor: '#1e2330' }}>
          <div className="px-5 py-3" style={{ background: '#111318', borderBottom: '1px solid #1e2330' }}>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7a96' }}>
              Published Items ({items.filter(i => i.is_published).length}) · Drafts ({items.filter(i => !i.is_published).length})
            </p>
          </div>

          {items.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm" style={{ color: '#6b7a96' }}>No chatter items yet. Click "Add New Item" to get started.</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#1e2330' }}>
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      {item.is_featured && <Star size={11} fill="#8b5cf6" style={{ color: '#8b5cf6' }} />}
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-medium"
                        style={{ background: item.is_published ? 'rgba(16,185,129,0.1)' : 'rgba(75,85,99,0.2)', color: item.is_published ? '#10b981' : '#6b7280' }}
                      >
                        {item.is_published ? 'Published' : 'Draft'}
                      </span>
                      <span className="text-xs" style={{ color: '#6b7a96' }}>{item.source_type} · {item.date_added}</span>
                    </div>
                    <p className="text-sm font-medium truncate" style={{ color: '#eceef5' }}>{item.custom_headline}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => toggleFeatured(item.id)}
                      className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
                      title={item.is_featured ? 'Unfeature' : 'Feature'}
                      style={{ color: item.is_featured ? '#8b5cf6' : '#4a5568' }}
                    >
                      <Star size={14} fill={item.is_featured ? '#8b5cf6' : 'none'} />
                    </button>
                    <button
                      onClick={() => togglePublish(item.id)}
                      className="p-1.5 rounded-lg transition-colors hover:bg-white/5"
                      title={item.is_published ? 'Unpublish' : 'Publish'}
                      style={{ color: item.is_published ? '#10b981' : '#4a5568' }}
                    >
                      {item.is_published ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
                      title="Delete"
                      style={{ color: '#6b7a96' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
