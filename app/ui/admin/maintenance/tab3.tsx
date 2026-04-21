"use client"
import { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { PlusIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { getTechnicians } from "@/app/actions/fetchUserStats"
import { getKiosksForTicket } from "@/app/actions/kiosk-actions"
import { createServiceRequest, getServiceRequests } from "@/app/actions/ticketsactions"
import { DialogClose } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ServiceRequestForm } from "./ServiceRequestForm"

import { type Kiosk, User, ServiceRequest as PrismaServiceRequest } from "@prisma/client"

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

export default function MaintenanceCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [serviceRequests, setServiceRequests] = useState<ServiceRequestWithRelations[]>([])
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false)
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [kiosks, setKiosks] = useState<Kiosk[]>([])
  const [selectedTicket, setSelectedTicket] = useState<ServiceRequestWithRelations | null>(null)
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

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1))
  }

  const renderEventList = (day: Date) => {
    const dayEvents = serviceRequests.filter((request) => 
      request.createdDate ? isSameDay(new Date(request.createdDate), day) : false
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
      case 'HIGH':
        return 'bg-red-500'
      case 'MEDIUM':
        return 'bg-yellow-500'
      case 'LOW':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-gray-500'
      case 'IN_PROGRESS':
        return 'bg-blue-500'
      case 'RESOLVED':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
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

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={handlePreviousMonth}
            variant="outline"
            className="border-orange-200 hover:bg-orange-50"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Button>
          <div className="text-xl font-semibold text-orange-800">
            {format(currentMonth, "MMMM yyyy")}
          </div>
          <Button
            onClick={handleNextMonth}
            variant="outline"
            className="border-orange-200 hover:bg-orange-50"
          >
            <ChevronRightIcon className="h-5 w-5" />
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

        {/* Quick Stats - Optional */}
        <div className="mt-6 pt-4 border-t">
          <div className="text-sm text-gray-600">
            Total des demandes: {serviceRequests.length} | 
            Demandes ce mois: {
              serviceRequests.filter(req => 
                req.createdDate && isSameMonth(new Date(req.createdDate), currentMonth)
              ).length
            }
          </div>
        </div>

        <ServiceRequestForm
          isOpen={isNewRequestModalOpen}
          onOpenChange={setIsNewRequestModalOpen}
          onSubmit={handleSubmit}
          kiosks={kiosks}
          technicians={technicians}
        />

        <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
          <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
            <DialogHeader className="p-4 pb-2 border-b bg-orange-50">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-lg font-semibold text-orange-700">
                  Détails de la demande
                </DialogTitle>
                <DialogClose asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <XMarkIcon className="h-4 w-4" />
                  </Button>
                </DialogClose>
              </div>
            </DialogHeader>
            
            {selectedTicket && (
              <div className="p-4 space-y-3">
                {/* Problem Description - Compact */}
                <div className="bg-orange-50 p-2 rounded-md">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {selectedTicket.problemDescription}
                  </p>
                </div>

                {/* Priority & Status - Side by side */}
                <div className="flex gap-3">
                  <div className="flex-1 flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <span className="text-xs font-medium text-gray-600">Priorité</span>
                    <Badge className={`${getPriorityColor(selectedTicket.priority)} text-white text-xs px-2 py-0.5`}>
                      {selectedTicket.priority}
                    </Badge>
                  </div>
                  <div className="flex-1 flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <span className="text-xs font-medium text-gray-600">Statut</span>
                    <Badge className={`${getStatusColor(selectedTicket.status)} text-white text-xs px-2 py-0.5`}>
                      {selectedTicket.status}
                    </Badge>
                  </div>
                </div>

                {/* Dates - Two columns */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-2 rounded-md">
                    <div className="text-xs font-medium text-gray-600 mb-1">Date de création</div>
                    <div className="text-sm text-gray-800">
                      {selectedTicket.createdDate && format(new Date(selectedTicket.createdDate), "dd/MM/yyyy")}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded-md">
                    <div className="text-xs font-medium text-gray-600 mb-1">Date de résolution</div>
                    <div className="text-sm text-gray-800">
                      {selectedTicket.resolvedDate 
                        ? format(new Date(selectedTicket.resolvedDate), "dd/MM/yyyy")
                        : "Non résolu"}
                    </div>
                  </div>
                </div>

                {/* Kiosk & Technicians */}
                <div className="bg-gray-50 p-2 rounded-md">
                  <div className="text-xs font-medium text-gray-600 mb-1">Kiosque</div>
                  <div className="text-sm text-gray-800">{selectedTicket.kiosk.kioskName}</div>
                </div>

                <div className="bg-gray-50 p-2 rounded-md">
                  <div className="text-xs font-medium text-gray-600 mb-1">Technicien(s)</div>
                  <div className="text-sm text-gray-800">
                    {selectedTicket.technicians.length > 0 ? (
                      selectedTicket.technicians.map((technician, index) => (
                        <span key={technician.id}>
                          {technician.name}
                          {index < selectedTicket.technicians.length - 1 ? ", " : ""}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">Aucun technicien assigné</span>
                    )}
                  </div>
                </div>

                {/* Comments - Only if exists */}
                {selectedTicket.comments && (
                  <div className="bg-gray-50 p-2 rounded-md">
                    <div className="text-xs font-medium text-gray-600 mb-1">Commentaires</div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedTicket.comments}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter className="p-3 pt-2 border-t bg-gray-50">
              <DialogClose asChild>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 h-8">
                  Fermer
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}