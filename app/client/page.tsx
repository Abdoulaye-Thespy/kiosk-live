"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import KioskTab1Client from "../ui/client/kiosque/tab1"
import { AddKioskDialogClient } from "../ui/client/kiosque/nouveau"
import Header from "@/app/ui/header"
import { deleteKiosk, getUserKiosks } from "@/app/actions/kiosk-actions"
import TabTwoKioskClient from "../ui/client/kiosque/tab2"
import type { Kiosk } from "@prisma/client"
import { Loader2 } from "lucide-react"

const tabs = [
  { id: "dashboard", label: "Vue des kiosque sur tableau" },
  { id: "invoices", label: "Vue des kiosque sur Map" },
]

export default function KioskDashboard() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [kiosks, setKiosks] = useState<Kiosk[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  const fetchKiosks = useCallback(async () => {
    if (!session?.user?.id) return

    try {
      setIsLoading(true)
      const result = await getUserKiosks({
        userId: session.user.id,
        page: currentPage,
        searchTerm,
        status: filterStatus as any,
        date: filterDate,
      })
      setKiosks(result.kiosks)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error("Error fetching kiosks:", error)
      // You might want to add error handling UI here
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.id, currentPage, searchTerm, filterStatus, filterDate])

  useEffect(() => {
    if (status === "authenticated") {
      fetchKiosks()
    }
  }, [status, fetchKiosks])

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

  const handleKioskDelete = async (kioskId: number) => {
    try {
      const result = await deleteKiosk(kioskId)
      if (result.error) {
        console.error(result.error)
      } else {
        setKiosks(kiosks.filter((kiosk) => kiosk.id !== kioskId))
        console.log(result.message)
      }
    } catch (error) {
      console.error("Error deleting kiosk:", error)
    }
  }

  const handleKioskAdd = (newKiosk: Kiosk) => {
    setKiosks((prevKiosks) => [newKiosk, ...prevKiosks])
    fetchKiosks() // Refresh the list to ensure we have the latest data
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-500">Please log in to view your kiosks</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <Header title="Mes Kiosques" />
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
        <div className="flex justify-between items-center mb-6 mt-6">
          <div></div>
          <AddKioskDialogClient />
        </div>
      </div>

      <div className="mt-4">
        {activeTab === "dashboard" && (
          <KioskTab1Client
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
        {activeTab === "invoices" && <TabTwoKioskClient />}
      </div>
    </div>
  )
}

