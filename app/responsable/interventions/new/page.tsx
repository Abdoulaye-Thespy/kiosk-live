'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, ChevronLeft } from 'lucide-react'
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function NewIntervention() {
  const [date, setDate] = useState<Date>()

  return (
    <div className=" mx-auto p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-semibold">Nouvelle intervention</h1>
        <div className="flex-1" />
        <Button className="bg-orange-500 hover:bg-orange-600">
          Enregistrer et continuer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground">
              Informations sur le kiosque
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="kiosk-number">Numéro de kiosque</Label>
                <Input id="kiosk-number" defaultValue="1243" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="client-name">Nom du client</Label>
                <Input id="client-name" defaultValue="Christian Gartner" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Ville</Label>
                <Input id="city" defaultValue="Douala" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zone">Zone exacte</Label>
                <Input id="zone" defaultValue="Bonamoussadi - rue 2345" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground">
              Details sur l'intervention
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="intervention-type">Type d'intervention</Label>
                <Select defaultValue="deployment">
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deployment">Déploiement</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="repair">Réparation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="materials">Matériel requis</Label>
                <Input id="materials" />
              </div>
              <div className="space-y-2">
                <Label>Date d'intervention</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP', { locale: fr }) : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground">
            Détails sur le technicien
          </h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="technician-name">Nom du technicien</Label>
              <Input id="technician-name" defaultValue="Dengele Rostand" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input id="phone" defaultValue="+237 55966832" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

