'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeftIcon, EyeIcon, PlusIcon } from "@heroicons/react/24/outline"
import { CalendarIcon } from "@heroicons/react/24/solid"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface InvoiceItem {
  name: string
  quantity: number
  price: number
  total: number
}

export default function CreateInvoice() {
  const [items, setItems] = useState<InvoiceItem[]>([
    { name: 'Website Design', quantity: 10, price: 50, total: 100000 },
    { name: 'Biffco Enterprise Branding', quantity: 1, price: 50, total: 20000 }
  ])
  const [date, setDate] = useState<Date>()

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
              <Link
                  href={{
                      pathname: '/admin/facturepaiement/',
                  }}
                  className="flex items-center hover:bg-gray-100 rounded-md p-1 transition-colors"
              >
                  <Button variant="ghost" className="gap-2">
                      <ArrowLeftIcon className="h-5 w-5" />
                      Retour
                  </Button>
              </Link>

        <div className="flex gap-4">
          <Button variant="outline" className="gap-2">
            <EyeIcon className="h-5 w-5" />
            Voir l'aperçu
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            Enregistrer et continuer
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label>Contact (client)</Label>
            <Input className="mt-2" placeholder="Nom du client" />
          </div>

          <div>
            <Label>Objet de la facture</Label>
            <Input className="mt-2" defaultValue="Contrat de prestation" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email</Label>
              <Input className="mt-2" defaultValue="johndoe@mail.com" />
            </div>
            <div>
              <Label>Téléphone</Label>
              <Input className="mt-2" defaultValue="+237" />
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-gray-500">
                    <th className="text-left pb-4">Nom</th>
                    <th className="text-left pb-4">Quantité</th>
                    <th className="text-left pb-4">PU</th>
                    <th className="text-right pb-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="py-4">{item.name}</td>
                      <td className="py-4">{item.quantity}</td>
                      <td className="py-4">${item.price}</td>
                      <td className="py-4 text-right">${item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Input placeholder="Nom du produit" className="flex-1" />
                  <Select>
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Qté" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Prix" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">$50</SelectItem>
                      <SelectItem value="100">$100</SelectItem>
                      <SelectItem value="150">$150</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Textarea placeholder="Description du produit" />
                <Button variant="outline" className="w-full gap-2">
                  <PlusIcon className="h-5 w-5" />
                  Ajouter un produit
                </Button>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sous-total</span>
                  <span>$125,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Réduction</span>
                  <span>-$100.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <Button variant="link" className="text-orange-500 h-auto p-0">
                    Ajouter
                  </Button>
                </div>
                <div className="flex justify-between font-semibold pt-4 border-t">
                  <span>Total</span>
                  <span>$124,000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="font-semibold">Details</h2>
              
              <div>
                <Label>Facture N°</Label>
                <Input className="mt-2" defaultValue="WEST100034584-001" />
              </div>

              <div>
                <Label>Date d'initiation</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-2"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PP', { locale: fr }) : '20 Oct, 2023'}
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

              <div>
                <Label>Date limite</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal mt-2"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PP', { locale: fr }) : '20 Oct, 2023'}
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

              <Button className="w-full bg-orange-500 hover:bg-orange-600 mt-4">
                Créer la facture
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}