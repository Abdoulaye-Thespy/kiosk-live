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
  client: string
  amount: string
  date: string
  status: 'Validée' | 'Rejetée' | 'En attente'
}

export default function AdminSalesTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)

  const proformas: Proforma[] = [
    { id: '1', client: 'Client A', amount: '1000€', date: '2023-06-01', status: 'Validée' },
    { id: '2', client: 'Client B', amount: '2000€', date: '2023-06-02', status: 'Rejetée' },
    { id: '3', client: 'Client C', amount: '3000€', date: '2023-06-03', status: 'En attente' },
    { id: '4', client: 'Client D', amount: '4000€', date: '2023-06-04', status: 'En attente' },
    { id: '5', client: 'Client E', amount: '5000€', date: '2023-06-05', status: 'Validée' },
  ]

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
                        setSelectedIds([...selectedIds, proforma.id])
                      } else {
                        setSelectedIds(selectedIds.filter(id => id !== proforma.id))
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{proforma.id}</TableCell>
                <TableCell>{proforma.client}</TableCell>
                <TableCell>{proforma.amount}</TableCell>
                <TableCell>{proforma.date}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {proforma.status === "Validée" && (
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    )}
                    {proforma.status === "Rejetée" && (
                      <XCircleIcon className="h-4 w-4 text-red-500" />
                    )}
                    {proforma.status === "En attente" && (
                      <ClockIcon className="h-4 w-4 text-yellow-500" />
                    )}
                    {proforma.status}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 hover:text-green-700"
                    >
                      Valider
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      Rejeter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-orange-600 hover:text-orange-700"
                    >
                      Renvoyer au client
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Details proforma={proforma}/>
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