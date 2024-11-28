'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft, Calendar } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useState } from "react"
import Header from "@/app/ui/header"
import Link from 'next/link'
export default function CreateQuote() {
  const [elaborationDate, setElaborationDate] = useState<Date>()
  const [dueDate, setDueDate] = useState<Date>()

  return (
      <div className="container mx-auto p-6">
          <Header title="Gestion des prosppect" />
          <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                  <Link
                      href={{
                          pathname: '/commercial/',
                      }}
                      >
                      <Button variant="ghost" size="icon">
                          <ChevronLeft className="h-4 w-4" />
                      </Button>
                  </Link>

                  <h1 className="text-xl font-semibold">Nouveau devis</h1>
              </div>
              <div className="flex gap-2">
                  <Button variant="outline">Voir l'aperçu</Button>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                      Enregistrer et continuer
                  </Button>
              </div>
          </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Prospect Information */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Informations sur le prospect</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nom complet</Label>
                  <Input id="fullName" placeholder="John Doe" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <Input id="email" type="email" placeholder="johndoe@mail.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" placeholder="(555)-555-123" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input id="address" placeholder="Kotto - rue354" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Responsabilités</Label>
                  <Textarea 
                    id="responsibilities" 
                    placeholder="Définir les responsabilités"
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conditions">Conditions de réalisation</Label>
                  <Textarea 
                    id="conditions" 
                    placeholder="Définir les conditions"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detail Information */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Detail Information</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contractNumber">Numéro du contrat</Label>
                  <Input id="contractNumber" value="WEST100034258A-001" readOnly className="bg-gray-50" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Montant</Label>
                  <Input id="amount" type="number" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <Label>Date d'élaboration</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {elaborationDate ? format(elaborationDate, "P", { locale: fr }) : "Sélectionner une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={elaborationDate}
                        onSelect={setElaborationDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Date d'échéance</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "P", { locale: fr }) : "Sélectionner une date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center justify-between py-2">
                  <Label htmlFor="payment-method">Méthode de paiement</Label>
                  <Switch id="payment-method" />
                </div>

                <div className="flex items-center justify-between py-2">
                  <Label htmlFor="late-fees">Frais de retard</Label>
                  <Switch id="late-fees" />
                </div>

                <div className="flex items-center justify-between py-2">
                  <Label htmlFor="notes">Note</Label>
                  <Switch id="notes" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}