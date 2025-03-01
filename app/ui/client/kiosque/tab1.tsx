"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import KioskMetricsClient from "./metrics"
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
import { UpdateKioskDialogAdmin } from "../../admin/kiosques/modifykiok"
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

export default function KioskTab1Client({
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
      <KioskMetricsClient />
      <div className="flex items-center gap-4">
        <div className="relative w-72">
          <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Select defaultValue="AVAILABLE" onValueChange={onFilterStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="TOUS LES KIOSQUES" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">TOUS LES KIOSQUES</SelectItem>
            <SelectItem value="AVAILABLE">En activité</SelectItem>
            <SelectItem value="UNDER_MAINTENANCE">En maintenance</SelectItem>
            <SelectItem value="REQUEST">En attente</SelectItem>
            <SelectItem value="LOCALIZING">En localisation</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onRefresh}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Filtres</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Statut</label>
                  <Select value={filterStatus} onValueChange={onFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">Tous</SelectItem>
                      <SelectItem value="AVAILABLE">En activité</SelectItem>
                      <SelectItem value="UNDER_MAINTENANCE">En maintenance</SelectItem>
                      <SelectItem value="REQUEST">En attente</SelectItem>
                      <SelectItem value="LOCALIZING">En localisation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        {filterDate ? format(filterDate, "P", { locale: fr }) : "Sélectionner la date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={filterDate} onSelect={onFilterDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={resetFilters}>
                    Réinitialiser
                  </Button>
                  <Button onClick={applyFilters}>Appliquer</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox checked={selectedIds.length === kiosks.length} onCheckedChange={handleSelectAll} />
              </TableHead>
              <TableHead>Nom de l'Entreprise</TableHead>
              <TableHead>Gestionnaire</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Adresse</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Type de kiosque</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {kiosks.map((kiosk) => (
              <TableRow key={kiosk.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(kiosk.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedIds([...selectedIds, kiosk.id])
                      } else {
                        setSelectedIds(selectedIds.filter((id) => id !== kiosk.id))
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{kiosk.kioskName}</TableCell>
                <TableCell>{kiosk.managerName}</TableCell>
                <TableCell>{kiosk.clientName}</TableCell>
                <TableCell>{kiosk.kioskAddress}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(kiosk.status)}`}
                  >
                    {getStatusTranslation(kiosk.status)}
                  </span>
                </TableCell>
                <TableCell>{getCompartmentTranslation(kiosk.type)}</TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More actions</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent side="left" className="w-40">
                      <div className="flex flex-col space-y-2">
                        <Button size="sm" onClick={() => handleModify(kiosk)}>
                          Modifier
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(kiosk.id)}>
                          Effacer
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {[1, 2, 3, "...", totalPages].map((page, index) => (
            <Button
              key={index}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (typeof page === "number") onPageChange(page)
              }}
              className={`${
                typeof page !== "number" ? "pointer-events-none" : ""
              } ${page === currentPage ? "bg-orange-500 text-white hover:bg-orange-600" : ""}`}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
      <UpdateKioskDialogAdmin
        isOpen={isModifyDialogOpen}
        kiosks={kiosks}
        onOpenChange={setIsModifyDialogOpen}
        kiosk={selectedKiosk}
        onSuccess={(updatedKiosk) => {
          setIsModifyDialogOpen(false)
          onKioskUpdate(updatedKiosk)
        }}
      />
    </div>
  )
}

