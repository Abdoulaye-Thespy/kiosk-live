'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  onExport: (data: ExportData) => void
}

interface ExportData {
  timeZone: string
  dateRange: DateRange
  columns: string[]
}

type DateRange = {
  start: Date
  end: Date
  label: string
}

const defaultColumns = [
  "Identifiant",
  "Montant où",
  "Facturation",
  "Fermé",
  "Devise",
  "Client",
  "Date (UTC)",
  "Date d'échéance (UTC)",
  "Numéro",
  "Payé",
  "Abonnement",
  "Sous-total",
  "Montant total de réduction",
  "Coupons appliqués",
  "Taxe",
  "Taux de taxe",
  "Total",
  "Montant payé",
  "Statut"
]

export function ExportDialog({ isOpen, onClose, onExport }: ExportDialogProps) {
  const [selectedDateRange, setSelectedDateRange] = useState('today')
  const [selectedColumns, setSelectedColumns] = useState<string[]>(defaultColumns)

  const getDateRange = (range: string): DateRange => {
    const today = new Date()
    switch (range) {
      case 'today':
        return {
          start: today,
          end: today,
          label: "Aujourd'hui"
        }
      case 'currentMonth':
        return {
          start: startOfMonth(today),
          end: endOfMonth(today),
          label: `${format(startOfMonth(today), 'MMM dd', { locale: fr })} - ${format(endOfMonth(today), 'MMM dd', { locale: fr })}`
        }
      case 'last7Days':
        return {
          start: subDays(today, 7),
          end: today,
          label: `${format(subDays(today, 7), 'd MMM', { locale: fr })} - ${format(today, 'd MMM', { locale: fr })}`
        }
      case 'lastMonth':
        const lastMonth = subMonths(today, 1)
        return {
          start: startOfMonth(lastMonth),
          end: endOfMonth(lastMonth),
          label: `${format(startOfMonth(lastMonth), 'd MMM', { locale: fr })} - ${format(endOfMonth(lastMonth), 'd MMM', { locale: fr })}`
        }
      case 'all':
        return {
          start: new Date(0),
          end: today,
          label: 'Tout'
        }
      default:
        return {
          start: today,
          end: today,
          label: "Aujourd'hui"
        }
    }
  }

  const handleExport = () => {
    const exportData: ExportData = {
      timeZone: 'GMT+8 (UTC+08:00)',
      dateRange: getDateRange(selectedDateRange),
      columns: selectedColumns
    }
    onExport(exportData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Exporter les factures</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Fuseau horaire</Label>
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              GMT+8 (UTC+08:00)
              <span className="text-gray-500">· Temps universel coordonné</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Période de date</Label>
            <RadioGroup
              defaultValue="today"
              value={selectedDateRange}
              onValueChange={setSelectedDateRange}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="today" id="today" />
                <Label htmlFor="today" className="font-normal">
                  Aujourd&apos;hui
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="currentMonth" id="currentMonth" />
                <Label htmlFor="currentMonth" className="font-normal">
                  Mois en cours
                  <span className="ml-2 text-gray-500">
                    {getDateRange('currentMonth').label}
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="last7Days" id="last7Days" />
                <Label htmlFor="last7Days" className="font-normal">
                  Derniers 7 jours
                  <span className="ml-2 text-gray-500">
                    {getDateRange('last7Days').label}
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lastMonth" id="lastMonth" />
                <Label htmlFor="lastMonth" className="font-normal">
                  Le Mois Dernier
                  <span className="ml-2 text-gray-500">
                    {getDateRange('lastMonth').label}
                  </span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="font-normal">
                  Tout
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Colonnes</Label>
            <Select defaultValue="default">
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner les colonnes">
                  Par défaut (16)
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Par défaut (16)</SelectItem>
                <SelectItem value="all">Toutes les colonnes</SelectItem>
                <SelectItem value="custom">Personnalisé</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {defaultColumns.join(', ')}
            </p>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleExport}
            >
              Exporter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

