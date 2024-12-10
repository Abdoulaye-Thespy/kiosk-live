'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface KioskDetailsProps {
  isOpen: boolean
  onClose: () => void
  kiosk: {
    id: string
    client: string
    manager: string
    services: string
    city: string
    location: string
    coordinates: string
    revenue: string
  }
}

export function KioskDetailsDialog({ isOpen, onClose, kiosk }: KioskDetailsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Details du kiosque
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-100">
              <span className="text-xs text-gray-600">?</span>
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Numéro du kiosque</p>
            <p className="font-medium">{kiosk.id}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Client</p>
            <p className="font-medium">{kiosk.client}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Gestionnaire du kiosque</p>
            <p className="font-medium">{kiosk.manager}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Produits et services</p>
            <p className="font-medium">{kiosk.services}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Ville</p>
            <p className="font-medium">{kiosk.city}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Zone exacte</p>
            <p className="font-medium">{kiosk.location}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Coordonnées GPS</p>
            <p className="font-medium">{kiosk.coordinates}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Revenu mensuel moyen</p>
            <p className="font-medium">{kiosk.revenue}</p>
          </div>
          <div className="flex flex-col gap-2 pt-4">
            <Button 
              variant="outline" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white" 
              onClick={onClose}
            >
              Retour
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

