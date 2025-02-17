"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowUpCircleIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { FunnelIcon, ArrowsUpDownIcon } from "@heroicons/react/24/solid"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import styles from "@/app/ui/dashboard.module.css"
import { getMaintenanceMetrics, getMaintenanceTickets, deleteTickets } from "@/app/actions/ticketsactions"
import type { RequestStatus, RequestPriority } from "@prisma/client"

interface Metric {
  title: string
  value: string
  subValue?: string
  subLabel?: string
  trend?: "up" | "down"
  trendValue?: string
  color?: string
}

interface Ticket {
  id: string
  kiosk: { kioskName: string }
  createdDate: Date
  resolvedDate: Date | null
  technicians: { name: string }[]
  status: RequestStatus
  priority: RequestPriority
}

export default function MaintenanceDashboardTechnicien() {
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | "">("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<RequestStatus | "">("")
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>(undefined)
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>(undefined)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isStartDateOpen, setIsStartDateOpen] = useState(false)
  const [isEndDateOpen, setIsEndDateOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchMetrics()
    fetchTickets()
  }, [])

  const fetchMetrics = async () => {
    const data = await getMaintenanceMetrics()
    setMetrics([
      {
        title: "Kiosques en maintenance",
        value: data.kiosksInMaintenance.toString(),
        subValue: "24",
        subLabel: "à planifier",
        trend: "up",
        color: "text-emerald-500",
      },
      {
        title: "Ticket en Progrès",
        value: data.totalTickets.toString(),
        trend: "up",
        trendValue: "9.1%",
        color: "text-emerald-500",
      },
      { title: "Tickets Ouverts", value: data.openTicketsThisMonth.toString(), subLabel: "ce dernier mois" },
      { title: "Tickets Complets", value: data.completedTicketsThisMonth.toString(), subLabel: "ce dernier mois" },
    ])
  }

  const fetchTickets = async () => {
    const { tickets: fetchedTickets, totalPages: pages } = await getMaintenanceTickets({
      page: currentPage,
      searchTerm,
      status: filterStatus === "ALL" ? undefined : filterStatus || undefined,
      startDate: filterStartDate,
      endDate: filterEndDate,
    })
    setTickets(fetchedTickets)
    setTotalPages(pages)
  }

  useEffect(() => {
    fetchTickets()
  }, [searchTerm, filterStatus, filterStartDate, filterEndDate]) //Corrected useEffect dependency array

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTickets(tickets.map((ticket) => ticket.id))
    } else {
      setSelectedTickets([])
    }
  }

  const handleSelectTicket = (ticketId: string, checked: boolean) => {
    if (checked) {
      setSelectedTickets([...selectedTickets, ticketId])
    } else {
      setSelectedTickets(selectedTickets.filter((id) => id !== ticketId))
    }
  }

  const resetFilters = () => {
    setFilterStatus("")
    setFilterStartDate(undefined)
    setFilterEndDate(undefined)
  }

  const applyFilters = () => {
    setCurrentPage(1)
    fetchTickets()
    setIsFilterOpen(false)
  }

  const handleStartDateSelect = (date: Date | undefined) => {
    setFilterStartDate(date)
    setIsStartDateOpen(false)
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    setFilterEndDate(date)
    setIsEndDateOpen(false)
  }

  const handleDelete = async () => {
    await deleteTickets(selectedTickets)
    setSelectedTickets([])
    fetchTickets()
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index} className={`shadow-md ${styles.carte}`}>
            <CardHeader className={`flex flex-column space-y-0 pb-2 shadow-md ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className="flex items-baseline space-x-3">
                <div className="text-2xl font-bold mt-2">{metric.value}</div>
                {metric.trend && (
                  <div className={`flex items-center bg-${metric.color} rounded-full bg-opacity-15 px-2 py-0.5`}>
                    <ArrowUpCircleIcon className="inline-block h-5 w-5 text-white" />
                    <div className="ml-2 text-medium text-white">{metric.trendValue}</div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {metric.subLabel && (
                <div className="flex items-center text-medium">
                  <p>
                    <span className="font-bold">{metric.subValue}</span> {metric.subLabel}
                  </p>
                </div>
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
              <SelectItem value="ALL">Tous les statuts</SelectItem>
              <SelectItem value="OPEN">Ouvert</SelectItem>
              <SelectItem value="IN_PROGRESS">En cours</SelectItem>
              <SelectItem value="CLOSED">Fermé</SelectItem>
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
            <Button variant="outline" className="text-red-600" onClick={handleDelete}>
              <TrashIcon className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          ) : (
            <>
              <Button variant="outline" size="icon">
                <ArrowsUpDownIcon className="h-4 w-4" />
              </Button>
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <FunnelIcon className="h-4 w-4" />
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
                          <SelectItem value="ALL">Tous</SelectItem>
                          <SelectItem value="OPEN">Ouvert</SelectItem>
                          <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                          <SelectItem value="CLOSED">Fermé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date de début</label>
                      <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            {filterStartDate ? format(filterStartDate, "P", { locale: fr }) : "Sélectionner la date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={filterStartDate}
                            onSelect={handleStartDateSelect}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date de fin</label>
                      <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            {filterEndDate ? format(filterEndDate, "P", { locale: fr }) : "Sélectionner la date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={filterEndDate}
                            onSelect={handleEndDateSelect}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={resetFilters}>
                        Réinitialiser
                      </Button>
                      <Button onClick={applyFilters} className="bg-orange-500 hover:bg-orange-600 text-white">
                        Appliquer
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox checked={selectedTickets.length === tickets.length} onCheckedChange={handleSelectAll} />
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
                  onCheckedChange={(checked) => handleSelectTicket(ticket.id, checked as boolean)}
                />
              </TableCell>
              <TableCell className="font-medium">{ticket.id}</TableCell>
              <TableCell>{ticket.kiosk.kioskName}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {format(new Date(ticket.createdDate), "dd/MM/yyyy")}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <svg className="mr-2 h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {ticket.resolvedDate ? format(new Date(ticket.resolvedDate), "dd/MM/yyyy") : "Non résolu"}
                </div>
              </TableCell>
              <TableCell>{ticket.technicians.map((tech) => tech.name).join(", ")}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    ticket.status === "OPEN" ? "destructive" : ticket.status === "IN_PROGRESS" ? "default" : "secondary"
                  }
                >
                  {ticket.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    ticket.priority === "HIGH" ? "destructive" : ticket.priority === "MEDIUM" ? "warning" : "secondary"
                  }
                >
                  {ticket.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              className={currentPage === i + 1 ? "bg-orange-500 text-white" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          {totalPages > 5 && (
            <Button variant="outline" size="sm" disabled>
              ...
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

