"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import KioskMetrics from "@/app/ui/admin/kiosques/metrics"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { MoreHorizontal, RotateCcw, Filter } from "lucide-react"
import type { KioskType } from "@prisma/client"
import { UpdateKioskDialogAdmin } from "./modifykiok"
import { useState } from "react"

import { type Kiosk } from "@prisma/client"

interface KioskTab1Props {
  kiosks: Kiosk[]
  totalPages: number
  currentPage: number
  searchTerm: string
  filterStatus: string
  filterDate: Date | undefined
  onSearch: (term: string) => void
  onFilterStatus: (status: string) => void
  onFilterDate: (date: Date | undefined) => void
  onPageChange: (page: number) => void
  onKioskUpdate: (kiosk: Kiosk) => void
  onKioskDelete: (kioskId: number) => void
  onRefresh: () => void
}

export default function KioskTab1({
  kiosks,
  totalPages,
  currentPage,
  searchTerm,
  filterStatus,
  filterDate,
  onSearch,
  onFilterStatus,
  onFilterDate,
  onPageChange,
  onKioskUpdate,
  onKioskDelete,
  onRefresh,
}: KioskTab1Props) {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false)
  const [selectedKiosk, setSelectedKiosk] = useState<Kiosk | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "text-green-600 bg-green-50"
      case "UNDER_MAINTENANCE":
        return "text-yellow-600 bg-yellow-50"
      case "REQUEST":
      case "LOCALIZING":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(kiosks.map((kiosk) => kiosk.id))
    } else {
      setSelectedIds([])
    }
  }

  const resetFilters = () => {
    onFilterStatus("")
    onFilterDate(undefined)
  }

  const applyFilters = () => {
    onPageChange(1)
    onRefresh()
    setIsFilterOpen(false)
  }

  const handleModify = (kiosk: Kiosk) => {
    setSelectedKiosk(kiosk)
    setIsModifyDialogOpen(true)
  }

  const handleDelete = (kioskId: number) => {
    if (window.confirm("Are you sure you want to delete this kiosk?")) {
      onKioskDelete(kioskId)
    }
  }

  const getStatusTranslation = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "En activité"
      case "UNDER_MAINTENANCE":
        return "En maintenance"
      case "REQUEST":
        return "En attente"
      case "LOCALIZING":
        return "En localisation"
      default:
        return status
    }
  }

  const getCompartmentTranslation = (compartment: string) => {
    switch (compartment) {
      case "ONE_COMPARTMENT_WITH_BRANDING":
        return "Un compartiment avec marque"
      case "ONE_COMPARTMENT_WITHOUT_BRANDING":
        return "Un compartiment sans marque"
      case "THREE_COMPARTMENT_WITHOUT_BRANDING":
        return "Trois compartiments sans marque"
      case "THREE_COMPARTMENT_WITH_BRANDING":
        return "Trois compartiments avec marque"
      default:
        return compartment
    }
  }

  return (
    <div className="space-y-4 p-6">
      <KioskMetrics />
    </div>
  )
}

