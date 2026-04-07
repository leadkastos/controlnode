import React from 'react'
import AppLayout from '../components/AppLayout'
import MorningBriefCard from '../components/MorningBriefCard'
import DailyWrapCard from '../components/DailyWrapCard'
import DashboardCard from '../components/DashboardCard'
import { dashboardCards } from '../data/mockData'
export default function Dashboard() {
  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <MorningBriefCard />
        <DailyWrapCard />
      </div>
      <div className="mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#6b7a96' }}>
          Intelligence Modules
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {dashboardCards.map((card) => (
          <DashboardCard key={card.id} card={card} />
        ))}
      </div>
    </AppLayout>
  )
}
