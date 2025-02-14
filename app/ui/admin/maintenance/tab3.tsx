"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { PlusIcon, XMarkIcon, PaperClipIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { getTechnicians } from "@/app/actions/fetchUserStats"
import { getKiosksForTicket } from "@/app/actions/kiosk-actions"
import { createMaintenanceEvent } from "@/app/actions/ticketsactions"

interface Event {
  id: string
  title: string
  kiosk: string
  startDate: Date
  endDate: Date
  description: string
  technicians: string[]
  attachments: string[]
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

export default function MaintenanceCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([])
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    kiosk: "",
    startDate: "",
    endDate: "",
    description: "",
    technicians: [] as string[],
    attachments: [] as string[],
  })
  const [technicianSearch, setTechnicianSearch] = useState("")
  const [kioskSearch, setKioskSearch] = useState("")
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [kiosks, setKiosks] = useState<Kiosk[]>([])

  useEffect(() => {
    const fetchTechnicians = async () => {
      const fetchedTechnicians = await getTechnicians()
      setTechnicians(fetchedTechnicians)
    }
    fetchTechnicians()
  }, [])

  useEffect(() => {
    const fetchKiosks = async () => {
      const fetchedKiosks = await getKiosksForTicket()
      setKiosks(fetchedKiosks)
    }
    fetchKiosks()
  }, [])

  const filteredTechnicians = technicians.filter((tech) =>
    tech.name.toLowerCase().includes(technicianSearch.toLowerCase()),
  )

  const filteredKiosks = kiosks.filter(
    (kiosk) =>
      kiosk.kioskName.toLowerCase().includes(kioskSearch.toLowerCase()) ||
      (kiosk.clientName && kiosk.clientName.toLowerCase().includes(kioskSearch.toLowerCase())),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.kiosk || !formData.startDate || !formData.endDate) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      const newEvent = await createMaintenanceEvent(formData)
      setEvents((prevEvents) => [...prevEvents, newEvent])

      setFormData({
        title: "",
        kiosk: "",
        startDate: "",
        endDate: "",
        description: "",
        technicians: [],
        attachments: [],
      })
      setIsNewEventModalOpen(false)

      alert("L'événement a été ajouté avec succès")
    } catch (error) {
      console.error("Error creating maintenance event:", error)
      alert("Une erreur est survenue lors de la création de l'événement")
    }
  }

  const handleTechnicianToggle = (technicianId: string) => {
    setFormData((prev) => ({
      ...prev,
      technicians: prev.technicians.includes(technicianId)
        ? prev.technicians.filter((id) => id !== technicianId)
        : [...prev.technicians, technicianId],
    }))
  }

  const handleKioskSelect = (kioskId: number) => {
    setFormData((prev) => ({
      ...prev,
      kiosk: kioskId.toString(),
    }))
  }

  const handleAddAttachment = () => {
    const mockAttachment = `document-${Date.now()}.pdf`
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, mockAttachment],
    }))
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Calendrier</h2>
          <Dialog open={isNewEventModalOpen} onOpenChange={setIsNewEventModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <PlusIcon className="h-5 w-5 mr-2" />
                Nouvel événement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader className="flex flex-row items-center justify-between pb-4">
                <DialogTitle>Nouveau ticket</DialogTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsNewEventModalOpen(false)}>
                  <XMarkIcon className="h-4 w-4" />
                </Button>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Nom du ticket</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="Type event title here..."
                      />
                    </div>

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
                              checked={formData.kiosk === kiosk.id.toString()}
                              onChange={() => handleKioskSelect(kiosk.id)}
                              className="rounded-full border-gray-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Date début</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">Date fin</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description de la tâche</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Détails..."
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Techniciens</Label>
                      <div className="relative mt-2">
                        <Input
                          type="text"
                          placeholder="Recherche..."
                          value={technicianSearch}
                          onChange={(e) => setTechnicianSearch(e.target.value)}
                          className="pl-8"
                        />
                        <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                      <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                        {filteredTechnicians.map((tech) => (
                          <div
                            key={tech.id}
                            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={tech.image || undefined} />
                                <AvatarFallback>{tech.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{tech.name}</p>
                                <p className="text-xs text-gray-500">{tech.email}</p>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={formData.technicians.includes(tech.id)}
                              onChange={() => handleTechnicianToggle(tech.id)}
                              className="rounded border-gray-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Pièce jointe</Label>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddAttachment}
                        className="w-full mt-2 text-orange-500"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Ajouter un document en pièces jointes
                      </Button>
                      {formData.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center mt-2 text-sm">
                          <PaperClipIcon className="h-4 w-4 mr-2" />
                          {attachment}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    Ajouter la tâche
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Calendar grid (unchanged) */}
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
              {events
                .filter((event) => isSameDay(event.startDate, day))
                .map((event) => (
                  <div
                    key={event.id}
                    className="mt-1 p-1 bg-orange-100 text-orange-800 text-xs rounded cursor-pointer hover:bg-orange-200"
                  >
                    {event.title}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

