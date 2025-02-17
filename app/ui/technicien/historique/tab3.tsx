"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { Loader2 } from "lucide-react"
import { getKiosksForTicket } from "@/app/actions/kiosk-actions"
import { createServiceRequest, getTechnicianMaintenanceTickets } from "@/app/actions/ticketsactions"
import type { RequestPriority, RequestStatus } from "@prisma/client"
import { DialogClose } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface ServiceRequest {
  id: string
  kioskId: number
  technicians: { id: string; name: string }[]
  problemDescription: string
  comments?: string | null
  status: RequestStatus
  priority: RequestPriority
  createdDate: Date
  resolvedDate?: Date | null
  attachments?: string | null
}

interface Technician {
  id: string
  name: string
  email: string
  image: string | null
}

interface Kiosk {
  id: number
  kioskName: string
  clientName: string | null
}

export default function MaintenanceCalendarTechnicien() {
  const { data: session } = useSession()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    kioskId: 0,
    technicians: [] as string[],
    problemDescription: "",
    comments: "",
    priority: "" as RequestPriority,
    resolvedDate: "",
    attachments: [] as string[],
  })
  const [kioskSearch, setKioskSearch] = useState("")
  const [kiosks, setKiosks] = useState<Kiosk[]>([])
  const [selectedTicket, setSelectedTicket] = useState<ServiceRequest | null>(null)
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.id) {
        const [fetchedKiosks, fetchedServiceRequests] = await Promise.all([
          getKiosksForTicket(),
          getTechnicianMaintenanceTickets({
            technicianId: session.user.id,
            page: 1,
            limit: 100, // Adjust this value as needed
          }),
        ])
        setKiosks(fetchedKiosks)
        setServiceRequests(fetchedServiceRequests.tickets)
      }
    }
    fetchData()
  }, [session])

  const filteredKiosks = kiosks.filter(
    (kiosk) =>
      kiosk.kioskName.toLowerCase().includes(kioskSearch.toLowerCase()) ||
      (kiosk.clientName && kiosk.clientName.toLowerCase().includes(kioskSearch.toLowerCase())),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.kioskId || !formData.problemDescription || !formData.priority) {
        throw new Error("Veuillez remplir tous les champs obligatoires")
      }

      const newServiceRequest = await createServiceRequest({
        kioskId: formData.kioskId,
        technicians: [session?.user?.id as string],
        problemDescription: formData.problemDescription,
        comments: formData.comments,
        priority: formData.priority,
        resolvedDate: formData.resolvedDate,
        attachments: formData.attachments,
      })
      setServiceRequests((prevRequests) => [...prevRequests, newServiceRequest])

      setFormData({
        kioskId: 0,
        technicians: [],
        problemDescription: "",
        comments: "",
        priority: "" as RequestPriority,
        resolvedDate: "",
        attachments: [],
      })
      setIsNewRequestModalOpen(false)
    } catch (error) {
      console.error("Error creating service request:", error)
      alert(
        error instanceof Error ? error.message : "Une erreur est survenue lors de la création de la demande de service",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKioskSelect = (kioskId: number) => {
    setFormData((prev) => ({
      ...prev,
      kioskId: kioskId,
    }))
  }

  const renderEventList = (day: Date) => {
    const dayEvents = serviceRequests.filter((request) => isSameDay(new Date(request.resolvedDate), day))
    return (
      <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
        {dayEvents.map((request) => (
          <div
            key={request.id}
            className="p-1 bg-orange-100 text-orange-800 text-xs rounded cursor-pointer hover:bg-orange-200"
            title={request.problemDescription}
            onClick={() => {
              setSelectedTicket(request)
              setIsTicketDialogOpen(true)
            }}
          >
            {request.problemDescription.length > 20
              ? `${request.problemDescription.substring(0, 20)}...`
              : request.problemDescription}
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Calendrier des demandes de service</h2>
          <Dialog open={isNewRequestModalOpen} onOpenChange={setIsNewRequestModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <PlusIcon className="h-5 w-5 mr-2" />
                Nouvelle demande
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader className="flex flex-row items-center justify-between pb-4">
                <DialogTitle>Nouvelle demande de service</DialogTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsNewRequestModalOpen(false)}>
                  <XMarkIcon className="h-4 w-4" />
                </Button>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>Kiosque concerné</Label>
                    <div className="relative mt-2">
                      <Input
                        type="text"
                        placeholder="Recherche..."
                        value={kioskSearch}
                        onChange={(e) => setKioskSearch(e.target.value)}
                        className="pl-8"
                      />
                      <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                      {filteredKiosks.map((kiosk) => (
                        <div
                          key={kiosk.id}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                        >
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
                            className="rounded-full border-gray-300"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="problemDescription">Description du problème</Label>
                    <Textarea
                      id="problemDescription"
                      value={formData.problemDescription}
                      onChange={(e) => setFormData((prev) => ({ ...prev, problemDescription: e.target.value }))}
                      placeholder="Décrivez le problème..."
                      required
                    />
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
                    <Label htmlFor="priority">Priorité</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, priority: value as RequestPriority }))
                      }
                      required
                    >
                      <SelectTrigger id="priority">
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
                    <Label htmlFor="resolvedDate">Date de résolution prévue</Label>
                    <Input
                      id="resolvedDate"
                      type="date"
                      value={formData.resolvedDate}
                      onChange={(e) => setFormData((prev) => ({ ...prev, resolvedDate: e.target.value }))}
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
        </div>

        <div className="grid grid-cols-7 gap-2">
          {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
            <div key={day} className="text-center font-semibold py-2">
              {day}
            </div>
          ))}
          {eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) }).map((day) => (
            <div
              key={day.toString()}
              className={`min-h-[100px] p-2 border ${
                !isSameMonth(day, currentMonth) ? "bg-gray-100" : isToday(day) ? "bg-blue-100" : ""
              }`}
            >
              <div className="font-semibold">{format(day, "d")}</div>
              {renderEventList(day)}
            </div>
          ))}
        </div>
        <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Détails de la demande de service</DialogTitle>
            </DialogHeader>
            {selectedTicket && (
              <div className="space-y-4">
                <div>
                  <Label className="font-semibold">ID de la demande</Label>
                  <p>{selectedTicket.id}</p>
                </div>
                <div>
                  <Label className="font-semibold">Kiosque</Label>
                  <p>{kiosks.find((k) => k.id === selectedTicket.kioskId)?.kioskName || "Non spécifié"}</p>
                </div>
                <div>
                  <Label className="font-semibold">Description du problème</Label>
                  <p>{selectedTicket.problemDescription}</p>
                </div>
                <div>
                  <Label className="font-semibold">Commentaires</Label>
                  <p>{selectedTicket.comments || "Aucun commentaire"}</p>
                </div>
                <div>
                  <Label className="font-semibold">Statut</Label>
                  <Badge
                    variant={
                      selectedTicket.status === "URGENT"
                        ? "destructive"
                        : selectedTicket.status === "IN_PROGRESS"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {selectedTicket.status}
                  </Badge>
                </div>
                <div>
                  <Label className="font-semibold">Priorité</Label>
                  <Badge
                    variant={
                      selectedTicket.priority === "HIGH"
                        ? "destructive"
                        : selectedTicket.priority === "MEDIUM"
                          ? "warning"
                          : "secondary"
                    }
                  >
                    {selectedTicket.priority}
                  </Badge>
                </div>
                <div>
                  <Label className="font-semibold">Date de création</Label>
                  <p>{format(new Date(selectedTicket.createdDate), "dd/MM/yyyy HH:mm")}</p>
                </div>
                <div>
                  <Label className="font-semibold">Date de résolution prévue</Label>
                  <p>
                    {selectedTicket.resolvedDate
                      ? format(new Date(selectedTicket.resolvedDate), "dd/MM/yyyy HH:mm")
                      : "Non spécifiée"}
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Fermer</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

