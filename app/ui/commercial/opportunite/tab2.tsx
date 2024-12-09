'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, Eye, Download, Search, Filter } from 'lucide-react'
import { fr } from 'date-fns/locale'

type Status = 'Refusé' | 'Accepté' | 'En cours de validation'

interface Opportunity {
  id: string;
  reference: string;
  opportunity: string;
  status: Status;
  date: string;
}

const opportunities: Opportunity[] = [
  { id: "1", reference: "Devis_1547", opportunity: "Opportunité 1", status: "Refusé", date: "9 Juil 2023" },
  { id: "2", reference: "Devis_1547xsd", opportunity: "Opportunité 1", status: "Accepté", date: "9 Juil 2023" },
  { id: "3", reference: "Devis_1547xsd", opportunity: "Opportunité 1", status: "En cours de validation", date: "9 Juil 2023" },
  { id: "4", reference: "Devis_1547xsd", opportunity: "Opportunité 1", status: "En cours de validation", date: "9 Juil 2023" },
  { id: "5", reference: "Devis_1547xsd", opportunity: "Opportunité 1", status: "Refusé", date: "9 Juil 2023" },
  { id: "6", reference: "Devis_1547xsd", opportunity: "Opportunité 2", status: "Accepté", date: "9 Juil 2023" },
  { id: "7", reference: "Devis_1547xsd", opportunity: "Opportunité 2", status: "Refusé", date: "9 Juil 2023" },
  { id: "8", reference: "Devis_1547xsd", opportunity: "Opportunité 2", status: "Refusé", date: "9 Juil 2023" },
  { id: "9", reference: "Devis_1547xsd", opportunity: "Opportunité 2", status: "En cours de validation", date: "9 Juil 2023" },
]

const StatusBadge = ({ status }: { status: Status }) => {
  const getStatusStyles = (status: Status) => {
    switch (status) {
      case 'Refusé':
        return 'bg-purple-100 text-purple-600 hover:bg-purple-100'
      case 'Accepté':
        return 'bg-green-100 text-green-600 hover:bg-green-100'
      case 'En cours de validation':
        return 'bg-blue-100 text-blue-600 hover:bg-blue-100'
      default:
        return ''
    }
  }

  return (
    <Badge variant="secondary" className={getStatusStyles(status)}>
      {status}
    </Badge>
  )
}

export default function OpportunitiesTable() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [date, setDate] = useState<Date>()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  const totalPages = 34

  const filteredOpportunities = opportunities.filter(opp =>
    opp.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.opportunity.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter size={20} />
              Filtre
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le status du devis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="refusé">Refusé</SelectItem>
                    <SelectItem value="accepté">Accepté</SelectItem>
                    <SelectItem value="en-cours">En cours de validation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP', { locale: fr }) : "Sélectionner la date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedStatus('')
                    setDate(undefined)
                  }}
                >
                  Réinitialiser
                </Button>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Appliquer
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Devis</TableHead>
            <TableHead>Opportunités</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOpportunities.map((opp) => (
            <TableRow key={opp.id}>
              <TableCell className="font-medium">
                {opp.reference}
              </TableCell>
              <TableCell>{opp.opportunity}</TableCell>
              <TableCell>
                <StatusBadge status={opp.status} />
              </TableCell>
              <TableCell>{opp.date}</TableCell>
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

