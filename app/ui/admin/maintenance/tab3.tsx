"use client"
import { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PlusIcon } from "@heroicons/react/24/outline"
import { getTechnicians } from "@/app/actions/fetchUserStats"
import { getKiosksForTicket } from "@/app/actions/kiosk-actions"
import { createServiceRequest, getServiceRequests } from "@/app/actions/ticketsactions"
import { DialogClose } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ServiceRequestForm } from "./ServiceRequestForm"

interface ServiceRequest {
  id: string
  kioskId: string
  problemDescription: string
  priority: "High" | "Medium" | "Low"
  technicianId: string
  resolvedDate: string
  status: "Open" | "In Progress" | "Resolved"
}

interface Technician {
  id: string
  name: string
  email: string
}

interface Kiosk {
  id: string
  name: string
  location: string
}

export default function MaintenanceCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false)
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [kiosks, setKiosks] = useState<Kiosk[]>([])
  const [selectedTicket, setSelectedTicket] = useState<ServiceRequest | null>(null)
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedTechnicians, fetchedKiosks, fetchedServiceRequests] = await Promise.all([
        getTechnicians(),
        getKiosksForTicket(),
        getServiceRequests(),
      ])
      setTechnicians(fetchedTechnicians)
      setKiosks(fetchedKiosks)
      setServiceRequests(fetchedServiceRequests)
    }
    fetchData()
  }, [])

  const handleSubmit = async (formData: any) => {
    try {
      const newServiceRequest = await createServiceRequest(formData)
      setServiceRequests((prevRequests) => [...prevRequests, newServiceRequest])
      setIsNewRequestModalOpen(false)
    } catch (error) {
      console.error("Error creating service request:", error)
      throw error
    }
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
          <Button
            onClick={() => setIsNewRequestModalOpen(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouvelle demande
          </Button>
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

        <ServiceRequestForm
          isOpen={isNewRequestModalOpen}
          onOpenChange={setIsNewRequestModalOpen}
          onSubmit={handleSubmit}
          kiosks={kiosks}
          technicians={technicians}
        />

        <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Détails de la demande de service</DialogTitle>
            </DialogHeader>
            {selectedTicket && (
              <div className="space-y-4">
                <Label>Description du problème:</Label>
                <p>{selectedTicket.problemDescription}</p>

                <Label>Priorité:</Label>
                <Badge
                  className={`bg-${selectedTicket.priority === "High" ? "red" : selectedTicket.priority === "Medium" ? "yellow" : "green"}-500`}
                >
                  {selectedTicket.priority}
                </Badge>

                <Label>Technicien assigné:</Label>
                <p>{technicians.find((technician) => technician.id === selectedTicket.technicianId)?.name}</p>

                <Label>Kiosque:</Label>
                <p>{kiosks.find((kiosk) => kiosk.id === selectedTicket.kioskId)?.name}</p>

                <Label>Date de résolution:</Label>
                <p>{format(new Date(selectedTicket.resolvedDate), "PPP")}</p>

                <Label>Statut:</Label>
                <Badge
                  className={`bg-${selectedTicket.status === "Open" ? "gray" : selectedTicket.status === "In Progress" ? "blue" : "green"}-500`}
                >
                  {selectedTicket.status}
                </Badge>
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

