'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, CalendarIcon, Upload } from 'lucide-react'
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"

export default function NewQuoteOpportunity() {
  const [elaborationDate, setElaborationDate] = useState<Date>()
  const [dueDate, setDueDate] = useState<Date>()
  const [formData, setFormData] = useState({
    opportunityName: '',
    prospect: '',
    responsibilities: '',
    conditions: '',
    amount: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', { ...formData, elaborationDate, dueDate })
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/opportunities">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Nouvelle opportunité devis</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Voir l'aperçu</Button>
          <Button 
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Enregistrer et continuer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium mb-4">Informations sur le prospect</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 mb-1.5 block">
                  Nom de l'opportunité
                </label>
                <Input
                  value={formData.opportunityName}
                  onChange={(e) => setFormData({ ...formData, opportunityName: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1.5 block">
                  Prospects
                </label>
                <Select
                  value={formData.prospect}
                  onValueChange={(value) => setFormData({ ...formData, prospect: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le prospect" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="courtney">Courtney Henry</SelectItem>
                    <SelectItem value="other">Other Prospects</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1.5 block">
                  Resposabilités
                </label>
                <Textarea
                  placeholder="Définir les responsabilités"
                  className="min-h-[100px]"
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1.5 block">
                  Conditions de réalisation
                </label>
                <Textarea
                  placeholder="Définir les conditions"
                  className="min-h-[100px]"
                  value={formData.conditions}
                  onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                />
              </div>

              <div className="pt-4">
                <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 space-y-2">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-600">Importer un document lié à ce devis</p>
                  <Button variant="outline" className="mt-2">
                    Importer un document
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div className="bg-white rounded-lg p-6 space-y-6">
            <h2 className="text-lg font-medium">Detail Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-500 mb-1.5 block">
                  Numéro du devis
                </label>
                <Input 
                  value="WEST100034258A-001"
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1.5 block">
                  Montant
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1.5 block">
                  Date d'élaboration
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {elaborationDate ? format(elaborationDate, "P", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={elaborationDate}
                      onSelect={setElaborationDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm text-gray-500 mb-1.5 block">
                  Date d'échéance
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "P", { locale: fr }) : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}