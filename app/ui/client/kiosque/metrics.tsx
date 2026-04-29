"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import styles from "@/app/ui/dashboard.module.css"
import ThreeKioskSVG from "../../svg/threekiosks"
import OneKioskSVG from "../../svg/onekiosks"
import { getUserKioskCounts } from "@/app/actions/kiosk-actions"

interface KioskCounts {
  totalKiosks: number
  oneCompartment: {
    REQUEST: number
    LOCALIZING: number
    AVAILABLE: number
    UNDER_MAINTENANCE: number
  }
  threeCompartment: {
    REQUEST: number
    LOCALIZING: number
    AVAILABLE: number
    UNDER_MAINTENANCE: number
  }
}

export default function KioskMetricsClient() {
  const { data: session, status } = useSession()
  const [kioskCounts, setKioskCounts] = useState<KioskCounts>({
    totalKiosks: 0,
    oneCompartment: {
      REQUEST: 0,
      LOCALIZING: 0,
      AVAILABLE: 0,
      UNDER_MAINTENANCE: 0,
    },
    threeCompartment: {
      REQUEST: 0,
      LOCALIZING: 0,
      AVAILABLE: 0,
      UNDER_MAINTENANCE: 0,
    },
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserKioskCounts() {
      if (status === "authenticated" && session?.user?.id) {
        try {
          setIsLoading(true)
          const counts = await getUserKioskCounts(session.user.id)
          setKioskCounts(counts)
          setError(null)
        } catch (err) {
          console.error("Error fetching user kiosk counts:", err)
          setError("Une erreur est survenue lors du chargement des données des kiosques.")
        } finally {
          setIsLoading(false)
        }
      } else if (status === "unauthenticated") {
        setIsLoading(false)
      }
    }

    fetchUserKioskCounts()
  }, [status, session])

  // Calculate metrics from kioskCounts
  const metrics = [
    {
      title: "Nouveaux kiosques",
      oneCompartment: kioskCounts.oneCompartment.REQUEST + kioskCounts.oneCompartment.LOCALIZING,
      threeCompartment: kioskCounts.threeCompartment.REQUEST + kioskCounts.threeCompartment.LOCALIZING,
      total:
        kioskCounts.oneCompartment.REQUEST +
        kioskCounts.threeCompartment.REQUEST +
        kioskCounts.oneCompartment.LOCALIZING +
        kioskCounts.threeCompartment.LOCALIZING,
      period: "en attente",
      description: "Kiosques en demande ou en cours de localisation",
    },
    {
      title: "Kiosques en activité",
      oneCompartment: kioskCounts.oneCompartment.AVAILABLE,
      threeCompartment: kioskCounts.threeCompartment.AVAILABLE,
      total: kioskCounts.oneCompartment.AVAILABLE + kioskCounts.threeCompartment.AVAILABLE,
      period: "actuellement",
      description: "Kiosques disponibles et actifs",
    },
    {
      title: "Kiosques en maintenance",
      oneCompartment: kioskCounts.oneCompartment.UNDER_MAINTENANCE,
      threeCompartment: kioskCounts.threeCompartment.UNDER_MAINTENANCE,
      total: kioskCounts.oneCompartment.UNDER_MAINTENANCE + kioskCounts.threeCompartment.UNDER_MAINTENANCE,
      period: "actuellement",
      description: "Kiosques en maintenance",
    },
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#ff6b4a] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Chargement de vos statistiques...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-[#ff6b4a] hover:underline"
        >
          Réessayer
        </button>
      </div>
    )
  }

  const hasNoKiosks = metrics.every((metric) => metric.total === 0)

  if (hasNoKiosks) {
    return (
      <div className="grid md:grid-cols-1 gap-4">
        <Card className={`shadow-md ${styles.carte} col-span-3`}>
          <CardContent className="flex flex-col items-center justify-center h-64 text-center p-6">
            <div className="mb-4">
              <div className="w-20 h-20 bg-[#ff6b4a]/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-[#ff6b4a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
            <CardTitle className="text-xl font-bold mb-4">Bienvenue sur Kiosk Online</CardTitle>
            <p className="text-gray-600 max-w-md">
              Vous n'avez pas de kiosque pour le moment. Veuillez faire une requête et nos techniciens seront
              avec vous dans peu de temps.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="">
      <div className="grid md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <Card className={`shadow-md ${styles.carte}`} key={index}>
            <CardHeader className={`flex flex-col space-y-2 pb-2 shadow-md ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className="flex justify-between items-center pt-2">
                {/* MONO Kiosks (1 compartment) */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-blue-50 rounded-full px-3 py-1.5">
                    <div className="inline-block">
                      <OneKioskSVG />
                    </div>
                    <div className="ml-2">
                      <div className="text-xs text-gray-500">MONO</div>
                      <div className="text-xl font-bold text-gray-700">{metric.oneCompartment}</div>
                    </div>
                  </div>
                </div>
                
                {/* GRAND Kiosks (3 compartments) */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-purple-50 rounded-full px-3 py-1.5">
                    <div className="inline-block">
                      <ThreeKioskSVG />
                    </div>
                    <div className="ml-2">
                      <div className="text-xs text-gray-500">GRAND</div>
                      <div className="text-xl font-bold text-gray-700">{metric.threeCompartment}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  <span className="font-bold text-lg text-[#ff6b4a]">{metric.total}</span> {metric.period}
                </p>
                <p className="text-xs text-gray-400">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}