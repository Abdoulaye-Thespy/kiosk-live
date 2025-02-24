"use client"

import type React from "react"
import { useState } from "react"
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { RequestPriority } from "@prisma/client"
import { cn } from "@/lib/utils"

interface FormErrors {
  kioskId?: boolean
  technicians?: boolean
  problemDescription?: boolean
  priority?: boolean
  resolvedDate?: boolean
}

interface ServiceRequestFormProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (formData: any) => Promise<void>
  kiosks: Array<{ id: number; kioskName: string; clientName: string | null }>
  technicians: Array<{ id: string; name: string; email: string; image: string | null }>
}

const RequiredLabel: React.FC<{ htmlFor?: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
  <Label htmlFor={htmlFor} className="flex items-center gap-1">
    {children}
    <span className="text-red-500">*</span>
  </Label>
)

export function ServiceRequestForm({ isOpen, onOpenChange, onSubmit, kiosks, technicians }: ServiceRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState({
    kioskId: 0,
    technicians: [] as string[],
    problemDescription: "",
    comments: "",
    priority: "" as RequestPriority,
    resolvedDate: "",
    attachments: [] as string[],
  })
  const [technicianSearch, setTechnicianSearch] = useState("")
  const [kioskSearch, setKioskSearch] = useState("")

  const validateForm = () => {
    const errors: FormErrors = {}
    let isValid = true

    if (!formData.kioskId) {
      errors.kioskId = true
      isValid = false
    }
    if (!formData.problemDescription) {
      errors.problemDescription = true
      isValid = false
    }
    if (!formData.priority) {
      errors.priority = true
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setFormData({
        kioskId: 0,
        technicians: [],
        problemDescription: "",
        comments: "",
        priority: "" as RequestPriority,
        resolvedDate: "",
        attachments: [],
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTechnicianToggle = (technicianId: string) => {
    setFormData((prev) => ({
      ...prev,
      technicians: prev.technicians.includes(technicianId)
        ? prev.technicians.filter((id) => id !== technicianId)
        : [...prev.technicians, technicianId],
    }))
    setFormErrors((prev) => ({ ...prev, technicians: false }))
  }

  const handleKioskSelect = (kioskId: number) => {
    setFormData((prev) => ({ ...prev, kioskId }))
    setFormErrors((prev) => ({ ...prev, kioskId: false }))
  }

  const filteredTechnicians = technicians.filter((tech) =>
    tech.name.toLowerCase().includes(technicianSearch.toLowerCase()),
  )

  const filteredKiosks = kiosks.filter(
    (kiosk) =>
      kiosk.kioskName.toLowerCase().includes(kioskSearch.toLowerCase()) ||
      (kiosk.clientName && kiosk.clientName.toLowerCase().includes(kioskSearch.toLowerCase())),
  )

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <DialogTitle>Nouvelle demande de service</DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <XMarkIcon className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <RequiredLabel>Kiosque concerné</RequiredLabel>
                <div className="relative mt-2">
                  <Input
                    type="text"
                    placeholder="Recherche..."
                    value={kioskSearch}
                    onChange={(e) => setKioskSearch(e.target.value)}
                    className={cn("pl-8", formErrors.kioskId && "border-red-500 focus-visible:ring-red-500")}
                  />
                  <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                  {filteredKiosks.map((kiosk) => (
                    <div key={kiosk.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{kiosk.kioskName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{kiosk.kioskName}</p>
                          <p className="text-xs text-gray-500">{kiosk.clientName}</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        checked={formData.kioskId === kiosk.id}
                        onChange={() => handleKioskSelect(kiosk.id)}
                        className={cn("rounded-full border-gray-300", formErrors.kioskId && "border-red-500")}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <RequiredLabel htmlFor="problemDescription">Description du problème</RequiredLabel>
                <Textarea
                  id="problemDescription"
                  value={formData.problemDescription}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, problemDescription: e.target.value }))
                    setFormErrors((prev) => ({ ...prev, problemDescription: false }))
                  }}
                  placeholder="Décrivez le problème..."
                  className={cn(formErrors.problemDescription && "border-red-500 focus-visible:ring-red-500")}
                />
              </div>
            </div>

            <div className="space-y-4">

              <div>
                <RequiredLabel htmlFor="priority">Priorité</RequiredLabel>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, priority: value as RequestPriority }))
                    setFormErrors((prev) => ({ ...prev, priority: false }))
                  }}
                >
                  <SelectTrigger
                    id="priority"
                    className={cn(formErrors.priority && "border-red-500 focus-visible:ring-red-500")}
                  >
                    <SelectValue placeholder="Sélectionner la priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Basse</SelectItem>
                    <SelectItem value="MEDIUM">Moyenne</SelectItem>
                    <SelectItem value="HIGH">Haute</SelectItem>
                    <SelectItem value="URGENT">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="comments">Commentaires</Label>
                <Textarea
                  id="comments"
                  value={formData.comments}
                  onChange={(e) => setFormData((prev) => ({ ...prev, comments: e.target.value }))}
                  placeholder="Commentaires additionnels..."
                />
              </div>

              <div>
                <Label htmlFor="attachments">Pièces jointes</Label>
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    setFormData((prev) => ({
                      ...prev,
                      attachments: files.map((file) => URL.createObjectURL(file)),
                    }))
                  }}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création en cours...
                </>
              ) : (
                "Créer la demande de service"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

