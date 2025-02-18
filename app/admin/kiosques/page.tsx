"use client"

import { useState, useEffect } from "react"
import KioskTab1 from "@/app/ui/admin/kiosques/tab1"
import KioskTab2 from "@/app/ui/admin/kiosques/tab2"
import { AddKioskDialog } from "@/app/ui/admin/kiosques/nouveau"
import Header from "@/app/ui/header"
import { getKiosks } from "@/app/actions/kiosk-actions"
import type { KioskType } from "@prisma/client"

const tabs = [
  { id: "dashboard", label: "Vue des kiosque sur tableau" },
  { id: "invoices", label: "Vue des kiosque sur Map" },
]

interface Kiosk {
  id: number
  kioskName: string
  managerName: string
  clientName: string
  kioskAddress: string
  status: KioskType
  averageMonthlyRevenue: number
  type: string
  compartment: string
}

export default function InvoiceDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [kiosks, setKiosks] = useState<Kiosk[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    fetchKiosks()
  }, [currentPage, searchTerm, filterStatus, filterDate])

  const fetchKiosks = async () => {
    const result = await getKiosks({
      page: currentPage,
      searchTerm,
      status: filterStatus as any,
      date: filterDate,
    })
    setKiosks(result.kiosks)
    setTotalPages(result.totalPages)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handleFilterStatus = (status: string) => {
    setFilterStatus(status)
    setCurrentPage(1)
  }

  const handleFilterDate = (date: Date | undefined) => {
    setFilterDate(date)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleKioskUpdate = (updatedKiosk: Kiosk) => {
    setKiosks(kiosks.map((kiosk) => (kiosk.id === updatedKiosk.id ? updatedKiosk : kiosk)))
  }

  const handleKioskDelete = (kioskId: number) => {
    setKiosks(kiosks.filter((kiosk) => kiosk.id !== kioskId))
  }

  return (
    <div className="container mx-auto p-4">
      <Header title="Kiosques" />
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
        <AddKioskDialog onKioskAdded={fetchKiosks} />
      </div>

      <div className="mt-4">
        {activeTab === "dashboard" && (
          <KioskTab1
            kiosks={kiosks}
            totalPages={totalPages}
            currentPage={currentPage}
            searchTerm={searchTerm}
            filterStatus={filterStatus}
            filterDate={filterDate}
            onSearch={handleSearch}
            onFilterStatus={handleFilterStatus}
            onFilterDate={handleFilterDate}
            onPageChange={handlePageChange}
            onKioskUpdate={handleKioskUpdate}
            onKioskDelete={handleKioskDelete}
            onRefresh={fetchKiosks}
          />
        )}
        {activeTab === "invoices" && <KioskTab2 />}
      </div>
    </div>
  )
}

