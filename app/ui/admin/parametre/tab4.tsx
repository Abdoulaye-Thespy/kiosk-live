"use client"

import { useSession } from "next-auth/react"
import { Badge } from "@/components/ui/badge"
import { Laptop, Smartphone } from "lucide-react"
import { useState, useEffect } from "react"

export default function TabFourParametre() {
  const { data: session } = useSession()
  const [currentDateTime, setCurrentDateTime] = useState<string>("")

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }
      setCurrentDateTime(now.toLocaleDateString("fr-FR", options))
    }

    updateDateTime() // Initial update
    const timer = setInterval(updateDateTime, 60000) // Update every minute

    return () => clearInterval(timer) // Cleanup on unmount
  }, [])

  if (!session) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Vous n'êtes pas connecté.</p>
      </div>
    )
  }

  const deviceType = session.user?.image?.includes("phone") ? "phone" : "laptop"
  const deviceName = deviceType === "phone" ? "Smartphone" : "Ordinateur"

  return (
    <div className="flex justify-between container mx-auto px-6 py-4 space-y-6 space-x-4 bg-white rounded-lg p-4">
      <div className="space-y-1 w-1/4">
        <h2 className="text-xl font-semibold">Informations de connexion</h2>
        <p className="text-sm text-gray-500">Activité sur votre compte</p>
      </div>

      <div className="space-y-2 w-3/4 ">
        <h3 className="text-sm font-medium text-gray-500">Vous êtes connecté</h3>
        <div className="space-y-1">
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {deviceType === "laptop" ? (
                <Laptop className="h-5 w-5 text-gray-500" />
              ) : (
                <Smartphone className="h-5 w-5 text-gray-500" />
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{deviceName}</span>
                  <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50 text-xs">
                    Actif maintenant
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {session.user?.name || "Utilisateur"} • {currentDateTime}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

