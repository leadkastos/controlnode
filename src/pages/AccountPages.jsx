import React from 'react'
import AppLayout from '../components/AppLayout'
import DetailPageLayout, { DetailSection, DataRow } from '../components/DetailPageLayout'
import { Badge } from '../components/UI'

export function Account() {
  return (
    <AppLayout hideRightSidebar>
      <DetailPageLayout title="Account" subtitle="Manage your ControlNode account details and preferences.">
        <DetailSection title="Profile">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff' }}
            >
              JD
            </div>
            <div>
              <p className="font-semibold" style={{ color: '#e8eaf0' }}>John Doe</p>
              <p className="text-sm" style={{ color: '#8892a4' }}>john@example.com</p>
              <Badge color="blue">Pro Plan</Badge>
            </div>
          </div>
          <div className="space-y-0">
            <DataRow label="Member Since" value="January 2025" />
            <DataRow label="Plan" value="ControlNode Pro" />
            <DataRow label="Status" value="Active" valueColor="#10b981" />
            <DataRow label="Last Login" value="Today, 6:30 AM CT" />
          </div>
        </DetailSection>
        <DetailSection title="Account Settings">
          <div className="space-y-3">
            {['Email Address', 'Display Name', 'Password', 'Timezone'].map((field) => (
              <div key={field} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: '#8892a4' }}>{field}</span>
                <button className="text-xs px-3 py-1.5 rounded-lg border transition-colors" style={{ color: '#3b82f6', borderColor: '#1e2330' }}>
                  Edit
                </button>
              </div>
            ))}
          </div>
        </DetailSection>
      </DetailPageLayout>
    </AppLayout>
  )
}

export function Billing() {
  return (
    <AppLayout hideRightSidebar>
      <DetailPageLayout title="Billing" subtitle="Manage your subscription, payment methods, and invoices.">
        <DetailSection title="Current Plan">
          <div
            className="rounded-lg p-4 mb-4"
            style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold" style={{ color: '#e8eaf0' }}>ControlNode Pro</p>
                <p className="text-sm" style={{ color: '#8892a4' }}>$49/month · Renews April 23, 2026</p>
              </div>
              <Badge color="blue">Active</Badge>
            </div>
          </div>
          <div className="space-y-0">
            <DataRow label="Next Billing Date" value="April 23, 2026" />
            <DataRow label="Amount" value="$49.00" />
            <DataRow label="Payment Method" value="Visa ····4242" />
          </div>
        </DetailSection>
        <DetailSection title="Invoices">
          <div className="space-y-2">
            {[
              { date: 'Mar 23, 2026', amount: '$49.00', status: 'Paid' },
              { date: 'Feb 23, 2026', amount: '$49.00', status: 'Paid' },
              { date: 'Jan 23, 2026', amount: '$49.00', status: 'Paid' },
            ].map((inv, i) => (
              <div key={i} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #1e2330' }}>
                <span className="text-sm" style={{ color: '#8892a4' }}>{inv.date}</span>
                <span className="text-sm" style={{ color: '#e8eaf0' }}>{inv.amount}</span>
                <Badge color="green">{inv.status}</Badge>
                <button className="text-xs" style={{ color: '#3b82f6' }}>Download</button>
              </div>
            ))}
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
        <DetailSection title="Notifications">
          <div className="space-y-3">
            {[
              { label: 'Morning Brief', desc: 'Notify when new brief is published', enabled: true },
              { label: 'ETF Flow Alerts', desc: 'Large inflow/outflow events', enabled: true },
              { label: 'Geopolitical Alerts', desc: 'Flash point updates', enabled: false },
              { label: 'Price Alerts', desc: 'XRP key level breaches', enabled: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #1e2330' }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: '#e8eaf0' }}>{item.label}</p>
                  <p className="text-xs" style={{ color: '#8892a4' }}>{item.desc}</p>
                </div>
                <div
                  className="w-10 h-5 rounded-full flex items-center px-0.5 cursor-pointer transition-colors"
                  style={{ background: item.enabled ? '#3b82f6' : '#1e2330' }}
                >
                  <div
                    className="w-4 h-4 rounded-full transition-transform"
                    style={{ background: '#fff', transform: item.enabled ? 'translateX(20px)' : 'translateX(0)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </DetailSection>
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
              <button
                key={action}
                className="text-sm px-4 py-2 rounded-lg border w-full text-left transition-colors"
                style={{ color: action === 'Delete Account' ? '#ef4444' : '#8892a4', borderColor: '#1e2330' }}
              >
                {action}
              </button>
            ))}
          </div>
        </DetailSection>
      </DetailPageLayout>
    </AppLayout>
  )
}
