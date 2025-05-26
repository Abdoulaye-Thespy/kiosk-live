"use client"

import React from "react"

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

// Surface count mapping for calculations
const SURFACE_COUNTS = {
  MONO: { joues: 2, oreilles: 2, menton: 1, fronton: 1 },
  GRAND: { joues: 2, oreilles: 4, menton: 1, fronton: 1 },
  COMPARTIMENT: { joues: 1, oreilles: 1, menton: 1, fronton: 1 },
} as const

// Types for the new schema structure
interface KioskSelection {
  type: "MONO" | "GRAND" | "COMPARTIMENT"
  quantity: number
  basePrice: number
  surfaces: {
    joues: { selected: boolean; price: number }
    oreilles: { selected: boolean; price: number }
    menton: { selected: boolean; price: number }
    fronton: { selected: boolean; price: number }
  }
  kioskSubtotal?: number
  surfacesSubtotal?: number
  selectionTotal?: number
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

  // Check if proforma uses new schema structure
  const isNewSchema = (proforma: any) => {
    return proforma.kioskSelections && Array.isArray(proforma.kioskSelections)
  }

  // Convert legacy proforma data to new structure for display
  const getLegacyKioskSelections = (proforma: any): KioskSelection[] => {
    if (!proforma.kioskType || !proforma.quantity) return []

    return [
      {
        type: proforma.kioskType,
        quantity: proforma.quantity,
        basePrice: proforma.basePrice || KIOSK_TYPES[proforma.kioskType].basePrice,
        surfaces: proforma.surfaces || {
          joues: { selected: false, price: KIOSK_TYPES[proforma.kioskType].surfaces.joues.price },
          oreilles: { selected: false, price: KIOSK_TYPES[proforma.kioskType].surfaces.oreilles.price },
          menton: { selected: false, price: KIOSK_TYPES[proforma.kioskType].surfaces.menton.price },
          fronton: { selected: false, price: KIOSK_TYPES[proforma.kioskType].surfaces.fronton.price },
        },
      },
    ]
  }

  // Get kiosk selections (works for both new and legacy schema)
  const getKioskSelections = (): KioskSelection[] => {
    if (!proforma) return []

    if (isNewSchema(proforma)) {
      return proforma.kioskSelections
    } else {
      return getLegacyKioskSelections(proforma)
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

  const kioskSelections = getKioskSelections()

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
        <div className="flex items-center space-x-2">
          {!isNewSchema(proforma) && (
            <Badge variant="outline" className="text-xs">
              Legacy
            </Badge>
          )}
          <Badge variant={getStatusBadgeVariant(proforma.status)} className="text-sm px-3 py-1">
            {getStatusDisplayText(proforma.status)}
          </Badge>
        </div>
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
                {proforma.expiryDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date d'expiration</p>
                    <p>{formatDate(proforma.expiryDate)}</p>
                  </div>
                )}
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
                    {kioskSelections.map((selection, selectionIndex) => (
                      <React.Fragment key={selectionIndex}>
                        {/* Kiosk base price */}
                        <TableRow>
                          <TableCell className="font-medium">{KIOSK_TYPES[selection.type].name}</TableCell>
                          <TableCell>{selection.quantity}</TableCell>
                          <TableCell>{formatCurrency(selection.basePrice)}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(selection.basePrice * selection.quantity)}
                          </TableCell>
                        </TableRow>

                        {/* Surface branding */}
                        {Object.entries(selection.surfaces).map(([surfaceKey, surface]) => {
                          if (!surface.selected) return null
                          const surfaceInfo =
                            KIOSK_TYPES[selection.type].surfaces[surfaceKey as keyof typeof KIOSK_TYPES.MONO.surfaces]
                          const totalQuantity = surfaceInfo.count * selection.quantity
                          return (
                            <TableRow key={`${selectionIndex}-${surfaceKey}`}>
                              <TableCell>
                                Branding {surfaceInfo.name} ({surfaceInfo.count} par kiosque)
                              </TableCell>
                              <TableCell>{totalQuantity}</TableCell>
                              <TableCell>{formatCurrency(surface.price)}</TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(surface.price * totalQuantity)}
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </React.Fragment>
                    ))}

                    {/* Subtotal */}
                    <TableRow className="border-t-2">
                      <TableCell colSpan={3} className="text-right font-medium">
                        Sous-total (HT)
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(proforma.subtotal || proforma.totalAmount || 0)}
                      </TableCell>
                    </TableRow>

                    {/* DTSP (only for new schema) */}
                    {isNewSchema(proforma) && proforma.dtsp > 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-right">
                          DTSP ({proforma.dtspRate || 3}%)
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(proforma.dtsp)}</TableCell>
                      </TableRow>
                    )}

                    {/* TVA (only for new schema) */}
                    {isNewSchema(proforma) && proforma.tva > 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-right">
                          TVA ({proforma.tvaRate || 19.25}%)
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(proforma.tva)}</TableCell>
                      </TableRow>
                    )}

                    {/* Total */}
                    <TableRow className="border-t-2">
                      <TableCell colSpan={3} className="text-right font-bold text-lg">
                        Total {isNewSchema(proforma) ? "TTC" : ""}
                      </TableCell>
                      <TableCell className="text-right font-bold text-lg">
                        {formatCurrency(proforma.totalAmount)}
                      </TableCell>
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
                {isNewSchema(proforma) && (
                  <div>
                    <p className="font-medium">Taxes incluses</p>
                    <p className="text-gray-500">
                      DTSP ({proforma.dtspRate || 3}%) et TVA ({proforma.tvaRate || 19.25}%) incluses dans le total.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Schema information for debugging */}
          {process.env.NODE_ENV === "development" && (
            <Card>
              <CardHeader>
                <CardTitle>Debug Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs space-y-2">
                  <div>
                    <span className="font-medium">Schema:</span> {isNewSchema(proforma) ? "New" : "Legacy"}
                  </div>
                  <div>
                    <span className="font-medium">Kiosk Selections:</span> {kioskSelections.length}
                  </div>
                  {isNewSchema(proforma) && (
                    <>
                      <div>
                        <span className="font-medium">Subtotal:</span> {proforma.subtotal}
                      </div>
                      <div>
                        <span className="font-medium">DTSP:</span> {proforma.dtsp}
                      </div>
                      <div>
                        <span className="font-medium">TVA:</span> {proforma.tva}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
