import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function DashboardCard({ card }) {
  const nav = useNavigate()

  return (
    <div
      className="rounded-xl p-5 border flex flex-col gap-4 cursor-pointer group transition-all duration-200"
      style={{ background: '#161a22', borderColor: '#1e2330' }}
      onClick={() => nav(card.route)}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#1e2330'}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: '#e8eaf0' }}>{card.title}</h3>
      </div>

      <div className="space-y-2 flex-1">
        {card.data.map((item, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <span className="text-xs" style={{ color: '#8892a4' }}>{item.label}</span>
            <span
              className="text-xs font-medium text-right"
              style={{
                color: item.highlight ? '#e8eaf0' :
                  item.positive ? '#10b981' :
                  item.warning ? '#f59e0b' :
                  '#8892a4'
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <button
        className="flex items-center gap-1.5 text-xs font-medium mt-auto transition-colors"
        style={{ color: '#3b82f6' }}
      >
        View Details
        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  )
}
