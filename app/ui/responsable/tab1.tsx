'use client'

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search } from 'lucide-react'
import MetricsResponsable from "./metrics"

interface MaintenanceRecord {
  id: string
  type: string
  date: string
  status: "Fermé" | "En cours" | "En attente" | "Résolu"
  priority: string
}

const maintenanceRecords: MaintenanceRecord[] = [
  {
    id: "1345",
    type: "Maintenance",
    date: "01/02/2024",
    status: "Fermé",
    priority: "Normal"
  },
  {
    id: "1345",
    type: "Maintenance",
    date: "01/02/2024",
    status: "Fermé",
    priority: "Normal"
  },
  {
    id: "1345",
    type: "Maintenance",
    date: "01/02/2024",
    status: "En attente",
    priority: "Normal"
  },
  {
    id: "1345",
    type: "Maintenance",
    date: "01/02/2024",
    status: "En attente",
    priority: "Normal"
  },
  {
    id: "1345",
    type: "Maintenance",
    date: "01/02/2024",
    status: "En cours",
    priority: "Normal"
  },
  {
    id: "1345",
    type: "Maintenance",
    date: "01/02/2024",
    status: "En cours",
    priority: "Normal"
  },
  {
    id: "1345",
    type: "Maintenance",
    date: "01/02/2024",
    status: "Résolu",
    priority: "Normal"
  }
]

export default function TabOneFactureIntervention() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Fermé":
        return "bg-red-100 text-red-800"
      case "En cours":
        return "bg-purple-100 text-purple-800"
      case "En attente":
        return "bg-yellow-100 text-yellow-800"
      case "Résolu":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="relative space-y-4">
        <MetricsResponsable/>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-[250px]"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Objet</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priorité</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {maintenanceRecords.map((record, index) => (
              <TableRow key={index}>
                <TableCell>{record.id}</TableCell>
                <TableCell>{record.type}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-orange-500 border-orange-500">
                    {record.priority}
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

