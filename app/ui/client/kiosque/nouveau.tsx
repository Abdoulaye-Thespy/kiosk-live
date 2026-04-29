"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import { InfoIcon, Loader2, CheckCircle2, XCircle, Mail, Sparkles, Palette, Brush, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { addKioskByClient } from "@/app/actions/kiosk-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type CompartmentSelection = {
  left: boolean
  middle: boolean
  right: boolean
}

interface AddKioskDialogClientProps {
  onKioskAdded?: () => void
}

export function AddKioskDialogClient({ onKioskAdded }: AddKioskDialogClientProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedKioskType, setSelectedKioskType] = useState<string>("")
  const [selectedCompartments, setSelectedCompartments] = useState<CompartmentSelection>({
    left: false,
    middle: false,
    right: false,
  })
  const [wantBranding, setWantBranding] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  const handleKioskTypeChange = (value: string) => {
    setSelectedKioskType(value)
    if (value === "MONO") {
      setSelectedCompartments({ left: false, middle: false, right: false })
    }
  }

  const handleCompartmentChange = (compartment: keyof CompartmentSelection) => {
    setSelectedCompartments({
      ...selectedCompartments,
      [compartment]: !selectedCompartments[compartment],
    })
  }

  const handleBrandingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWantBranding(e.target.checked)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData(event.currentTarget)

    if (!session?.user?.id) {
      setError("Utilisateur non trouvé. Veuillez vous reconnecter.")
      setIsSubmitting(false)
      return
    }

    formData.append("userId", session.user.id)
    formData.append("clientName", session.user.name)
    formData.append("kioskType", selectedKioskType)
    formData.append("wantBranding", wantBranding.toString())

    if (selectedKioskType === "GRAND") {
      formData.append("compartments", JSON.stringify({
        left: selectedCompartments.left,
        middle: selectedCompartments.middle,
        right: selectedCompartments.right,
      }))
    }

    try {
      const result = await addKioskByClient(formData)
      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(result.message || "Votre demande a été enregistrée avec succès!")
        setTimeout(() => {
          setIsOpen(false)
          setSelectedKioskType("")
          setSelectedCompartments({ left: false, middle: false, right: false })
          setWantBranding(false)
          onKioskAdded?.()
          router.refresh()
        }, 4000)
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la soumission.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSelectedCount = () => {
    let count = 0
    if (selectedCompartments.left) count++
    if (selectedCompartments.middle) count++
    if (selectedCompartments.right) count++
    return count
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <ArrowDownTrayIcon className="h-5 w-5" />
        </Button>
        <Button onClick={() => setIsOpen(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="mr-2">
            <path d="M5.99988 11.8332C5.72655 11.8332 5.49988 11.6066 5.49988 11.3332V8.53991L5.01988 9.01991C4.82655 9.21324 4.50655 9.21324 4.31321 9.01991C4.11988 8.82658 4.11988 8.50658 4.31321 8.31324L5.64655 6.97991C5.78655 6.83991 6.00655 6.79324 6.19321 6.87324C6.37988 6.94658 6.49988 7.13324 6.49988 7.33324V11.3332C6.49988 11.6066 6.27321 11.8332 5.99988 11.8332Z" fill="white"/>
            <path d="M7.33338 9.16663C7.20671 9.16663 7.08004 9.11996 6.98004 9.01996L5.64671 7.68663C5.45338 7.49329 5.45338 7.17329 5.64671 6.97996C5.84004 6.78663 6.16004 6.78663 6.35338 6.97996L7.68671 8.31329C7.88004 8.50663 7.88004 8.82663 7.68671 9.01996C7.58671 9.11996 7.46004 9.16663 7.33338 9.16663Z" fill="white"/>
            <path d="M9.99992 15.1666H5.99992C2.37992 15.1666 0.833252 13.6199 0.833252 9.99992V5.99992C0.833252 2.37992 2.37992 0.833252 5.99992 0.833252H9.33325C9.60659 0.833252 9.83325 1.05992 9.83325 1.33325C9.83325 1.60659 9.60659 1.83325 9.33325 1.83325H5.99992C2.92659 1.83325 1.83325 2.92659 1.83325 5.99992V9.99992C1.83325 13.0733 2.92659 14.1666 5.99992 14.1666H9.99992C13.0733 14.1666 14.1666 13.0733 14.1666 9.99992V6.66659C14.1666 6.39325 14.3933 6.16659 14.6666 6.16659C14.9399 6.16659 15.1666 6.39325 15.1666 6.66659V9.99992C15.1666 13.6199 13.6199 15.1666 9.99992 15.1666Z" fill="white"/>
            <path d="M14.6666 7.16658H11.9999C9.71992 7.16658 8.83325 6.27991 8.83325 3.99991V1.33324C8.83325 1.13324 8.95325 0.946578 9.13992 0.873244C9.32659 0.793244 9.53992 0.839911 9.68659 0.979911L15.0199 6.31324C15.1599 6.45324 15.2066 6.67324 15.1266 6.85991C15.0466 7.04658 14.8666 7.16658 14.6666 7.16658ZM9.83325 2.53991V3.99991C9.83325 5.71991 10.2799 6.16658 11.9999 6.16658H13.4599L9.83325 2.53991Z" fill="white"/>
          </svg>
          Demander un kiosque
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Demander un kiosque</DialogTitle>
            <p className="text-sm text-gray-500">Remplissez ce formulaire pour faire une demande de kiosque</p>
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
              <Alert className="mb-4 bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">✓ Demande envoyée!</AlertTitle>
                <AlertDescription className="text-green-700">
                  <p>{success}</p>
                  <div className="mt-3 p-3 bg-green-100 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-green-700" />
                      <span className="font-medium text-green-800">Proforma à venir</span>
                    </div>
                    <p className="text-sm">Un commercial vous contactera sous 48h avec une proforma détaillée.</p>
                    {wantBranding && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-green-200">
                        <Palette className="h-4 w-4 text-orange-500" />
                        <p className="text-xs text-green-700">Vous avez demandé des options de personnalisation. Celles-ci seront incluses dans la proforma.</p>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
            
            <form id="add-kiosk-form" onSubmit={handleSubmit} className="space-y-4 pr-4">
              <div>
                <Label htmlFor="kiosk-name">Nom de l'Entreprise / Enseigne <span className="text-red-500">*</span></Label>
                <Input id="kiosk-name" name="kioskName" placeholder="Ma Boutique" className="mt-1" required />
              </div>

              <div>
                <Label htmlFor="kiosk-address">Adresse du kiosque <span className="text-red-500">*</span></Label>
                <Input id="kiosk-address" name="kioskAddress" placeholder="Douala, Makepe BM" className="mt-1" required />
              </div>

              <div>
                <Label>Type de kiosque <span className="text-red-500">*</span></Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div 
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      selectedKioskType === "MONO" 
                        ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200" 
                        : "border-gray-200 hover:border-orange-300"
                    }`} 
                    onClick={() => handleKioskTypeChange("MONO")}
                  >
                    <div className="flex items-start gap-2">
                      <input 
                        type="radio" 
                        name="kioskTypeRadio" 
                        value="MONO" 
                        checked={selectedKioskType === "MONO"} 
                        onChange={() => handleKioskTypeChange("MONO")} 
                        className="mt-1"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🏪</span>
                          <span className="font-medium">Kiosque MONO</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Un seul compartiment - Idéal pour petite activité</p>
                      </div>
                    </div>
                  </div>
                  <div 
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      selectedKioskType === "GRAND" 
                        ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200" 
                        : "border-gray-200 hover:border-orange-300"
                    }`} 
                    onClick={() => handleKioskTypeChange("GRAND")}
                  >
                    <div className="flex items-start gap-2">
                      <input 
                        type="radio" 
                        name="kioskTypeRadio" 
                        value="GRAND" 
                        checked={selectedKioskType === "GRAND"} 
                        onChange={() => handleKioskTypeChange("GRAND")} 
                        className="mt-1"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🏢</span>
                          <span className="font-medium">Kiosque GRAND</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Trois compartiments - Parfait pour grande surface</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedKioskType === "GRAND" && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <Label className="font-semibold mb-3 block">Compartiments souhaités</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { key: "left", label: "Compartiment Gauche" },
                      { key: "middle", label: "Compartiment Centre" },
                      { key: "right", label: "Compartiment Droit" }
                    ].map(({ key, label }) => (
                      <div
                        key={key}
                        className={`border rounded-lg p-3 text-center cursor-pointer transition-all ${
                          selectedCompartments[key as keyof CompartmentSelection]
                            ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200"
                            : "border-gray-200 bg-white hover:border-orange-300"
                        }`}
                        onClick={() => handleCompartmentChange(key as keyof CompartmentSelection)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedCompartments[key as keyof CompartmentSelection]}
                          onChange={() => handleCompartmentChange(key as keyof CompartmentSelection)}
                          className="h-4 w-4 mb-2"
                        />
                        <Label className="block text-sm cursor-pointer">{label}</Label>
                      </div>
                    ))}
                  </div>
                  {getSelectedCount() === 0 && (
                    <p className="text-xs text-red-500 mt-3">Veuillez sélectionner au moins un compartiment</p>
                  )}
                  {getSelectedCount() > 0 && (
                    <div className="mt-3 p-2 bg-orange-100 rounded-lg text-center">
                      <span className="text-sm font-medium text-orange-800">
                        {getSelectedCount()} compartiment(s) sélectionné(s)
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Branding Toggle */}
              {selectedKioskType && (
                <div className="border rounded-lg p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Brush className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <Label className="font-semibold text-purple-800">Personnalisation / Branding</Label>
                        <p className="text-xs text-gray-600 mt-0.5">
                          Ajouter votre logo, couleurs personnalisées et enseigne lumineuse
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={wantBranding}
                        onChange={handleBrandingChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                  </div>
                  {wantBranding && (
                    <div className="mt-3 p-2 bg-purple-100 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-purple-600" />
                        <p className="text-xs text-purple-800">
                          Vous recevrez une proforma avec les différentes options de personnalisation et leurs tarifs.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Info about proforma */}
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-blue-600" />
                  <p className="text-sm font-medium text-blue-800">Proforma détaillée à venir</p>
                </div>
                <p className="text-xs text-blue-700">
                  Une proforma avec le détail des prix de base et des options de personnalisation vous sera envoyée par email sous 48h.
                </p>
              </div>

              <div>
                <Label htmlFor="products-services">Produits et services offerts</Label>
                <Input id="products-services" name="productsServices" placeholder="Téléphones, accessoires, réparations..." className="mt-1" />
              </div>

              <div>
                <Label htmlFor="manager-name">Nom du gestionnaire</Label>
                <Input id="manager-name" name="managerName" placeholder="Jean Dupont" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="manager-contact">Contact du gestionnaire</Label>
                <Input id="manager-contact" name="managerContact" placeholder="+237 6XX XXX XXX" className="mt-1" />
              </div>
            </form>
          </ScrollArea>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Annuler</Button>
            <Button 
              form="add-kiosk-form" 
              type="submit" 
              className="bg-orange-500 hover:bg-orange-600"
              disabled={isSubmitting || !selectedKioskType || (selectedKioskType === "GRAND" && getSelectedCount() === 0)}
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Envoyer la demande
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}