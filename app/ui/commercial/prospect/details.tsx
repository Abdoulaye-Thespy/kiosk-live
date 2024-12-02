'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { InfoIcon } from 'lucide-react'

interface ProspectDetailsProps {
  trigger?: string
  prospect: {
    fullName: string
    email: string
    phone: string
    address: string
    needs: string
  }
}

export default function ProspectDetails({ trigger = "View Details", prospect }: ProspectDetailsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {typeof trigger === 'string' ? (
          <Button variant="ghost" size="sm">
            <InfoIcon className="h-4 w-4 mr-2" />
            {trigger}
          </Button>
        ) : (
          trigger
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <InfoIcon className="h-5 w-5" />
            Informations générales
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] pr-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Nom complet</p>
                  <p className="text-sm font-medium">{prospect.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{prospect.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Numéro de téléphone</p>
                  <p className="text-sm font-medium">{prospect.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Adresse</p>
                  <p className="text-sm font-medium">{prospect.address}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Besoin</p>
                  <p className="text-sm">{prospect.needs}</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

