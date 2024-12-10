'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import KioskTab1 from '@/app/ui/admin/kiosques/tab1'
import KioskTab2 from '@/app/ui/admin/kiosques/tab2'
import { AddKioskDialog } from '@/app/ui/admin/kiosques/nouveau'


const tabs = [
  { id: 'dashboard', label: "Vue des kiosque sur tableau" },
  { id: 'invoices', label: "Vue des kiosque sur Map" },
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
        <AddKioskDialog />
      </div>
      
      <div className="mt-4">
        {activeTab === 'dashboard' && <KioskTab1 />}
        {activeTab === 'invoices' && (
           <KioskTab2 />
        )}
      </div>
    </div>
  )
}