"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { updateKiosk } from "@/app/actions/kiosk-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search } from "lucide-react"
import { fetchClients } from "@/app/actions/fetchUserStats"

interface Client {
  id: string
  name: string
  email: string
}
import type { Kiosk } from "@prisma/client"

interface UpdateKioskDialogAdminProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  kiosk: Kiosk | null
  kiosks: Kiosk[]
  onSuccess: (updatedKiosk: Kiosk) => void
}

// Mapping des catégories vers les statuts Prisma
const categoryStatusMap: Record<string, string[]> = {
  "🏚️ EN STOCK": ["IN_STOCK"],
  "🟢 OCCUPÉ": ["ACTIVE"],
  "🔵 LIBRE": ["AVAILABLE", "REQUEST", "LOCALIZING", "UNACTIVE"],
  "🟡 MAINTENANCE": ["ACTIVE_UNDER_MAINTENANCE", "UNACTIVE_UNDER_MAINTENANCE"],
}

// Mapping inverse : statut Prisma -> catégorie
const getCategoryFromStatus = (status: string): string => {
  if (status === "IN_STOCK") return "🏚️ EN STOCK"
  if (status === "ACTIVE") return "🟢 OCCUPÉ"
  if (["AVAILABLE", "REQUEST", "LOCALIZING", "UNACTIVE"].includes(status)) return "🔵 LIBRE"
  if (["ACTIVE_UNDER_MAINTENANCE", "UNACTIVE_UNDER_MAINTENANCE"].includes(status)) return "🟡 MAINTENANCE"
  return "🏚️ EN STOCK"
}

// Liste des catégories pour le select
const categories = [
  { label: "🏚️ EN STOCK", value: "IN_STOCK", default: true },
  { label: "🟢 OCCUPÉ", value: "ACTIVE", default: false },
  { label: "🔵 LIBRE", value: "AVAILABLE", default: false },
  { label: "🟡 MAINTENANCE", value: "ACTIVE_UNDER_MAINTENANCE", default: false },
]

