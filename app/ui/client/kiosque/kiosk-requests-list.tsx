"use client"

import { Clock, CheckCircle, XCircle, Loader2, MapPin, Calendar, Package, Palette, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface KioskRequest {
  id: string
  requestNumber: string
  status: string
  requestedKioskType: string
  requestedCompartments: any
  wantBranding: boolean
  kioskAddress: string
  createdAt: string
  estimatedPrice: number | null
  assignedKiosk?: {
    kioskName: string
  }
}

interface KioskRequestsListProps {
  requests: KioskRequest[]
  onRefresh: () => void
}

const statusConfig = {
  PENDING: { label: "En attente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  APPROVED: { label: "Approuvée", color: "bg-green-100 text-green-800", icon: CheckCircle },
  REJECTED: { label: "Rejetée", color: "bg-red-100 text-red-800", icon: XCircle },
  IN_PROGRESS: { label: "En cours", color: "bg-blue-100 text-blue-800", icon: Loader2 },
  COMPLETED: { label: "Terminée", color: "bg-green-100 text-green-800", icon: CheckCircle },
  CANCELLED: { label: "Annulée", color: "bg-gray-100 text-gray-800", icon: XCircle },
}

export function KioskRequestsList({ requests, onRefresh }: KioskRequestsListProps) {
  if (requests.length === 0) {
    return (
      <Card className="shadow-md">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Package className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">Aucune demande</h3>
          <p className="text-sm text-gray-500 mt-2">
            Vous n'avez pas encore fait de demande de kiosque.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Cliquez sur "Demander un kiosque" pour commencer.
          </p>
        </CardContent>
      </Card>
    )
  }

  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCompartments = (compartments: any) => {
    if (!compartments) return "Aucun"
    const selected = []
    if (compartments.left) selected.push("Gauche")
    if (compartments.middle) selected.push("Centre")
    if (compartments.right) selected.push("Droit")
    return selected.length > 0 ? selected.join(", ") : "Aucun"
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Mes demandes ({requests.length})
        </h2>
        <button
          onClick={onRefresh}
          className="text-sm text-[#ff6b4a] hover:text-[#ff5a36] transition-colors"
        >
          Rafraîchir
        </button>
      </div>

      <div className="grid gap-4">
        {requests.map((request) => {
          const status = getStatusConfig(request.status)
          const StatusIcon = status.icon
          
          return (
            <Card key={request.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base font-semibold">
                      Demande #{request.requestNumber.slice(-8)}
                    </CardTitle>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    <StatusIcon className="h-3 w-3" />
                    <span>{status.label}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">
                      {request.requestedKioskType === "MONO" ? "MONO (1 compartiment)" : "GRAND (3 compartiments)"}
                    </span>
                  </div>
                  
                  {request.requestedKioskType === "GRAND" && (
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Compartiments:</span>
                      <span className="font-medium">{formatCompartments(request.requestedCompartments)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Adresse:</span>
                    <span className="font-medium truncate">{request.kioskAddress || "Non spécifiée"}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">Branding:</span>
                    <span className={`font-medium ${request.wantBranding ? "text-purple-600" : "text-gray-500"}`}>
                      {request.wantBranding ? "Oui" : "Non"}
                    </span>
                  </div>
                  
                  {request.estimatedPrice && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Estimation:</span>
                      <span className="font-medium text-green-600">
                        {request.estimatedPrice.toLocaleString()} CFA/mois
                      </span>
                    </div>
                  )}
                  
                  {request.assignedKiosk && (
                    <div className="flex items-center gap-2 col-span-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Kiosque assigné:</span>
                      <span className="font-medium">{request.assignedKiosk.kioskName}</span>
                    </div>
                  )}
                </div>
                
                {request.status === "PENDING" && (
                  <div className="mt-2 p-2 bg-yellow-50 rounded-lg text-xs text-yellow-700">
                    <Clock className="h-3 w-3 inline mr-1" />
                    Votre demande est en cours de traitement. Un commercial vous contactera sous 48h.
                  </div>
                )}
                
                {request.status === "APPROVED" && (
                  <div className="mt-2 p-2 bg-green-50 rounded-lg text-xs text-green-700">
                    <CheckCircle className="h-3 w-3 inline mr-1" />
                    Votre demande a été approuvée ! Vous allez recevoir une confirmation par email.
                  </div>
                )}
                
                {request.status === "REJECTED" && (
                  <div className="mt-2 p-2 bg-red-50 rounded-lg text-xs text-red-700">
                    <XCircle className="h-3 w-3 inline mr-1" />
                    Votre demande a été refusée. Veuillez contacter le support pour plus d'informations.
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}