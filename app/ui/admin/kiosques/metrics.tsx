"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import styles from "@/app/ui/dashboard.module.css"
import ThreeKioskSVG from "../../svg/threekiosks"
import OneKioskSVG from "../../svg/onekiosks"
import { getKioskCounts } from "@/app/actions/kiosk-actions"

export default function KioskMetrics() {
  const [kioskCounts, setKioskCounts] = useState({
    totalKiosks: 0,
    all: {
      oneCompartment: {
        REQUEST: 0,
        IN_STOCK: 0,
        ACTIVE: 0,
        UNACTIVE: 0,
        ACTIVE_UNDER_MAINTENANCE: 0,
        UNACTIVE_UNDER_MAINTENANCE: 0,
      },
      threeCompartment: {
        REQUEST: 0,
        IN_STOCK: 0,
        ACTIVE: 0,
        UNACTIVE: 0,
        ACTIVE_UNDER_MAINTENANCE: 0,
        UNACTIVE_UNDER_MAINTENANCE: 0,
      },
    },
    towns: {
      DOUALA: {
        oneCompartment: {
          REQUEST: 0,
          IN_STOCK: 0,
          ACTIVE: 0,
          UNACTIVE: 0,
          ACTIVE_UNDER_MAINTENANCE: 0,
          UNACTIVE_UNDER_MAINTENANCE: 0,
        },
        threeCompartment: {
          REQUEST: 0,
          IN_STOCK: 0,
          ACTIVE: 0,
          UNACTIVE: 0,
          ACTIVE_UNDER_MAINTENANCE: 0,
          UNACTIVE_UNDER_MAINTENANCE: 0,
        },
      },
      YAOUNDE: {
        oneCompartment: {
          REQUEST: 0,
          IN_STOCK: 0,
          ACTIVE: 0,
          UNACTIVE: 0,
          ACTIVE_UNDER_MAINTENANCE: 0,
          UNACTIVE_UNDER_MAINTENANCE: 0,
        },
        threeCompartment: {
          REQUEST: 0,
          IN_STOCK: 0,
          ACTIVE: 0,
          UNACTIVE: 0,
          ACTIVE_UNDER_MAINTENANCE: 0,
          UNACTIVE_UNDER_MAINTENANCE: 0,
        },
      },
    },
  })

  useEffect(() => {
    async function fetchKioskCounts() {
      const counts = await getKioskCounts()
      setKioskCounts(counts)
    }
    fetchKioskCounts()
  }, [])

  // Function to generate metrics for a specific location
  const generateMetrics = (location) => {
    const data = location === "all" ? kioskCounts.all : kioskCounts.towns[location]

    if (!data) return []

    return [
      {
        title: "Nouvelles Demandes De Kiosque",
        oneCompartment: data.oneCompartment.REQUEST,
        threeCompartment: data.threeCompartment.REQUEST,
        total: data.oneCompartment.REQUEST + data.threeCompartment.REQUEST,
        period: "actuellement",
      },
      {
        title: "Kiosques en Stock",
        oneCompartment: data.oneCompartment.IN_STOCK,
        threeCompartment: data.threeCompartment.IN_STOCK,
        total: data.oneCompartment.IN_STOCK + data.threeCompartment.IN_STOCK,
        period: "actuellement",
      },
      {
        title: "Kiosques Actifs",
        oneCompartment: data.oneCompartment.ACTIVE,
        threeCompartment: data.threeCompartment.ACTIVE,
        total: data.oneCompartment.ACTIVE + data.threeCompartment.ACTIVE,
        period: "actuellement",
      },
      {
        title: "Kiosques Inactifs",
        oneCompartment: data.oneCompartment.UNACTIVE,
        threeCompartment: data.threeCompartment.UNACTIVE,
        total: data.oneCompartment.UNACTIVE + data.threeCompartment.UNACTIVE,
        period: "actuellement",
      },
      {
        title: "Kiosques Actifs en Maintenance",
        oneCompartment: data.oneCompartment.ACTIVE_UNDER_MAINTENANCE,
        threeCompartment: data.threeCompartment.ACTIVE_UNDER_MAINTENANCE,
        total: data.oneCompartment.ACTIVE_UNDER_MAINTENANCE + data.threeCompartment.ACTIVE_UNDER_MAINTENANCE,
        period: "actuellement",
      },
      {
        title: "Kiosques Inactifs en Maintenance",
        oneCompartment: data.oneCompartment.UNACTIVE_UNDER_MAINTENANCE,
        threeCompartment: data.threeCompartment.UNACTIVE_UNDER_MAINTENANCE,
        total: data.oneCompartment.UNACTIVE_UNDER_MAINTENANCE + data.threeCompartment.UNACTIVE_UNDER_MAINTENANCE,
        period: "actuellement",
      },
    ]
  }

  // Render metrics cards for a specific location
  const renderMetricsCards = (metrics) => {
    return (
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
    )
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Tous les Kiosques</TabsTrigger>
          <TabsTrigger value="DOUALA">Douala</TabsTrigger>
          <TabsTrigger value="YAOUNDE">Yaoundé</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          {renderMetricsCards(generateMetrics("all"))}
        </TabsContent>

        <TabsContent value="DOUALA" className="mt-4">
          {renderMetricsCards(generateMetrics("DOUALA"))}
        </TabsContent>

        <TabsContent value="YAOUNDE" className="mt-4">
          {renderMetricsCards(generateMetrics("YAOUNDE"))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
