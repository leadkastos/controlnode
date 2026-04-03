import React from 'react'
import { Badge } from './UI'

export function DetailSection({ title, children }) {
  return (
    <div className="rounded-xl p-5 border mb-4" style={{ background: '#161a22', borderColor: '#1e2330' }}>
      <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>
        {title}
      </h3>
      <div style={{ color: '#9aa8be' }}>
        {children}
      </div>
    </div>
  )
}

export function DataRow({ label, value, valueColor }) {
  return (
    <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #1e2330' }}>
      <span className="text-sm" style={{ color: '#9aa8be' }}>{label}</span>
      <span className="text-sm font-medium" style={{ color: valueColor || '#e8eaf0' }}>{value}</span>
    </div>
  )
}

export function BulletList({ items }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: '#3b82f6' }} />
          <span className="text-sm leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function DetailPageLayout({ title, subtitle, badge, badgeColor, children }) {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        {badge && (
          <div className="mb-2">
            <Badge color={badgeColor || 'blue'}>{badge}</Badge>
          </div>
        )}
        <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif', color: '#eceef5' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm leading-relaxed" style={{ color: '#9aa8be' }}>{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  )
}
