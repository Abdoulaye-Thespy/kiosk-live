'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Upload } from 'lucide-react'
import { Label } from "@/components/ui/label"

export default function NewOpportunityForm() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Nouvelle opportunité</h1>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600">
            Enregistrer et continuer
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <form className="space-y-8">
              <div className="space-y-6">
                <h2 className="text-lg font-medium">Informations sur le prospect</h2>
                
                <div className="space-y-2">
                  <Label htmlFor="opportunity-name">Nom de l&apos;opportunité</Label>
                  <Input
                    id="opportunity-name"
                    placeholder="Entrez le nom de l'opportunité"
                    className="max-w-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Responsabilités</Label>
                  <Textarea
                    id="responsibilities"
                    placeholder="Définir les responsabilités"
                    className="min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conditions">Conditions de réalisation</Label>
                  <Textarea
                    id="conditions"
                    placeholder="Définir les conditions"
                    className="min-h-[120px]"
                  />
                </div>

                <div className="pt-4">
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-gray-50">
                    <div className="mb-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Upload className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      Importer un document lié à ce devis
                    </p>
                    <Button 
                      variant="outline" 
                      className="bg-white border-orange-500 text-orange-500 hover:bg-orange-50"
                    >
                      Importer un document
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

