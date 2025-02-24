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
import { Button } from "@/components/ui/button"
import { Eye, Download, FileText, FileSpreadsheet, Receipt } from 'lucide-react'

interface Document {
  id: number
  type: string
  description: string
  kiosque: string
  date: string
}

const documents: Document[] = [
  {
    id: 1,
    type: "Rapport Intervention",
    description: "Objet du devis",
    kiosque: "Kiosque 676",
    date: "10 Nov 2023"
  },
  {
    id: 2,
    type: "Rapport Intervention",
    description: "Objet du devis",
    kiosque: "Kiosque 676",
    date: "01 Jan 2023"
  },
  {
    id: 3,
    type: "Rapport maintenance",
    description: "Objet du devis",
    kiosque: "Kiosque 676",
    date: "3 Mar 2023"
  },
  {
    id: 4,
    type: "Rapport maintenance",
    description: "Objet du devis",
    kiosque: "Kiosque 676",
    date: "3 Mar 2023"
  },
  {
    id: 5,
    type: "Rapport",
    description: "Objet du devis",
    kiosque: "Kiosque 676",
    date: "3 Mar 2023"
  },
  {
    id: 6,
    type: "Rapport",
    description: "Objet du devis",
    kiosque: "Kiosque 676",
    date: "9 Jul 2023"
  },
  {
    id: 7,
    type: "Facture",
    description: "Objet du devis",
    kiosque: "Kiosque 676",
    date: "9 Jul 2023"
  }
]

export default function DocumentTable() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 7

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "Rapport Intervention":
      case "Rapport maintenance":
      case "Rapport":
        return <FileText className="h-4 w-4 text-orange-500" />
      case "Facture":
        return <Receipt className="h-4 w-4 text-orange-500" />
      default:
        return <FileSpreadsheet className="h-4 w-4 text-orange-500" />
    }
  }

  const filteredData = documents.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

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
              <TableHead>Document</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Kiosque concerné</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getDocumentIcon(item.type)}
                    <span>{item.type}</span>
                  </div>
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.kiosque}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">
          Page {currentPage} sur {totalPages}
        </p>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  )
}