export function UpdateKioskDialogAdmin({
  isOpen,
  onOpenChange,
  kiosk,
  kiosks,
  onSuccess,
}: UpdateKioskDialogAdminProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [clients, setClients] = useState<Client[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string>("")
  const [selectedClientName, setSelectedClientName] = useState<string>("")
  const [openClientSelect, setOpenClientSelect] = useState(false)

  const [initialClientId, setInitialClientId] = useState<string>("")
  const [initialClientName, setInitialClientName] = useState<string>("")

  const router = useRouter()
  const { data: session } = useSession()

  const [formData, setFormData] = useState<Partial<Kiosk>>({
    kioskName: "",
    clientName: "",
    kioskAddress: "",
    gpsLatitude: null,
    gpsLongitude: null,
    kioskType: "",
    managerName: "",
    managerContacts: "",
    productTypes: "",
    userId: "",
    status: "IN_STOCK",
  })

  // Catégorie sélectionnée pour l'affichage
  const [selectedCategory, setSelectedCategory] = useState<string>("🏚️ EN STOCK")

  useEffect(() => {
    const getClients = async () => {
      try {
        const data = await fetchClients()
        setClients(data.clients)
      } catch (error) {
        console.error("Error fetching clients:", error)
      }
    }

    getClients()
  }, [])

  useEffect(() => {
    if (kiosk) {
      setFormData(kiosk)
      setSelectedClientId(kiosk.userId || "")
      setSelectedClientName(kiosk.clientName || "")
      setInitialClientId(kiosk.userId || "")
      setInitialClientName(kiosk.clientName || "")
      // Définir la catégorie en fonction du statut actuel
      setSelectedCategory(getCategoryFromStatus(kiosk.status || "IN_STOCK"))
    } else {
      setFormData({
        kioskName: "",
        clientName: "",
        kioskAddress: "",
        gpsLatitude: null,
        gpsLongitude: null,
        kioskType: "",
        productsServices: "",
        managerName: "",
        managerContacts: "",
        productTypes: "",
        userId: "",
        status: "IN_STOCK",
      })
      setSelectedClientId("")
      setSelectedClientName("")
      setInitialClientId("")
      setInitialClientName("")
      setSelectedCategory("🏚️ EN STOCK")
    }
  }, [kiosk])

  const handleCategoryChange = (categoryLabel: string) => {
    setSelectedCategory(categoryLabel)
    // Récupérer le premier statut Prisma correspondant à la catégorie
    const prismaStatuses = categoryStatusMap[categoryLabel]
    if (prismaStatuses && prismaStatuses.length > 0) {
      setFormData({ ...formData, status: prismaStatuses[0] as Kiosk["status"] })
    }
  }

  // Dans UpdateKioskDialogAdmin, modifier handleSubmit

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    // Déterminer le statut Prisma à envoyer en fonction de la catégorie sélectionnée
    let prismaStatus = formData.status

    // Si on a sélectionné une catégorie, prendre le premier statut correspondant
    if (selectedCategory) {
      const statuses = categoryStatusMap[selectedCategory]
      if (statuses && statuses.length > 0) {
        prismaStatus = statuses[0] as Kiosk["status"]
      }
    }

    // Pour un kiosque MONO avec client, forcer le statut ACTIVE
    const isMonoWithClient = formData.kioskType === "MONO" && selectedClientId
    if (isMonoWithClient) {
      prismaStatus = "ACTIVE"
    }

    // Pour un kiosque MONO sans client, déterminer le statut approprié
    const isMonoWithoutClient = formData.kioskType === "MONO" && !selectedClientId
    if (isMonoWithoutClient) {
      const hasGpsCoordinates = formData.gpsLatitude && formData.gpsLongitude
      prismaStatus = hasGpsCoordinates ? "UNACTIVE" : "AVAILABLE"
    }

    const updatedData = {
      ...formData,
      userId: selectedClientId,
      clientName: selectedClientName,
      status: prismaStatus,
    }

    try {
      const result = await updateKiosk(kiosk.id, updatedData)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess("Le kiosque a été modifié avec succès.")
        const updatedKiosk = { ...kiosk, ...updatedData }
        onSuccess(updatedKiosk)
        setTimeout(() => {
          onOpenChange(false)
        }, 2000)
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
              <Label htmlFor="kiosk-name">Nom de l'Entreprise</Label>
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
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Sélectionnez le statut" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.label} value={category.label}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="client-select">Sélectionner un client</Label>
              <Popover open={openClientSelect} onOpenChange={setOpenClientSelect}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openClientSelect}
                    className="w-full justify-between"
                  >
                    {selectedClientId
                      ? clients.find((client) => client.id === selectedClientId)?.name || selectedClientName
                      : "Sélectionner un client"}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Rechercher un client..." />
                    <CommandList>
                      <CommandEmpty>Aucun client trouvé.</CommandEmpty>
                      <CommandGroup>
                        {clients.map((client) => (
                          <CommandItem
                            key={client.id}
                            onSelect={() => {
                              setSelectedClientId(client.id)
                              setSelectedClientName(client.name)
                              setOpenClientSelect(false)
                              setFormData({
                                ...formData,
                                userId: client.id,
                                clientName: client.name,
                              })
                            }}
                          >
                            {client.name} ({client.email})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {initialClientName && (
              <div>
                <Label htmlFor="initial-client">Client initial</Label>
                <Input id="initial-client" type="text" value={initialClientName} readOnly className="bg-gray-50" />
              </div>
            )}

            {selectedClientId !== initialClientId && selectedClientName && (
              <div>
                <Label htmlFor="new-client" className="text-orange-500">
                  Nouveau client
                </Label>
                <Input
                  id="new-client"
                  type="text"
                  value={selectedClientName}
                  readOnly
                  className="bg-gray-50 border-orange-200"
                />
              </div>
            )}

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
                value={formData.gpsLatitude || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gpsLatitude: e.target.value !== "" ? Number.parseFloat(e.target.value) : null,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="text"
                placeholder="Longitude"
                value={formData.gpsLongitude || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gpsLongitude: e.target.value !== "" ? Number.parseFloat(e.target.value) : null,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="products-services">Produits/Services</Label>
              <Input
                id="products-services"
                type="text"
                placeholder="Produits/Services"
                value={formData.productTypes || ""}
                onChange={(e) => setFormData({ ...formData, productTypes: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="manager-name">Nom du gestionnaire</Label>
              <Input
                id="manager-name"
                type="text"
                placeholder="Nom du responsable"
                value={formData.managerName || ""}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="manager-contact">Contact du gestionnaire</Label>
              <Input
                id="manager-contact"
                type="text"
                placeholder="Contact du responsable"
                value={formData.managerContacts || ""}
                onChange={(e) => setFormData({ ...formData, managerContacts: e.target.value })}
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