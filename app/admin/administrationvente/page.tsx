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

import TabTwo from '@/app/ui/admin/administrationvente/tab2'
import TabOne from '@/app/ui/admin/administrationvente/tab1'
import TabThree from '@/app/ui/admin/administrationvente/tab3'
import TabFour from '@/app/ui/admin/administrationvente/tab4'
import Header from '@/app/ui/header'

const tabs = [
  { id: 'validation', label: "Validation des proformas", icon: ClipboardDocumentCheckIcon },
  { id: 'activity', label: "Suivi de l'activité", icon: CalendarIcon },
  { id: 'stats', label: "Chiffres sur l'activité", icon: ChartBarIcon },
  { id: 'compartments', label: "Suivi des compartiments", icon: TableCellsIcon },
  { id: 'dashboard', label: "Tableau de bord", icon: ChartBarIcon },
]

const proformas = [
  {
    id: "1345",
    client: "Alain NGONO",
    amount: "100 000 fcfa",
    date: "01/02/2024",
    status: "Rejetée"
  },
  {
    id: "1339",
    client: "Thierry NTAMACK",
    amount: "100 000 fcfa",
    date: "01/02/2024",
    status: "Rejetée"
  },
  {
    id: "1340",
    client: "Boris ADJOGO",
    amount: "100 000 fcfa",
    date: "01/02/2024",
    status: "Validée"
  },
  {
    id: "1346",
    client: "Bruno AYOLO",
    amount: "600 000 fcfa",
    date: "01/02/2024",
    status: "Validée"
  },
  {
    id: "1332",
    client: "Alain NGONO",
    amount: "400 000 fcfa",
    date: "01/02/2024",
    status: "En attente"
  }
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
      <Header title="Administration de Vente" />
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="mt-4">
        {activeTab === 'validation' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Validation des proformas</h2>
            <TabOne />
          </div>
        )}
        {activeTab === 'activity' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Suivi de l'activité</h2>
            <div className="flex items-center justify-center border rounded-lg">
              <TabTwo />
            </div>
          </div>
        )}
        {activeTab === 'stats' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Chiffres sur l'activité</h2>
            <div className="flex items-center justify-center border rounded-lg">
              <TabThree />
            </div>
          </div>
        )}
        {activeTab === 'compartments' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Suivi des compartiments</h2>
            <TabFour />
          </div>
        )}
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Tableau de bord</h2>
            <div className="h-[400px] flex items-center justify-center border rounded-lg">
              <p className="text-muted-foreground">Contenu du tableau de bord à implémenter</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}