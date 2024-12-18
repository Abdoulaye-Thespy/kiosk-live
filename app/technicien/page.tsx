'use client'

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MoreHorizontal, Search, TicketIcon, RotateCw, Filter, Bell } from 'lucide-react'
import Header from "../ui/header"
import KioskMetrics from "../ui/admin/kiosques/metrics"

interface Task {
  id: string
  ticketId: string
  kiosk: string
  date: string
  client: string
  type: "Déplacement" | "Maintenance" | "Déploiement"
  priority: "Bas" | "Normal" | "Urgent"
  status: "Done" | "En cours" | "Annulé" | "Effectué"
}

const tasks: Task[] = [
  {
    id: "1",
    ticketId: "1345",
    kiosk: "Kiosk_1345",
    date: "01/02/2024",
    client: "Alain NGONO",
    type: "Déplacement",
    priority: "Bas",
    status: "Annulé"
  },
  {
    id: "2",
    ticketId: "1339",
    kiosk: "Kiosk_1368",
    date: "01/02/2024",
    client: "Thierry NTAMACK",
    type: "Déplacement",
    priority: "Urgent",
    status: "Done"
  },
  {
    id: "3",
    ticketId: "1340",
    kiosk: "Kiosk_1368",
    date: "01/02/2024",
    client: "Boris ADIOGO",
    type: "Déplacement",
    priority: "Normal",
    status: "En cours"
  },
  {
    id: "4",
    ticketId: "1346",
    kiosk: "Kiosk_1358",
    date: "01/02/2024",
    client: "Bruno AYOLO",
    type: "Maintenance",
    priority: "Bas",
    status: "Effectué"
  },
  {
    id: "5",
    ticketId: "1332",
    kiosk: "Kiosk_1358",
    date: "01/02/2024",
    client: "Alain NGONO",
    type: "Déplacement",
    priority: "Bas",
    status: "En cours"
  }
]

export default function TaskTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800 border-red-800"
      case "Normal":
        return "bg-green-100 text-green-800"
      case "Bas":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Done":
        return "text-green-600 flex items-center gap-1"
      case "Effectué":
        return "text-green-600 flex items-center gap-1"
      case "En cours":
        return "text-yellow-600 flex items-center gap-1"
      case "Annulé":
        return "text-gray-600 flex items-center gap-1"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Done":
        return "✓"
      case "Effectué":
        return "✓"
      case "En cours":
        return "◷"
      case "Annulé":
        return "•"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-4">
      <Header title="Mes taches" />
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
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="TOUS LES TACHES" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">TOUS LES TACHES</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="completed">Terminé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30px]">
                <Checkbox />
              </TableHead>
              <TableHead>ID ticket</TableHead>
              <TableHead>Kiosque</TableHead>
              <TableHead>Date création</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Priorité</TableHead>
              <TableHead>État</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <TicketIcon className="h-4 w-4 text-gray-500" />
                  {task.ticketId}
                </TableCell>
                <TableCell>{task.kiosk}</TableCell>
                <TableCell>{task.date}</TableCell>
                <TableCell>{task.client}</TableCell>
                <TableCell>{task.type}</TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={getStatusColor(task.status)}>
                    {getStatusIcon(task.status)} {task.status}
                  </span>
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
    </div>
  )
}

