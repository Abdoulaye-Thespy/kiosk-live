'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import { AddKioskDialog } from '@/app/ui/admin/kiosques/nouveau'
import Header from '../ui/header'
import KioskMetricsClient from '../ui/client/kiosque/metrics'
import MapView from '../ui/maps/maps'


const tabs = [
  { id: 'dashboard', label: "Vue des kiosque sur tableau" },
  { id: 'invoices', label: "Vue des kiosque sur Map" },
]

export default function InvoiceDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="container mx-auto p-4">
      <Header title='Mes Kiosques'/>
      <div className="flex justify-between items-center mb-6 mt-6">
        <div></div>
        <AddKioskDialog />
      </div>
      <KioskMetricsClient />
      <div className='mt-5'>
      <MapView />
      </div>
      
    
      
    </div>
  )
}