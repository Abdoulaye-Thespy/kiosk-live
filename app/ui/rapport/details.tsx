'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EyeIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { CalendarIcon } from "@heroicons/react/24/solid"

interface ProformaDetailsModalProps {
  rapport: {
    id: string
    type: string
    date: string
  }
}

const rapports: Rapport[] = [
    { id: '1', type: 'Mensuel', date: '2023-06-01' },
    { id: '2', type: 'Trimestriel', date: '2023-06-02' },
    { id: '3', type: 'Annuel', date: '2023-06-03' },
    { id: '4', type: 'Mensuel', date: '2023-07-01' },
    { id: '5', type: 'Trimestriel', date: '2023-09-01' },
  ]

export default function ProformaDetailsModal({ rapport }: ProformaDetailsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <EyeIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Details Rapport</DialogTitle>
            <DialogTrigger asChild>
            </DialogTrigger>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium">Rapport N° {rapport.id}</p>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Type de Rapport</p>
                <p className="text-sm font-medium">{rapport.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de création</p>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{rapport.date}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date de validation</p>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">{rapport.date}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="outline">Retour</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}