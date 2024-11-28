'use client'

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Laptop, Smartphone, MoreVertical } from 'lucide-react'

export default function TabFourParametre() {
  const devices = [
    {
      id: 1,
      name: "2018 Macbook Pro 15-inch",
      type: "laptop",
      location: "Melbourne, Australie",
      date: "22 Jan à 10h40",
      isActive: true,
    },
    {
      id: 2,
      name: "2018 Macbook Pro 15 pouces",
      type: "laptop",
      location: "Melbourne, Australie",
      date: "22 Jan à 16h20",
    },
    {
      id: 3,
      name: "2018 Macbook Pro 15 pouces",
      type: "laptop",
      location: "Melbourne, Australie",
      date: "22 Jan à 13h15",
    },
    {
      id: 4,
      name: "2018 iPhone XS",
      type: "phone",
      location: "Melbourne, Australie",
      date: "22 Jan à 7h20",
    },
    {
      id: 5,
      name: "2018 Macbook Pro 15 pouces",
      type: "laptop",
      location: "Melbourne, Australie",
      date: "21 janv. à 18h",
    },
    {
      id: 6,
      name: "2018 Macbook Pro 15 pouces",
      type: "laptop",
      location: "Melbourne, Australie",
      date: "21 janv. à 15h20",
    },
    {
      id: 7,
      name: "2018 Macbook Pro 15 pouces",
      type: "laptop",
      location: "Melbourne, Australie",
      date: "21 janv. à 11h15",
    },
  ]

  return (
    <div className="flex justify-between container mx-auto px-6 py-4 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Informations de connexion</h2>
        <p className="text-sm text-gray-500">Activité sur votre compte</p>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-500">Vous êtes connecté</h3>
        <div className="space-y-1">
          {devices.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {device.type === "laptop" ? (
                  <Laptop className="h-5 w-5 text-gray-500" />
                ) : (
                  <Smartphone className="h-5 w-5 text-gray-500" />
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{device.name}</span>
                    {device.isActive && (
                      <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50 text-xs">
                        Actif maintenant
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {device.location} • {device.date}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-500">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}