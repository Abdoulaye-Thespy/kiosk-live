'use client'

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, TicketIcon } from 'lucide-react'
import Header from "@/app/ui/header"

interface Ticket {
  id: string
  kiosk: string
  creationDate: string
  resolutionDate: string
  technician: string
  type: "Déplacement" | "Maintenance"
  priority: "Bas" | "Urgent" | "Normal"
}

const tickets: Ticket[] = [
  {
    id: "1345",
    kiosk: "Kiosk_1345",
    creationDate: "01/02/2024",
    resolutionDate: "01/02/2024",
    technician: "Alain NGONO",
    type: "Déplacement",
    priority: "Bas"
  },
  {
    id: "1339",
    kiosk: "Kiosk_1368",
    creationDate: "01/02/2024",
    resolutionDate: "01/02/2024",
    technician: "Thierry NTAMACK",
    type: "Déplacement",
    priority: "Urgent"
  },
  {
    id: "1340",
    kiosk: "Kiosk_1368",
    creationDate: "01/02/2024",
    resolutionDate: "01/02/2024",
    technician: "Boris ADIOGO",
    type: "Maintenance",
    priority: "Normal"
  },
  {
    id: "1346",
    kiosk: "Kiosk_1358",
    creationDate: "01/02/2024",
    resolutionDate: "01/02/2024",
    technician: "Bruno AYOLO",
    type: "Déplacement",
    priority: "Bas"
  },
  {
    id: "1332",
    kiosk: "Kiosk_1358",
    creationDate: "01/02/2024",
    resolutionDate: "01/02/2024",
    technician: "Alain NGONO",
    type: "Maintenance",
    priority: "Bas"
  },
  {
    id: "1333",
    kiosk: "Kiosk_195",
    creationDate: "01/02/2024",
    resolutionDate: "01/02/2024",
    technician: "Thierry NTAMACK",
    type: "Déplacement",
    priority: "Urgent"
  },
  {
    id: "1342",
    kiosk: "Kiosk_195",
    creationDate: "01/02/2024",
    resolutionDate: "01/02/2024",
    technician: "Boris ADIOGO",
    type: "Maintenance",
    priority: "Urgent"
  },
  {
    id: "1340",
    kiosk: "Kiosk_9545",
    creationDate: "01/02/2024",
    resolutionDate: "01/02/2024",
    technician: "Thierry NTAMACK",
    type: "Maintenance",
    priority: "Normal"
  },
  {
    id: "1344",
    kiosk: "Jean Dupont",
    creationDate: "01/02/2024",
    resolutionDate: "01/02/2024",
    technician: "Bruno AYOLO",
    type: "Déplacement",
    priority: "Normal"
  },
  {
    id: "1344",
    kiosk: "Jean Dupont",
    creationDate: "01/02/2024",
    resolutionDate: "01/02/2024",
    technician: "Bruno AYOLO",
    type: "Maintenance",
    priority: "Normal"
  }
]

export default function TicketTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800"
      case "Normal":
        return "bg-green-100 text-green-800"
      case "Bas":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <Header title="Historique" />
      <div className="flex items-center justify-between">
        <div className="relative">
          <Input
            placeholder="Rechercher"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[250px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID ticket</TableHead>
              <TableHead>Kiosque</TableHead>
              <TableHead>Date création</TableHead>
              <TableHead>Date résolution</TableHead>
              <TableHead>Technicien</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>État</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket, index) => (
              <TableRow key={`${ticket.id}-${index}`}>
                <TableCell className="flex items-center gap-2">
                  <TicketIcon className="h-4 w-4 text-gray-500" />
                  {ticket.id}
                </TableCell>
                <TableCell>{ticket.kiosk}</TableCell>
                <TableCell>{ticket.creationDate}</TableCell>
                <TableCell>{ticket.resolutionDate}</TableCell>
                <TableCell>{ticket.technician}</TableCell>
                <TableCell>{ticket.type}</TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(ticket.priority)}>
                    {ticket.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} sur 34
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" disabled>
            &lt;
          </Button>
          <Button variant="outline" size="icon" className="bg-orange-500 text-white hover:bg-orange-600">
            1
          </Button>
          <Button variant="outline" size="icon">2</Button>
          <Button variant="outline" size="icon">3</Button>
          <Button variant="outline" size="icon">...</Button>
          <Button variant="outline" size="icon">34</Button>
          <Button variant="outline" size="icon">&gt;</Button>
        </div>
      </div>
    </div>
  )
}

