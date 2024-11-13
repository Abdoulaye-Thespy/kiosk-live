'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusIcon, ArrowPathIcon } from "@heroicons/react/24/outline"
import { CreditCardIcon } from "@heroicons/react/24/solid"

export default function BankSettings() {
  return (
    <div className="container mx-auto px-6 py-4 space-y-6">

      <Tabs defaultValue="bank" className="space-y-6">

        <TabsContent value="bank" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Compte bancaire</h2>
            <p className="text-sm text-gray-500">Configurer et gérer votre entreprise</p>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-[200px_1fr] items-start gap-x-8">
              <div className="text-sm font-medium text-gray-500 pt-4">Compte bancaire</div>
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">C</span>
                      </div>
                      <div>
                        <p className="font-medium">CCA Bank</p>
                        <p className="text-sm text-gray-500">**** **** **** 4520</p>
                      </div>
                    </div>
                    <Button variant="ghost" className="text-orange-500 hover:text-orange-600 font-medium">
                      Modifier
                    </Button>
                  </div>
                </Card>

                <Button variant="outline" className="w-full justify-start text-orange-500 hover:text-orange-600 font-medium">
                  <PlusIcon className="h-5 w-5 mr-2 text-orange-500" />
                  Nouveau compte bancaire
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] items-start gap-x-8">
              <div className="text-sm font-medium text-gray-500 pt-4">Cartes</div>
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCardIcon className="h-10 w-10 text-blue-600" />
                      <div>
                        <p className="font-medium">Visa</p>
                        <p className="text-sm text-gray-500">**** **** **** 3212</p>
                      </div>
                    </div>
                    <Button variant="ghost" className="text-orange-500 hover:text-orange-600 font-medium">
                      Modifier
                    </Button>
                  </div>
                </Card>

                <Button variant="outline" className="w-full justify-start text-orange-500 hover:text-orange-600 font-medium">
                  <PlusIcon className="h-5 w-5 mr-2 text-orange-500" />
                  Nouvelles cartes
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="general">
          <div className="h-[400px] flex items-center justify-center border rounded-lg">
            <p className="text-muted-foreground">Contenu général</p>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="h-[400px] flex items-center justify-center border rounded-lg">
            <p className="text-muted-foreground">Contenu des notifications</p>
          </div>
        </TabsContent>

        <TabsContent value="connection">
          <div className="h-[400px] flex items-center justify-center border rounded-lg">
            <p className="text-muted-foreground">Contenu des informations de connexion</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}