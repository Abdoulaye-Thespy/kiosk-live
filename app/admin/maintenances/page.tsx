'use client'

import React, { useState } from 'react'
import { cn } from "@/lib/utils"
import Header from '@/app/ui/header'
import TabOneMaintenance from '@/app/ui/admin/maintenance/tab1'
import TabTwoMaintenance from '@/app/ui/admin/maintenance/tab2'
import TabThreeMaintenance from '@/app/ui/admin/maintenance/tab3'

const tabs = [
  { id: 'overview', label: "Vue d'ensemble" },
  { id: 'maintenance', label: "Tickets de maintenance" },
  { id: 'planning', label: "Planification et suivi" },
  { id: 'technicians', label: "Gestion des techniciens" },
  { id: 'history', label: "Historique" },
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
            <TabOneMaintenance />
          </div>
        )}
        {activeTab === 'maintenance' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Tickets de maintenance</h2>
            <TabTwoMaintenance />
          </div>
        )}
        {activeTab === 'planning' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Planification et suivi</h2>
            <TabThreeMaintenance />
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