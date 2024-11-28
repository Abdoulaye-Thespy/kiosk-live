'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Download, Eye, PenSquare, HelpCircle, X } from 'lucide-react'
import Link from "next/link"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"

interface OpportunityDetails {
  id: string
  name: string
  fullName: string
  email: string
  phone: string
  address: string
  status: string
  responsibilities: string
  conditions: string
  documents: Array<{ name: string; type: string }>
}

const opportunityDetails: OpportunityDetails = {
  id: "Opportunité 1",
  name: "Opportunité 1",
  fullName: "Jenny Wilson",
  email: "jennywilson@gmail.com",
  phone: "(555) 555-1234",
  address: "Bonamoussadi - rue 2345",
  status: "En cours de validation",
  responsibilities: "Lorem ipsum dolor sit amet consectetur. Tortor vel nunc fusce ut euismod tempor mattis. Interdum nibh nec commodo congue ac mattis neque donec. Malesuada eleifend suspendisse risus at. Vitae maecenas nibh sed tellus.",
  conditions: "Lorem ipsum dolor sit amet consectetur. Tortor vel nunc fusce ut euismod tempor mattis. Interdum nibh nec commodo congue ac mattis neque donec. Malesuada eleifend suspendisse risus at. Vitae maecenas nibh sed tellus.",
  documents: [
    { name: "Brief", type: "pdf" },
    { name: "Brief", type: "pdf" },
  ]
}

export default function OpportunityDetails() {
  const [details, setDetails] = useState<OpportunityDetails>(opportunityDetails)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    fullName: details.fullName,
    email: details.email,
    phone: details.phone,
    address: details.address,
  })

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setDetails({
      ...details,
      ...editForm
    })
    setIsEditing(false)
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
          <h1 className="text-xl font-semibold">Détails de l'Opportunité</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Créer un devis
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Opportunité</label>
                  <p className="text-lg font-medium">{details.id}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      Informations générales
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Informations générales sur l'opportunité</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </h3>
                    <Dialog open={isEditing} onOpenChange={setIsEditing}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <PenSquare className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Modifier les informations</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-name">Nom complet</Label>
                            <Input
                              id="edit-name"
                              value={editForm.fullName}
                              onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                              id="edit-email"
                              type="email"
                              value={editForm.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-phone">Numéro de téléphone</Label>
                            <Input
                              id="edit-phone"
                              value={editForm.phone}
                              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-address">Adresse</Label>
                            <Input
                              id="edit-address"
                              value={editForm.address}
                              onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                              Annuler
                            </Button>
                            <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                              Enregistrer
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500">Nom complet</label>
                      <p className="font-medium">{details.fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <p className="font-medium">{details.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Numéro de téléphone</label>
                      <p className="font-medium">{details.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Adresse</label>
                      <p className="font-medium">{details.address}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">Statut</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Statut actuel de l'opportunité</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {details.status}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">Responsabilités</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Responsabilités liées à l'opportunité</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-gray-600">{details.responsibilities}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">Conditions</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Conditions de l'opportunité</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-gray-600">{details.conditions}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Documents associés</h3>
                <div className="space-y-2">
                  {details.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-medium">B</span>
                        </div>
                        <span className="font-medium">{doc.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}