'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Eye, Download, FileText, Search, SlidersHorizontal, ArrowDownAZ } from 'lucide-react'

interface Report {
  id: string;
  name: string;
  type: string;
  date: string;
}

const reports: Report[] = [
  { id: "1", name: "Rap_contrat 1547", type: "Paiement", date: "9 Juil 2023" },
  { id: "2", name: "Rap_paiement 1547", type: "Contrats", date: "9 Juil 2023" },
  { id: "3", name: "Rap_facture 1867", type: "Inventaire", date: "9 Juil 2023" },
  { id: "4", name: "Rap_inventaire 10436", type: "Contrats", date: "9 Juil 2023" },
  { id: "5", name: "Rap_paiement 1547", type: "Facture", date: "9 Juil 2023" },
  { id: "6", name: "Rap_facture 1867", type: "Inventaire", date: "9 Juil 2023" },
  { id: "7", name: "Rap_inventaire 10436", type: "Facture", date: "9 Juil 2023" },
  { id: "8", name: "Rap_inventaire 10436", type: "Facture", date: "9 Juil 2023" },
  { id: "9", name: "Rap_inventaire 10436", type: "Facture", date: "9 Juil 2023" },
  { id: "10", name: "Rap_inventaire 10436", type: "Facture", date: "9 Juil 2023" },
]

export default function ReportTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredReports = reports.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.date.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = 34 // This would typically be calculated based on the total number of reports

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            className="pl-10 pr-4 py-2 w-64"
            placeholder="Recherche"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <SlidersHorizontal size={20} />
          </Button>
          <Button variant="outline" size="icon">
            <ArrowDownAZ size={20} />
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Rapport</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredReports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <FileText className="mr-2 text-orange-500" size={20} />
                  {report.name}
                </div>
              </TableCell>
              <TableCell>{report.type}</TableCell>
              <TableCell>{report.date}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <Eye size={20} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Download size={20} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={20} />
          </Button>
          {[1, 2, 3].map(page => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button variant="outline">...</Button>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(totalPages)}
          >
            {totalPages}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>
    </div>
  )
}

