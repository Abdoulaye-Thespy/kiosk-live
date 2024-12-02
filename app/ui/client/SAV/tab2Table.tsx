'use client'

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface DataTableProps {
  data: {
    id: number
    intervention: string
    kiosque: string
    numeroDemande: string
    dateHeure: string
    priorite: "Urgent" | "Normal"
    status: "Fermé" | "En cours" | "En attente"
  }[]
}

export default function DataTable({ data }: DataTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 7

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Fermé":
        return "secondary"
      case "En cours":
        return "warning"
      case "En attente":
        return "outline"
      default:
        return "default"
    }
  }

  const getPriorityBadgeVariant = (priority: string) => {
    return priority === "Urgent" ? "destructive" : "success"
  }

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-4">
      <Input
        placeholder="Rechercher"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-sm"
      />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Intervention</TableHead>
              <TableHead>Kiosque</TableHead>
              <TableHead>N° de la demande</TableHead>
              <TableHead>Date heure</TableHead>
              <TableHead>Priorité</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.intervention}</TableCell>
                <TableCell>{item.kiosque}</TableCell>
                <TableCell>{item.numeroDemande}</TableCell>
                <TableCell>{item.dateHeure}</TableCell>
                <TableCell>
                  <Badge variant={getPriorityBadgeVariant(item.priorite)}>
                    {item.priorite}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(item.status)}>
                    {item.status}
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
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

