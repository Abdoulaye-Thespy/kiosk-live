"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import styles from "@/app/ui/dashboard.module.css"
import ThreeKioskSVG from "../../svg/threekiosks"
import OneKioskSVG from "../../svg/onekiosks"
import { getUserKioskCounts } from "@/app/actions/kiosk-actions"

export default function KioskMetrics() {
  const { data: session, status } = useSession()
  const [kioskCounts, setKioskCounts] = useState({
    totalKiosks: 0,
    oneCompartment: {
      AVAILABLE: 0,
      UNDER_MAINTENANCE: 0,
      REQUEST: 0,
      LOCALIZING: 0,
    },
    threeCompartment: {
      AVAILABLE: 0,
      UNDER_MAINTENANCE: 0,
      REQUEST: 0,
      LOCALIZING: 0,
    },
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserKioskCounts() {
      if (status === "authenticated" && session?.user?.id) {
        try {
          setIsLoading(true)
          console.log(session.user.id)
          const counts = await getUserKioskCounts(session.user.id)
          setKioskCounts(counts)
          setError(null)
        } catch (err) {
          console.error("Error fetching user kiosk counts:", err)
          setError("Une erreur est survenue lors du chargement des données des kiosques.")
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchUserKioskCounts()
  }, [status, session])

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
    },
    {
      title: "Kiosques en activité",
      oneCompartment: kioskCounts.oneCompartment.AVAILABLE,
      threeCompartment: kioskCounts.threeCompartment.AVAILABLE,
      total: kioskCounts.oneCompartment.AVAILABLE + kioskCounts.threeCompartment.AVAILABLE,
      period: "actuellement",
    },
    {
      title: "Kiosques en maintenance",
      oneCompartment: kioskCounts.oneCompartment.UNDER_MAINTENANCE,
      threeCompartment: kioskCounts.threeCompartment.UNDER_MAINTENANCE,
      total: kioskCounts.oneCompartment.UNDER_MAINTENANCE + kioskCounts.threeCompartment.UNDER_MAINTENANCE,
      period: "actuellement",
    },
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>
  }

  const hasNoKiosks = metrics.every((metric) => metric.total === 0)

  if (hasNoKiosks) {
    return (
      <div className="grid md:grid-cols-1 gap-4">
        <Card className={`shadow-md ${styles.carte} col-span-3`}>
          <CardContent className="flex flex-col items-center justify-center h-64 text-center p-6">
            <CardTitle className="text-xl font-bold mb-4">Bienvenue sur Kiok Online par Accent Media</CardTitle>
            <p className="text-gray-600">
              Vous n'avez pas de kiosque pour le moment. S'il vous plaît, faites une requête et nos techniciens seront
              avec vous dans peu de temps. Merci.
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
            <CardHeader className={`flex flex-column space-y-0 pb-2 shadow-md ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className="flex gap-5 pt-2">
                <div className="flex items-baseline space-x-3">
                  <div className="flex items-center bg-gray-500 rounded-full bg-opacity-15 px-2 py-0.5">
                    <div className="inline-block text-xs font-medium text-grey-500 flex items-center">
                      <ThreeKioskSVG />
                    </div>
                    <div className="ml-2 text-xl font-bold text-grey-500">{metric.threeCompartment}</div>
                  </div>
                </div>
                <div className="flex items-baseline space-x-3">
                  <div className="flex items-center bg-gray-500 rounded-full bg-opacity-15 px-2 py-0.5">
                    <div className="inline-block text-xs font-medium text-grey-500 flex items-center">
                      <OneKioskSVG />
                    </div>
                    <div className="ml-2 text-xl font-bold text-grey-500">{metric.oneCompartment}</div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-medium">
                <p>
                  <span className="font-bold">{metric.total}</span> {metric.period}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

