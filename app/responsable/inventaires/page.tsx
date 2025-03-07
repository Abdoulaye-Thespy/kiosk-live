"use client"

import { useState, useEffect, useCallback } from "react"
import KioskTab1 from "@/app/ui/responsable/kiosques/tab1"
import KioskTab2 from "@/app/ui/admin/kiosques/tab2"
import { AddKioskDialog } from "@/app/ui/admin/kiosques/nouveau"
import Header from "@/app/ui/header"
import { getKiosks } from "@/app/actions/kiosk-actions"

const tabs = [
  { id: "dashboard", label: "Vue des kiosque sur tableau" },
]


import { type Kiosk } from "@prisma/client"

export default function InvoiceDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [kiosks, setKiosks] = useState<Kiosk[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)

  const fetchKiosks = useCallback(async () => {
    const result = await getKiosks({
      page: currentPage,
      searchTerm,
      status: filterStatus as any,
      date: filterDate,
    })
    console.log(result.kiosks)
    setKiosks(result.kiosks)
    setTotalPages(result.totalPages)
  }, [currentPage, searchTerm, filterStatus, filterDate])

  useEffect(() => {
    fetchKiosks()
  }, [fetchKiosks])

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

  const handleKioskAdd = (newKiosk: Kiosk) => {
  console.log("handlign kiosk add")
    setKiosks((prevKiosks) => [newKiosk, ...prevKiosks])
    fetchKiosks() // Refresh the list to ensure we have the latest data
  }

  return (
    <div className="container mx-auto p-4">
      <Header title="Inventaires" />

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

