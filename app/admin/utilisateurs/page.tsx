'use client';
import React, { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { EnvelopeIcon, BellIcon, EllipsisHorizontalIcon, ArrowDownTrayIcon, MagnifyingGlassIcon, UserGroupIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import styles from '@/app/ui/utilisateurs.module.css';
import {
  ArrowLongRightIcon,
  ArrowUpCircleIcon,
  XMarkIcon,
  FunnelIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/solid';

import { format } from "date-fns"
import { fr } from "date-fns/locale"

const users = [
  { id: 1, name: 'Darlene Robertson', role: 'Client', email: 'darlenerobertson@gmail.com', number: '+237 691 234 567', date: '01/02/2024', status: 'Inactif' },
  { id: 2, name: 'Jane Cooper', role: 'Admin', email: 'janecooper@gmail.com', number: '+237 691 234 567', date: '01/02/2024', status: 'Suspendu' },
  { id: 3, name: 'Jenny Wilson', role: 'Comptable', email: 'jennywilson@gmail.com', number: '+237 691 234 567', date: '01/02/2024', status: 'Actif' },
  { id: 4, name: 'Robert Fox', role: 'Client', email: 'robertfox@gmail.com', number: '+237 691 234 567', date: '01/02/2024', status: 'Inactif' },
  { id: 5, name: 'Wade Warren', role: 'R. Kiosque', email: 'wadewarren@gmail.com', number: '+237 691 234 567', date: '01/02/2024', status: 'Inactif' },
]

export default function UserManagement() {
  const [selectedUsers, setSelectedUsers] = React.useState<number[]>([])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(user => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    }
  }

  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUserType, setSelectedUserType] = useState('all')
  const [filterRole, setFilterRole] = useState('')
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)
  const [filterStatus, setFilterStatus] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const resetFilters = () => {
    setFilterRole('')
    setFilterDate(undefined)
    setFilterStatus('')
  }

  const applyFilters = () => {
    // Apply filters logic here
    console.log('Filters applied:', { filterRole, filterDate, filterStatus })
    // setIsFilterOpen(false)
  }


  return (
    <div className="container mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Utilisateurs</h1>
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
        <Button className={styles.add} onClick={openModal}>
          <UserPlusIcon className="mr-2 h-4 w-4" />
          Ajouter des utilisateurs
        </Button>
        <div>

          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" onClick={closeModal}></div>
              <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="p-6">
                  <button
                    onClick={closeModal}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                  <h2 className="text-xl font-semibold mb-4">Créer un utilisateur</h2>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Nom complet
                      </label>
                      <Input id="fullName" placeholder="Tahsan Khan" className="w-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <Input id="email" type="email" placeholder="Adresse mail" className="w-full" />
                      </div>
                      <div>
                        <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                          Numéro
                        </label>
                        <Input id="number" type="tel" placeholder="6 012 345 678" className="w-full" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                        Rôle
                      </label>
                      <Select>
                        <SelectTrigger id="role" className="w-full">
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="client">Client</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <Input id="address" placeholder="address line" className="w-full" />
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <Button variant="outline" onClick={closeModal} className="px-4 py-2">
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2">
                        Ajouter
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <hr />

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total d'utilisateurs</CardTitle>
            <UserPlusIcon className="h-4 w-4 text-muted-foreground text-" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-8">
              <div className="text-2xl font-bold">1,822</div>
              <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                <div className="inline-block  text-xs font-medium text-green-500 flex items-center">
                  <ArrowUpCircleIcon className='inline-block h-5 w-5' />

                </div>
                <div className="ml-2 text-medium text-gray-500">5.2%</div>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground w-70">
              <span><b>+140</b> Ce dernier mois</span>
              <ArrowLongRightIcon className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux utilisateurs</CardTitle>
            <UserPlusIcon className="h-4 w-4 text-muted-foreground text-" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-8">
              <div className="text-2xl font-bold">1,822</div>
              <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                <div className="inline-block  text-xs font-medium text-green-500 flex items-center">
                  <ArrowUpCircleIcon className='inline-block h-5 w-5' />

                </div>
                <div className="ml-2 text-medium text-gray-500">5.2%</div>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground w-70">
              <span><b>+140</b> Ce dernier mois</span>
              <ArrowLongRightIcon className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>
      </div>

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
          <Select value={selectedUserType} onValueChange={setSelectedUserType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tous les utilisateurs" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les utilisateurs</SelectItem>
              <SelectItem value="admin">Administrateurs</SelectItem>
              <SelectItem value="user">Utilisateurs</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
                    <label className="text-sm font-medium text-black">Rôle</label>
                    <Select value={filterRole} onValueChange={setFilterRole}>
                      <SelectTrigger className="text-black">
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin" className="text-black">Administrateur</SelectItem>
                        <SelectItem value="user" className="text-black">Utilisateur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">Date</label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal text-black">
                          {filterDate ? format(filterDate, "P", { locale: fr }) : "Sélectionner la date"}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" align="start" className="w-auto p-0 bg-white">
                        <Calendar
                          mode="single"
                          selected={filterDate}
                          onSelect={(date) => {
                            setFilterDate(date)
                          }}
                          initialFocus
                          className="text-black"
                        />
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">Statut</label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="text-black">
                        <SelectValue placeholder="Sélectionner le statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active" className="text-black">Actif</SelectItem>
                        <SelectItem value="inactive" className="text-black">Inactif</SelectItem>
                      </SelectContent>
                    </Select>
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
      </div>

      <Table className=' shadow'>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedUsers.length === users.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[200px]">Nom complet</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead>Adresse Email</TableHead>
            <TableHead>Numéro</TableHead>
            <TableHead>Date d&apos;insc.</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={(checked) => handleSelectUser(user.id, checked)}
                />
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {user.name}
                </div>
              </TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className='font-medium'>
                <span className='
                  text-[#E55210] '>
                  {user.email}
                </span>
              </TableCell>
              <TableCell className='font-medium'>{user.number}</TableCell>
              <TableCell className='font-medium'>{user.date}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${user.status === 'Actif' ? 'bg-green-100 text-green-800' :
                    user.status === 'Inactif' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                  }`}>
                  {user.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <EllipsisHorizontalIcon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page 1 of 34
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
            ...
          </Button>
          <Button variant="outline" size="icon">
            34
          </Button>
          <Button variant="outline" size="icon">
            &gt;
          </Button>
        </div>
      </div>
    </div>
  )
}