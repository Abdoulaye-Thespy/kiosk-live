'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, ArrowLeftIcon, BellIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline"
import { DocumentArrowUpIcon } from "@heroicons/react/24/solid"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Component() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <ArrowLeftIcon className="h-6 w-6" />
          <h1 className="text-2xl font-semibold">Nouveau contrat</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">Voir l&apos;aperçu</Button>
          <Button>Enregistrer et continuer</Button>
          <Button variant="ghost" size="icon">
            <BellIcon className="h-5 w-5" />
          </Button>
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon">
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Facture à :</h2>
                <div className="space-y-2">
                  <Label>Responsable du kiosque</Label>
                  <Input type="email" placeholder="johndoe@mail.com" />
                </div>
                <div className="space-y-2">
                  <Label>Autorité contractante</Label>
                  <Input type="email" placeholder="johndoe@mail.com" />
                </div>
                <div className="space-y-2">
                  <Label>Addresse</Label>
                  <Input placeholder="Akwa Nord" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-medium">Responsabilités</h2>
              <Textarea placeholder="Définir les responsabilités" className="min-h-[100px]" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-medium">Conditions de résiliation</h2>
              <Textarea placeholder="Définir les conditions" className="min-h-[100px]" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
                <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-4">Importer le document de votre contrat ici</p>
                <Button>
                  <DocumentArrowUpIcon className="h-4 w-4 mr-2" />
                  Importer un document
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-lg font-medium">Detail Information</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Numéro du contrat</Label>
                  <Input value="WEST1000342584-001" readOnly className="bg-gray-50" />
                </div>

                <div className="space-y-2">
                  <Label>Montant</Label>
                  <Input type="number" placeholder="0.00" />
                </div>

                <div className="space-y-2">
                  <Label>Date d&apos;élaboration</Label>
                  <div className="relative">
                    <Input type="text" value="20 Oct, 2023" readOnly className="bg-gray-50" />
                    <CalendarIcon className="h-4 w-4 absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Date d&apos;échéance</Label>
                  <div className="relative">
                    <Input type="text" value="20 Oct, 2024" readOnly className="bg-gray-50" />
                    <CalendarIcon className="h-4 w-4 absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div className="flex items-center justify-between py-2">
                  <Label>Méthode de paiement</Label>
                  <Switch />
                </div>

                <div className="flex items-center justify-between py-2">
                  <Label>Frais de retard</Label>
                  <Switch />
                </div>

                <div className="flex items-center justify-between py-2">
                  <Label>Note</Label>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}