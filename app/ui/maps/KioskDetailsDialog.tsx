import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { KioskType } from "@prisma/client"
import { Store } from 'lucide-react'

interface KioskDetailsProps {
  isOpen: boolean
  onClose: () => void
  kiosk: {
    id: string
    client: string
    manager: string
    services: string
    location: string
    coordinates: string
    revenue: string
    type: KioskType
  }
}

export function KioskDetailsDialog({ isOpen, onClose, kiosk }: KioskDetailsProps) {
  const getKioskTypeLabel = (type: KioskType) => {
    switch (type) {
      case KioskType.ONE_COMPARTMENT_WITH_BRANDING:
        return "Un compartiment avec branding"
      case KioskType.ONE_COMPARTMENT_WITHOUT_BRANDING:
        return "Un compartiment sans branding"
      case KioskType.THREE_COMPARTMENT_WITH_BRANDING:
        return "Trois compartiments avec branding"
      case KioskType.THREE_COMPARTMENT_WITHOUT_BRANDING:
        return "Trois compartiments sans branding"
      default:
        return "Type inconnu"
    }
  }

  const getKioskTypeColor = (type: KioskType) => {
    return type.includes('THREE_COMPARTMENT') ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-orange-500" />
            Details du kiosque
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">

          {/* <div className="space-y-2">
            <p className="text-sm text-gray-500">Type de kiosque</p>
            <Badge className={`${getKioskTypeColor(kiosk.type)}`}>
              {getKioskTypeLabel(kiosk.type)}
            </Badge>
          </div> */}

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
            <p className="text-sm text-gray-500">Zone exacte</p>
            <p className="font-medium">{kiosk.location}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Coordonnées GPS</p>
            <p className="font-medium">{kiosk.coordinates}</p>
          </div>

          <div className="pt-4">
            <div className="rounded-md bg-orange-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Store className="h-5 w-5 text-orange-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-orange-800">
                    {kiosk.type.includes('THREE_COMPARTMENT') 
                      ? 'Kiosque à trois compartiments' 
                      : 'Kiosque à un compartiment'}
                  </h3>
                  <div className="mt-2 text-sm text-orange-700">
                    <p>
                      {kiosk.type.includes('THREE_COMPARTMENT')
                        ? 'Ce kiosque peut accueillir jusqu\'à trois activités différentes.'
                        : 'Ce kiosque est conçu pour une seule activité.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <Button 
              variant="outline" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white" 
              onClick={onClose}
            >
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}