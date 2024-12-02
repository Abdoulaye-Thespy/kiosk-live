'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MagnifyingGlassIcon, PhotoIcon } from "@heroicons/react/24/outline"
import { ArrowPathIcon } from "@heroicons/react/24/solid"
import TabOneParemetre from "@/app/ui/admin/parametre/tab1"
import TabTwoParemetre from "@/app/ui/admin/parametre/tab2"
import TabThreeParametre from "@/app/ui/admin/parametre/tab3"
import TabFourParametre from "@/app/ui/admin/parametre/tab4"

const tabs = [
  { id: 'general', label: "Général" },
  { id: 'bank', label: "Comptes bancaires" },
  { id: 'notifications', label: "Notifications" },
  { id: 'connection', label: "Informations de connexion" },
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
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-9 w-[250px]"
            />
          </div>
          <Button variant="ghost" size="icon">
            <ArrowPathIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-6">
          {activeTab === 'general' && (
            <div>
              <TabOneParemetre />
            </div>
          )}
          {activeTab === 'bank' && (
            <div>
              <TabTwoParemetre />
            </div>
          )}
          {activeTab === 'notifications' && (
            <div>
              <TabThreeParametre />
            </div>
          )}
          {activeTab === 'connection' && (
            <div>
              <TabFourParametre />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}