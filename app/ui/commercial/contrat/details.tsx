'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Download, X } from 'lucide-react'
import { EyeIcon } from "@heroicons/react/24/outline"

export default function ContractDetailsDialog() {
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false)

  return (
    <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
      <DialogTrigger asChild>
        <Button><EyeIcon className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex justify-between items-start mb-6">
            <DialogTitle className="text-xl font-semibold">Details du contrat</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsMainDialogOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="max-h-[80vh] overflow-y-auto">
          <section className="space-y-6">
            <div>
              <h2 className="text-sm text-gray-500 mb-2">Responsabilités</h2>
              <p className="text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit
                amet, adipiscing nec, ultricies sed, dolor.
              </p>
            </div>

            <div>
              <h2 className="text-sm text-gray-500 mb-2">Condition de réalisation</h2>
              <p className="text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit
                amet, adipiscing nec, ultricies sed, dolor.
              </p>
            </div>

            <div>
              <h2 className="text-sm text-gray-500 mb-2">Paiement</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Details des paiements</span>
                  <span>1.000.000 FCfa</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Échéances</span>
                  <span>22/11/2024 - 22/12/2024</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pénalités en cas de retard</span>
                  <span>1.000.000 FCfa</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm text-gray-500 mb-4">Documents associés</h2>
              <div className="space-y-3">
                {['Brief', 'Documentation', 'Cahier de charge', 'Brief', 'Documentation'].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <span className="text-blue-600 text-xs">PDF</span>
                      </div>
                      <span className="text-sm">{doc}</span>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-orange-500 hover:bg-orange-600">
                  Renouveler le contrat
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Renouveler le contrat</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm">
                    Vous êtes sur le point de renouveler le contrat n°1245 pour une durée de 1 mois à compter d&apos;aujourd&apos;hui.
                  </p>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="extend-contract">Prolonger le contrat</Label>
                    <Switch id="extend-contract" />
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button variant="outline">Annuler</Button>
                    <Button className="bg-orange-500 hover:bg-orange-600">
                      Renouveler
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="ghost" className="w-full" onClick={() => setIsMainDialogOpen(false)}>
              Retour
            </Button>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

