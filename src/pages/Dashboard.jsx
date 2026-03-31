import React from 'react'
import AppLayout from '../components/AppLayout'
import MorningBriefCard from '../components/MorningBriefCard'
import DashboardCard from '../components/DashboardCard'
import { dashboardCards } from '../data/mockData'

export default function Dashboard() {
  return (
    <AppLayout>
      <MorningBriefCard />

      <div className="mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#4a5568' }}>
          Intelligence Modules
        </h2>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        {dashboardCards.map((card) => (
          <DashboardCard key={card.id} card={card} />
        ))}
      </div>
    </AppLayout>
  )
}
