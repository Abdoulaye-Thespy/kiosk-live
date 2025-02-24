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
import { fetchClients } from "@/app/actions/fetchUserStats"
import type { KioskType, KioskStatus } from "@prisma/client"

interface Client {
  id: string
  name: string
  email: string
}

import { type Kiosk } from "@prisma/client"

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

  const initialFormData = {
    kioskName: "",
    kioskAddress: "",
    latitude: "",
    longitude: "",
    kioskType: "",
    productTypes: "",
    managerName: "",
    managerContacts: "",
  }

  const [formData, setFormData] = useState(initialFormData)
  const router = useRouter()
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({})

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    const requiredFields = ["kioskName", "kioskAddress", "kioskType"]
    const newFieldErrors = requiredFields.reduce(
      (acc, field) => {
        acc[field] = !formData[field]
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
      submitData.append(key, value)
    })
    submitData.append("userId", selectedClientId)
    submitData.append("clientName", selectedClientName)

    try {
      const result = await addKioskByStaff(submitData)
      if (result.error) {
        setError(result.error)
      } else {
        // Add the new kiosk to the kiosks array


        // Reset the form data

        const addedKiosk = result.kiosk;
        // onKioskAdd(kioskAdded)
        onSuccess(addedKiosk)

        setFormData(initialFormData)
        setSelectedClientId("")
        setSelectedClientName("")
        setSuccess("Le kiosque a été ajouté avec succès.")
        setTimeout(() => {
          setIsOpen(false)
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
            {/* SVG path data */}
          </svg>
          Ajouter un nouveau kiosque
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                        ? clients.find((client) => client.id === selectedClientId)?.name
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

              <div>
                <Label htmlFor="kiosk-name" className={fieldErrors.kioskName ? "text-red-500" : ""}>
                  Nom de l'Entreprise *
                </Label>
                <Input
                  id="kiosk-name"
                  name="kioskName"
                  value={formData.kioskName}
                  onChange={handleChange}
                  placeholder="Kiosk 639"
                  className={`w-full mt-1 ${fieldErrors.kioskName ? "border-red-500" : ""}`}
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
                <Label>Coordonnées GPS</Label>
                <div className="flex gap-4 mt-1">
                  <Input
                    id="latitude"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="Latitude (optionnel)"
                    className="w-full"
                  />
                  <Input
                    id="longitude"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="Longitude (optionnel)"
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
                <div className={`grid grid-cols-2 gap-2 mt-1 ${fieldErrors.kioskType ? "text-red-500" : ""}`}>
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
                        onChange={handleChange}
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
                  name="productTypes"
                  value={formData.productTypes}
                  onChange={handleChange}
                  placeholder="Produits et services (optionnel)"
                  className="w-full mt-1"
                />
              </div>

              <div>
                <Label htmlFor="manager-name">Nom du gestionnaire</Label>
                <Input
                  id="manager-name"
                  name="managerName"
                  value={formData.managerName}
                  onChange={handleChange}
                  placeholder="ALIOU Salif (optionnel)"
                  className="w-full mt-1"
                />
              </div>

              <div>
                <Label htmlFor="manager-contact">Coordonnées du gestionnaire</Label>
                <Input
                  id="manager-contact"
                  name="managerContacts"
                  value={formData.managerContacts}
                  onChange={handleChange}
                  placeholder="+237 123 456 789 (optionnel)"
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

