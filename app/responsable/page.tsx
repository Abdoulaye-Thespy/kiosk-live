'use client'

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal, Search } from 'lucide-react'
import Header from "../ui/header"
import KioskMetrics from "../ui/admin/kiosques/metrics"

interface Kiosk {
  id: string
  number: string
  client: string
  city: string
  zone: string
  status: "En activité" | "En maintenance" | "Fermé"
  revenue: number
}

const kiosks: Kiosk[] = [
  {
    id: "1",
    number: "1345",
    client: "NDOUMBE François",
    city: "Douala",
    zone: "Makepe plateau",
    status: "En activité",
    revenue: 1000000
  },
  {
    id: "2",
    number: "1345",
    client: "NDOUMBE François",
    city: "Douala",
    zone: "Makepe BM fin des pavés",
    status: "En maintenance",
    revenue: 1000000
  },
  {
    id: "3",
    number: "1345",
    client: "NDOUMBE François",
    city: "Douala",
    zone: "Makepe plateau",
    status: "Fermé",
    revenue: 1000000
  },
  {
    id: "4",
    number: "1345",
    client: "NDOUMBE François",
    city: "Yaoundé",
    zone: "Akwa Nord 2",
    status: "Fermé",
    revenue: 1000000
  },
  {
    id: "5",
    number: "1345",
    client: "Ngono Freddy",
    city: "Yaoundé",
    zone: "Makepe BM fin des pavés",
    status: "En maintenance",
    revenue: 1000000
  },
  {
    id: "6",
    number: "1345",
    client: "Ngono Freddy",
    city: "Douala",
    zone: "Deido",
    status: "En activité",
    revenue: 1000000
  },
  {
    id: "7",
    number: "1345",
    client: "HABIB Oumarou",
    city: "Douala",
    zone: "Akwa Nord 2",
    status: "En maintenance",
    revenue: 1000000
  },
  {
    id: "8",
    number: "1345",
    client: "HABIB Oumarou",
    city: "Yaoundé",
    zone: "Deido",
    status: "Fermé",
    revenue: 1000000
  },
  {
    id: "9",
    number: "1345",
    client: "ABDOU Rayim",
    city: "Yaoundé",
    zone: "Total Bonateki",
    status: "En activité",
    revenue: 1000000
  }
]

export default function KioskTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedKiosk, setSelectedKiosk] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En activité":
        return "bg-green-100 text-green-800"
      case "En maintenance":
        return "bg-purple-100 text-purple-800"
      case "Fermé":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
            <Header title="Tableau de Bord" />
            <KioskMetrics />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[250px]"
            />
          </div>
          <Select value={selectedKiosk} onValueChange={setSelectedKiosk}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="TOUS LES KIOSQUES" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">TOUS LES KIOSQUES</SelectItem>
              <SelectItem value="active">Kiosques actifs</SelectItem>
              <SelectItem value="maintenance">En maintenance</SelectItem>
              <SelectItem value="closed">Fermés</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox />
              </TableHead>
              <TableHead>N° Kiosque</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>ville</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Revenu mensuel moyen</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {kiosks.map((kiosk) => (
              <TableRow key={kiosk.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>{kiosk.number}</TableCell>
                <TableCell className="font-medium">{kiosk.client}</TableCell>
                <TableCell>{kiosk.city}</TableCell>
                <TableCell>{kiosk.zone}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(kiosk.status)}>
                    {kiosk.status}
                  </Badge>
                </TableCell>
                <TableCell>{kiosk.revenue.toLocaleString()} FCFA</TableCell>
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

