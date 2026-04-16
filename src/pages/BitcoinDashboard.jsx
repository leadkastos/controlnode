import React from 'react'
import AppLayout from '../components/AppLayout'
import { Bitcoin, Lock } from 'lucide-react'

function BlurredCard({ title }) {
  return (
    <div className="rounded-xl p-5 border relative overflow-hidden" style={{ background: '#161a22', borderColor: '#1e2330', minHeight: '140px' }}>
      <div className="filter blur-sm select-none pointer-events-none">
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#eceef5' }}>{title}</h3>
        <div className="space-y-2">
          <div className="flex justify-between"><span className="text-xs" style={{ color: '#9aa8be' }}>Loading...</span><span className="text-xs" style={{ color: '#eceef5' }}>$00,000</span></div>
          <div className="flex justify-between"><span className="text-xs" style={{ color: '#9aa8be' }}>Loading...</span><span className="text-xs" style={{ color: '#10b981' }}>+0.00%</span></div>
          <div className="flex justify-between"><span className="text-xs" style={{ color: '#9aa8be' }}>Loading...</span><span className="text-xs" style={{ color: '#eceef5' }}>$0.0B</span></div>
        </div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl" style={{ background: 'rgba(13,15,20,0.75)', backdropFilter: 'blur(2px)' }}>
        <Lock size={16} style={{ color: '#f59e0b', marginBottom: '6px' }} />
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#f59e0b' }}>Coming Soon</span>
      </div>
    </div>
  )
}

function BlurredBriefCard({ title, color }) {
  return (
    <div className="relative rounded-xl p-5 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f1724 0%, #111827 40%, #0d1520 100%)', border: `1px solid ${color}40`, minHeight: '180px' }}>
      <div className="filter blur-sm select-none pointer-events-none">
        <div className="flex items-center gap-2 mb-3">
          <div className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: `${color}20`, color }}>{title}</div>
          <span className="text-xs" style={{ color: '#6b7a96' }}>Coming soon...</span>
        </div>
        <h2 className="text-lg font-bold mb-2" style={{ color: '#eceef5' }}>Bitcoin Intelligence Coming to ControlNode</h2>
        <p className="text-sm" style={{ color: '#9aa8be' }}>Daily Bitcoin briefings, macro analysis, ETF flows, whale tracking and more.</p>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl" style={{ background: 'rgba(13,15,20,0.75)', backdropFilter: 'blur(2px)' }}>
        <Lock size={20} style={{ color, marginBottom: '8px' }} />
        <span className="text-xs font-bold tracking-widest uppercase" style={{ color }}>Coming Soon</span>
      </div>
    </div>
  )
}

export default function BitcoinDashboard() {
  return (
    <AppLayout>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(247,147,26,0.15)' }}>
            <Bitcoin size={18} style={{ color: '#f7931a' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>Bitcoin Intelligence</h1>
            <p className="text-xs" style={{ color: '#6b7a96' }}>Coming soon to ControlNode</p>
          </div>
          <div className="ml-auto px-3 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase flex items-center gap-2" style={{ background: 'rgba(247,147,26,0.12)', border: '1px solid rgba(247,147,26,0.3)', color: '#f7931a' }}>
            <Lock size={11} />
            Coming Soon
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: 'rgba(247,147,26,0.07)', border: '1px solid rgba(247,147,26,0.2)' }}>
          <p className="text-sm" style={{ color: '#9aa8be' }}>
            <span style={{ color: '#f7931a', fontWeight: 600 }}>Bitcoin Intelligence is coming to ControlNode. </span>
            We're building the same depth of daily briefings, macro context, ETF flow tracking, whale alerts, and curated intelligence — all focused on Bitcoin. Founding members will get access first.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <BlurredBriefCard title="BTC MORNING BRIEF" color="#f7931a" />
        <BlurredBriefCard title="BTC DAILY WRAP" color="#8b5cf6" />
      </div>

      <div className="mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6b7a96' }}>Intelligence Modules</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <BlurredCard title="BTC Price Snapshot" />
        <BlurredCard title="Technical Analysis" />
        <BlurredCard title="Bitcoin News" />
        <BlurredCard title="Halving Cycle Tracker" />
        <BlurredCard title="Geopolitical Watch" />
        <BlurredCard title="Bitcoin ETF Flows" />
        <BlurredCard title="Media Intelligence" />
        <BlurredCard title="Macro Correlation" />
        <BlurredCard title="Whale Alerts" />
      </div>

      <div className="mt-8 rounded-xl p-6 text-center" style={{ background: 'rgba(247,147,26,0.07)', border: '1px solid rgba(247,147,26,0.2)' }}>
        <Bitcoin size={32} className="mx-auto mb-3" style={{ color: '#f7931a' }} />
        <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>Bitcoin Intelligence — Coming Soon</h3>
        <p className="text-sm mb-1" style={{ color: '#9aa8be' }}>Founding members get early access when Bitcoin Intelligence launches.</p>
        <p className="text-xs" style={{ color: '#6b7a96' }}>Your membership covers all future intelligence modules at no additional cost.</p>
      </div>
    </AppLayout>
  )
}
