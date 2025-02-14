"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InfoIcon, Loader2, CheckCircle2, XCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { updateKiosk } from "@/app/actions/kiosk-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface User {
  id: string
  name: string
  email: string
}

interface Kiosk {
  id: number
  kioskName: string
  clientName: string
  kioskAddress: string
  latitude: string
  longitude: string
  kioskType: string
  productsServices: string
  managerName: string
  managerContact: string
  userId: string
  status: "REQUEST" | "LOCALIZING" | "AVAILABLE" | "UNDER_MAINTENANCE" // Add status field
}

interface AddKioskDialogAdminProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  kiosk?: Kiosk | null
  onSuccess: () => void
}

export function UpdateKioskDialogAdmin({ isOpen, onOpenChange, kiosk, onSuccess }: AddKioskDialogAdminProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const router = useRouter()
  const { data: session } = useSession()

  const [formData, setFormData] = useState<Partial<Kiosk>>({
    kioskName: "",
    clientName: "",
    kioskAddress: "",
    latitude: "",
    longitude: "",
    kioskType: "",
    productsServices: "",
    managerName: "",
    managerContact: "",
    userId: "",
    status: "REQUEST", // Add default status
  })

  useEffect(() => {
    if (kiosk) {
      setFormData(kiosk)
    } else {
      setFormData({
        kioskName: "",
        clientName: "",
        kioskAddress: "",
        latitude: "",
        longitude: "",
        kioskType: "",
        productsServices: "",
        managerName: "",
        managerContact: "",
        userId: "",
        status: "REQUEST", // Add default status
      })
    }
  }, [kiosk])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await updateKiosk(kiosk.id, formData)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess("Le kiosque a été modifié avec succès.")
        setTimeout(() => {
          onOpenChange(false)
          router.refresh() // Refresh the page to show the new kiosk
        }, 2000) // Close the dialog and refresh after 2 seconds
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la modification du kiosque.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-semibold">Modifier le kiosque</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow overflow-auto">
             {error && (
              <Alert variant="destructive" className="mb-4">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="default" className="mb-4 bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Succès</AlertTitle>
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}
          <form id="kiosk-form" onSubmit={handleSubmit} className="space-y-3 pr-4">
            <div>
              <Label htmlFor="kiosk-name">Nom du kiosque</Label>
              <Input
                id="kiosk-name"
                type="text"
                placeholder="Nom du kiosque"
                value={formData.kioskName || ""}
                onChange={(e) => setFormData({ ...formData, kioskName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="kiosk-status">Statut du kiosque</Label>
              <Select
                name="status"
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Kiosk["status"] })}
              >
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Sélectionnez le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REQUEST">Demande</SelectItem>
                  <SelectItem value="LOCALIZING">En cours de localisation</SelectItem>
                  <SelectItem value="AVAILABLE">Disponible</SelectItem>
                  <SelectItem value="UNDER_MAINTENANCE">En maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="client-name">Nom du client</Label>
              <Input
                id="client-name"
                type="text"
                placeholder="Nom du client"
                value={formData.clientName || ""}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="kiosk-address">Adresse du kiosque</Label>
              <Input
                id="kiosk-address"
                type="text"
                placeholder="Adresse du kiosque"
                value={formData.kioskAddress || ""}
                onChange={(e) => setFormData({ ...formData, kioskAddress: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="text"
                placeholder="Latitude"
                value={formData.latitude || ""}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="text"
                placeholder="Longitude"
                value={formData.longitude || ""}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="products-services">Produits/Services</Label>
              <Input
                id="products-services"
                type="text"
                placeholder="Produits/Services"
                value={formData.productsServices || ""}
                onChange={(e) => setFormData({ ...formData, productsServices: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="manager-name">Nom du gestionaire</Label>
              <Input
                id="manager-name"
                type="text"
                placeholder="Nom du responsable"
                value={formData.managerName || ""}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="manager-contact">Contact du gestionaire</Label>
              <Input
                id="manager-contact"
                type="text"
                placeholder="Contact du responsable"
                value={formData.managerContact || ""}
                onChange={(e) => setFormData({ ...formData, managerContact: e.target.value })}
              />
            </div>

            <div>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            form="kiosk-form"
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Modification en cours...
              </>
            ) : (
              "Modifier"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

