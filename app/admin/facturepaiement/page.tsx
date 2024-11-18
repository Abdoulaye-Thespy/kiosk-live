'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import TabOneFacturePaiement from '@/app/ui/facturepaiement/tab1'
import TabTwoFacturePaiment from '@/app/ui/facturepaiement/tab2'

const tabs = [
  { id: 'dashboard', label: "Tableau de bord" },
  { id: 'invoices', label: "factures émises" },
  { id: 'transactions', label: "Transactions" },
]

export default function InvoiceDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
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
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <ArrowDownTrayIcon className="h-5 w-5" />
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Créer une nouvelle facture
          </Button>
        </div>
      </div>
      
      <div className="mt-4">
        {activeTab === 'dashboard' && <TabOneFacturePaiement />}
        {activeTab === 'invoices' && (
           <TabTwoFacturePaiment />
        )}
        {activeTab === 'transactions' && (
          <div className="h-[400px] flex items-center justify-center border rounded-lg">
            <p className="text-muted-foreground">Contenu des transactions à implémenter</p>
          </div>
        )}
      </div>
    </div>
  )
}