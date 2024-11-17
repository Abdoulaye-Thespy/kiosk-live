'use client';

import React, { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { EnvelopeIcon, BellIcon, EllipsisHorizontalIcon, ArrowDownTrayIcon, MagnifyingGlassIcon, DocumentPlusIcon, EyeIcon } from '@heroicons/react/24/outline'
import {
  ArrowsUpDownIcon,
  FunnelIcon,
  TrashIcon, 
  PencilIcon
} from '@heroicons/react/24/solid'

import { format } from "date-fns"
import { fr } from "date-fns/locale"

import RapportDetails from '@/app/ui/rapport/details'
import Header from '@/app/ui/header';

const rapports = [
  {
    id: 1,
    name: "Rapport Mensuel",
    number: "RAP-2023-001",
    date: "2023-01-31",
    type: "Mensuel",
    status: "Publié"
  },
  {
    id: 2,
    name: "Rapport Trimestriel Q1",
    number: "RAP-2023-002",
    date: "2023-03-31",
    type: "Trimestriel",
    status: "En révision"
  },
  {
    id: 3,
    name: "Rapport Annuel 2022",
    number: "RAP-2023-003",
    date: "2023-02-28",
    type: "Annuel",
    status: "Publié"
  },
  {
    id: 4,
    name: "Rapport Mensuel",
    number: "RAP-2023-004",
    date: "2023-02-28",
    type: "Mensuel",
    status: "Brouillon"
  },
  {
    id: 5,
    name: "Rapport Spécial Projet X",
    number: "RAP-2023-005",
    date: "2023-04-15",
    type: "Spécial",
    status: "En révision"
  }
]

export default function RapportManagement() {
  const [selectedRapports, setSelectedRapports] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRapportType, setSelectedRapportType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node) && event.target !== filterRef.current) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRapports(rapports.map(rapport => rapport.id))
    } else {
      setSelectedRapports([])
    }
  }

  const handleDelete = () => {
    console.log('Deleting rapports:', selectedRapports)
  }

  const handleSelectRapport = (rapportId: number, checked: boolean) => {
    if (checked) {
      setSelectedRapports([...selectedRapports, rapportId])
    } else {
      setSelectedRapports(selectedRapports.filter(id => id !== rapportId))
    }
  }

  const resetFilters = () => {
    setFilterStatus('')
    setFilterDate(undefined)
  }

  const applyFilters = () => {
    console.log('Filters applied:', { filterStatus, filterDate })
  }

  return (
    <div className="container mx-auto space-y-6">
      <Header title='Rapport'/>

      <div className="flex items-center justify-between space-x-4 p-4 bg-white shadow rounded-lg">
        <div className='flex'>
          <div className="relative mr-5">
            <Input
              type="text"
              placeholder="Recherche"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-md"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div>
          {selectedRapports.length > 0 && (
            <Button 
              onClick={handleDelete}
              className='bg-white border border-gray-500 text-black-500 font-medium py-2 px-4 rounded inline-flex items-center'
            >
              <TrashIcon className="h-4 w-4" />
              Supprimer
            </Button>
          )}

          {selectedRapports.length === 1 && (
            <Button 
              className='bg-white border border-gray-500 text-black-500 font-medium py-2 px-4 rounded inline-flex items-center ml-4'
            >
              <PencilIcon className="h-4 w-4" />
              Modifier
            </Button>
          )}

          {!selectedRapports.length && (
            <div>
              <button className="p-2 hover:bg-gray-100 rounded-md">
                <ArrowsUpDownIcon className="h-6 w-6 text-gray-600" />
              </button>

              <TooltipProvider>
                <Tooltip open={isFilterOpen}>
                  <TooltipTrigger asChild>
                    <button className="p-2 hover:bg-gray-100 rounded-md" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                      <FunnelIcon className="h-6 w-6 text-gray-600" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="end"
                    className="w-80 p-0 bg-white border border-gray-200 shadow-lg text-black"
                    ref={filterRef}
                  >
                    <div className="p-4 space-y-4 text-black" >
                      <h3 className="font-semibold text-lg text-black">Filtre</h3>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-black">Statut</label>
                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger className="text-black">
                            <SelectValue placeholder="Sélectionner le statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="publie" className="text-black">Publié</SelectItem>
                            <SelectItem value="en_revision" className="text-black">En révision</SelectItem>
                            <SelectItem value="brouillon" className="text-black">Brouillon</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-black">Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button 
                              variant="outline" 
                              className="w-full justify-start text-left font-normal"
                            >
                              {filterDate 
                                ? format(filterDate, "P", { locale: fr }) 
                                : "Sélectionner la date"
                              }
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
                        <Button variant="outline" onClick={resetFilters} className="text-black">Réinitialiser</Button>
                        <Button onClick={applyFilters} className="bg-orange-500 hover:bg-orange-600 text-white">Appliquer</Button>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>

      <Table className='shadow'>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedRapports.length === rapports.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[200px]">Nom du rapport</TableHead>
            <TableHead>N° Rapport</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rapports.map((rapport) => (
            <TableRow key={rapport.id}>
              <TableCell>
                <Checkbox
                  checked={selectedRapports.includes(rapport.id)}
                  onCheckedChange={(checked) => handleSelectRapport(rapport.id, checked)}
                />
              </TableCell>
              <TableCell className="font-medium">
                  <span className="text-blue-600 ">{rapport.name}</span>
              </TableCell>
              <TableCell>{rapport.number}</TableCell>
              <TableCell>{rapport.date}</TableCell>
              <TableCell>{rapport.type}</TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <RapportDetails rapport={rapports}/>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page 1 of 5
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" disabled>
            &lt;
          </Button>
          <Button variant="outline" size="icon">
            1
          </Button>
          <Button variant="outline" size="icon">
            2
          </Button>
          <Button variant="outline" size="icon">
            3
          </Button>
          <Button variant="outline" size="icon">
            4
          </Button>
          <Button variant="outline" size="icon">
            5
          </Button>
          <Button variant="outline" size="icon">
            &gt;
          </Button>
        </div>
      </div>
    </div>
  )
}