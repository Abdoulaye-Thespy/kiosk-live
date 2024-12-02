'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import TabOneFacturePaiement from '@/app/ui/admin/facturepaiement/tab1'
import TabTwoFacturePaiment from '@/app/ui/admin/facturepaiement/tab2'
import TabOneFacturePaiementClient from '@/app/ui/client/SAV/tab1'

const tabs = [
  { id: 'dashboard', label: "Tableau de bord" },
  { id: 'invoices', label: "Historique des interventions" },
  { id: 'transactions', label: "Documentation" },
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
          <Link
            href={{
              pathname: '/admin/facturepaiement/create',
            }}
            className=""
          >
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M5.99988 11.8332C5.72655 11.8332 5.49988 11.6066 5.49988 11.3332V8.53991L5.01988 9.01991C4.82655 9.21324 4.50655 9.21324 4.31321 9.01991C4.11988 8.82658 4.11988 8.50658 4.31321 8.31324L5.64655 6.97991C5.78655 6.83991 6.00655 6.79324 6.19321 6.87324C6.37988 6.94658 6.49988 7.13324 6.49988 7.33324V11.3332C6.49988 11.6066 6.27321 11.8332 5.99988 11.8332Z" fill="white" />
                <path d="M7.33338 9.16663C7.20671 9.16663 7.08004 9.11996 6.98004 9.01996L5.64671 7.68663C5.45338 7.49329 5.45338 7.17329 5.64671 6.97996C5.84004 6.78663 6.16004 6.78663 6.35338 6.97996L7.68671 8.31329C7.88004 8.50663 7.88004 8.82663 7.68671 9.01996C7.58671 9.11996 7.46004 9.16663 7.33338 9.16663Z" fill="white" />
                <path d="M9.99992 15.1666H5.99992C2.37992 15.1666 0.833252 13.6199 0.833252 9.99992V5.99992C0.833252 2.37992 2.37992 0.833252 5.99992 0.833252H9.33325C9.60659 0.833252 9.83325 1.05992 9.83325 1.33325C9.83325 1.60659 9.60659 1.83325 9.33325 1.83325H5.99992C2.92659 1.83325 1.83325 2.92659 1.83325 5.99992V9.99992C1.83325 13.0733 2.92659 14.1666 5.99992 14.1666H9.99992C13.0733 14.1666 14.1666 13.0733 14.1666 9.99992V6.66659C14.1666 6.39325 14.3933 6.16659 14.6666 6.16659C14.9399 6.16659 15.1666 6.39325 15.1666 6.66659V9.99992C15.1666 13.6199 13.6199 15.1666 9.99992 15.1666Z" fill="white" />
                <path d="M14.6666 7.16658H11.9999C9.71992 7.16658 8.83325 6.27991 8.83325 3.99991V1.33324C8.83325 1.13324 8.95325 0.946578 9.13992 0.873244C9.32659 0.793244 9.53992 0.839911 9.68659 0.979911L15.0199 6.31324C15.1599 6.45324 15.2066 6.67324 15.1266 6.85991C15.0466 7.04658 14.8666 7.16658 14.6666 7.16658ZM9.83325 2.53991V3.99991C9.83325 5.71991 10.2799 6.16658 11.9999 6.16658H13.4599L9.83325 2.53991Z" fill="white" />
              </svg>
              Créer une nouvelle demande
            </Button>
          </Link>

        </div>
      </div>
      
      <div className="mt-4">
        {activeTab === 'dashboard' && <TabOneFacturePaiementClient />}
        {activeTab === 'invoices' && (
           <TabTwoFacturePaiment />
        )}
        {activeTab === 'transactions' && (
          <TabOneFacturePaiementClient />
        )}
      </div>
    </div>
  )
}