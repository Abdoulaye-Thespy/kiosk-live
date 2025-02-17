'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { UserPlusIcon } from "@heroicons/react/24/outline"
import TabOneFactureIntervention from '@/app/ui/responsable/tab1'
import InterventionTableTab2Responsable from '@/app/ui/responsable/tab2'
import Header from '@/app/ui/header'


const tabs = [
  { id: 'dashboard', label: "Vue des kiosque sur tableau" },
  { id: 'invoices', label: "Vue des kiosque sur Map" },
]

export default function InvoiceDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="container mx-auto p-4">
      <Header title='Interventions'/>
      <div className="flex justify-between items-center mb-6 mt-6">
        <nav className="flex space-x-1 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none ${
                activeTab === tab.id ? "border-b-2 border-orange-500 text-orange-600" : ""
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <Link href="/responsable/interventions/new">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white inline-flex items-center px-4 py-2 rounded-lg">
            <UserPlusIcon className="mr-2 h-4 w-4" />
            Ajouter une intervention
          </Button>
        </Link>
      </div>
      
      <div className="mt-4">
        {activeTab === 'dashboard' && <TabOneFactureIntervention />}
        {activeTab === 'invoices' && (
           <InterventionTableTab2Responsable />
        )}
      </div>
    </div>
  )
}