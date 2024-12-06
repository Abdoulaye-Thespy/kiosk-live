'use client'

import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { EllipsisHorizontalIcon, ArrowDownTrayIcon, MagnifyingGlassIcon, UserGroupIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import {
  ArrowUpCircleIcon,
  XMarkIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  TrashIcon, 
  PencilIcon
} from '@heroicons/react/24/solid'
import Header from '@/app/ui/header'
import { Download, Eye, Filter, SortDesc } from 'lucide-react'


export default function UserManagement() {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUserType, setSelectedUserType] = useState('all')
  const [filterRole, setFilterRole] = useState('')
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)
  const [filterStatus, setFilterStatus] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  interface Document {
    id: string
    name: string
    type: string
    date: string
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(user => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleDelete = () => {
    console.log('Deleting users:', selectedUsers)
  }

  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    }
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const resetFilters = () => {
    setFilterRole('')
    setFilterDate(undefined)
    setFilterStatus('')
  }

  const applyFilters = () => {
    console.log('Filters applied:', { filterRole, filterDate, filterStatus })
    setIsFilterOpen(false)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setFilterDate(date)
    setIsCalendarOpen(false)
  }

  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState("")

  // Sample data - replace with your actual data
  const documents: Document[] = [
    { id: "1", name: "Rap_contrat 1547", type: "Paiement", date: "9 Juil 2023" },
    { id: "2", name: "Rap_paiement 1547", type: "Contrats", date: "9 Juil 2023" },
    { id: "3", name: "Rap_facture 1867", type: "Inventaire", date: "9 Juil 2023" },
    { id: "4", name: "Rap_inventaire 10436", type: "Contrats", date: "9 Juil 2023" },
    { id: "5", name: "Rap_paiement 1547", type: "Facture", date: "9 Juil 2023" },
    { id: "6", name: "Rap_facture 1867", type: "Inventaire", date: "9 Juil 2023" },
    { id: "7", name: "Rap_inventaire 10436", type: "Facture", date: "9 Juil 2023" },
    { id: "8", name: "Rap_inventaire 10436", type: "Facture", date: "9 Juil 2023" },
    { id: "9", name: "Rap_inventaire 10436", type: "Facture", date: "9 Juil 2023" },
    { id: "10", name: "Rap_inventaire 10436", type: "Facture", date: "9 Juil 2023" },
  ]

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.type.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = 34 //

  return (
    <div className="container mx-auto space-y-6">
      <Header title="Rapports de vente" />
      <hr />

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-column space-y-0 pb-2 shadow-md">
            <CardTitle className="text-sm font-medium">Total prospects</CardTitle>
            <div className="flex items-baseline space-x-3 ">
              <div className="text-2xl font-bold mt-2">1,822</div>
              <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                <ArrowUpCircleIcon className='inline-block h-5 w-5 text-green-500' />
                <div className="ml-2 text-medium text-gray-500">5.2%</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-medium">
              <p><span className='font-bold'>+22</span> le dernier mois</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-column space-y-0 pb-2 shadow-md">
            <CardTitle className="text-sm font-medium">Nouveaux prospects</CardTitle>
            <div className="flex items-baseline space-x-3 ">
              <div className="text-2xl font-bold mt-2">1,822</div>
              <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                <ArrowUpCircleIcon className='inline-block h-5 w-5 text-green-500' />
                <div className="ml-2 text-medium text-gray-500">5.2%</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-medium">
              <p><span className='font-bold'>+22</span> le dernier mois</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-column space-y-0 pb-2 shadow-md">
            <CardTitle className="text-sm font-medium">Prospects conclus</CardTitle>
            <div className="flex items-baseline space-x-3 ">
              <div className="text-2xl font-bold mt-2">1,822</div>
              <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                <ArrowUpCircleIcon className='inline-block h-5 w-5 text-green-500' />
                <div className="ml-2 text-medium text-gray-500">5.2%</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-medium">
              <p><span className='font-bold'>+22</span> le dernier mois</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-72">
          <Input
            placeholder="Recherche"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-4"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <SortDesc className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]"></TableHead>
              <TableHead>Rapport</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <div className="w-6 h-6 bg-orange-100 rounded flex items-center justify-center">
                    <span className="text-orange-600 text-xs">PDF</span>
                  </div>
                </TableCell>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.date}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {[1, 2, 3].map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              {page}
            </Button>
          ))}
          <Button
            size="sm"
            variant="outline"
          >
            ...
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setCurrentPage(34)}
          >
            34
          </Button>
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
    </div>
  )
}