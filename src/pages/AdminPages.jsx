import React, { useState } from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection } from '../components/DetailPageLayout'
import { Badge } from '../components/UI'
import { useNavigate } from 'react-router-dom'

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
        className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
        style={{
          background: '#111318',
          border: '1px solid #1e2330',
          color: '#eceef5',
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
      <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#6b7a96' }}>
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
          color: '#eceef5',
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
              <h3 className="font-semibold mt-2" style={{ color: '#eceef5' }}>{item.title}</h3>
              <p className="text-sm mt-1" style={{ color: '#9aa8be' }}>{item.desc}</p>
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
                  <p className="text-sm font-medium" style={{ color: '#eceef5' }}>{pub.title}</p>
                  <p className="text-xs" style={{ color: '#6b7a96' }}>{pub.time}</p>
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
              style={{ color: '#9aa8be', borderColor: '#1e2330' }}
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
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#6b7a96' }}>
              Target Module
            </label>
            <select
              value={module}
              onChange={e => setModule(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
              style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}
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
              style={{ color: '#9aa8be', borderColor: '#1e2330' }}
            >
              Preview
            </button>
          </div>
        </DetailSection>
      </DetailPageLayout>
    </AppLayout>
  )
}

export function AdminDominoTheory() {
  const [dominoStatuses, setDominoStatuses] = React.useState({
    1: { status: 'triggered',   notes: 'Brent Crude at $87.40 — elevated. Middle East tensions elevated. Monitor closely.' },
    2: { status: 'in_progress', notes: 'BOJ held at 0.1% — surprise hold. 10Y yield at 0.84% and rising.' },
    3: { status: 'in_progress', notes: 'USD/JPY at 153.4 — yen weak but carry trade still active.' },
    4: { status: 'not_started', notes: 'Treasury market functioning normally. Auctions stable. Critical domino to watch.' },
    5: { status: 'not_started', notes: 'Stablecoin bills progressing in Senate. USDT at $110B market cap. Early stage.' },
    6: { status: 'in_progress', notes: 'BTC ETF flows positive but slowing. Traditional ETF redemptions elevated. Late-stage accelerator.' },
    7: { status: 'not_started', notes: 'BTC at $67,420. Equities elevated. No liquidation cascade signals yet.' },
    8: { status: 'not_started', notes: 'USDT stable at $1.00. No peg stress. High-risk if triggered.' },
    9: { status: 'not_started', notes: 'The final domino. XRP positioned. ODL volume growing. ETF filings active.' },
  })

  const dominoTitles = {
    1: '🛢️ Global Oil & Energy Shock',
    2: '🏦 Japan Rate & Yield Break',
    3: '💴 Yen Carry Trade Unwind',
    4: '📊 U.S. Treasury Stress',
    5: '💵 Stablecoin Absorption',
    6: '📉 ETF Liquidity Stress',
    7: '🌊 Global Asset Liquidation',
    8: '⚠️ Tether Instability',
    9: '⚡ XRP Liquidity Bridge',
  }

  const statusColors = {
    triggered:   '#ef4444',
    in_progress: '#f59e0b',
    not_started: '#6b7280',
  }

  const [saved, setSaved] = React.useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <AppLayout hideRightSidebar>
      <div className="max-w-3xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>
            Domino Theory Manager
          </h1>
          <p className="text-sm mt-1" style={{ color: '#9aa8be' }}>
            Two controls per domino — Status and your Assessment. Changes go live instantly for all members and trigger a bell notification.
          </p>
          <div className="mt-3 rounded-lg px-4 py-3 text-xs" style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', color: '#9aa8be' }}>
            <span style={{ color: '#8b5cf6', fontWeight: 600 }}>How to use: </span>
            When a real-world event occurs — BOJ hikes rates, Treasury auction fails, BTC drops 20% — open this panel, update the relevant domino status, write one sentence of context, and hit Save. Members are notified automatically.
          </div>
        </div>

        {saved && (
          <div className="rounded-xl p-3 mb-4 text-sm font-medium text-center" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
            ✓ Domino Theory updated — all members notified
          </div>
        )}

        <div className="space-y-3">
          {Object.entries(dominoTitles).map(([id, title]) => {
            const d = dominoStatuses[id]
            const statusColor = statusColors[d.status]
            return (
              <div key={id} className="rounded-xl p-5 border" style={{ background: '#161a22', borderColor: '#1e2330', borderLeft: `3px solid ${statusColor}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-sm font-semibold" style={{ color: '#eceef5' }}>{title}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded" style={{ background: `${statusColor}18`, color: statusColor }}>
                    {d.status === 'triggered' ? 'Fallen' : d.status === 'in_progress' ? 'Tipping' : 'Standing'}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#6b7a96' }}>Status</label>
                    <select
                      value={d.status}
                      onChange={e => setDominoStatuses(prev => ({ ...prev, [id]: { ...prev[id], status: e.target.value } }))}
                      className="w-full px-3 py-2.5 rounded-lg text-sm outline-none"
                      style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}
                    >
                      <option value="not_started">Standing — Monitoring</option>
                      <option value="in_progress">Tipping — In Progress</option>
                      <option value="triggered">Fallen — Triggered</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#6b7a96' }}>ControlNode Assessment</label>
                    <textarea
                      value={d.notes}
                      onChange={e => setDominoStatuses(prev => ({ ...prev, [id]: { ...prev[id], notes: e.target.value } }))}
                      rows={2}
                      placeholder="One sentence describing current conditions..."
                      className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                      style={{ background: '#111318', border: '1px solid #1e2330', color: '#eceef5' }}
                      onFocus={e => e.target.style.borderColor = '#8b5cf6'}
                      onBlur={e => e.target.style.borderColor = '#1e2330'}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all"
            style={{ background: saved ? '#10b981' : '#8b5cf6', color: '#fff' }}
          >
            {saved ? '✓ Published — Members Notified' : 'Save & Publish Updates'}
          </button>
        </div>

        <p className="text-xs mt-4" style={{ color: '#4a5870' }}>
          Tip: Visit <a href="/domino-theory" style={{ color: '#8b5cf6' }}>/domino-theory</a> after saving to confirm changes look correct before sharing with members.
        </p>
      </div>
    </AppLayout>
  )
}
