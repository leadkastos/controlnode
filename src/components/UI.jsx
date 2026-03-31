import React from 'react'

export function Card({ children, className = '', style = {} }) {
  return (
    <div
      className={`rounded-xl border ${className}`}
      style={{ background: '#161a22', borderColor: '#1e2330', ...style }}
    >
      {children}
    </div>
  )
}

export function Button({ children, variant = 'primary', onClick, className = '' }) {
  if (variant === 'primary') {
    return (
      <button
        onClick={onClick}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${className}`}
        style={{ background: '#3b82f6', color: '#fff' }}
        onMouseEnter={e => e.target.style.background = '#2563eb'}
        onMouseLeave={e => e.target.style.background = '#3b82f6'}
      >
        {children}
      </button>
    )
  }
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 border ${className}`}
      style={{ color: '#8892a4', borderColor: '#1e2330', background: 'transparent' }}
    >
      {children}
    </button>
  )
}

export function Badge({ children, color = 'blue' }) {
  const colors = {
    blue: { bg: 'rgba(59,130,246,0.12)', text: '#3b82f6' },
    green: { bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
    red: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
    yellow: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
    purple: { bg: 'rgba(139,92,246,0.12)', text: '#8b5cf6' },
  }
  const c = colors[color] || colors.blue
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
      style={{ background: c.bg, color: c.text }}
    >
      {children}
    </span>
  )
}

export function SectionTitle({ children }) {
  return (
    <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Syne, sans-serif', color: '#e8eaf0' }}>
      {children}
    </h2>
  )
}
