'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Info } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function NewPaymentForm() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
          <Link
                  href={{
                    pathname: '/comptable/paiement/',
                  }}
             >
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            </Link>
            <h1 className="text-xl font-semibold">Nouveau paiement</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">Voir l&apos;aperçu</Button>
            <Button className="bg-orange-500 hover:bg-orange-600">
              Enregistrer et continuer
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Supplier and Client Information */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <h2 className="text-lg font-medium">Informations sur le fournisseur</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Fournisseur</Label>
                      <div className="flex items-center gap-2 p-3 border rounded-md">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/avatars/02.png" alt="Courtney Henry" />
                          <AvatarFallback>CH</AvatarFallback>
                        </Avatar>
                        <span>Courtney Henry</span>
                        <Button variant="ghost" size="icon" className="ml-auto">
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payer-code">Code payeur</Label>
                      <Input id="payer-code" value="1243 4569 8541 7415" readOnly />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="rib">RIB (Relevé d&apos;Identité Bancaire)</Label>
                      <Input id="rib" value="USD748657586858947586854" readOnly />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="payment-services">Services de paiement</Label>
                      <Select defaultValue="uba">
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une banque" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="uba">UBA Bank</SelectItem>
                          <SelectItem value="cca">CCA Bank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <h2 className="text-lg font-medium">Informations sur le client</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Client</Label>
                      <div className="flex items-center gap-2 p-3 border rounded-md">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/avatars/03.png" alt="Christian Gartner" />
                          <AvatarFallback>CG</AvatarFallback>
                        </Avatar>
                        <span>Christian Gartner</span>
                        <Button variant="ghost" size="icon" className="ml-auto">
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client-code">Code payeur</Label>
                      <Input id="client-code" value="1243 4569 8541 7415" readOnly />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client-rib">RIB (Relevé d&apos;Identité Bancaire)</Label>
                      <Input id="client-rib" value="USD748657586858947586854" readOnly />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="client-payment-services">Services de paiement</Label>
                      <Select defaultValue="cca">
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une banque" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="uba">UBA Bank</SelectItem>
                          <SelectItem value="cca">CCA Bank</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Payment Details */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <h2 className="text-lg font-medium">Detail paiement</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoice-number">Numéro de la facture</Label>
                    <Input id="invoice-number" value="WEST1000342584-001" readOnly />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Montant</Label>
                    <Input id="amount" placeholder="....." />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="creation-date">date d&apos;élaboration</Label>
                    <Input id="creation-date" type="date" value="2023-10-20" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="due-time">heure d&apos;échéance</Label>
                    <Input id="due-time" type="time" value="22:00" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

