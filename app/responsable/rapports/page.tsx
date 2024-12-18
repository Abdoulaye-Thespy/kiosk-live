'use client'

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Eye, Search } from 'lucide-react'
import Header from "@/app/ui/header"

interface Report {
  id: string
  reference: string
  client: string
  status: "Installé" | "En maintenance" | "Désactivé"
  interventions: string
  date: string
}

const reports: Report[] = [
  {
    id: "1",
    reference: "Rap_1547",
    client: "Aurelie Mfou",
    status: "Installé",
    interventions: "03",
    date: "9 Juil 2023"
  },
  {
    id: "2",
    reference: "Rap_1547",
    client: "HABIB Oumarou",
    status: "Installé",
    interventions: "03",
    date: "9 Juil 2023"
  },
  {
    id: "3",
    reference: "Rap_1547",
    client: "HABIB Oumarou",
    status: "Installé",
    interventions: "03",
    date: "9 Juil 2023"
  },
  {
    id: "4",
    reference: "Rap_1547",
    client: "Ngono Freddy",
    status: "Installé",
    interventions: "03",
    date: "9 Juil 2023"
  },
  {
    id: "5",
    reference: "Rap_1547",
    client: "HABIB Oumarou",
    status: "Installé",
    interventions: "03",
    date: "9 Juil 2023"
  },
  {
    id: "6",
    reference: "Rap_1547",
    client: "Ngono Freddy",
    status: "Installé",
    interventions: "03",
    date: "9 Juil 2023"
  },
  {
    id: "7",
    reference: "Rap_1547",
    client: "Ngono Freddy",
    status: "Installé",
    interventions: "03",
    date: "9 Juil 2023"
  },
  {
    id: "8",
    reference: "Rap_1547",
    client: "Ngono Freddy",
    status: "Installé",
    interventions: "03",
    date: "9 Juil 2023"
  },
  {
    id: "9",
    reference: "Rap_1547",
    client: "HABIB Oumarou",
    status: "Installé",
    interventions: "03",
    date: "9 Juil 2023"
  },
  {
    id: "10",
    reference: "Rap_1547",
    client: "HABIB Oumarou",
    status: "Installé",
    interventions: "03",
    date: "9 Juil 2023"
  }
]

export default function ReportsTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")

  return (
    <div className="space-y-4">
      <Header title="Rapports d’activités" />
      <Tabs defaultValue="all" onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">
            Tous les kiosques
          </TabsTrigger>
          <TabsTrigger value="installed">
            Kiosques installés
          </TabsTrigger>
          <TabsTrigger value="deactivated">
            Kiosques en désactivés
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            Kiosques en maintenance
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center justify-between">
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
              <TableHead>Rapport</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Interventions</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-orange-500" />
                  {report.reference}
                </TableCell>
                <TableCell className="font-medium">{report.client}</TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800">
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell>{report.interventions}</TableCell>
                <TableCell>{report.date}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
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

