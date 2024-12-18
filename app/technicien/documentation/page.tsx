'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  CalendarIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline"
import { CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/solid"

import TabOneFactureClient from '@/app/ui/client/facture/tab1'
import TabTwoFactureClient from '@/app/ui/client/facture/tab2'


import Header from '@/app/ui/header'

const tabs = [
  { id: 'validation', label: "Factures", icon: ClipboardDocumentCheckIcon },
  { id: 'activity', label: "Documentation", icon: CalendarIcon },
]


const TabNavigation = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: Function }) => {
  return (
    <nav className="flex space-x-1 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 focus:outline-none ${
            activeTab === tab.id ? "border-b-2 border-orange-500 text-orange-600" : ""
          }`}
        >
          <tab.icon className="h-4 w-4 mr-2 inline-block" />
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

export default function AdminDashboard() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('validation')

  return (
    <div className="container mx-auto p-4">
      <Header title="Mes Factures" />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="mt-4">
        {activeTab === 'validation' && (
          <div>
            <TabOneFactureClient />
          </div>
        )}
        {activeTab === 'activity' && (
          <div>
            <div>
              <TabTwoFactureClient />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}