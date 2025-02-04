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
import KioskTable from "../ui/admin/kiosques/tab1"

export default function KioskTableREsponsable() {
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
    <div className="">
      <Header title="Tableau de Bord" />
      <KioskTable />
    </div>
  )
}

