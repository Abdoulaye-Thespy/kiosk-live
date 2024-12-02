'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MagnifyingGlassIcon, FunnelIcon, ArrowsUpDownIcon } from "@heroicons/react/24/outline"
import { CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/solid"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Details from './details'

interface Proforma {
  id: string
  document: string
  object: string
  date: string
  status: 'Annulée' | 'Réglée' | 'En attente de Paiement'
}

export default function TabOneFactureClient() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const proformas: Proforma[] = [
    { id: '1', document: 'Document A', object: 'Object A', date: '2023-06-01', status: 'Annulée' },
    { id: '2', document: 'Document B', object: 'Object B', date: '2023-06-02', status: 'Réglée' },
    { id: '3', document: 'Document C', object: 'Object C', date: '2023-06-03', status: 'En attente de Paiement' },
    { id: '4', document: 'Document D', object: 'Object D', date: '2023-06-04', status: 'En attente de Paiement' },
    { id: '5', document: 'Document E', object: 'Object E', date: '2023-06-05', status: 'Réglée' },
];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(proformas.map(proforma => proforma.id))
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

  const handleDateSelect = (date: Date | undefined) => {
    setFilterDate(date)
    setIsCalendarOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher"
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <ArrowsUpDownIcon className="h-4 w-4" />
          </Button>
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <FunnelIcon className="h-4 w-4" />
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
                      <SelectItem value="Validée">Validée</SelectItem>
                      <SelectItem value="Rejetée">Rejetée</SelectItem>
                      <SelectItem value="En attente">En attente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
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
                        onSelect={handleDateSelect}
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

      <div className="rounded-md border">
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead className="w-[50px]">
                              <Checkbox
                                  checked={selectedIds.length === proformas.length}
                                  onCheckedChange={handleSelectAll}
                              />
                          </TableHead>
                          <TableHead>Numéro</TableHead>
                          <TableHead>Client associé</TableHead>
                          <TableHead>Montant total</TableHead>
                          <TableHead>Date création</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Actions</TableHead>
                          <TableHead></TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {proformas.map((proforma) => (
                          <TableRow key={proforma.id}>
                              <TableCell>
                                  <Checkbox
                                      checked={selectedIds.includes(proforma.id)}
                                      onCheckedChange={(checked) => {
                                          if (checked) {
                                              setSelectedIds([...selectedIds, proforma.id]);
                                          } else {
                                              setSelectedIds(selectedIds.filter((id) => id !== proforma.id));
                                          }
                                      }}
                                  />
                              </TableCell>
                              <TableCell>{proforma.id}</TableCell>
                              <TableCell>{proforma.document}</TableCell>
                              <TableCell>{proforma.object}</TableCell>
                              <TableCell>{proforma.date}</TableCell>
                              <TableCell>
                                  <div className="flex items-center gap-1">
                                      {proforma.status === "Annulée" && (
                                          <span className="text-red-500">Annulée</span>
                                      )}
                                      {proforma.status === "Réglée" && (
                                          <span className="text-green-500">Réglée</span>
                                      )}
                                      {proforma.status === "En attente de Paiement" && (
                                          <span className="text-yellow-500">En attente de Paiement</span>
                                      )}
                                  </div>
                              </TableCell>
                              <TableCell>
                                  <div className="flex gap-2">
                                      <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-green-600 hover:text-green-700"
                                      >
                                          Payer
                                      </Button>
                                      <Button
                                          variant="outline"
                                          size="sm"
                                          className="text-red-600 hover:text-red-700"
                                      >
                                          Rejeter
                                      </Button>
                                  </div>
                              </TableCell>
                              <TableCell>
                                  <Details proforma={proforma} />
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page 1 of 34
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            ...
          </Button>
          <Button variant="outline" size="sm">
            34
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}