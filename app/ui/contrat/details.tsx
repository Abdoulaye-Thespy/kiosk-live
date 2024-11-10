'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { EyeIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { DocumentIcon, ArrowDownTrayIcon } from "@heroicons/react/24/solid"

export default function ContractDetailsModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <EyeIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Details du contrat</DialogTitle>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full">
                <XMarkIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] pr-4">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Parties impliquées</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Responsable du kiosque</p>
                  <p className="text-sm">Jhon Smith</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Autorité contractante</p>
                  <p className="text-sm">Joe Defack</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">Termes et conditions</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Responsabilités</p>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.
                    Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Condition de résiliation</p>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus.
                    Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Durée</p>
                  <p className="text-sm">1 mois</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">Paiement</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Détails des paiements</p>
                  <p className="text-sm">1 000 000 Fcfa</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Échéances</p>
                  <p className="text-sm">22/11/2024 - 22/12/2024</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pénalités en cas de retard</p>
                  <p className="text-sm">1 000 000 Fcfa</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">Documents associés</h3>
              <div className="space-y-3">
                {['Brief', 'Documentation', 'Cahier de charge', 'Brief'].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between bg-secondary/50 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DocumentIcon className="h-5 w-5 text-blue-500" />
                      <span className="text-sm">{doc}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowDownTrayIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}