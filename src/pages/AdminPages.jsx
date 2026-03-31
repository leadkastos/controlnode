import React, { useState } from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection } from '../components/DetailPageLayout'
import { Badge } from '../components/UI'
import { useNavigate } from 'react-router-dom'

function InputField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#4a5568' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
        style={{
          background: '#111318',
          border: '1px solid #1e2330',
          color: '#e8eaf0',
        }}
        onFocus={e => e.target.style.borderColor = '#3b82f6'}
        onBlur={e => e.target.style.borderColor = '#1e2330'}
      />
    </div>
  )
}

function TextareaField({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#4a5568' }}>
        {label}
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors resize-none"
        style={{
          background: '#111318',
          border: '1px solid #1e2330',
          color: '#e8eaf0',
        }}
        onFocus={e => e.target.style.borderColor = '#3b82f6'}
        onBlur={e => e.target.style.borderColor = '#1e2330'}
      />
    </div>
  )
}

export function Admin() {
  const nav = useNavigate()
  return (
    <AppLayout hideRightSidebar>
      <DetailPageLayout title="Admin Panel" subtitle="ControlNode content management system.">
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: 'Morning Brief', desc: 'Publish the daily brief', path: '/admin/morning-brief', badge: 'blue' },
            { title: 'Updates', desc: 'Post intelligence updates', path: '/admin/updates', badge: 'purple' },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => nav(item.path)}
              className="rounded-xl p-5 border text-left transition-colors hover:bg-white/5"
              style={{ background: '#161a22', borderColor: '#1e2330' }}
            >
              <Badge color={item.badge} className="mb-2">{item.badge === 'blue' ? 'Content' : 'Updates'}</Badge>
              <h3 className="font-semibold mt-2" style={{ color: '#e8eaf0' }}>{item.title}</h3>
              <p className="text-sm mt-1" style={{ color: '#8892a4' }}>{item.desc}</p>
            </button>
          ))}
        </div>

        <DetailSection title="Recent Publications">
          <div className="space-y-2">
            {[
              { title: 'Morning Brief — March 23', type: 'Brief', time: 'Today 6:45 AM', status: 'Published' },
              { title: 'Geopolitical Alert — BOJ Decision', type: 'Update', time: 'Today 8:00 AM', status: 'Published' },
              { title: 'ETF Flow Report — March 22', type: 'Brief', time: 'Yesterday', status: 'Published' },
            ].map((pub, i) => (
              <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #1e2330' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#e8eaf0' }}>{pub.title}</p>
                  <p className="text-xs" style={{ color: '#4a5568' }}>{pub.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge color="blue">{pub.type}</Badge>
                  <Badge color="green">{pub.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </DetailSection>
      </DetailPageLayout>
    </AppLayout>
  )
}

export function AdminMorningBrief() {
  const [title, setTitle] = useState('')
  const [snippet, setSnippet] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)

  function handlePublish() {
    if (!title || !snippet) return
    setPublished(true)
    setTimeout(() => setPublished(false), 3000)
  }

  return (
    <AppLayout hideRightSidebar>
      <DetailPageLayout title="Publish Morning Brief" subtitle="Create and publish the daily intelligence brief.">
        <DetailSection title="Brief Details">
          <InputField
            label="Title / Headline"
            value={title}
            onChange={setTitle}
            placeholder="e.g. XRP Holds Key Level as Macro Turns — Domino Theory Activates"
          />
          <TextareaField
            label="Snippet (shown on dashboard)"
            value={snippet}
            onChange={setSnippet}
            placeholder="2–3 sentence summary shown on the dashboard card..."
            rows={3}
          />
          <TextareaField
            label="Full Brief Content"
            value={content}
            onChange={setContent}
            placeholder="Full brief content in Markdown format..."
            rows={14}
          />
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={handlePublish}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{ background: published ? '#10b981' : '#3b82f6', color: '#fff' }}
            >
              {published ? '✓ Published Successfully' : 'Publish Brief'}
            </button>
            <button
              className="px-6 py-2.5 rounded-lg text-sm font-medium border transition-colors"
              style={{ color: '#8892a4', borderColor: '#1e2330' }}
            >
              Save Draft
            </button>
          </div>
        </DetailSection>
      </DetailPageLayout>
    </AppLayout>
  )
}

export function AdminUpdates() {
  const [title, setTitle] = useState('')
  const [module, setModule] = useState('geopolitical-watch')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)

  function handlePublish() {
    if (!title || !content) return
    setPublished(true)
    setTimeout(() => setPublished(false), 3000)
  }

  return (
    <AppLayout hideRightSidebar>
      <DetailPageLayout title="Post Intelligence Update" subtitle="Push a targeted update to a specific intelligence module.">
        <DetailSection title="Update Details">
          <InputField
            label="Update Title"
            value={title}
            onChange={setTitle}
            placeholder="e.g. Geopolitical Alert: USD/JPY Breaks 155"
          />
          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#4a5568' }}>
              Target Module
            </label>
            <select
              value={module}
              onChange={e => setModule(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: '#111318', border: '1px solid #1e2330', color: '#e8eaf0' }}
            >
              <option value="geopolitical-watch">Geopolitical Watch</option>
              <option value="xrp-intelligence">XRP Intelligence</option>
              <option value="domino-theory">Domino Theory</option>
              <option value="etf-flows">ETF Flows</option>
              <option value="oil-vs-yen">Oil vs Yen</option>
              <option value="media-narratives">Media & Narratives</option>
              <option value="market-overview">Market Overview</option>
            </select>
          </div>
          <TextareaField
            label="Update Content"
            value={content}
            onChange={setContent}
            placeholder="Intelligence update content..."
            rows={8}
          />
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={handlePublish}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{ background: published ? '#10b981' : '#3b82f6', color: '#fff' }}
            >
              {published ? '✓ Update Posted' : 'Post Update'}
            </button>
            <button
              className="px-6 py-2.5 rounded-lg text-sm font-medium border"
              style={{ color: '#8892a4', borderColor: '#1e2330' }}
            >
              Preview
            </button>
          </div>
        </DetailSection>
      </DetailPageLayout>
    </AppLayout>
  )
}
