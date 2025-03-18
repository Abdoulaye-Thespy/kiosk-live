"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowLeft,
  FileTextIcon,
  ClipboardIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  Loader2,
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  CreditCardIcon,
  ClockIcon,
  HistoryIcon,
} from "lucide-react"
import { getContract, updateContractStatus, recordPayment } from "@/app/actions/contractActions"
import type { ContractStatus } from "@prisma/client"

export default function ContractDetailPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const contractId = params.id as string

  const [contract, setContract] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [paymentData, setPaymentData] = useState({
    amount: "",
    paymentMethod: "Espèces",
    reference: "",
  })

  useEffect(() => {
    const fetchContract = async () => {
      setIsLoading(true)
      try {
        const result = await getContract(contractId)

        if (result.success) {
          setContract(result.contract)
        } else {
          setError(result.error || "Failed to load contract")
        }
      } catch (error) {
        console.error("Error fetching contract:", error)
        setError("An error occurred while loading the contract")
      } finally {
        setIsLoading(false)
      }
    }

    if (contractId) {
      fetchContract()
    }
  }, [contractId])

  const handleStatusUpdate = async (newStatus: ContractStatus) => {
    if (!session?.user?.id) return

    setIsUpdatingStatus(true)
    try {
      const result = await updateContractStatus(contractId, newStatus, session.user.id)

      if (result.success) {
        setContract(result.contract)
      } else {
        setError(result.error || "Failed to update contract status")
      }
    } catch (error) {
      console.error("Error updating contract status:", error)
      setError("An error occurred while updating the contract status")
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!paymentData.amount) {
      setError("Payment amount is required")
      return
    }

    try {
      const result = await recordPayment(
        contractId,
        Number.parseFloat(paymentData.amount),
        paymentData.paymentMethod,
        paymentData.reference,
      )

      if (result.success) {
        // Refresh contract data
        const contractResult = await getContract(contractId)
        if (contractResult.success) {
          setContract(contractResult.contract)
        }

        setIsPaymentDialogOpen(false)
        setPaymentData({
          amount: "",
          paymentMethod: "Espèces",
          reference: "",
        })
      } else {
        setError(result.error || "Failed to record payment")
      }
    } catch (error) {
      console.error("Error recording payment:", error)
      setError("An error occurred while recording the payment")
    }
  }

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

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">Contrat non trouvé</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error || "Le contrat demandé n'existe pas ou a été supprimé."}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">Contrat {contract.contractNumber}</h1>
        </div>
        <div className="flex space-x-2">
          {contract.contractDocument && (
            <Button variant="outline" onClick={() => window.open(contract.contractDocument, "_blank")}>
              <FileTextIcon className="h-4 w-4 mr-2" />
              Voir le PDF
            </Button>
          )}

          {contract.status === "DRAFT" && (
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => handleStatusUpdate("PENDING")}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <ClipboardIcon className="h-4 w-4 mr-2" />
              )}
              Soumettre
            </Button>
          )}

          {contract.status === "PENDING" && session?.user?.role === "ADMIN" && (
            <Button
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => handleStatusUpdate("CONFIRMED")}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircleIcon className="h-4 w-4 mr-2" />
              )}
              Confirmer
            </Button>
          )}

          {contract.status === "CONFIRMED" && session?.user?.role === "ADMIN" && (
            <Button
              className="bg-green-500 hover:bg-green-600 text-white"
              onClick={() => handleStatusUpdate("ACTIVE")}
              disabled={isUpdatingStatus}
            >
              {isUpdatingStatus ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <CheckCircleIcon className="h-4 w-4 mr-2" />
              )}
              Activer
            </Button>
          )}

          {["DRAFT", "PENDING", "CONFIRMED"].includes(contract.status) && (
            <Button variant="destructive" onClick={() => handleStatusUpdate("CANCELLED")} disabled={isUpdatingStatus}>
              {isUpdatingStatus ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <XCircleIcon className="h-4 w-4 mr-2" />
              )}
              Annuler
            </Button>
          )}

          {contract.status === "ACTIVE" && (
            <Button variant="destructive" onClick={() => handleStatusUpdate("TERMINATED")} disabled={isUpdatingStatus}>
              {isUpdatingStatus ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <AlertCircleIcon className="h-4 w-4 mr-2" />
              )}
              Résilier
            </Button>
          )}

          {contract.status === "ACTIVE" && (
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => setIsPaymentDialogOpen(true)}
            >
              <CreditCardIcon className="h-4 w-4 mr-2" />
              Enregistrer un paiement
            </Button>
          )}
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Statut</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {getStatusBadge(contract.status)}
              <span className="ml-2 text-sm text-gray-500">
                {contract.status === "ACTIVE" &&
                  contract.startDate &&
                  `Depuis le ${new Date(contract.startDate).toLocaleDateString()}`}
                {contract.status === "EXPIRED" &&
                  contract.endDate &&
                  `Expiré le ${new Date(contract.endDate).toLocaleDateString()}`}
                {contract.status === "TERMINATED" &&
                  contract.terminationDate &&
                  `Résilié le ${new Date(contract.terminationDate).toLocaleDateString()}`}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Montant total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contract.totalAmount.toLocaleString()} FCFA</div>
            <p className="text-sm text-gray-500">
              {contract.paymentAmount.toLocaleString()} FCFA par {contract.paymentFrequency.toLowerCase()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Durée</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contract.contractDuration} mois</div>
            {contract.startDate && contract.endDate && (
              <p className="text-sm text-gray-500">
                Du {new Date(contract.startDate).toLocaleDateString()} au{" "}
                {new Date(contract.endDate).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="kiosks">Kiosques ({contract.kiosks.length})</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informations du client</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <UserIcon className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">{contract.clientName}</p>
                        <p className="text-sm text-gray-500">
                          {contract.clientIdNumber && `CNI: ${contract.clientIdNumber}`}
                          {contract.clientIdIssuedDate &&
                            `, délivrée le ${new Date(contract.clientIdIssuedDate).toLocaleDateString()}`}
                          {contract.clientIdIssuedPlace && ` à ${contract.clientIdIssuedPlace}`}
                        </p>
                      </div>
                    </div>

                    {contract.clientPhone && (
                      <div className="flex items-start">
                        <PhoneIcon className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium">{contract.clientPhone}</p>
                          <p className="text-sm text-gray-500">Téléphone</p>
                        </div>
                      </div>
                    )}

                    {contract.clientAddress && (
                      <div className="flex items-start">
                        <MapPinIcon className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium">{contract.clientAddress}</p>
                          <p className="text-sm text-gray-500">Adresse domicile</p>
                        </div>
                      </div>
                    )}

                    {(contract.clientBusinessAddress ||
                      contract.clientBusinessQuarter ||
                      contract.clientBusinessLocation) && (
                      <div className="flex items-start">
                        <MapPinIcon className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium">
                            {[
                              contract.clientBusinessAddress,
                              contract.clientBusinessQuarter && `Quartier ${contract.clientBusinessQuarter}`,
                              contract.clientBusinessLocation && `Lieu-dit ${contract.clientBusinessLocation}`,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                          <p className="text-sm text-gray-500">Adresse professionnelle</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Détails du contrat</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CalendarIcon className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">Créé le {new Date(contract.createdAt).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">par {contract.createdBy?.name || "Utilisateur inconnu"}</p>
                      </div>
                    </div>

                    {contract.signatureDate && (
                      <div className="flex items-start">
                        <ClipboardIcon className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium">
                            Signé le {new Date(contract.signatureDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            par {contract.signedBy?.name || "Utilisateur inconnu"}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start">
                      <ClockIcon className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">{contract.contractDuration} mois</p>
                        <p className="text-sm text-gray-500">Durée du contrat</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <CreditCardIcon className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">
                          {contract.paymentAmount.toLocaleString()} FCFA par {contract.paymentFrequency.toLowerCase()}
                        </p>
                        <p className="text-sm text-gray-500">
                          Montant total: {contract.totalAmount.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kiosks" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {contract.kiosks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Aucun kiosque associé à ce contrat</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Kiosque</TableHead>
                      <TableHead>Modèle</TableHead>
                      <TableHead>Emplacement</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contract.kiosks.map((kiosk: any) => (
                      <TableRow key={kiosk.id}>
                        <TableCell className="font-medium">{kiosk.kiosqueNumber}</TableCell>
                        <TableCell>{kiosk.model}</TableCell>
                        <TableCell>{kiosk.location}</TableCell>
                        <TableCell>
                          <Badge
                            variant={kiosk.status === "OCCUPIED" ? "success" : "secondary"}
                            className={kiosk.status === "OCCUPIED" ? "bg-green-500" : ""}
                          >
                            {kiosk.status === "OCCUPIED"
                              ? "Occupé"
                              : kiosk.status === "RESERVED"
                                ? "Réservé"
                                : kiosk.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* <TabsContent value="payments" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {contract.payments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Aucun paiement enregistré pour ce contrat</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Méthode</TableHead>
                      <TableHead>Référence</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contract.payments.map((payment: any) => (
                      <TableRow key={payment.id}>
                        <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{payment.amount.toLocaleString()} FCFA</TableCell>
                        <TableCell>{payment.paymentMethod}</TableCell>
                        <TableCell>{payment.reference || "-"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={payment.status === "COMPLETED" ? "success" : "secondary"}
                            className={payment.status === "COMPLETED" ? "bg-green-500" : ""}
                          >
                            {payment.status === "COMPLETED" ? "Complété" : payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent> */}

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {contract.contractActions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Aucune action enregistrée pour ce contrat</div>
              ) : (
                <div className="space-y-4">
                  {contract.contractActions.map((action: any) => (
                    <div key={action.id} className="flex items-start">
                      <HistoryIcon className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium">{action.description}</p>
                        <p className="text-sm text-gray-500">{new Date(action.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer un paiement</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePaymentSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Montant (FCFA)*</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Méthode de paiement*</Label>
                <Select
                  value={paymentData.paymentMethod}
                  onValueChange={(value) => setPaymentData({ ...paymentData, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Espèces">Espèces</SelectItem>
                    <SelectItem value="Chèque">Chèque</SelectItem>
                    <SelectItem value="Virement">Virement bancaire</SelectItem>
                    <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">Référence</Label>
                <Input
                  id="reference"
                  value={paymentData.reference}
                  onChange={(e) => setPaymentData({ ...paymentData, reference: e.target.value })}
                  placeholder="N° de chèque, référence de transaction, etc."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsPaymentDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                Enregistrer le paiement
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

