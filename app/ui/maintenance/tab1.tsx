'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowUpIcon, ArrowRightIcon, ArrowDownTrayIcon, AdjustmentsHorizontalIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { FunnelIcon, ArrowsUpDownIcon } from "@heroicons/react/24/solid"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const metrics = [
  { title: "Kiosques en maintenance", value: "366", subValue: "24", subLabel: "à planifier", trend: "up", color: "text-emerald-500" },
  { title: "Ticket en maintenance", value: "3,455", trend: "up", trendValue: "9.1%", color: "text-emerald-500" },
  { title: "Temps moyen de résolution", value: "48 heures", subLabel: "ce dernier mois" },
  { title: "Coût moyen de maintenance", value: "12 500 Fcfa", subLabel: "ce dernier mois" },
]

const tickets = [
  { id: "1345", kiosk: "Kiosk_1345", creationDate: "01/02/2024", resolutionDate: "01/02/2024", technician: "Alain NGONO", status: "Bas", priority: "Annulé" },
  { id: "1339", kiosk: "Kiosk_1368", creationDate: "01/02/2024", resolutionDate: "01/02/2024", technician: "Thierry NTAMACK", status: "Urgent", priority: "Done" },
  { id: "1340", kiosk: "Kiosk_1368", creationDate: "01/02/2024", resolutionDate: "01/02/2024", technician: "Boris ADIOGO", status: "Normal", priority: "En cours" },
  { id: "1346", kiosk: "Kiosk_1358", creationDate: "01/02/2024", resolutionDate: "01/02/2024", technician: "Bruno AYOLO", status: "Bas", priority: "Effectué" },
  { id: "1332", kiosk: "Kiosk_1358", creationDate: "01/02/2024", resolutionDate: "01/02/2024", technician: "Alain NGONO", status: "Bas", priority: "En cours" },
  { id: "1345", kiosk: "Kiosk_1345", creationDate: "01/02/2024", resolutionDate: "01/02/2024", technician: "Alain NGONO", status: "Bas", priority: "Annulé" },
  { id: "1339", kiosk: "Kiosk_1368", creationDate: "01/02/2024", resolutionDate: "01/02/2024", technician: "Thierry NTAMACK", status: "Urgent", priority: "Done" },
  { id: "1340", kiosk: "Kiosk_1368", creationDate: "01/02/2024", resolutionDate: "01/02/2024", technician: "Boris ADIOGO", status: "Normal", priority: "En cours" },
  { id: "1346", kiosk: "Kiosk_1358", creationDate: "01/02/2024", resolutionDate: "01/02/2024", technician: "Bruno AYOLO", status: "Bas", priority: "Effectué" },
  { id: "1332", kiosk: "Kiosk_1358", creationDate: "01/02/2024", resolutionDate: "01/02/2024", technician: "Alain NGONO", status: "Bas", priority: "En cours" },
  { id: "1345", kiosk: "Kiosk_1345", creationDate: "01/02/2024", resolutionDate: "01/02/2024", technician: "Alain NGONO", status: "Bas", priority: "Annulé" },
  { id: "1339", kiosk: "Kiosk_1368", creationDate: "01/02/2024", resolutionDate: "01/02/2024", technician: "Thierry NTAMACK", status: "Urgent", priority: "Done" },
  { id: "1340", kiosk: "Kiosk_1368", creationDate: "01/02/2024", resolutionDate: "01/02/2024", technician: "Boris ADIOGO", status: "Normal", priority: "En cours" },
  { id: "1346", kiosk: "Kiosk_1358", creationDate: "01/02/2024", resolutionDate: "01/02/2024", technician: "Bruno AYOLO", status: "Bas", priority: "Effectué" },
  { id: "1332", kiosk: "Kiosk_1358", creationDate: "01/02/2024", resolutionDate: "01/02/2024", technician: "Alain NGONO", status: "Bas", priority: "En cours" },
]

export default function MaintenanceDashboard() {
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState('')
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTickets(tickets.map(ticket => ticket.id))
    } else {
      setSelectedTickets([])
    }
  }

  const handleSelectTicket = (ticketId: string, checked: boolean) => {
    if (checked) {
      setSelectedTickets([...selectedTickets, ticketId])
    } else {
      setSelectedTickets(selectedTickets.filter(id => id !== ticketId))
    }
  }

  const resetFilters = () => {
    setFilterStatus('')
    setFilterStartDate(undefined)
    setFilterEndDate(undefined)
  }

  const applyFilters = () => {
    console.log('Filters applied:', { filterStatus, filterStartDate, filterEndDate })
    setIsFilterOpen(false)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <ArrowDownTrayIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              {metric.subValue && (
                <p className="text-xs text-muted-foreground">
                  {metric.subValue} {metric.subLabel}
                </p>
              )}
              {metric.trend && (
                <div className={`flex items-center text-xs ${metric.color}`}>
                  <ArrowUpIcon className="h-4 w-4 mr-1" />
                  {metric.trendValue}
                </div>
              )}
              {!metric.trend && metric.subLabel && (
                <p className="text-xs text-muted-foreground flex items-center">
                  {metric.subLabel}
                  <ArrowRightIcon className="h-4 w-4 ml-1" />
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center space-x-4 p-4 bg-white shadow rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="Rechercher"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-[300px] border rounded-md"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sélectionner le statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="bas">Bas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          {selectedTickets.length === 1 && (
            <Button variant="outline" className="text-blue-600">
              <PencilIcon className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          )}
          {selectedTickets.length > 0 ? (
            <Button variant="outline" className="text-red-600">
              <TrashIcon className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          ) : (
            <>
              <Button variant="outline" size="icon">
                <ArrowsUpDownIcon className="h-4 w-4" />
              </Button>
              <TooltipProvider>
                <Tooltip open={isFilterOpen}>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                      <FunnelIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="end"
                    className="w-80 p-0 bg-white border border-gray-200 shadow-lg text-black"
                    ref={filterRef}
                  >
                    <div className="p-4 space-y-4 text-black">
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
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              {filterStartDate ? format(filterStartDate, "P", { locale: fr }) : "Sélectionner la date"}
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
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              {filterEndDate ? format(filterEndDate, "P", { locale: fr }) : "Sélectionner la date"}
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
                        <Button variant="outline" onClick={resetFilters}>Réinitialiser</Button>
                        <Button onClick={applyFilters} className="bg-orange-500 hover:bg-orange-600 text-white">Appliquer</Button>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedTickets.length === tickets.length}
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead className="w-[100px]">ID ticket</TableHead>
            <TableHead>Kiosque</TableHead>
            <TableHead>Date création</TableHead>
            <TableHead>Date résolution</TableHead>
            <TableHead>Technicien</TableHead>
            <TableHead>Etat</TableHead>
            <TableHead>Priorité</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>
                <Checkbox
                  checked={selectedTickets.includes(ticket.id)}
                  onCheckedChange={(checked) => handleSelectTicket(ticket.id, checked)}
                />
              </TableCell>
              <TableCell className="font-medium">{ticket.id}</TableCell>
              <TableCell>{ticket.kiosk}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {ticket.creationDate}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {ticket.resolutionDate}
                </div>
              </TableCell>
              <TableCell>{ticket.technician}</TableCell>
              <TableCell>
                <Badge variant={ticket.status === 'Urgent' ? 'destructive' : ticket.status === 'Normal' ? 'default' : 'secondary'}>
                  {ticket.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={ticket.priority === 'Done' ? 'default' : ticket.priority === 'En cours' ? 'warning' : 'outline'}>
                  {ticket.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Page 1 of 34</p>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-orange-500 text-white">
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