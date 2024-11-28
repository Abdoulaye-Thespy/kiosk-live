'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import KioskMetrics from '@/app/ui/admin/kiosques/metrics';
import Header from '@/app/ui/header';
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { MoreHorizontal, RotateCcw, Settings, Signal, Filter } from 'lucide-react'

interface Kiosk {
  id: string
  manager: string
  city: string
  zone: string
  status: 'En activité' | 'En maintenance' | 'Fermé'
  revenue: string
}

const kiosks: Kiosk[] = [
  {
    id: "1345",
    manager: "NDOUMBE François",
    city: "Douala",
    zone: "Makepe plateau",
    status: "En activité",
    revenue: "1 000 000 FCFA"
  },
  {
    id: "1345",
    manager: "NDOUMBE François",
    city: "Douala",
    zone: "Makepe BM fin des pavés",
    status: "En maintenance",
    revenue: "1 000 000 FCFA"
  },
  {
    id: "1345",
    manager: "NDOUMBE François",
    city: "Douala",
    zone: "Makepe plateau",
    status: "Fermé",
    revenue: "1 000 000 FCFA"
  },
  {
    id: "1345",
    manager: "NDOUMBE François",
    city: "Yaoundé",
    zone: "Akwa Nord 2",
    status: "Fermé",
    revenue: "1 000 000 FCFA"
  },
  {
    id: "1345",
    manager: "Ngono Freddy",
    city: "Yaoundé",
    zone: "Makepe BM fin des pavés",
    status: "En maintenance",
    revenue: "1 000 000 FCFA"
  },
  {
    id: "1345",
    manager: "Ngono Freddy",
    city: "Douala",
    zone: "Deido",
    status: "En activité",
    revenue: "1 000 000 FCFA"
  },
  {
    id: "1345",
    manager: "HABIB Oumarou",
    city: "Douala",
    zone: "Akwa Nord 2",
    status: "En maintenance",
    revenue: "1 000 000 FCFA"
  },
  {
    id: "1345",
    manager: "HABIB Oumarou",
    city: "Yaoundé",
    zone: "Deido",
    status: "Fermé",
    revenue: "1 000 000 FCFA"
  },
  {
    id: "1345",
    manager: "ABDOU Rayim",
    city: "Yaoundé",
    zone: "Total Bonateki",
    status: "En activité",
    revenue: "1 000 000 FCFA"
  }
]

export default function KioskTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)
  const totalPages = 34

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En activité":
        return "text-green-600 bg-green-50"
      case "En maintenance":
        return "text-yellow-600 bg-yellow-50"
      case "Fermé":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(kiosks.map(kiosk => kiosk.id))
    } else {
      setSelectedIds([])
    }
  }

  const resetFilters = () => {
    setFilterStatus('')
    setFilterDate(undefined)
  }

  const applyFilters = () => {
    console.log('Filters applied:', { filterStatus, filterDate })
    setIsFilterOpen(false)
  }

  return (
    <div className="space-y-4 p-6">
      <Header title='Kiosque' />
      <KioskMetrics />
      <div className="flex items-center gap-4">
        <div className="relative w-72">
          <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="TOUS LES KIOSQUES" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">TOUS LES KIOSQUES</SelectItem>
            <SelectItem value="active">En activité</SelectItem>
            <SelectItem value="maintenance">En maintenance</SelectItem>
            <SelectItem value="closed">Fermé</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Signal className="h-4 w-4" />
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
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="En activité">En activité</SelectItem>
                      <SelectItem value="En maintenance">En maintenance</SelectItem>
                      <SelectItem value="Fermé">Fermé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {filterDate ? format(filterDate, "P", { locale: fr }) : "Sélectionner la date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filterDate}
                        onSelect={setFilterDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={resetFilters}>Réinitialiser</Button>
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
                <Checkbox
                  checked={selectedIds.length === kiosks.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>N° kiosque</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Revenu mensuel moyen</TableHead>
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
                        setSelectedIds(selectedIds.filter(id => id !== kiosk.id))
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{kiosk.id}</TableCell>
                <TableCell>{kiosk.manager}</TableCell>
                <TableCell>{kiosk.city}</TableCell>
                <TableCell>{kiosk.zone}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(kiosk.status)}`}>
                    {kiosk.status}
                  </span>
                </TableCell>
                <TableCell>{kiosk.revenue}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More actions</span>
                  </Button>
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
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {[1, 2, 3, '...', totalPages].map((page, index) => (
            <Button
              key={index}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (typeof page === 'number') setCurrentPage(page)
              }}
              className={`${typeof page !== 'number' ? 'pointer-events-none' : ''
                } ${page === currentPage ? 'bg-orange-500 text-white hover:bg-orange-600' : ''}`}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}