'use client';
import React, { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { EnvelopeIcon, BellIcon, EllipsisHorizontalIcon, ArrowDownTrayIcon, MagnifyingGlassIcon, DocumentPlusIcon } from '@heroicons/react/24/outline'
import styles from '@/app/ui/contrats.module.css';
import {
  ArrowLongRightIcon,
  ArrowUpCircleIcon,
  XMarkIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  TrashIcon, 
  PencilIcon
} from '@heroicons/react/24/solid'

import { format } from "date-fns"
import { fr } from "date-fns/locale"

import ContractDetails from '@/app/ui/contrat/details';

const contracts = [
  {
    id: 1,
    contractorName: "Dupont Entreprise",
    contractNumber: "CONT-2023-001",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    amount: 50000,
    status: "En cours"
  },
  {
    id: 2,
    contractorName: "Martin & Co",
    contractNumber: "CONT-2023-002",
    startDate: "2023-02-15",
    endDate: "2024-02-14",
    amount: 75000,
    status: "En attente"
  },
  {
    id: 3,
    contractorName: "Lefevre Services",
    contractNumber: "CONT-2023-003",
    startDate: "2023-03-01",
    endDate: "2023-08-31",
    amount: 30000,
    status: "Terminé"
  },
  {
    id: 4,
    contractorName: "Moreau Consulting",
    contractNumber: "CONT-2023-004",
    startDate: "2023-04-01",
    endDate: "2024-03-31",
    amount: 100000,
    status: "En cours"
  },
  {
    id: 5,
    contractorName: "Petit Innovations",
    contractNumber: "CONT-2023-005",
    startDate: "2023-05-15",
    endDate: "2023-11-15",
    amount: 45000,
    status: "En cours"
  }
]

export default function ContractManagement() {
  const [selectedContracts, setSelectedContracts] = React.useState<number[]>([])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContracts(contracts.map(contract => contract.id))
    } else {
      setSelectedContracts([])
    }
  }

  const handleDelete = () => {
    console.log('Deleting contracts:', selectedContracts)
  }

  const handleSelectContract = (contractId: number, checked: boolean) => {
    if (checked) {
      setSelectedContracts([...selectedContracts, contractId])
    } else {
      setSelectedContracts(selectedContracts.filter(id => id !== contractId))
    }
  }

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedContractType, setSelectedContractType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>(undefined)
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>(undefined)
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

  const resetFilters = () => {
    setFilterStatus('')
    setFilterStartDate(undefined)
    setFilterEndDate(undefined)
  }

  const applyFilters = () => {
    console.log('Filters applied:', { filterStatus, filterStartDate, filterEndDate })
  }

  return (
    <div className="container mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Contrats</h1>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <EnvelopeIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <BellIcon className="h-4 w-4" />
          </Button>
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon">
            <EllipsisHorizontalIcon className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <hr />

      <div className="flex justify-end items-center">
        <Button variant="ghost">
          <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
        </Button>
        <Link href="/admin/contrats/nouveau">
        <Button className={styles.add}>
          <DocumentPlusIcon className="mr-2 h-4 w-4" />
          Créer un nouveau contrat
        </Button>
        </Link>
      </div>
      <hr />

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
          <Select value={selectedContractType} onValueChange={setSelectedContractType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tous les contrats" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les contrats</SelectItem>
              <SelectItem value="active">Contrats actifs</SelectItem>
              <SelectItem value="expired">Contrats expirés</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          {selectedContracts.length > 0 && (
            <Button 
              onClick={handleDelete}
              className='bg-white border border-gray-500 text-black-500 font-medium py-2 px-4 rounded inline-flex items-center'
            >
              <TrashIcon className="h-4 w-4" />
              Supprimer
            </Button>
          )}

          {selectedContracts.length === 1 && (
            <Button 
              className='bg-white border border-gray-500 text-black-500 font-medium py-2 px-4 rounded inline-flex items-center ml-4'
            >
              <PencilIcon className="h-4 w-4" />
              Modifier
            </Button>
          )}

          {!selectedContracts.length && (
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
                            <SelectItem value="en_cours" className="text-black">En cours</SelectItem>
                            <SelectItem value="termine" className="text-black">Terminé</SelectItem>
                            <SelectItem value="en_attente" className="text-black">En attente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-black">Date de début</label>
                        <Popover>
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
                              onSelect={setFilterStartDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-black">Date de fin</label>
                        <Popover>
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
                              onSelect={setFilterEndDate}
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
                checked={selectedContracts.length === contracts.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[200px]">Nom du contractant</TableHead>
            <TableHead>N° Contrat</TableHead>
            <TableHead>Date debut</TableHead>
            <TableHead>Date fin</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell>
                <Checkbox
                  checked={selectedContracts.includes(contract.id)}
                  onCheckedChange={(checked) => handleSelectContract(contract.id, checked)}
                />
              </TableCell>
              <TableCell className="font-medium">
                <span className="text-blue-600">{contract.contractorName}</span>
              </TableCell>
              <TableCell>{contract.contractNumber}</TableCell>
              <TableCell>{contract.startDate}</TableCell>
              <TableCell>{contract.endDate}</TableCell>
              <TableCell>{contract.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  contract.status === 'En cours' ? 'bg-green-100 text-green-800' :
                  contract.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {contract.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
               <ContractDetails />
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