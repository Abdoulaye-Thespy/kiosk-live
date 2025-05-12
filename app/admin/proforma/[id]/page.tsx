"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Loader2, ArrowLeft, Download, FileText, Send, Check, X, FileOutput } from "lucide-react"
import { getProforma, updateProformaStatus, convertProformaToContract } from "@/app/actions/proformaActions"
import type { ProformaStatus } from "@prisma/client"

// Kiosk type and pricing data
const KIOSK_TYPES = {
  MONO: {
    name: "Mono Kiosque",
    basePrice: 150000,
    surfaces: {
      joues: { count: 2, price: 25000, name: "Joues" },
      oreilles: { count: 2, price: 15000, name: "Oreilles" },
      menton: { count: 1, price: 20000, name: "Menton" },
      fronton: { count: 1, price: 30000, name: "Fronton" },
    },
  },
  GRAND: {
    name: "Grand Kiosque",
    basePrice: 250000,
    surfaces: {
      joues: { count: 2, price: 35000, name: "Joues" },
      oreilles: { count: 4, price: 15000, name: "Oreilles" },
      menton: { count: 1, price: 25000, name: "Menton" },
      fronton: { count: 1, price: 40000, name: "Fronton" },
    },
  },
  COMPARTIMENT: {
    name: "Compartiment",
    basePrice: 100000,
    surfaces: {
      joues: { count: 1, price: 20000, name: "Joues" },
      oreilles: { count: 1, price: 10000, name: "Oreilles" },
      menton: { count: 1, price: 15000, name: "Menton" },
      fronton: { count: 1, price: 25000, name: "Fronton" },
    },
  },
}

