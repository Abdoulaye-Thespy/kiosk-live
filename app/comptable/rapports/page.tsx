'use client'

import * as React from "react"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FileText, Eye, Download, ChevronDown, Filter } from 'lucide-react'
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface Report {
  id: string
  name: string
  type: string
  date: string
}

const reports: Report[] = [
  {
    id: "1",
    name: "Rap_contrat 1547",
    type: "Paiement",
    date: "9 Juil 2023"
  },
  {
    id: "2",
    name: "Rap_paiement 1547",
    type: "Contrats",
    date: "9 Juil 2023"
  },
  {
    id: "3",
    name: "Rap_facture 1867",
    type: "Inventaire",
    date: "9 Juil 2023"
  },
  {
    id: "4",
    name: "Rap_inventaire 10436",
    type: "Contrats",
    date: "9 Juil 2023"
  },
  {
    id: "5",
    name: "Rap_paiement 1547",
    type: "Facture",
    date: "9 Juil 2023"
  },
  {
    id: "6",
    name: "Rap_facture 1867",
    type: "Inventaire",
    date: "9 Juil 2023"
  },
  {
    id: "7",
    name: "Rap_inventaire 10436",
    type: "Facture",
    date: "9 Juil 2023"
  },
  {
    id: "8",
    name: "Rap_inventaire 10436",
    type: "Facture",
    date: "9 Juil 2023"
  },
  {
    id: "9",
    name: "Rap_inventaire 10436",
    type: "Facture",
    date: "9 Juil 2023"
  },
  {
    id: "10",
    name: "Rap_inventaire 10436",
    type: "Facture",
    date: "9 Juil 2023"
  }
]

export default function FinancialReports() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>(undefined)
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>(undefined)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isStartDateOpen, setIsStartDateOpen] = useState(false)
  const [isEndDateOpen, setIsEndDateOpen] = useState(false)

  const totalPages = 34

  const filteredReports = reports.filter(report => 
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === '' || report.type === filterType) &&
    (!filterStartDate || new Date(report.date) >= filterStartDate) &&
    (!filterEndDate || new Date(report.date) <= filterEndDate)
  )

  const resetFilters = () => {
    setFilterType('')
    setFilterStartDate(undefined)
    setFilterEndDate(undefined)
  }

  const applyFilters = () => {
    setIsFilterOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Recherche"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2">
          <span className="text-sm">14</span>
          <Button variant="ghost" size="icon">
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="p-4 space-y-4">
                <h3 className="font-semibold text-lg">Filtre</h3>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Type</Label>
                  <RadioGroup value={filterType} onValueChange={setFilterType}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="" id="all" />
                      <Label htmlFor="all">Tous</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Paiement" id="payment" />
                      <Label htmlFor="payment">Paiement</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Contrats" id="contracts" />
                      <Label htmlFor="contracts">Contrats</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Inventaire" id="inventory" />
                      <Label htmlFor="inventory">Inventaire</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Facture" id="invoice" />
                      <Label htmlFor="invoice">Facture</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Date de début</Label>
                  <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left font-normal"
                      >
                        {filterStartDate 
                          ? format(filterStartDate, "P", { locale: fr }) 
                          : "Sélectionner la date"
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filterStartDate}
                        onSelect={(date) => {
                          setFilterStartDate(date)
                          setIsStartDateOpen(false)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Date de fin</Label>
                  <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left font-normal"
                      >
                        {filterEndDate 
                          ? format(filterEndDate, "P", { locale: fr }) 
                          : "Sélectionner la date"
                        }
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filterEndDate}
                        onSelect={(date) => {
                          setFilterEndDate(date)
                          setIsEndDateOpen(false)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={resetFilters}>Réinitialiser</Button>
                  <Button onClick={applyFilters} className="bg-orange-500 hover:bg-orange-600 text-white">Appliquer</Button>
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
              <TableHead>Rapport</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-500" />
                    <span>{report.name}</span>
                  </div>
                </TableCell>
                <TableCell>{report.type}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </Button>
          {[1, 2, 3, '...', totalPages].map((page, i) => (
            <Button
              key={i}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => typeof page === 'number' && setCurrentPage(page)}
              className={page === '...' ? 'cursor-default' : ''}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            &gt;
          </Button>
        </div>
      </div>
    </div>
  )
}

