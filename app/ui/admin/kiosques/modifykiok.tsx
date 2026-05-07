"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, CheckCircle2, XCircle, UserRound, RefreshCw } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"

interface Client {
  id: string
  name: string
  email: string
  phone?: string
}

interface KioskWithClient {
  id: number
  kioskName: string
  kioskMatricule: string
  kioskType: string
  kioskAddress?: string
  gpsLatitude?: number | null
  gpsLongitude?: number | null
  kioskTown?: string
  productTypes?: string
  managerName?: string
  managerContacts?: string
  status: string
  userId?: string
  clientName?: string
  monoClientId?: string | null
  monoClient?: {
    name: string
    email: string
    phone?: string
  } | null
  createdAt?: string
  updatedAt?: string
}

interface UpdateKioskDialogAdminProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  kiosk: KioskWithClient | null
  kiosks: KioskWithClient[]
  onSuccess: (updatedKiosk: any) => void
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

// Liste des villes pour le select
const towns = [
  { label: "Douala", value: "DOUALA" },
  { label: "Yaoundé", value: "YAOUNDE" },
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
  const [pendingCategoryChange, setPendingCategoryChange] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmMessage, setConfirmMessage] = useState("")

  const [clients, setClients] = useState<Client[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string>("")
  const [selectedClientName, setSelectedClientName] = useState<string>("")
  const [openClientSelect, setOpenClientSelect] = useState(false)
  const [isLoadingClients, setIsLoadingClients] = useState(true)
  const [clientsLoaded, setClientsLoaded] = useState(false)
  const [showClientSelector, setShowClientSelector] = useState(false)

  const [initialClientId, setInitialClientId] = useState<string>("")
  const [initialClientName, setInitialClientName] = useState<string>("")

  const [formData, setFormData] = useState<Partial<KioskWithClient>>({
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
    kioskTown: "DOUALA",
  })

  const [selectedCategory, setSelectedCategory] = useState<string>("🏚️ EN STOCK")

  // Charger les clients
  useEffect(() => {
    const getClients = async () => {
      if (clientsLoaded) return
      
      setIsLoadingClients(true)
      try {
        const data = await fetchClients()
        setClients(data.clients || [])
        setClientsLoaded(true)
      } catch (error) {
        console.error("Error fetching clients:", error)
        setClients([])
      } finally {
        setIsLoadingClients(false)
      }
    }

    if (isOpen) {
      getClients()
    }
  }, [isOpen, clientsLoaded])

  // Charger les données du kiosque
  useEffect(() => {
    if (kiosk) {
      const clientId = kiosk.monoClientId || kiosk.userId || ""
      const clientName = kiosk.monoClient?.name || kiosk.clientName || ""
      
      setFormData({
        ...kiosk,
        userId: clientId,
        clientName: clientName,
      })
      setSelectedClientId(clientId)
      setSelectedClientName(clientName)
      setInitialClientId(clientId)
      setInitialClientName(clientName)
      setSelectedCategory(getCategoryFromStatus(kiosk.status || "IN_STOCK"))
      setShowClientSelector(false)
    } else {
      setFormData({
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
        kioskTown: "DOUALA",
      })
      setSelectedClientId("")
      setSelectedClientName("")
      setInitialClientId("")
      setInitialClientName("")
      setSelectedCategory("🏚️ EN STOCK")
      setShowClientSelector(false)
    }
  }, [kiosk])

  // Mettre à jour le nom du client quand la liste des clients est chargée
  useEffect(() => {
    if (selectedClientId && clients.length > 0 && !selectedClientName) {
      const foundClient = clients.find(c => c.id === selectedClientId)
      if (foundClient) {
        setSelectedClientName(foundClient.name)
        if (initialClientId === selectedClientId) {
          setInitialClientName(foundClient.name)
        }
        setFormData(prev => ({
          ...prev,
          clientName: foundClient.name,
        }))
      }
    }
  }, [clients, selectedClientId, selectedClientName, initialClientId])

  const handleCategoryChange = (categoryLabel: string) => {
    const oldCategory = selectedCategory
    const newCategory = categoryLabel
    
    // Vérifier si c'est un changement qui nécessite une confirmation
    const wasOccupied = oldCategory === "🟢 OCCUPÉ"
    const willBeFree = newCategory === "🔵 LIBRE"
    const willBeStock = newCategory === "🏚️ EN STOCK"
    const willBeMaintenance = newCategory === "🟡 MAINTENANCE"
    const hasClient = !!selectedClientId
    
    let needsConfirmation = false
    let message = ""
    
    if (wasOccupied && willBeFree) {
      needsConfirmation = true
      message = "⚠️ Attention : Passer ce kiosque de « Occupé » à « Libre » supprimera toutes les informations du client (nom, email, téléphone, produits/services, gestionnaire). Êtes-vous sûr de vouloir continuer ?"
    } else if (wasOccupied && willBeStock) {
      needsConfirmation = true
      message = "⚠️ Attention : Passer ce kiosque de « Occupé » à « En stock » supprimera toutes les informations du client et le retirera du terrain. Êtes-vous sûr de vouloir continuer ?"
    } else if (wasOccupied && willBeMaintenance) {
      needsConfirmation = true
      message = "⚠️ Attention : Passer ce kiosque de « Occupé » à « Maintenance » signifie que le kiosque a un problème technique. Le client reste associé mais le kiosque n'est plus actif. Confirmez-vous ?"
    } else if (!wasOccupied && hasClient && willBeStock) {
      needsConfirmation = true
      message = "⚠️ Attention : Passer ce kiosque de « Libre » à « En stock » supprimera la sélection du client. Êtes-vous sûr de vouloir continuer ?"
    }
    
    if (needsConfirmation) {
      setPendingCategoryChange(categoryLabel)
      setConfirmMessage(message)
      setShowConfirmDialog(true)
    } else {
      applyCategoryChange(categoryLabel)
    }
  }
  
  const applyCategoryChange = (categoryLabel: string) => {
    setSelectedCategory(categoryLabel)
    const prismaStatuses = categoryStatusMap[categoryLabel]
    if (prismaStatuses && prismaStatuses.length > 0) {
      setFormData({ ...formData, status: prismaStatuses[0] })
    }
    
    // Si on passe à Libre ou En stock, on supprime le client
    if (categoryLabel === "🔵 LIBRE" || categoryLabel === "🏚️ EN STOCK") {
      setSelectedClientId("")
      setSelectedClientName("")
      setFormData(prev => ({
        ...prev,
        userId: "",
        clientName: "",
        productTypes: "",
        managerName: "",
        managerContacts: "",
      }))
      setShowClientSelector(false)
    }
    
    setPendingCategoryChange(null)
    setShowConfirmDialog(false)
  }
  
  const cancelCategoryChange = () => {
    setPendingCategoryChange(null)
    setShowConfirmDialog(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    let prismaStatus = formData.status

    if (selectedCategory) {
      const statuses = categoryStatusMap[selectedCategory]
      if (statuses && statuses.length > 0) {
        prismaStatus = statuses[0]
      }
    }

    const isMonoWithClient = formData.kioskType === "MONO" && selectedClientId
    if (isMonoWithClient) {
      prismaStatus = "ACTIVE"
    }

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
      const result = await updateKiosk(kiosk!.id, updatedData as any)
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

  const hasClient = !!kiosk?.monoClientId

  const handleChangeClient = () => {
    setShowClientSelector(true)
  }

  const handleCancelChangeClient = () => {
    setShowClientSelector(false)
    setSelectedClientId(initialClientId)
    setSelectedClientName(initialClientName)
    setFormData(prev => ({
      ...prev,
      userId: initialClientId,
      clientName: initialClientName,
    }))
  }

  return (
    <>
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
                <Label htmlFor="kiosk-town">Ville</Label>
                <Select
                  value={formData.kioskTown || "DOUALA"}
                  onValueChange={(value) => setFormData({ ...formData, kioskTown: value })}
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Sélectionnez la ville" />
                  </SelectTrigger>
                  <SelectContent>
                    {towns.map((town) => (
                      <SelectItem key={town.value} value={town.value}>
                        {town.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Si le kiosque a un client ET qu'on n'est pas en mode changement, afficher la carte client */}
              {(hasClient || selectedClientId) && !showClientSelector && selectedClientName ? (
                <div>
                  <Label>Client du kiosque</Label>
                  <div className="flex items-center gap-2 mt-1 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <UserRound className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{selectedClientName}</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleChangeClient}
                      className="text-orange-500 border-orange-300 hover:bg-orange-50"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Changer
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="client-select">
                    Client du kiosque
                    {!selectedClientId && (
                      <span className="ml-2 text-xs text-blue-500 font-normal">(Aucun client - Kiosque libre)</span>
                    )}
                    {showClientSelector && (
                      <span className="ml-2 text-xs text-orange-500 font-normal">(Changement en cours)</span>
                    )}
                  </Label>
                  
                  {showClientSelector && selectedClientId && (
                    <div className="mb-2">
                      <Badge variant="outline" className="text-orange-500 border-orange-300 bg-orange-50">
                        Client actuel: {initialClientName}
                      </Badge>
                    </div>
                  )}

                  <Popover open={openClientSelect} onOpenChange={setOpenClientSelect}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openClientSelect}
                        className="w-full justify-between"
                      >
                        {selectedClientId && selectedClientName
                          ? selectedClientName
                          : "🔵 Aucun client (kiosque libre)"}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Rechercher un client..." />
                        <CommandList>
                          <CommandEmpty>
                            {isLoadingClients ? "Chargement des clients..." : "Aucun client trouvé."}
                          </CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              onSelect={() => {
                                setSelectedClientId("")
                                setSelectedClientName("")
                                setOpenClientSelect(false)
                                setFormData({
                                  ...formData,
                                  userId: "",
                                  clientName: "",
                                })
                                if (showClientSelector) {
                                  setShowClientSelector(false)
                                }
                              }}
                              className="text-blue-600"
                            >
                              🔵 Aucun client (kiosque libre)
                            </CommandItem>
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
                                  if (showClientSelector) {
                                    setShowClientSelector(false)
                                  }
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

                  {showClientSelector && selectedClientId && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelChangeClient}
                      className="mt-2 text-gray-500 hover:text-red-500"
                    >
                      Annuler le changement
                    </Button>
                  )}
                </div>
              )}

              {initialClientName && selectedClientId && !showClientSelector && (
                <div>
                  <Label htmlFor="initial-client">Client initial</Label>
                  <Input id="initial-client" type="text" value={initialClientName} readOnly className="bg-gray-50" />
                </div>
              )}

              {selectedClientId !== initialClientId && selectedClientName && showClientSelector && (
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

              {/* Afficher les champs Produits/Services et Gestionnaire uniquement si le kiosque a un client */}
              {(hasClient || selectedClientId) && (
                <>
                  <div className="border-t pt-2 mt-2">
                    <p className="text-sm font-medium text-gray-500 mb-2">Informations du client</p>
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
                </>
              )}
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

      {/* Dialogue de confirmation */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-orange-600">Confirmation requise</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700 whitespace-pre-line">{confirmMessage}</p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={cancelCategoryChange}>
              Annuler
            </Button>
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() => pendingCategoryChange && applyCategoryChange(pendingCategoryChange)}
            >
              Confirmer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}