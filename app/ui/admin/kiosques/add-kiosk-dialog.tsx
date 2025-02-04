"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { InfoIcon, Loader2, CheckCircle2, XCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { addKioskByStaff, updateKiosk } from "@/app/actions/kiosk-actions"
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
}

interface AddKioskDialogAdminProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  kiosk?: Kiosk | null
  onSuccess: () => void
}

export function AddKioskDialogAdmin({ isOpen, onOpenChange, kiosk, onSuccess }: AddKioskDialogAdminProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")

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
      })
    }
  }, [kiosk])

  useEffect(() => {
    // Fetch users from the database
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users")
        if (response.ok) {
          const data = await response.json()
          setUsers(data)
          setFilteredUsers(data)
        } else {
          console.error("Failed to fetch users")
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    const submitData = new FormData(event.currentTarget)

    try {
      let result
      if (kiosk) {
        result = await updateKiosk(kiosk.id, submitData)
      } else {
        result = await addKioskByStaff(submitData)
      }

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(kiosk ? "Le kiosque a été modifié avec succès." : "Le kiosque a été ajouté avec succès.")
        setTimeout(() => {
          onOpenChange(false)
          onSuccess()
        }, 2000)
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l'opération.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-semibold">
            {kiosk ? "Modifier le kiosque" : "Ajouter un nouveau kiosque"}
          </DialogTitle>
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
              <Label htmlFor="user-search">Rechercher un utilisateur</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="user-search"
                  placeholder="Rechercher par nom ou email"
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="user-select">Sélectionner un utilisateur</Label>
              <Select
                name="userId"
                value={formData.userId}
                onValueChange={(value) => setFormData({ ...formData, userId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un utilisateur" />
                </SelectTrigger>
                <SelectContent>
                  {filteredUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="kiosk-name">Nomdddd du kiosque</Label>
              <Input
                id="kiosk-name"
                name="kioskName"
                value={formData.kioskName}
                onChange={(e) => setFormData({ ...formData, kioskName: e.target.value })}
                placeholder="Kiosk 639"
                className="w-full mt-1"
              />
            </div>

            <div>
              <Label htmlFor="client-name">Nom du client</Label>
              <Input
                id="client-name"
                name="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="Douala, Makepe BM"
                className="w-full mt-1"
              />
            </div>

            <div>
              <Label htmlFor="kiosk-address">Adresse du kiosque</Label>
              <Input
                id="kiosk-address"
                name="kioskAddress"
                value={formData.kioskAddress}
                onChange={(e) => setFormData({ ...formData, kioskAddress: e.target.value })}
                placeholder="Douala, Makepe BM"
                className="w-full mt-1"
              />
            </div>

            <div>
              <Label>Coordonnées GPS</Label>
              <div className="flex gap-4 mt-1">
                <Input
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="Latitude"
                  className="w-full"
                />
                <Input
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="Longitude"
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center">
                <Label>Type de kiosque</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-4 w-4 ml-2 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Choisissez le type de kiosque selon ses caractéristiques et services offerts.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {[
                  {
                    type: "un compartiment avec marque",
                    description: "Kiosque de base avec les services essentiels",
                    value: "ONE_COMPARTMENT_WITH_BRANDING",
                  },
                  {
                    type: "un compartiment sans_marque",
                    description: "Kiosque amélioré avec des services supplémentaires",
                    value: "ONE_COMPARTMENT_WITHOUT_BRANDING",
                  },
                  {
                    type: "trois compartiments sans_marque",
                    description: "Kiosque haut de gamme avec tous les services disponibles",
                    value: "THREE_COMPARTMENT_WITHOUT_BRANDING",
                  },
                  {
                    type: "trois compartiments avec_marque",
                    description: "Kiosque personnalisé selon les besoins spécifiques du client",
                    value: "THREE_COMPARTMENT_WITH_BRANDING",
                  },
                ].map(({ type, description, value }) => (
                  <div key={type} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`type-${type}`}
                      name="kioskType"
                      value={value}
                      checked={formData.kioskType === value}
                      onChange={(e) => setFormData({ ...formData, kioskType: e.target.value })}
                      className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-600"
                    />
                    <Label htmlFor={`type-${type}`}>{type}</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="h-4 w-4 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="products-services">Type de produits et services offerts</Label>
              <Input
                id="products-services"
                name="productsServices"
                value={formData.productsServices}
                onChange={(e) => setFormData({ ...formData, productsServices: e.target.value })}
                placeholder="Produits et services"
                className="w-full mt-1"
              />
            </div>

            <div>
              <Label htmlFor="manager-name">Nom du gestionnaire</Label>
              <Input
                id="manager-name"
                name="managerName"
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                placeholder="ALIOU Salif"
                className="w-full mt-1"
              />
            </div>

            <div>
              <Label htmlFor="manager-contact">Coordonnées du gestionnaire</Label>
              <Input
                id="manager-contact"
                name="managerContact"
                value={formData.managerContact}
                onChange={(e) => setFormData({ ...formData, managerContact: e.target.value })}
                placeholder="+237 123 456 789"
                className="w-full mt-1"
              />
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
                {kiosk ? "Modification en cours..." : "Ajout en cours..."}
              </>
            ) : kiosk ? (
              "Modifier"
            ) : (
              "Ajouter"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

