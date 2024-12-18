'use client'

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Search } from 'lucide-react'
import MetricsResponsableTab2 from "./metricsTab2"

interface Intervention {
  id: string
  date: string
  status: "En attente" | "Résolu"
  priority: "Urgent" | "Normal"
}

const interventions: Intervention[] = [
  {
    id: "1345",
    date: "01/02/2024",
    status: "En attente",
    priority: "Urgent"
  },
  {
    id: "1345",
    date: "01/02/2024",
    status: "En attente",
    priority: "Normal"
  },
  {
    id: "1345",
    date: "01/02/2024",
    status: "Résolu",
    priority: "Normal"
  },
  {
    id: "1345",
    date: "01/02/2024",
    status: "En attente",
    priority: "Normal"
  },
  {
    id: "1345",
    date: "01/02/2024",
    status: "En attente",
    priority: "Urgent"
  },
  {
    id: "1345",
    date: "01/02/2024",
    status: "En attente",
    priority: "Normal"
  },
  {
    id: "1345",
    date: "01/02/2024",
    status: "En attente",
    priority: "Urgent"
  }
]

export default function InterventionTableTab2Responsable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En attente":
        return "bg-yellow-100 text-yellow-800"
      case "Résolu":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800"
      case "Normal":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(interventions.map(i => i.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id])
    } else {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id))
    }
  }

  return (
    <div className="space-y-4">
        <MetricsResponsableTab2 />
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
              <TableHead className="w-[50px]">
                <Checkbox 
                  checked={selectedRows.length === interventions.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Priorité</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interventions.map((intervention) => (
              <TableRow key={intervention.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedRows.includes(intervention.id)}
                    onCheckedChange={(checked) => handleSelectRow(intervention.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell>{intervention.id}</TableCell>
                <TableCell>{intervention.date}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(intervention.status)}>
                    {intervention.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(intervention.priority)}>
                    {intervention.priority}
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