export default function ProformaDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [proforma, setProforma] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch proforma details on component mount
  useEffect(() => {
    fetchProformaDetails()
  }, [params.id])

  // Fetch proforma details from the server
  const fetchProformaDetails = async () => {
    setIsLoading(true)
    try {
      const result = await getProforma(params.id)
      if (result.success) {
        setProforma(result.proforma)
      } else {
        setError(result.error || "Échec du chargement de la proforma")
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de la proforma:", error)
      setError("Une erreur s'est produite lors du chargement de la proforma")
    } finally {
      setIsLoading(false)
    }
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

  // Handle send proforma
  const handleSendProforma = async () => {
    setIsActionLoading(true)
    try {
      const result = await updateProformaStatus(params.id, "SENT")
      if (result.success) {
        setProforma({ ...proforma, status: "SENT" })
      } else {
        setError(result.error || "Échec de l'envoi de la proforma")
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la proforma:", error)
      setError("Une erreur s'est produite lors de l'envoi de la proforma")
    } finally {
      setIsActionLoading(false)
    }
  }

  // Handle accept proforma
  const handleAcceptProforma = async () => {
    setIsActionLoading(true)
    try {
      const result = await updateProformaStatus(params.id, "ACCEPTED")
      if (result.success) {
        setProforma({ ...proforma, status: "ACCEPTED" })
      } else {
        setError(result.error || "Échec de l'acceptation de la proforma")
      }
    } catch (error) {
      console.error("Erreur lors de l'acceptation de la proforma:", error)
      setError("Une erreur s'est produite lors de l'acceptation de la proforma")
    } finally {
      setIsActionLoading(false)
    }
  }

  // Handle reject proforma
  const handleRejectProforma = async () => {
    setIsActionLoading(true)
    try {
      const result = await updateProformaStatus(params.id, "REJECTED")
      if (result.success) {
        setProforma({ ...proforma, status: "REJECTED" })
      } else {
        setError(result.error || "Échec du rejet de la proforma")
      }
    } catch (error) {
      console.error("Erreur lors du rejet de la proforma:", error)
      setError("Une erreur s'est produite lors du rejet de la proforma")
    } finally {
      setIsActionLoading(false)
    }
  }

  // Handle convert to contract
  const handleConvertToContract = async () => {
    if (!session?.user?.id) {
      setError("Utilisateur non authentifié")
      return
    }

    setIsActionLoading(true)
    try {
      const result = await convertProformaToContract(params.id, session.user.id)
      if (result.success) {
        setProforma({ ...proforma, status: "CONVERTED" })
        // Redirect to the new contract
        router.push(`/admin/contrat/${result.contractId}`)
      } else {
        setError(result.error || "Échec de la conversion en contrat")
      }
    } catch (error) {
      console.error("Erreur lors de la conversion en contrat:", error)
      setError("Une erreur s'est produite lors de la conversion en contrat")
    } finally {
      setIsActionLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
        <Button variant="outline" onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>
    )
  }

  if (!proforma) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-8 text-gray-500">Proforma non trouvée</div>
        <Button variant="outline" onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
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
          <h1 className="text-3xl font-bold">Proforma {proforma.proformaNumber}</h1>
        </div>
        <Badge variant={getStatusBadgeVariant(proforma.status)} className="text-sm px-3 py-1">
          {getStatusDisplayText(proforma.status)}
        </Badge>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Détails de la Proforma</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Numéro de Proforma</p>
                  <p>{proforma.proformaNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date de création</p>
                  <p>{formatDate(proforma.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Créé par</p>
                  <p>{proforma.createdBy?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Statut</p>
                  <Badge variant={getStatusBadgeVariant(proforma.status)}>
                    {getStatusDisplayText(proforma.status)}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-3">Informations du Client</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nom</p>
                    <p>{proforma.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{proforma.clientEmail || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Téléphone</p>
                    <p>{proforma.clientPhone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Adresse</p>
                    <p>{proforma.clientAddress || "N/A"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-3">Détails de la Commande</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Quantité</TableHead>
                      <TableHead>Prix unitaire</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{KIOSK_TYPES[proforma.kioskType].name}</TableCell>
                      <TableCell>{proforma.quantity}</TableCell>
                      <TableCell>{formatCurrency(KIOSK_TYPES[proforma.kioskType].basePrice)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(proforma.basePrice)}</TableCell>
                    </TableRow>

                    {proforma.surfaces.joues && (
                      <TableRow>
                        <TableCell>
                          Branding Joues ({KIOSK_TYPES[proforma.kioskType].surfaces.joues.count} par kiosque)
                        </TableCell>
                        <TableCell>
                          {KIOSK_TYPES[proforma.kioskType].surfaces.joues.count * proforma.quantity}
                        </TableCell>
                        <TableCell>{formatCurrency(KIOSK_TYPES[proforma.kioskType].surfaces.joues.price)}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(
                            KIOSK_TYPES[proforma.kioskType].surfaces.joues.price *
                              KIOSK_TYPES[proforma.kioskType].surfaces.joues.count *
                              proforma.quantity,
                          )}
                        </TableCell>
                      </TableRow>
                    )}

                    {proforma.surfaces.oreilles && (
                      <TableRow>
                        <TableCell>
                          Branding Oreilles ({KIOSK_TYPES[proforma.kioskType].surfaces.oreilles.count} par kiosque)
                        </TableCell>
                        <TableCell>
                          {KIOSK_TYPES[proforma.kioskType].surfaces.oreilles.count * proforma.quantity}
                        </TableCell>
                        <TableCell>{formatCurrency(KIOSK_TYPES[proforma.kioskType].surfaces.oreilles.price)}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(
                            KIOSK_TYPES[proforma.kioskType].surfaces.oreilles.price *
                              KIOSK_TYPES[proforma.kioskType].surfaces.oreilles.count *
                              proforma.quantity,
                          )}
                        </TableCell>
                      </TableRow>
                    )}

                    {proforma.surfaces.menton && (
                      <TableRow>
                        <TableCell>
                          Branding Menton ({KIOSK_TYPES[proforma.kioskType].surfaces.menton.count} par kiosque)
                        </TableCell>
                        <TableCell>
                          {KIOSK_TYPES[proforma.kioskType].surfaces.menton.count * proforma.quantity}
                        </TableCell>
                        <TableCell>{formatCurrency(KIOSK_TYPES[proforma.kioskType].surfaces.menton.price)}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(
                            KIOSK_TYPES[proforma.kioskType].surfaces.menton.price *
                              KIOSK_TYPES[proforma.kioskType].surfaces.menton.count *
                              proforma.quantity,
                          )}
                        </TableCell>
                      </TableRow>
                    )}

                    {proforma.surfaces.fronton && (
                      <TableRow>
                        <TableCell>
                          Branding Fronton ({KIOSK_TYPES[proforma.kioskType].surfaces.fronton.count} par kiosque)
                        </TableCell>
                        <TableCell>
                          {KIOSK_TYPES[proforma.kioskType].surfaces.fronton.count * proforma.quantity}
                        </TableCell>
                        <TableCell>{formatCurrency(KIOSK_TYPES[proforma.kioskType].surfaces.fronton.price)}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(
                            KIOSK_TYPES[proforma.kioskType].surfaces.fronton.price *
                              KIOSK_TYPES[proforma.kioskType].surfaces.fronton.count *
                              proforma.quantity,
                          )}
                        </TableCell>
                      </TableRow>
                    )}

                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-bold">
                        Total
                      </TableCell>
                      <TableCell className="text-right font-bold">{formatCurrency(proforma.totalAmount)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {proforma.pdfUrl && (
                  <Button className="w-full" onClick={() => window.open(proforma.pdfUrl, "_blank")}>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </Button>
                )}

                {proforma.status === "DRAFT" && (
                  <Button
                    className="w-full bg-blue-500 hover:bg-blue-600"
                    onClick={handleSendProforma}
                    disabled={isActionLoading}
                  >
                    {isActionLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Envoyer au client
                  </Button>
                )}

                {proforma.status === "SENT" && (
                  <>
                    <Button
                      className="w-full bg-green-500 hover:bg-green-600"
                      onClick={handleAcceptProforma}
                      disabled={isActionLoading}
                    >
                      {isActionLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4 mr-2" />
                      )}
                      Marquer comme acceptée
                    </Button>
                    <Button
                      className="w-full bg-red-500 hover:bg-red-600"
                      onClick={handleRejectProforma}
                      disabled={isActionLoading}
                    >
                      {isActionLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <X className="h-4 w-4 mr-2" />
                      )}
                      Marquer comme rejetée
                    </Button>
                  </>
                )}

                {proforma.status === "ACCEPTED" && (
                  <Button
                    className="w-full bg-purple-500 hover:bg-purple-600"
                    onClick={handleConvertToContract}
                    disabled={isActionLoading}
                  >
                    {isActionLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <FileOutput className="h-4 w-4 mr-2" />
                    )}
                    Convertir en contrat
                  </Button>
                )}

                {proforma.status === "CONVERTED" && proforma.contractId && (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => router.push(`/admin/contrat/${proforma.contractId}`)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Voir le contrat
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium">Validité</p>
                  <p className="text-gray-500">Cette proforma est valable pour une durée de 30 jours.</p>
                </div>
                <div>
                  <p className="font-medium">Conditions de paiement</p>
                  <p className="text-gray-500">50% à la signature du contrat, 50% à la livraison.</p>
                </div>
                <div>
                  <p className="font-medium">Délai de livraison</p>
                  <p className="text-gray-500">15 jours ouvrables après signature du contrat.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
