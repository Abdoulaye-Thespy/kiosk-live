"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon, FileTextIcon } from "lucide-react"
import { getAllContracts } from "@/app/actions/contractActions"
import type { ContractStatus } from "@prisma/client"

export default function ContractsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [contracts, setContracts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filterStatus, setFilterStatus] = useState<ContractStatus | "">("")

  useEffect(() => {
    const fetchContracts = async () => {
      setIsLoading(true)
      try {
        const filters: any = {}

        if (filterStatus) {
          filters.status = filterStatus
        }

        if (session?.user?.id) {
          filters.userId = session.user.id
        }


        const result = await getAllContracts(filters)

        if (result.success) {
          console.log(result)
          setContracts(result.contracts)
        } else {
          setError(result.error || "Failed to load contracts")
        }
      } catch (error) {
        console.error("Error fetching contracts:", error)
        setError("An error occurred while loading contracts")
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchContracts()
    }
  }, [session, filterStatus])

  const getStatusBadge = (status: ContractStatus) => {
    switch (status) {
      case "DRAFT":
        return <Badge variant="outline">Brouillon</Badge>
      case "PENDING":
        return <Badge variant="secondary">En attente</Badge>
      case "CONFIRMED":
        return <Badge variant="default">Confirmé</Badge>
      case "ACTIVE":
        return (
          <Badge variant="success" className="bg-green-500">
            Actif
          </Badge>
        )
      case "EXPIRED":
        return <Badge variant="destructive">Expiré</Badge>
      case "TERMINATED":
        return <Badge variant="destructive">Résilié</Badge>
      case "CANCELLED":
        return <Badge variant="destructive">Annulé</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredContracts = contracts.filter((contract) => {
    return (
      (contract.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.contractNumber?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeTab === "all" ||
        (activeTab === "active" && contract.status === "ACTIVE") ||
        (activeTab === "pending" && ["DRAFT", "PENDING", "CONFIRMED"].includes(contract.status)) ||
        (activeTab === "expired" && ["EXPIRED", "TERMINATED", "CANCELLED"].includes(contract.status)))
    )
  })

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contrats</h1>
        <Button onClick={() => router.push("contrat/new")} className="bg-orange-500 hover:bg-orange-600 text-white">
          <PlusIcon className="mr-2 h-4 w-4" />
          Nouveau Contrat
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Contrats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contracts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Contrats Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contracts.filter((c) => c.status === "ACTIVE").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contracts.filter((c) => ["DRAFT", "PENDING", "CONFIRMED"].includes(c.status)).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expirés/Résiliés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contracts.filter((c) => ["EXPIRED", "TERMINATED", "CANCELLED"].includes(c.status)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between space-x-4 p-4 bg-white shadow rounded-lg">
        <div className="flex space-x-4">
          <Input
            type="text"
            placeholder="Rechercher par nom ou numéro de contrat"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80"
          />
          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tous les statuts</SelectItem>
              <SelectItem value="DRAFT">Brouillon</SelectItem>
              <SelectItem value="PENDING">En attente</SelectItem>
              <SelectItem value="CONFIRMED">Confirmé</SelectItem>
              <SelectItem value="ACTIVE">Actif</SelectItem>
              <SelectItem value="EXPIRED">Expiré</SelectItem>
              <SelectItem value="TERMINATED">Résilié</SelectItem>
              <SelectItem value="CANCELLED">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="active">Actifs</TabsTrigger>
          <TabsTrigger value="pending">En attente</TabsTrigger>
          <TabsTrigger value="expired">Expirés/Résiliés</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <ContractsTable contracts={filteredContracts} isLoading={isLoading} getStatusBadge={getStatusBadge} />
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          <ContractsTable contracts={filteredContracts} isLoading={isLoading} getStatusBadge={getStatusBadge} />
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          <ContractsTable contracts={filteredContracts} isLoading={isLoading} getStatusBadge={getStatusBadge} />
        </TabsContent>
        <TabsContent value="expired" className="mt-4">
          <ContractsTable contracts={filteredContracts} isLoading={isLoading} getStatusBadge={getStatusBadge} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ContractsTable({
  contracts,
  isLoading,
  getStatusBadge,
}: {
  contracts: any[]
  isLoading: boolean
  getStatusBadge: (status: ContractStatus) => JSX.Element
}) {
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (contracts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <FileTextIcon className="h-12 w-12 mb-4" />
        <p>Aucun contrat trouvé</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>N° Contrat</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Date de création</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Kiosques</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contracts.map((contract) => (
          <TableRow
            key={contract.id}
            className="cursor-pointer hover:bg-gray-50"
            onClick={() => router.push(`contrat/${contract.id}`)}
          >
            <TableCell className="font-medium">{contract.contractNumber}</TableCell>
            <TableCell>{contract.clientName}</TableCell>
            <TableCell>{new Date(contract.createdAt).toLocaleDateString()}</TableCell>
            <TableCell>{getStatusBadge(contract.status)}</TableCell>
            <TableCell>{Number(contract.totalAmount).toLocaleString()} FCFA</TableCell>
            <TableCell>{contract.kiosks.length}</TableCell>
            <TableCell>
              <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`contrat/${contract.id}`)
                  }}
                >
                  Voir
                </Button>
                {contract.contractDocument && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      window.open(contract.contractDocument, "_blank")
                    }}
                  >
                    PDF
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

