"use client"

import { TableHeader } from "@/components/ui/table"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { getServiceRequests } from "@/app/actions/ticketsactions"
import type { RequestPriority, RequestStatus, Kiosk, User } from "@prisma/client"

interface ServiceRequest {
  id: string
  kioskId: number
  kiosk: Kiosk
  technicians: User[]
  problemDescription: string
  comments?: string | null
  status: RequestStatus
  priority: RequestPriority
  createdDate: Date
  resolvedDate?: Date | null
  attachments?: string | null
}

export default function TabTwoMaintenance() {
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | "">("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<RequestStatus | "">("")
  const [filterStartDate, setFilterStartDate] = useState<Date | undefined>(undefined)
  const [filterEndDate, setFilterEndDate] = useState<Date | undefined>(undefined)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<ServiceRequest[]>([])

  const filterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      const fetchedServiceRequests = await getServiceRequests()
      setServiceRequests(fetchedServiceRequests)
      setFilteredRequests(fetchedServiceRequests)
    }
    fetchData()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node) &&
        event.target !== filterRef.current
      ) {
        setIsFilterOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const filtered = serviceRequests.filter((request) => {
      const matchesSearch =
        request.problemDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.kiosk.kioskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.technicians.some((tech) => tech.name.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = !selectedStatus || request.status === selectedStatus
      const matchesFilterStatus = !filterStatus || request.status === filterStatus
      const matchesStartDate = !filterStartDate || new Date(request.createdDate) >= filterStartDate
      const matchesEndDate = !filterEndDate || new Date(request.createdDate) <= filterEndDate

      return matchesSearch && matchesStatus && matchesFilterStatus && matchesStartDate && matchesEndDate
    })

    setFilteredRequests(filtered)
  }, [serviceRequests, searchTerm, selectedStatus, filterStatus, filterStartDate, filterEndDate])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTickets(filteredRequests.map((request) => request.id))
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
    setIsFilterOpen(false)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Filter UI would go here */}
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>
              <Checkbox
                checked={filteredRequests.length > 0 && selectedTickets.length === filteredRequests.length}
                onCheckedChange={(e) => handleSelectAll(e.target.checked)}
              />
            </TableHeader>
            <TableHeader>ID</TableHeader>
            <TableHeader>Kiosque</TableHeader>
            <TableHeader>Date de création</TableHeader>
            <TableHeader>Date de résolution</TableHeader>
            <TableHeader>Techniciens</TableHeader>
            <TableHeader>Statut</TableHeader>
            <TableHeader>Priorité</TableHeader>
            <TableHeader></TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <Checkbox
                  checked={selectedTickets.includes(request.id)}
                  onCheckedChange={(e) => handleSelectTicket(request.id, e.target.checked)}
                />
              </TableCell>
              <TableCell className="font-medium">{request.id}</TableCell>
              <TableCell>{request.kiosk.kioskName}</TableCell>
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
                  {format(new Date(request.createdDate), "dd/MM/yyyy")}
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
                  {request.resolvedDate ? format(new Date(request.resolvedDate), "dd/MM/yyyy") : "Non résolu"}
                </div>
              </TableCell>
              <TableCell>{request.technicians.map((tech) => tech.name).join(", ")}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    request.status === "URGENT"
                      ? "destructive"
                      : request.status === "IN_PROGRESS"
                        ? "default"
                        : "secondary"
                  }
                >
                  {request.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    request.priority === "HIGH" ? "default" : request.priority === "MEDIUM" ? "warning" : "outline"
                  }
                >
                  {request.priority}
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
      {/* Pagination UI would go here */}
    </div>
  )
}

