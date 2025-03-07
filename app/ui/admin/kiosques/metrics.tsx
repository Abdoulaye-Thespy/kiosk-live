"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import styles from "@/app/ui/dashboard.module.css"
import ThreeKioskSVG from "../../svg/threekiosks"
import OneKioskSVG from "../../svg/onekiosks"
import { getKioskCounts } from "@/app/actions/kiosk-actions"

export default function KioskMetrics() {
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

  useEffect(() => {
    async function fetchKioskCounts() {
      const counts = await getKioskCounts()
      setKioskCounts(counts)
    }
    fetchKioskCounts()
  }, [])

  const metrics = [
    {
      title: "Nouveaux kiosques",
      oneCompartment: kioskCounts.oneCompartment.REQUEST,
      threeCompartment: kioskCounts.threeCompartment.REQUEST,
      total: kioskCounts.oneCompartment.REQUEST + kioskCounts.threeCompartment.REQUEST,
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
    {
      title: "En Localisation",
      oneCompartment: kioskCounts.oneCompartment.LOCALIZING,
      threeCompartment: kioskCounts.threeCompartment.LOCALIZING,
      total: kioskCounts.oneCompartment.LOCALIZING + kioskCounts.threeCompartment.LOCALIZING,
      period: "actuellement",
    },
  ]

  return (
    <div className="">
      <div className="grid md:grid-cols-2 gap-4">
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

