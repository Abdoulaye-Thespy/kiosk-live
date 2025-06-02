"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Search, Plus, FileText, Download, MoreHorizontal, Filter } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getProformasByUser } from "@/app/actions/proformaActions"
import type { ProformaStatus } from "@prisma/client"

export default function ProformasListPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [proformas, setProformas] = useState<any[]>([])
  const [filteredProformas, setFilteredProformas] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("all")

  // Fetch proformas on component mount
  useEffect(() => {
    fetchProformas()
  }, [])

  // Apply filters when filter state changes
  useEffect(() => {
    applyFilters()
  }, [proformas, searchTerm, statusFilter, dateFilter, activeTab])

  // Fetch proformas from the server
  const fetchProformas = async () => {
    setIsLoading(true)
    try {
      const result = await getProformasByUser (session.user.id)
      if (result.success) {
        setProformas(result.proformas)
      } else {
        setError(result.error || "Échec du chargement des proformas")
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des proformas:", error)
      setError("Une erreur s'est produite lors du chargement des proformas")
    } finally {
      setIsLoading(false)
    }
  }

  // Apply filters to the proformas list
  const applyFilters = () => {
    let filtered = [...proformas]

    // Apply tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter((proforma) => proforma.status === activeTab)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((proforma) => proforma.status === statusFilter)
    }

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date()
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30))
      const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90))

      filtered = filtered.filter((proforma) => {
        const proformaDate = new Date(proforma.createdAt)
        if (dateFilter === "last30days") {
          return proformaDate >= thirtyDaysAgo
        } else if (dateFilter === "last90days") {
          return proformaDate >= ninetyDaysAgo
        }
        return true
      })
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (proforma) =>
          proforma.proformaNumber.toLowerCase().includes(term) || proforma.clientName.toLowerCase().includes(term),
      )
    }

    setFilteredProformas(filtered)
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA"
  }

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Get status badge variant
  const getStatusBadgeVariant = (status: ProformaStatus) => {
    switch (status) {
      case "DRAFT":
        return "secondary"
      case "SENT":
        return "blue"
      case "ACCEPTED":
        return "success"
      case "REJECTED":
        return "destructive"
      case "CONVERTED":
        return "purple"
      case "EXPIRED":
        return "outline"
      default:
        return "secondary"
    }
  }

  // Get status display text
  const getStatusDisplayText = (status: ProformaStatus) => {
    switch (status) {
      case "DRAFT":
        return "Brouillon"
      case "SENT":
        return "Envoyée"
      case "ACCEPTED":
        return "Acceptée"
      case "REJECTED":
        return "Rejetée"
      case "CONVERTED":
        return "Convertie"
      case "EXPIRED":
        return "Expirée"
      default:
        return status
    }
  }

  // Handle view proforma
  const handleViewProforma = (id: string) => {
    router.push(`/admin/proforma/${id}`)
  }

  // Handle create new proforma
  const handleCreateProforma = () => {
    router.push("/commercial/proforma/new")
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Proformas</h1>
        <Button onClick={handleCreateProforma} className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Proforma
        </Button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Liste des Proformas</CardTitle>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 w-full md:w-[250px]"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Statut" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="DRAFT">Brouillon</SelectItem>
                    <SelectItem value="SENT">Envoyée</SelectItem>
                    <SelectItem value="ACCEPTED">Acceptée</SelectItem>
                    <SelectItem value="REJECTED">Rejetée</SelectItem>
                    <SelectItem value="CONVERTED">Convertie</SelectItem>
                    <SelectItem value="EXPIRED">Expirée</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les dates</SelectItem>
                    <SelectItem value="last30days">30 derniers jours</SelectItem>
                    <SelectItem value="last90days">90 derniers jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="DRAFT">Brouillons</TabsTrigger>
              <TabsTrigger value="SENT">Envoyées</TabsTrigger>
              <TabsTrigger value="ACCEPTED">Acceptées</TabsTrigger>
              <TabsTrigger value="CONVERTED">Converties</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : filteredProformas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Aucune proforma trouvée</div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>N° Proforma</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Type de Kiosque</TableHead>
                        <TableHead>Quantité</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Date de création</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProformas.map((proforma) => (
                        <TableRow key={proforma.id}>
                          <TableCell className="font-medium">{proforma.proformaNumber}</TableCell>
                          <TableCell>{proforma.clientName}</TableCell>
                          <TableCell>
                            {proforma.kioskType === "MONO"
                              ? "Mono Kiosque"
                              : proforma.kioskType === "GRAND"
                                ? "Grand Kiosque"
                                : "Compartiment"}
                          </TableCell>
                          <TableCell>{proforma.quantity}</TableCell>
                          <TableCell>{formatCurrency(proforma.totalAmount)}</TableCell>
                          <TableCell>{formatDate(proforma.createdAt)}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(proforma.status)}>
                              {getStatusDisplayText(proforma.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleViewProforma(proforma.id)}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Voir les détails
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Télécharger PDF
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {proforma.status === "DRAFT" && <DropdownMenuItem>Modifier</DropdownMenuItem>}
                                {(proforma.status === "DRAFT" || proforma.status === "SENT") && (
                                  <DropdownMenuItem>Envoyer par email</DropdownMenuItem>
                                )}
                                {proforma.status === "ACCEPTED" && (
                                  <DropdownMenuItem>Convertir en contrat</DropdownMenuItem>
                                )}
                                {proforma.status === "DRAFT" && (
                                  <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
