'use client'

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Download, Filter, MoreHorizontal, X } from 'lucide-react'

const invoices = [
  {
    id: 1,
    client: {
      name: "Michael Hall",
      image: "/placeholder.svg"
    },
    type: "Location",
    amount: "450.000 FCfa",
    category: "Paiement",
    date: "10 Nov 2023, 08:00",
    status: "En attente"
  },
  {
    id: 2,
    client: {
      name: "Courtney Henry",
      image: "/placeholder.svg"
    },
    type: "Partenariat",
    amount: "100.000 FCfa",
    category: "Paiement",
    date: "10 Nov 2023, 08:00",
    status: "Suspendu"
  },
  {
    id: 3,
    client: {
      name: "Annette Black",
      image: "/placeholder.svg"
    },
    type: "Location",
    amount: "250.000 FCfa",
    category: "Paiement",
    date: "10 Nov 2023, 08:00",
    status: "Suspendu"
  },
  {
    id: 4,
    client: {
      name: "Jenny Wilson",
      image: "/placeholder.svg"
    },
    type: "Maintenance",
    amount: "80.000 FCfa",
    category: "Paiement",
    date: "10 Nov 2023, 08:00",
    status: "Effectué"
  },
  {
    id: 5,
    client: {
      name: "Ralph Edwards",
      image: "/placeholder.svg"
    },
    type: "Location",
    amount: "80.000 FCfa",
    category: "Paiement",
    date: "10 Nov 2023, 08:00",
    status: "Effectué"
  },
  {
    id: 6,
    client: {
      name: "Cody Fisher",
      image: "/placeholder.svg"
    },
    type: "Partenariat",
    amount: "80.000 FCfa",
    category: "Paiement",
    date: "10 Nov 2023, 08:00",
    status: "En attente"
  },
  {
    id: 7,
    client: {
      name: "Ronald Richards",
      image: "/placeholder.svg"
    },
    type: "Maintenance",
    amount: "80.000 FCfa",
    category: "Paiement",
    date: "10 Nov 2023, 08:00",
    status: "Suspendu"
  },
  {
    id: 8,
    client: {
      name: "Leslie Alexander",
      image: "/placeholder.svg"
    },
    type: "Partenariat",
    amount: "90.000 FCfa",
    category: "Paiement",
    date: "10 Nov 2023, 08:00",
    status: "Actif"
  },
  {
    id: 9,
    client: {
      name: "Jane Cooper",
      image: "/placeholder.svg"
    },
    type: "Maintenance",
    amount: "2500.000 FCfa",
    category: "Paiement",
    date: "10 Nov 2023, 08:00",
    status: "En attente"
  }
]

export default function TabThreeFacturePaiement() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    type: [],
    status: [],
    date: '30'
  })
  const totalPages = 10

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Effectué":
        return "text-green-600 bg-green-50"
      case "En attente":
        return "text-yellow-600 bg-yellow-50"
      case "Suspendu":
        return "text-red-600 bg-red-50"
      case "Actif":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Location":
        return "text-orange-500"
      case "Partenariat":
        return "text-purple-500"
      case "Maintenance":
        return "text-blue-500"
      default:
        return "text-gray-500"
    }
  }

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters }
      if (filterType === 'date') {
        updatedFilters.date = value
      } else {
        const index = updatedFilters[filterType].indexOf(value)
        if (index > -1) {
          updatedFilters[filterType] = updatedFilters[filterType].filter(item => item !== value)
        } else {
          updatedFilters[filterType] = [...updatedFilters[filterType], value]
        }
      }
      return updatedFilters
    })
  }

  const clearFilters = () => {
    setFilters({
      type: [],
      status: [],
      date: '30'
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input placeholder="Rechercher une transaction..." />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtrer
              {(filters.type.length > 0 || filters.status.length > 0) && (
                <span className="ml-2 rounded-full bg-primary w-2 h-2" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Filtres</h4>
                <p className="text-sm text-muted-foreground">
                  Affiner les résultats par type et statut.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label htmlFor="type">Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Location', 'Partenariat', 'Maintenance'].map((type) => (
                      <Label
                        key={type}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <Checkbox
                          id={type}
                          checked={filters.type.includes(type)}
                          onCheckedChange={() => handleFilterChange('type', type)}
                        />
                        <span>{type}</span>
                      </Label>
                    ))}
                  </div>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="status">Statut</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Effectué', 'En attente', 'Suspendu', 'Actif'].map((status) => (
                      <Label
                        key={status}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <Checkbox
                          id={status}
                          checked={filters.status.includes(status)}
                          onCheckedChange={() => handleFilterChange('status', status)}
                        />
                        <span>{status}</span>
                      </Label>
                    ))}
                  </div>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="date">Période</Label>
                  <Select
                    value={filters.date}
                    onValueChange={(value) => handleFilterChange('date', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 derniers jours</SelectItem>
                      <SelectItem value="30">30 derniers jours</SelectItem>
                      <SelectItem value="90">90 derniers jours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button variant="outline" onClick={clearFilters}>
                Réinitialiser les filtres
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client/fournisseur</TableHead>
              <TableHead>Prestation</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={invoice.client.image} alt={invoice.client.name} />
                      <AvatarFallback>{invoice.client.name[0]}</AvatarFallback>
                    </Avatar>
                    {invoice.client.name}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={getTypeColor(invoice.type)}>{invoice.type}</span>
                </TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    {invoice.category}
                  </span>
                </TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More actions</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Page {currentPage} sur {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}