'use client'

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function TabThreeParametre() {
  return (
    <div className="container mx-auto px-6 py-4 space-y-6">
      <div className="space-y-1 mb-6">
        <h2 className="text-xl font-semibold">Notifications</h2>
        <p className="text-sm text-gray-500">Gérer les notifications</p>
      </div>

      <div className="flex justify-end gap-3 mb-8">
        <Button variant="outline">Annuler</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          Enregistrer les changements
        </Button>
      </div>

      <div className="space-y-6 max-w-3xl">
        <div className="flex items-start justify-between gap-8 py-2">
          <div className="space-y-1">
            <h3 className="font-medium">Informations</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Gérer les alertes envoyées lorsque vous modifiez les informations de votre compte, ou lorsque vous avez des rabais ou des offres spéciales.
            </p>
          </div>
          <Switch className="data-[state=checked]:bg-orange-500" />
        </div>

        <div className="flex items-start justify-between gap-8 py-2">
          <div className="space-y-1">
            <h3 className="font-medium">Installer les notifications de paiement</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Intégrez les notifications de paiement Kiosk
            </p>
          </div>
          <Switch className="data-[state=checked]:bg-orange-500" />
        </div>

        <div className="flex items-start justify-between gap-8 py-2">
          <div className="space-y-1">
            <h3 className="font-medium">Paiements réussis</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Recevoir des notifications pour chaque paiement réussi.
            </p>
          </div>
          <Switch className="data-[state=checked]:bg-orange-500" />
        </div>

        <div className="flex items-start justify-between gap-8 py-2">
          <div className="space-y-1">
            <h3 className="font-medium">Revue de paiement</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Recevoir des notifications si un paiement est marqué comme risque élevé par Stripe ou une règle personnalisée.
            </p>
          </div>
          <Switch className="data-[state=checked]:bg-orange-500" />
        </div>

        <div className="flex items-start justify-between gap-8 py-2">
          <div className="space-y-1">
            <h3 className="font-medium">Paiements incorrects de facture</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Recevoir une notification si un client envoie un montant incorrect pour payer leur facture.
            </p>
          </div>
          <Switch className="data-[state=checked]:bg-orange-500" />
        </div>
      </div>
    </div>
  )
}