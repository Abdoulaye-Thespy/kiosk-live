"use client"
import { useState, useEffect, useCallback } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PlusIcon } from "@heroicons/react/24/outline"
import { getTechnicians } from "@/app/actions/fetchUserStats"
import { getKiosksForTicket } from "@/app/actions/kiosk-actions"
import { createServiceRequest, getClientServiceRequests } from "@/app/actions/ticketsactions"
import { DialogClose } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ServiceRequestForm } from "./ServiceRequestForm"
import { useSession } from "next-auth/react"

import type { Kiosk, User, ServiceRequest as PrismaServiceRequest } from "@prisma/client"

// Define the extended types with relations
type ServiceRequestWithRelations = PrismaServiceRequest & {
  technicians: User[]
  kiosk: Kiosk
}

interface Technician {
  id: string
  name: string
  email: string
}

export default function MaintenanceCalendarClient() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [serviceRequests, setServiceRequests] = useState<ServiceRequestWithRelations[]>([])
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false)
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [kiosks, setKiosks] = useState<Kiosk[]>([])
  const [selectedTicket, setSelectedTicket] = useState<ServiceRequestWithRelations | null>(null)
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const { data: session } = useSession()

  const fetchServiceRequests = useCallback(async () => {
    if (session?.user?.id) {
      const { serviceRequests: fetchedRequests, totalPages } = await getClientServiceRequests({
        userId: session.user.id,
        page: currentPage,
        limit: 100, // Adjust this value as needed
      })
      setServiceRequests(fetchedRequests)
      setTotalPages(totalPages)
    }
  }, [session, currentPage])

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedTechnicians, fetchedKiosks] = await Promise.all([getTechnicians(), getKiosksForTicket()])
      setTechnicians(fetchedTechnicians)
      setKiosks(fetchedKiosks)
    }
    fetchData()
    fetchServiceRequests()
  }, [fetchServiceRequests])

  const handleSubmit = async (formData: any) => {
    try {
      const newServiceRequest = await createServiceRequest(formData)
      setServiceRequests((prevRequests) => [...prevRequests, newServiceRequest])
      setIsNewRequestModalOpen(false)
      fetchServiceRequests() // Refresh the list after creating a new request
    } catch (error) {
      console.error("Error creating service request:", error)
      throw error
    }
  }

  const renderEventList = (day: Date) => {
    const dayEvents = serviceRequests.filter((request) =>
      request.createdDate ? isSameDay(new Date(request.createdDate), day) : false,
    )
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500"
      case "MEDIUM":
        return "bg-yellow-500"
      case "LOW":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-gray-500"
      case "IN_PROGRESS":
        return "bg-blue-500"
      case "RESOLVED":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
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
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="text-xl font-semibold text-orange-700">
                Détails de la demande de service
              </DialogTitle>
            </DialogHeader>
            {selectedTicket && (
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-orange-700">Description du problème</Label>
                  <p className="text-gray-700 bg-orange-50 p-3 rounded-md whitespace-pre-wrap">
                    {selectedTicket.problemDescription}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-orange-700">Priorité</Label>
                    <Badge className={`${getPriorityColor(selectedTicket.priority)} text-white`}>
                      {selectedTicket.priority}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-orange-700">Statut</Label>
                    <Badge className={`${getStatusColor(selectedTicket.status)} text-white`}>
                      {selectedTicket.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-orange-700">Technicien(e)(s) assigné(e)(s)</Label>
                  <div className="bg-orange-50 p-3 rounded-md">
                    {selectedTicket.technicians.length > 0 ? (
                      selectedTicket.technicians.map((technician, index) => (
                        <span key={technician.id} className="text-gray-700">
                          {technician.name}
                          {index < selectedTicket.technicians.length - 1 ? ", " : ""}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">Aucun technicien assigné</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-orange-700">Kiosque</Label>
                  <p className="text-gray-700 bg-orange-50 p-3 rounded-md">{selectedTicket.kiosk.kioskName}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-orange-700">Date de résolution</Label>
                  <p className="text-gray-700 bg-orange-50 p-3 rounded-md">
                    {selectedTicket.resolvedDate ? format(new Date(selectedTicket.resolvedDate), "PPP") : "Non résolu"}
                  </p>
                </div>

                {selectedTicket.comments && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-orange-700">Commentaires</Label>
                    <p className="text-gray-700 bg-orange-50 p-3 rounded-md whitespace-pre-wrap">
                      {selectedTicket.comments}
                    </p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter className="border-t pt-4">
              <DialogClose asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6">Fermer</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

