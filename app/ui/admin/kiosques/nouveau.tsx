"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import { InfoIcon, Loader2, CheckCircle2, XCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { addKioskByStaff } from "@/app/actions/kiosk-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fetchClients } from "@/app/actions/fetchUserStats"
import type { KioskTown, KioskType } from "@prisma/client"

interface Client {
  id: string
  name: string
  email: string
  phone?: string
}

import type { Kiosk } from "@prisma/client"

interface AddKioskDialogProps {
  kiosks: Kiosk[]
  onSuccess: (addedKiosk: Kiosk) => void
}

export function AddKioskDialog({ kiosks, onSuccess }: AddKioskDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string>("")
  const [selectedClientName, setSelectedClientName] = useState<string>("")
  const [openClientSelect, setOpenClientSelect] = useState(false)
  const [isLoadingClients, setIsLoadingClients] = useState(false)
  const [clientsLoaded, setClientsLoaded] = useState(false)

  const initialFormData = {
    kioskName: "",
    kioskAddress: "",
    latitude: "",
    longitude: "",
    kioskType: "",
    productTypes: "",
    managerName: "",
    managerContacts: "",
    kioskMatricule: "",
    kioskTown: "DOUALA" as KioskTown,
  }

  const [formData, setFormData] = useState(initialFormData)
  const router = useRouter()
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({})

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: false }))
    }
  }

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: false }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setSelectedClientId("")
    setSelectedClientName("")
    setFieldErrors({})
    setError(null)
    setSuccess(null)
  }

  // Fonction pour obtenir l'affichage du client sélectionné
  const getSelectedClientDisplay = () => {
    if (!selectedClientId) {
      return "Sélectionner un client (optionnel)"
    }
    
    const foundClient = clients.find((client) => client.id === selectedClientId)
    if (foundClient) {
      return foundClient.name
    }
    
    return selectedClientName || "Client sélectionné"
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    const requiredFields = ["kioskType", "kioskMatricule", "kioskName", "kioskAddress"]
    const newFieldErrors = requiredFields.reduce(
      (acc, field) => {
        acc[field] = !formData[field as keyof typeof formData]
        return acc
      },
      {} as Record<string, boolean>,
    )

    setFieldErrors(newFieldErrors)

    if (Object.values(newFieldErrors).some(Boolean)) {
      setError("Veuillez remplir tous les champs obligatoires.")
      setIsSubmitting(false)
      return
    }

    const submitData = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        submitData.append(key, value)
      }
    })
    if (selectedClientId) {
      submitData.append("userId", selectedClientId)
      submitData.append("clientName", selectedClientName)
    }

    try {
      const result = await addKioskByStaff(submitData)
      if (result.error) {
        setError(result.error)
      } else {
        const addedKiosk = result.kiosk
        onSuccess(addedKiosk)
        resetForm()
        setSuccess("Le kiosque a été ajouté avec succès.")
        setTimeout(() => {
          setIsOpen(false)
          resetForm()
        }, 2000)
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l'ajout du kiosque.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <ArrowDownTrayIcon className="h-5 w-5" />
        </Button>
        <Button onClick={() => setIsOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="mr-2"
          >
            <path
              d="M8 2v12M2 8h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Ajouter un nouveau kiosque
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) resetForm()
      }}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl font-semibold">Ajouter un nouveau kiosque</DialogTitle>
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
            <form id="add-kiosk-form" onSubmit={handleSubmit} className="space-y-3 pr-4">
              <p className="text-sm text-muted-foreground mb-4">
                Les champs marqués d'un astérisque (*) sont obligatoires.
              </p>

              <div>
                <Label htmlFor="client-select">Client (optionnel)</Label>
                <Popover open={openClientSelect} onOpenChange={setOpenClientSelect}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openClientSelect}
                      className="w-full justify-between"
                    >
                      {getSelectedClientDisplay()}
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
                          {clients && clients.length > 0 ? (
                            clients.map((client) => (
                              <CommandItem
                                key={client.id}
                                onSelect={() => {
                                  setSelectedClientId(client.id)
                                  setSelectedClientName(client.name)
                                  setOpenClientSelect(false)
                                }}
                              >
                                {client.name} ({client.email})
                              </CommandItem>
                            ))
                          ) : (
                            !isLoadingClients && (
                              <div className="px-2 py-2 text-sm text-gray-500">
                                Aucun client disponible
                              </div>
                            )
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="kiosk-name" className={fieldErrors.kioskName ? "text-red-500" : ""}>
                  Nom de l'Entreprise *
                </Label>
                <Input
                  id="kiosk-name"
                  name="kioskName"
                  value={formData.kioskName}
                  onChange={handleChange}
                  placeholder="Nom du kiosque"
                  className={`w-full mt-1 ${fieldErrors.kioskName ? "border-red-500" : ""}`}
                />
              </div>

              <div>
                <Label htmlFor="kiosk-matricule" className={fieldErrors.kioskMatricule ? "text-red-500" : ""}>
                  Matricule du kiosque *
                </Label>
                <Input
                  id="kiosk-matricule"
                  name="kioskMatricule"
                  value={formData.kioskMatricule}
                  onChange={handleChange}
                  placeholder="K-000-0000-000"
                  className={`w-full mt-1 ${fieldErrors.kioskMatricule ? "border-red-500" : ""}`}
                />
              </div>

              <div>
                <Label htmlFor="kiosk-address" className={fieldErrors.kioskAddress ? "text-red-500" : ""}>
                  Adresse du kiosque *
                </Label>
                <Input
                  id="kiosk-address"
                  name="kioskAddress"
                  value={formData.kioskAddress}
                  onChange={handleChange}
                  placeholder="Douala, Makepe BM"
                  className={`w-full mt-1 ${fieldErrors.kioskAddress ? "border-red-500" : ""}`}
                />
              </div>

              <div>
                <Label htmlFor="kiosk-town">Ville du kiosque</Label>
                <Select value={formData.kioskTown} onValueChange={(value) => handleSelectChange("kioskTown", value)}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Sélectionner une ville" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DOUALA">Douala</SelectItem>
                    <SelectItem value="YAOUNDE">Yaoundé</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Coordonnées GPS (optionnel)</Label>
                <div className="flex gap-4 mt-1">
                  <Input
                    id="latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="Latitude"
                    className="w-full"
                  />
                  <Input
                    id="longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="Longitude"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center">
                  <Label className={fieldErrors.kioskType ? "text-red-500" : ""}>Type de kiosque *</Label>
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
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 mt-1 ${fieldErrors.kioskType ? "border-red-500 p-2 rounded" : ""}`}>
                  {[
                    { type: "MONO", label: "MONO (1 compartiment)", description: "Kiosque à 1 compartiment" },
                    { type: "GRAND", label: "GRAND (3 compartiments)", description: "Kiosque à 3 compartiments" },
                  ].map(({ type, label, description }) => (
                    <div key={type} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`type-${type}`}
                        name="kioskType"
                        value={type}
                        checked={formData.kioskType === type}
                        onChange={handleRadioChange}
                        className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-600"
                      />
                      <Label htmlFor={`type-${type}`} className="cursor-pointer">
                        {label}
                      </Label>
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
                <Label htmlFor="products-services">Type de produits et services offerts (optionnel)</Label>
                <Input
                  id="products-services"
                  name="productTypes"
                  value={formData.productTypes}
                  onChange={handleChange}
                  placeholder="Produits et services"
                  className="w-full mt-1"
                />
              </div>

              <div>
                <Label htmlFor="manager-name">Nom du gestionnaire (optionnel)</Label>
                <Input
                  id="manager-name"
                  name="managerName"
                  value={formData.managerName}
                  onChange={handleChange}
                  placeholder="Nom du responsable"
                  className="w-full mt-1"
                />
              </div>

              <div>
                <Label htmlFor="manager-contact">Coordonnées du gestionnaire (optionnel)</Label>
                <Input
                  id="manager-contact"
                  name="managerContacts"
                  value={formData.managerContacts}
                  onChange={handleChange}
                  placeholder="+237 123 456 789"
                  className="w-full mt-1"
                />
              </div>

              <input type="hidden" name="userId" value={selectedClientId} />
              <input type="hidden" name="clientName" value={selectedClientName} />
            </form>
          </ScrollArea>
          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Annuler
            </Button>
            <Button
              form="add-kiosk-form"
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ajout en cours...
                </>
              ) : (
                "Ajouter"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}