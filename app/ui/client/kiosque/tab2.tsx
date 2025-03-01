'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import MapView from '../../maps/maps'
import KioskMetricsClient from './metrics'


const tabs = [
  { id: 'dashboard', label: "Vue des kiosques sur tableau" },
  { id: 'invoices', label: "Vue des kiosques sur Map" },
]

export default function TabTwoKioskClient() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="container mx-auto p-4">
      <KioskMetricsClient />
      <div className='mt-5'>
      <MapView />
      </div>
      
    
      
    </div>
  )
}