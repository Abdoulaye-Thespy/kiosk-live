'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from 'lucide-react'

interface ReminderLetterDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function ReminderLetterDialog({ isOpen, onClose }: ReminderLetterDialogProps) {
  const defaultMessage = `Cher(e) Mr/Mme,

Nous espérons que ce message vous trouve en bonne santé. Nous souhaitons vous informer que le paiement concernant votre commande/facture n° [référence de la commande ou facture] d'un montant de [montant] n'a pas été traité, résultant en un échec de transaction.

Détails de la facture :
• Montant dû : [montant]
• Référence : [référence de la facture]
• Date d'échéance : [date]

Il est possible que cet échec soit dû à un problème technique ou à une carte expirée. Pour régulariser votre situation, nous vous invitons à effectuer le paiement selon ces deux options :
1. Méthode de paiement 1: ex : lien vers les plateformes de paiement
2. Méthode de paiement 2: ex. virement bancaire avec les coordonnées)

Si le paiement a déjà été effectué récemment, veuillez ignorer ce message. Dans le cas contraire, nous vous prions de bien vouloir régulariser avant le [nouvelle date limite, si applicable], afin d'éviter tout désagrément`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Lettre de relance</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Entête</h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Logo</Label>
                <Input value="Logo.jpg" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input value="17 Nov, 2024" readOnly />
              </div>
              <div className="space-y-2">
                <Label>Objet</Label>
                <Input value="Relance pour paiement échoué" readOnly />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Contenu</h3>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea 
                className="h-[300px]" 
                value={defaultMessage}
              />
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline">
              Prévisualiser
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600">
              Enregistrer le message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

