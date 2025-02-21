'use client'

import React, { useState } from 'react'
import { cn } from "@/lib/utils"
import Header from '@/app/ui/header'
import MaintenanceCalendarTechnicien from '@/app/ui/technicien/historique/tab3'
import MaintenanceDashboardTechnicien from '@/app/ui/technicien/historique/tab1'
const tabs = [
  { id: 'overview', label: "Vue en Liste" },
  { id: 'planning', label: "Vue sur Calendrier" },
]

const TabNavigation = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: Function }) => {
  return (
    <nav className="flex space-x-1 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none",
            activeTab === tab.id && "border-b-2 border-orange-500 text-orange-600"
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

export default function MaintenanceManagement() {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="container mx-auto p-4">
      <Header title='Factures et Paiements'/>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="mt-4">
        {activeTab === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Vue d'ensemble</h2>
            <MaintenanceDashboardTechnicien />
          </div>
        )}
        {activeTab === 'maintenance' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Tickets de maintenance</h2>
            <MaintenanceCalendarTechnicien />
          </div>
        )}
        {activeTab === 'planning' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Planification et suivi</h2>
            <MaintenanceCalendarTechnicien />
          </div>
        )}
        {activeTab === 'technicians' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Gestion des techniciens</h2>
            {/* Insert Technician Management component here */}
          </div>
        )}
        {activeTab === 'history' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Historique</h2>
            {/* Insert History component here */}
          </div>
        )}
      </div>
    </div>
  )
}