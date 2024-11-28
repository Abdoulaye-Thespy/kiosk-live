'use client'

import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { EllipsisHorizontalIcon, MagnifyingGlassIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import {
  XMarkIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  TrashIcon, 
  PencilIcon
} from '@heroicons/react/24/solid'
import Header from '@/app/ui/header'

const opportunities = [
  { id: 1, devis: 'Darlene Robertson', opportunite: 'darlenerobertson@gmail.com', date: '01/02/2024', status: 'Inactif' },
  { id: 2, devis: 'Jane Cooper', opportunite: 'janecooper@gmail.com', date: '01/02/2024', status: 'Suspendu' },
  { id: 3, devis: 'Jenny Wilson', opportunite: 'jennywilson@gmail.com', date: '01/02/2024', status: 'Actif' },
  { id: 4, devis: 'Robert Fox', opportunite: 'robertfox@gmail.com', date: '01/02/2024', status: 'Inactif' },
  { id: 5, devis: 'Wade Warren', opportunite: 'wadewarren@gmail.com', date: '01/02/2024', status: 'Inactif' },
]

export default function OpportunityManagement() {
  const [selectedOpportunities, setSelectedOpportunities] = useState<number[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOpportunities(opportunities.map(opp => opp.id))
    } else {
      setSelectedOpportunities([])
    }
  }

  const handleDelete = () => {
    console.log('Deleting opportunities:', selectedOpportunities)
  }

  const handleSelectOpportunity = (oppId: number, checked: boolean) => {
    if (checked) {
      setSelectedOpportunities([...selectedOpportunities, oppId])
    } else {
      setSelectedOpportunities(selectedOpportunities.filter(id => id !== oppId))
    }
  }

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const resetFilters = () => {
    setFilterStatus('')
  }

  const applyFilters = () => {
    console.log('Filters applied:', { filterStatus })
    setIsFilterOpen(false)
  }

  return (
    <div className="container mx-auto space-y-6">
      <Header title="Gestion des opportunités" />

      <div className="flex justify-end items-center">
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
                <h2 className="text-xl font-semibold mb-4">Créer une opportunité</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="devis" className="block text-sm font-medium text-gray-700 mb-1">
                      Devis
                    </label>
                    <Input id="devis" placeholder="Numéro du devis" className="w-full" />
                  </div>
                  <div>
                    <label htmlFor="opportunite" className="block text-sm font-medium text-gray-700 mb-1">
                      Opportunité
                    </label>
                    <Input id="opportunite" placeholder="Description de l'opportunité" className="w-full" />
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button variant="outline" onClick={closeModal}>
                      Annuler
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
          {selectedOpportunities.length > 0 && (
            <Button 
              onClick={handleDelete}
              className='bg-white border border-gray-500 text-black-500 font-medium py-2 px-4 rounded inline-flex items-center'
            >
              <TrashIcon className="h-4 w-4" />
              Supprimer
            </Button>
          )}

          {selectedOpportunities.length === 1 && (
            <>
              <Button
                className='bg-white border border-gray-500 text-black-500 font-medium py-2 px-4 rounded inline-flex items-center ml-4'
              >
                <PencilIcon className="h-4 w-4" />
                Modifier
              </Button>
              <Link href="/commercial/nouveauprospect">
                <Button
                  className='bg-white border border-gray-500 text-black-500 font-medium py-2 px-4 rounded inline-flex items-center ml-4'
                >
                  <PencilIcon className="h-4 w-4" />
                  Créer un devis
                </Button>
              </Link>
            </>
          )}

          {selectedOpportunities.length === 0 && (
            <div className="flex items-center gap-2">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={openModal}>
                <UserPlusIcon className="mr-2 h-4 w-4" />
                Ajouter une opportunité
              </Button>

              <Button variant="ghost" size="icon">
                <ArrowsUpDownIcon className="h-6 w-6 text-gray-600" />
              </Button>

              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <FunnelIcon className="h-6 w-6 text-gray-600" />
                  </Button>
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
                      <Button onClick={applyFilters} className="bg-orange-500 hover:bg-orange-600 text-white">
                        Appliquer
                      </Button>
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
                checked={selectedOpportunities.length === opportunities.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[200px]">Devis</TableHead>
            <TableHead>Opportunités</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date d&apos;insc.</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {opportunities.map((opp) => (
            <TableRow key={opp.id}>
              <TableCell>
                <Checkbox
                  checked={selectedOpportunities.includes(opp.id)}
                  onCheckedChange={(checked) => handleSelectOpportunity(opp.id, checked as boolean)}
                />
              </TableCell>
              <TableCell className="font-medium">
                <Link
                  href={{
                    pathname: '/commercial/opportunite/details',
                  }}
                  className="flex items-center hover:bg-gray-100 rounded-md p-1 transition-colors"
                >
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={opp.devis} />
                    <AvatarFallback>{opp.devis.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-blue-600 hover:underline">{opp.devis}</span>
                </Link>
              </TableCell>
              <TableCell>{opp.opportunite}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  opp.status === 'Actif' ? 'bg-green-100 text-green-800' :
                  opp.status === 'Inactif' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {opp.status}
                </span>
              </TableCell>
              <TableCell>{opp.date}</TableCell>
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