'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
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
import { BuildingOffice2Icon } from "@heroicons/react/24/solid"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface KioskData {
  id: string
  ville: string
  quartier: string
  zone: string
  compartimentsOccupes: number
  compartimentsTotal: number
  compartimentsInstables: number
  compartimentsLibres: number
  valeurNette: string
}

const kioskData: KioskData[] = [
  {
    id: '1',
    ville: 'Douala',
    quartier: 'Makepe BM',
    zone: 'Zone 01',
    compartimentsOccupes: 56,
    compartimentsTotal: 42,
    compartimentsInstables: 56,
    compartimentsLibres: 42,
    valeurNette: '100 000 fcfa'
  },
  {
    id: '2',
    ville: 'Douala',
    quartier: 'Makepe Bloc L',
    zone: 'Zone 02',
    compartimentsOccupes: 42,
    compartimentsTotal: 42,
    compartimentsInstables: 42,
    compartimentsLibres: 42,
    valeurNette: '100 000 fcfa'
  },
  {
    id: '3',
    ville: 'Douala',
    quartier: 'Logpom',
    zone: 'Zone 03',
    compartimentsOccupes: 42,
    compartimentsTotal: 42,
    compartimentsInstables: 42,
    compartimentsLibres: 42,
    valeurNette: '100 000 fcfa'
  },
  {
    id: '4',
    ville: 'Douala',
    quartier: 'Logpom fin goudron',
    zone: 'Zone 04',
    compartimentsOccupes: 42,
    compartimentsTotal: 42,
    compartimentsInstables: 42,
    compartimentsLibres: 42,
    valeurNette: '600 000 fcfa'
  },
  {
    id: '5',
    ville: 'Douala',
    quartier: 'Akwa',
    zone: 'Zone 05',
    compartimentsOccupes: 42,
    compartimentsTotal: 42,
    compartimentsInstables: 42,
    compartimentsLibres: 42,
    valeurNette: '400 000 fcfa'
  },
  {
    id: '6',
    ville: 'Yaoundé',
    quartier: 'Poste centrale',
    zone: 'Zone Y1',
    compartimentsOccupes: 42,
    compartimentsTotal: 42,
    compartimentsInstables: 42,
    compartimentsLibres: 42,
    valeurNette: '100 000 fcfa'
  },
  {
    id: '7',
    ville: 'Yaoundé',
    quartier: 'Tsinga 1',
    zone: 'Zone Y2',
    compartimentsOccupes: 42,
    compartimentsTotal: 42,
    compartimentsInstables: 42,
    compartimentsLibres: 42,
    valeurNette: '2 100 000 fcfa'
  },
  {
    id: '8',
    ville: 'Yaoundé',
    quartier: 'Tsinga 2',
    zone: 'Zone Y3',
    compartimentsOccupes: 42,
    compartimentsTotal: 42,
    compartimentsInstables: 42,
    compartimentsLibres: 42,
    valeurNette: '250 000 fcfa'
  },
  {
    id: '9',
    ville: 'Yaoundé',
    quartier: 'Lng Ada',
    zone: 'Zone Y4',
    compartimentsOccupes: 42,
    compartimentsTotal: 42,
    compartimentsInstables: 42,
    compartimentsLibres: 42,
    valeurNette: '100 000 fcfa'
  },
]

export default function KioskTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterVille, setFilterVille] = useState('')
  const [filterZone, setFilterZone] = useState('')
  const totalPages = 34

  const resetFilters = () => {
    setFilterVille('')
    setFilterZone('')
  }

  const applyFilters = () => {
    console.log('Filters applied:', { filterVille, filterZone })
    setIsFilterOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
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
                  <label className="text-sm font-medium">Ville</label>
                  <Select value={filterVille} onValueChange={setFilterVille}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une ville" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Douala">Douala</SelectItem>
                      <SelectItem value="Yaoundé">Yaoundé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Zone</label>
                  <Select value={filterZone} onValueChange={setFilterZone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Zone 01">Zone 01</SelectItem>
                      <SelectItem value="Zone 02">Zone 02</SelectItem>
                      <SelectItem value="Zone 03">Zone 03</SelectItem>
                      <SelectItem value="Zone 04">Zone 04</SelectItem>
                      <SelectItem value="Zone 05">Zone 05</SelectItem>
                      <SelectItem value="Zone Y1">Zone Y1</SelectItem>
                      <SelectItem value="Zone Y2">Zone Y2</SelectItem>
                      <SelectItem value="Zone Y3">Zone Y3</SelectItem>
                      <SelectItem value="Zone Y4">Zone Y4</SelectItem>
                    </SelectContent>
                  </Select>
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
              <TableHead>Ville</TableHead>
              <TableHead>Quartier</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead className="text-center">
                <div className="space-y-1">
                  <p>Compartiments</p>
                  <p>occupés</p>
                  <div className="flex items-center justify-center gap-1">
                    <BuildingOffice2Icon className="h-4 w-4 text-orange-500" />
                    <span>56</span>
                    <span className="text-muted-foreground">/ 42</span>
                  </div>
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="space-y-1">
                  <p>Compartiments</p>
                  <p>instables</p>
                  <div className="flex items-center justify-center gap-1">
                    <BuildingOffice2Icon className="h-4 w-4 text-yellow-500" />
                    <span>56</span>
                    <span className="text-muted-foreground">/ 42</span>
                  </div>
                </div>
              </TableHead>
              <TableHead className="text-center">
                <div className="space-y-1">
                  <p>Compartiments</p>
                  <p>libres</p>
                  <div className="flex items-center justify-center gap-1">
                    <BuildingOffice2Icon className="h-4 w-4 text-green-500" />
                    <span>56</span>
                    <span className="text-muted-foreground">/ 42</span>
                  </div>
                </div>
              </TableHead>
              <TableHead>Valeur nette</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {kioskData.map((kiosk) => (
              <TableRow key={kiosk.id}>
                <TableCell>{kiosk.ville}</TableCell>
                <TableCell>{kiosk.quartier}</TableCell>
                <TableCell>{kiosk.zone}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <BuildingOffice2Icon className="h-4 w-4 text-orange-500" />
                    <span>{kiosk.compartimentsOccupes}</span>
                    <span className="text-muted-foreground">/ {kiosk.compartimentsTotal}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <BuildingOffice2Icon className="h-4 w-4 text-yellow-500" />
                    <span>{kiosk.compartimentsInstables}</span>
                    <span className="text-muted-foreground">/ {kiosk.compartimentsTotal}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <BuildingOffice2Icon className="h-4 w-4 text-green-500" />
                    <span>{kiosk.compartimentsLibres}</span>
                    <span className="text-muted-foreground">/ {kiosk.compartimentsTotal}</span>
                  </div>
                </TableCell>
                <TableCell>{kiosk.valeurNette}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={currentPage === 1 ? "bg-orange-500 text-white" : ""}
          >
            1
          </Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">...</Button>
          <Button variant="outline" size="sm">34</Button>
          <Button 
            variant="outline" 
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}