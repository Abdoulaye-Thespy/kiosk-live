"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import KioskTab1Client from "../ui/client/kiosque/tab1"
import { AddKioskDialogClient } from "../ui/client/kiosque/nouveau"
import Header from "@/app/ui/header"
import { deleteKiosk, getUserKiosks, getUserKioskRequests } from "@/app/actions/kiosk-actions"
import TabTwoKioskClient from "../ui/client/kiosque/tab2"
import type { Kiosk, KioskStatus } from "@prisma/client"
import { Loader2, ClipboardList } from "lucide-react"
import { KioskRequestsList } from "../ui/client/kiosque/kiosk-requests-list"

const tabs = [
  { id: "dashboard", label: "Vue des kiosques sur tableau" },
  { id: "requests", label: "Mes demandes" },
  { id: "invoices", label: "Vue des kiosques sur Map" },
]

interface KioskRequest {
  id: string
  requestNumber: string
  status: string
  requestedKioskType: string
  requestedCompartments: any
  wantBranding: boolean
  kioskAddress: string
  createdAt: string
  estimatedPrice: number | null
  assignedKiosk?: {
    kioskName: string
  }
}

export default function KioskDashboard() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [kiosks, setKiosks] = useState<Kiosk[]>([])
  const [kioskRequests, setKioskRequests] = useState<KioskRequest[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const fetchKiosks = useCallback(async () => {
    if (!session?.user?.id) return

    try {
      setIsLoading(true)
      const result = await getUserKiosks({
        userId: session.user.id,
        page: currentPage,
        limit: 10,
        searchTerm,
        status: filterStatus === "all" ? undefined : (filterStatus as KioskStatus),
        date: filterDate,
      })
      
      if (result && result.kiosks) {
        setKiosks(result.kiosks)
        setTotalPages(result.totalPages || 1)
      } else {
        setKiosks([])
        setTotalPages(1)
      }
    } catch (error) {
      console.error("Error fetching kiosks:", error)
      setKiosks([])
    } finally {
      setIsLoading(false)
    }
  }, [session?.user?.id, currentPage, searchTerm, filterStatus, filterDate])

  const fetchKioskRequests = useCallback(async () => {
    if (!session?.user?.id) return

    try {
      const result = await getUserKioskRequests(session.user.id)
      if (result.success && result.requests) {
        setKioskRequests(result.requests)
      }
    } catch (error) {
      console.error("Error fetching kiosk requests:", error)
    }
  }, [session?.user?.id])

  useEffect(() => {
    if (status === "authenticated") {
      fetchKiosks()
      fetchKioskRequests()
    }
  }, [status, fetchKiosks, fetchKioskRequests, refreshTrigger])

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
    setKiosks((prevKiosks) =>
      prevKiosks.map((kiosk) => (kiosk.id === updatedKiosk.id ? updatedKiosk : kiosk))
    )
  }

  const handleKioskDelete = async (kioskId: number) => {
    try {
      const result = await deleteKiosk(kioskId)
      if (result.error) {
        console.error(result.error)
      } else {
        setKiosks((prevKiosks) => prevKiosks.filter((kiosk) => kiosk.id !== kioskId))
        console.log(result.message)
        setRefreshTrigger(prev => prev + 1)
      }
    } catch (error) {
      console.error("Error deleting kiosk:", error)
    }
  }

  const handleKioskAdd = () => {
    setRefreshTrigger(prev => prev + 1)
    setCurrentPage(1)
    // Also refresh requests in case the request is shown in that tab
    fetchKioskRequests()
  }

  // Show loading state
  if (status === "loading" || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#ff6b4a] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Chargement de vos kiosques...</p>
        </div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-500">Veuillez vous connecter pour voir vos kiosques</p>
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
              className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none ${
                activeTab === tab.id
                  ? "border-b-2 border-[#ff6b4a] text-[#ff6b4a]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        
        <AddKioskDialogClient onKioskAdded={handleKioskAdd} />
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
        
        {activeTab === "requests" && (
          <KioskRequestsList 
            requests={kioskRequests}
            onRefresh={fetchKioskRequests}
          />
        )}
        
        {activeTab === "invoices" && (
          <TabTwoKioskClient 
            kiosks={kiosks} 
            onRefresh={fetchKiosks}
          />
        )}
      </div>
    </div>
  )
}