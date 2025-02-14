"use client"

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

interface Client {
  id: string
  name: string
  email: string
}

export function AddKioskDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClientId, setSelectedClientId] = useState<string>("")
  const [selectedClientName, setSelectedClientName] = useState<string>("")
  const [openClientSelect, setOpenClientSelect] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Fetch users with role CLIENT from the database
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(event.currentTarget)
    formData.append("userId", selectedClientId)
    formData.append("clientName", selectedClientName)

    try {
      const result = await addKioskByStaff(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess("Le kiosque a été ajouté avec succès.")
        setTimeout(() => {
          setIsOpen(false)
          router.refresh() // Refresh the page to show the new kiosk
        }, 2000) // Close the dialog and refresh after 2 seconds
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
              d="M5.99988 11.8332C5.72655 11.8332 5.49988 11.6066 5.49988 11.3332V8.53991L5.01988 9.01991C4.82655 9.21324 4.50655 9.21324 4.31321 9.01991C4.11988 8.82658 4.11988 8.50658 4.31321 8.31324L5.64655 6.97991C5.78655 6.83991 6.00655 6.79324 6.19321 6.87324C6.37988 6.94658 6.49988 7.13324 6.49988 7.33324V11.3332C6.49988 11.6066 6.27321 11.8332 5.99988 11.8332Z"
              fill="white"
            />
            <path
              d="M7.33338 9.16663C7.20671 9.16663 7.08004 9.11996 6.98004 9.01996L5.64671 7.68663C5.45338 7.49329 5.45338 7.17329 5.64671 6.97996C5.84004 6.78663 6.16004 6.78663 6.35338 6.97996L7.68671 8.31329C7.88004 8.50663 7.88004 8.82663 7.68671 9.01996C7.58671 9.11996 7.46004 9.16663 7.33338 9.16663Z"
              fill="white"
            />
            <path
              d="M9.99992 15.1666H5.99992C2.37992 15.1666 0.833252 13.6199 0.833252 9.99992V5.99992C0.833252 2.37992 2.37992 0.833252 5.99992 0.833252H9.33325C9.60659 0.833252 9.83325 1.05992 9.83325 1.33325C9.83325 1.60659 9.60659 1.83325 9.33325 1.83325H5.99992C2.92659 1.83325 1.83325 2.92659 1.83325 5.99992V9.99992C1.83325 13.0733 2.92659 14.1666 5.99992 14.1666H9.99992C13.0733 14.1666 14.1666 13.0733 14.1666 9.99992V6.66659C14.1666 6.39325 14.3933 6.16659 14.6666 6.16659C14.9399 6.16659 15.1666 6.39325 15.1666 6.66659V9.99992C15.1666 13.6199 13.6199 15.1666 9.99992 15.1666Z"
              fill="white"
            />
            <path
              d="M14.6666 7.16658H11.9999C9.71992 7.16658 8.83325 6.27991 8.83325 3.99991V1.33324C8.83325 1.13324 8.95325 0.946578 9.13992 0.873244C9.32659 0.793244 9.53992 0.839911 9.68659 0.979911L15.0199 6.31324C15.1599 6.45324 15.2066 6.67324 15.1266 6.85991C15.0466 7.04658 14.8666 7.16658 14.6666 7.16658ZM9.83325 2.53991V3.99991C9.83325 5.71991 10.2799 6.16658 11.9999 6.16658H13.4599L9.83325 2.53991Z"
              fill="white"
            />
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
                <Label htmlFor="kiosk-name">Nom de l'Entreprise</Label>
                <Input id="kiosk-name" name="kioskName" placeholder="Kiosk 639" className="w-full mt-1" />
              </div>

              <div>
                <Label htmlFor="kiosk-address">Adresse du kiosque</Label>
                <Input id="kiosk-address" name="kioskAddress" placeholder="Douala, Makepe BM" className="w-full mt-1" />
              </div>

              <div>
                <Label>Coordonnées GPS</Label>
                <div className="flex gap-4 mt-1">
                  <Input id="latitude" name="latitude" placeholder="Latitude" className="w-full" />
                  <Input id="longitude" name="longitude" placeholder="Longitude" className="w-full" />
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
                  placeholder="Produits et services"
                  className="w-full mt-1"
                />
              </div>

              <div>
                <Label htmlFor="manager-name">Nom du gestionnaire</Label>
                <Input id="manager-name" name="managerName" placeholder="ALIOU Salif" className="w-full mt-1" />
              </div>

              <div>
                <Label htmlFor="manager-contact">Coordonnées du gestionnaire</Label>
                <Input
                  id="manager-contact"
                  name="managerContact"
                  placeholder="+237 123 456 789"
                  className="w-full mt-1"
                />
              </div>
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

