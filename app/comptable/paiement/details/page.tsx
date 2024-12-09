'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Eye, X } from 'lucide-react'
import { useState } from 'react'

export function TransactionDetailsDialog() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Eye className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Détails de la transaction</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="space-y-6">
            {/* Payer Section */}
            <div className="space-y-4">
              <h3 className="font-medium">Payeur</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-sm text-gray-500">Payeur</span>
                  <span className="text-sm">transaction.name</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-sm text-gray-500">Code payeur</span>
                  <span className="text-sm">transaction.payer.code</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-sm text-gray-500">RIB (Relevé d'Identité Bancaire)</span>
                  <span className="text-sm font-mono">transaction.payer.rib</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-sm text-gray-500">Services de paiement</span>
                  <span className="text-sm">transaction.payer.bank</span>
                </div>
              </div>
            </div>

            {/* Recipient Section */}
            <div className="space-y-4">
              <h3 className="font-medium">Destinataire</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-sm text-gray-500">Destinataire</span>
                  <span className="text-sm">transaction.recipient.name</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-sm text-gray-500">Code payeur</span>
                  <span className="text-sm">transaction.recipient.code</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-sm text-gray-500">Identifiant International de Compte</span>
                  <span className="text-sm font-mono">transaction.recipient.rib</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-sm text-gray-500">Services de paiement</span>
                  <span className="text-sm">transaction.recipient.bank</span>
                </div>
              </div>
            </div>

            {/* Transaction Section */}
            <div className="space-y-4">
              <h3 className="font-medium">Transaction</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-sm text-gray-500">Montant</span>
                  <span className="text-sm">transaction.transaction.amount</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-sm text-gray-500">Commission</span>
                  <span className="text-sm">transaction.transaction.commission</span>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-sm text-gray-500">État</span>
                  <Badge variant="success" className="w-fit">
                    transaction.transaction.status
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-sm text-gray-500">Objet du paiement</span>
                  <span className="text-sm">transaction.transaction.purpose</span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

