'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MagnifyingGlassIcon, PhotoIcon } from "@heroicons/react/24/outline"
import { ArrowPathIcon } from "@heroicons/react/24/solid"
import TabOneParemetre from "@/app/ui/parametre/tab1"
import TabTwoParemetre from "@/app/ui/parametre/tab2"
import TabThreeParametre from "@/app/ui/parametre/tab3"
import TabFourParametre from "@/app/ui/parametre/tab4"

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-9 w-[250px]"
            />
          </div>
          <Button variant="ghost" size="icon">
            <ArrowPathIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="border-b w-full rounded-none p-0 h-auto">
            <div className="flex gap-6 text-muted-foreground">
              <TabsTrigger
                value="general"
                className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold data-[state=active]:border-primary data-[state=active]:text-primary"
              >
                Général
              </TabsTrigger>
              <TabsTrigger
                value="bank"
                className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold data-[state=active]:border-primary data-[state=active]:text-primary"
              >
                Comptes bancaires
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold data-[state=active]:border-primary data-[state=active]:text-primary"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="connection"
                className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold data-[state=active]:border-primary data-[state=active]:text-primary"
              >
                Informations de connexion
              </TabsTrigger>
            </div>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
             <TabOneParemetre />
          </TabsContent>

          <TabsContent value="bank">
            <TabTwoParemetre />
          </TabsContent>

          <TabsContent value="notifications">
              <TabThreeParametre />
          </TabsContent>

          <TabsContent value="connection">
            <TabFourParametre />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}