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
import ProspectDetails from '../ui/commercial/prospect/details'

const users = [
  { id: 1, name: 'Darlene Robertson', email: 'darlenerobertson@gmail.com', besoin: 'Nouveau Kiosque', number: '+237 691 234 567', date: '01/02/2024', status: 'Inactif' },
  { id: 2, name: 'Jane Cooper', email: 'janecooper@gmail.com', besoin: 'Nouveau Kiosque', number: '+237 691 234 567', date: '01/02/2024', status: 'Suspendu' },
  { id: 3, name: 'Jenny Wilson', email: 'jennywilson@gmail.com', besoin: 'Maintenance', number: '+237 691 234 567', date: '01/02/2024', status: 'Actif' },
  { id: 4, name: 'Robert Fox',  email: 'robertfox@gmail.com', besoin: 'Nouveau Kiosque', number: '+237 691 234 567', date: '01/02/2024', status: 'Inactif' },
  { id: 5, name: 'Wade Warren', email: 'wadewarren@gmail.com', besoin: 'Nouveau Kiosque', number: '+237 691 234 567', date: '01/02/2024', status: 'Inactif' },
]

const prospectData = {
  fullName: "Jenny Wilson",
  email: "jennywilson@gmail.com",
  phone: "(555) 555-1234",
  address: "Bonamoussadi - rue 2345",
  needs: "Lorem ipsum dolor sit amet consectetur. Tortor vel nunc fusce ut euismod tempor mattis. Interdum nibh nec commodo congue ac mattis neque donec. Malesuada eleifend suspendisse risus at. Vitae maecenas nibh sed tellus. Lorem ipsum dolor sit amet consectetur. Tortor vel nunc fusce ut euismod tempor mattis. Interdum nibh nec commodo congue ac mattis neque donec. Malesuada eleifend suspendisse risus at. Vitae maecenas nibh sed tellus."
}

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

  return (
    <div className="container mx-auto space-y-6">
      <Header title="Gestion des prospects" />

      <div className="flex justify-end items-center">
        <Button variant="ghost">
          <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
        </Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={openModal}>
          <UserPlusIcon className="mr-2 h-4 w-4" />
          Ajouter des prospects
        </Button>
        
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
                <h2 className="text-xl font-semibold mb-4">Créer un prospect</h2>
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
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Addresse
                    </label>
                    <Input id="address" placeholder="Akwa" className="w-full" />
                  </div>
                  <div>
                    <label htmlFor="besoin" className="block text-sm font-medium text-gray-700 mb-1">
                      Besoin
                    </label>
                    <Input id="besoin" placeholder="Besoin" className="w-full" />
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button variant="outline" onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                      Ajouter
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
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
              <SelectValue placeholder="Tous les Propects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les Propects</SelectItem>
              <SelectItem value="admin">Administrateurs</SelectItem>
              <SelectItem value="user">Utilisateurs</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          {selectedUsers.length >  0 && (
            <Button 
              onClick={handleDelete}
              className='bg-white border border-gray-500 text-black-500 font-medium py-2 px-4 rounded inline-flex items-center'
            >
              <TrashIcon className="h-4 w-4" />
              Supprimer
            </Button>
          )}

          {selectedUsers.length == 1 && (
            <>
              <Button
                className='bg-white border border-gray-500 text-black-500 font-medium py-2 px-4 rounded inline-flex items-center ml-4'
              >
                <PencilIcon className="h-4 w-4" />
                Modifier
              </Button>
              <Link
                href={{
                  pathname: '/commercial/nouveauprospect',
                }}
              >
                <Button
                  className='bg-white border border-gray-500 text-black-500 font-medium py-2 px-4 rounded inline-flex items-center ml-4'
                >
                  <PencilIcon className="h-4 w-4" />
                  Créer un devis
                </Button>
              </Link>
            </>

          )}

          {selectedUsers.length === 0 && (
            <div>
              <button className="p-2 hover:bg-gray-100 rounded-md">
                <ArrowsUpDownIcon className="h-6 w-6 text-gray-600" />
              </button>

              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <FunnelIcon className="h-6 w-6 text-gray-600" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <div className="p-4 space-y-4">
                    <h3 className="font-semibold text-lg">Filtre</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Statut</label>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Actif</SelectItem>
                          <SelectItem value="inactive">Inactif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={resetFilters}>Réinitialiser</Button>
                      <Button onClick={applyFilters} className="bg-orange-500 hover:bg-orange-600 text-white">Appliquer</Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>

      <Table className='shadow'>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedUsers.length === users.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[200px]">Nom complet</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Adresse Email</TableHead>
            <TableHead>Besoin</TableHead>
            <TableHead>Numéro</TableHead>
            <TableHead>Date d&apos;insc.</TableHead>
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
                <Link
                  href={{
                    pathname: '/admin/utilisateurs/details',
                    query: { userId: user.id },
                  }}
                  className="flex items-center hover:bg-gray-100 rounded-md p-1 transition-colors"
                >
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-blue-600 hover:underline">{user.name}</span>
                </Link>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.status === 'Actif' ? 'bg-green-100 text-green-800' :
                  user.status === 'Inactif' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {user.status}
                </span>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className='font-medium'>{user.besoin}</TableCell>
              <TableCell className='font-medium'>
                <span className='text-[#E55210]'>
                  {user.email}
                </span>
              </TableCell>
              <TableCell className='font-medium'>{user.date}</TableCell>
              <TableCell>
                <ProspectDetails
                  trigger=""
                  prospect={prospectData}
                />
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