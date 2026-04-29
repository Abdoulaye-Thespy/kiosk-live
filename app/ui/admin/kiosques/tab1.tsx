"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ShoppingCart, LayoutGrid, Warehouse, TrendingUp, Building2 } from "lucide-react"
import { getKioskCounts } from "@/app/actions/kiosk-actions"
import ThreeKioskSVG from "../../svg/threekiosks"
import OneKioskSVG from "../../svg/onekiosks"

interface KioskTab1Props {
  kiosks?: any[]
  totalPages?: number
  currentPage?: number
  searchTerm?: string
  filterStatus?: string
  filterDate?: Date | undefined
  onSearch?: (term: string) => void
  onFilterStatus?: (status: string) => void
  onFilterDate?: (date: Date | undefined) => void
  onPageChange?: (page: number) => void
  onKioskUpdate?: (kiosk: any) => void
  onKioskDelete?: (kioskId: number) => void
  onRefresh?: () => void
}

export default function KioskTab1({
  kiosks,
  totalPages,
  currentPage,
  searchTerm,
  filterStatus,
  filterDate,
  onSearch,
  onFilterStatus,
  onFilterDate,
  onPageChange,
  onKioskUpdate,
  onKioskDelete,
  onRefresh,
}: KioskTab1Props) {
  const [stats, setStats] = useState({
    totalKiosks: 0,
    totalCompartments: 0,
    monoKiosks: 0,
    grandKiosks: 0,
    monoInStock: 0,
    grandInStock: 0,
    monoDeployed: 0,
    grandDeployed: 0,
    freeCompartments: 0,
    occupiedCompartments: 0,
    compartmentsUnderMaintenance: 0,
    monoOccupied: 0,
    grandOccupiedCompartments: 0,
    grandFreeCompartments: 0,
    grandCompartmentsTotal: 0,
    kiosksAddedThisMonth: 0,
    percentageAddedThisMonth: 0,
  })

  const [doualaStats, setDoualaStats] = useState({
    totalKiosks: 0,
    monoKiosks: 0,
    grandKiosks: 0,
    monoInStock: 0,
    grandInStock: 0,
    monoDeployed: 0,
    grandDeployed: 0,
    freeCompartments: 0,
    occupiedCompartments: 0,
    compartmentsUnderMaintenance: 0,
    monoOccupied: 0,
    grandOccupiedCompartments: 0,
    grandFreeCompartments: 0,
    totalCompartments: 0,
  })

  const [yaoundeStats, setYaoundeStats] = useState({
    totalKiosks: 0,
    monoKiosks: 0,
    grandKiosks: 0,
    monoInStock: 0,
    grandInStock: 0,
    monoDeployed: 0,
    grandDeployed: 0,
    freeCompartments: 0,
    occupiedCompartments: 0,
    compartmentsUnderMaintenance: 0,
    monoOccupied: 0,
    grandOccupiedCompartments: 0,
    grandFreeCompartments: 0,
    totalCompartments: 0,
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      setLoading(true)
      try {
        const result = await getKioskCounts()
        
        if (result) {
          // Overall stats
          setStats({
            totalKiosks: result.totalKiosks || 0,
            totalCompartments: (result.kiosks?.MONO?.totalKiosks || 0) + ((result.kiosks?.GRAND?.totalKiosks || 0) * 3),
            monoKiosks: result.kiosks?.MONO?.totalKiosks || 0,
            grandKiosks: result.kiosks?.GRAND?.totalKiosks || 0,
            monoInStock: (result.kiosks?.MONO?.IN_STOCK || 0) + (result.kiosks?.MONO?.AVAILABLE || 0),
            grandInStock: (result.kiosks?.GRAND?.IN_STOCK || 0) + (result.kiosks?.GRAND?.AVAILABLE || 0),
            monoDeployed: (result.kiosks?.MONO?.ACTIVE || 0) + (result.kiosks?.MONO?.ACTIVE_UNDER_MAINTENANCE || 0),
            grandDeployed: (result.kiosks?.GRAND?.ACTIVE || 0) + (result.kiosks?.GRAND?.ACTIVE_UNDER_MAINTENANCE || 0),
            freeCompartments: result.compartments?.AVAILABLE || 0,
            occupiedCompartments: result.compartments?.OCCUPIED || 0,
            compartmentsUnderMaintenance: result.compartments?.UNDER_MAINTENANCE || 0,
            monoOccupied: result.kiosks?.MONO?.ACTIVE || 0,
            grandOccupiedCompartments: result.compartments?.OCCUPIED || 0,
            grandFreeCompartments: result.compartments?.AVAILABLE || 0,
            grandCompartmentsTotal: (result.kiosks?.GRAND?.totalKiosks || 0) * 3,
            kiosksAddedThisMonth: result.kiosksAddedThisMonth || 0,
            percentageAddedThisMonth: result.percentageAddedThisMonth || 0,
          })

          // Douala stats
          setDoualaStats({
            totalKiosks: result.towns?.DOUALA?.MONO?.total + result.towns?.DOUALA?.GRAND?.total || 0,
            monoKiosks: result.towns?.DOUALA?.MONO?.total || 0,
            grandKiosks: result.towns?.DOUALA?.GRAND?.total || 0,
            monoInStock: result.towns?.DOUALA?.MONO?.available || 0,
            grandInStock: result.towns?.DOUALA?.GRAND?.available || 0,
            monoDeployed: result.kiosks?.MONO?.ACTIVE || 0,
            grandDeployed: result.kiosks?.GRAND?.ACTIVE || 0,
            freeCompartments: 0,
            occupiedCompartments: 0,
            compartmentsUnderMaintenance: 0,
            monoOccupied: 0,
            grandOccupiedCompartments: 0,
            grandFreeCompartments: 0,
            totalCompartments: 0,
          })

          // Yaounde stats
          setYaoundeStats({
            totalKiosks: result.towns?.YAOUNDE?.MONO?.total + result.towns?.YAOUNDE?.GRAND?.total || 0,
            monoKiosks: result.towns?.YAOUNDE?.MONO?.total || 0,
            grandKiosks: result.towns?.YAOUNDE?.GRAND?.total || 0,
            monoInStock: result.towns?.YAOUNDE?.MONO?.available || 0,
            grandInStock: result.towns?.YAOUNDE?.GRAND?.available || 0,
            monoDeployed: 0,
            grandDeployed: 0,
            freeCompartments: 0,
            occupiedCompartments: 0,
            compartmentsUnderMaintenance: 0,
            monoOccupied: 0,
            grandOccupiedCompartments: 0,
            grandFreeCompartments: 0,
            totalCompartments: 0,
          })
        }
      } catch (error) {
        console.error("Error loading kiosk metrics:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#ff6b4a] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Chargement des métriques...</p>
        </div>
      </div>
    )
  }

  // Card component for reusability
  const MetricCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )

  // Overall metrics row
  const OverallMetrics = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard title="Total Kiosques">
        <div className="text-3xl font-bold mt-2 text-orange-600">{stats.totalKiosks}</div>
        <div className="flex items-center justify-between text-sm mt-2">
          <div className="flex items-center gap-2">
            <OneKioskSVG />
            <span>MONO: <strong>{stats.monoKiosks}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <ThreeKioskSVG />
            <span>GRAND: <strong>{stats.grandKiosks}</strong></span>
          </div>
        </div>
      </MetricCard>

      <MetricCard title="En Stock">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <OneKioskSVG />
              <span className="text-sm">MONO</span>
            </div>
            <span className="text-xl font-bold text-blue-600">{stats.monoInStock}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ThreeKioskSVG />
              <span className="text-sm">GRAND</span>
            </div>
            <span className="text-xl font-bold text-purple-600">{stats.grandInStock}</span>
          </div>
        </div>
        <div className="flex items-center text-medium text-gray-600 mt-2">
          <Warehouse className="h-4 w-4 mr-2" />
          <span>Disponibles</span>
        </div>
      </MetricCard>

      <MetricCard title="Déployés">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <OneKioskSVG />
              <span className="text-sm">MONO</span>
            </div>
            <span className="text-xl font-bold text-green-600">{stats.monoDeployed}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ThreeKioskSVG />
              <span className="text-sm">GRAND</span>
            </div>
            <span className="text-xl font-bold text-green-600">{stats.grandDeployed}</span>
          </div>
        </div>
        <div className="flex items-center text-medium text-gray-600 mt-2">
          <TrendingUp className="h-4 w-4 mr-2" />
          <span>Actifs</span>
        </div>
      </MetricCard>

      <MetricCard title="Compartiments">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Occupés</span>
            <span className="text-xl font-bold text-blue-600">{stats.occupiedCompartments}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Libres</span>
            <span className="text-xl font-bold text-green-600">{stats.freeCompartments}</span>
          </div>
        </div>
        <div className="flex items-center text-medium text-gray-600 mt-2">
          <LayoutGrid className="h-4 w-4 mr-2" />
          <span>Total: {stats.totalCompartments}</span>
        </div>
      </MetricCard>
    </div>
  )

  // Town metrics row (4 columns like admin dashboard)
  const TownMetrics = ({ town, data, iconColor }: { town: string; data: typeof doualaStats; iconColor: string }) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard title={`Total Kiosques - ${town}`}>
        <div className="text-3xl font-bold mt-2 text-orange-600">{data.totalKiosks}</div>
        <div className="flex items-center justify-between text-sm mt-2">
          <div className="flex items-center gap-2">
            <OneKioskSVG />
            <span>MONO: <strong>{data.monoKiosks}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <ThreeKioskSVG />
            <span>GRAND: <strong>{data.grandKiosks}</strong></span>
          </div>
        </div>
      </MetricCard>

      <MetricCard title={`En Stock - ${town}`}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <OneKioskSVG />
              <span className="text-sm">MONO</span>
            </div>
            <span className="text-xl font-bold text-blue-600">{data.monoInStock}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ThreeKioskSVG />
              <span className="text-sm">GRAND</span>
            </div>
            <span className="text-xl font-bold text-purple-600">{data.grandInStock}</span>
          </div>
        </div>
        <div className="flex items-center text-medium text-gray-600 mt-2">
          <Warehouse className="h-4 w-4 mr-2" />
          <span>Disponibles</span>
        </div>
      </MetricCard>

      <MetricCard title={`Déployés - ${town}`}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <OneKioskSVG />
              <span className="text-sm">MONO</span>
            </div>
            <span className="text-xl font-bold text-green-600">{data.monoDeployed}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ThreeKioskSVG />
              <span className="text-sm">GRAND</span>
            </div>
            <span className="text-xl font-bold text-green-600">{data.grandDeployed}</span>
          </div>
        </div>
        <div className="flex items-center text-medium text-gray-600 mt-2">
          <TrendingUp className="h-4 w-4 mr-2" />
          <span>Actifs</span>
        </div>
      </MetricCard>

      <MetricCard title={`Compartiments - ${town}`}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Occupés</span>
            <span className="text-xl font-bold text-blue-600">{data.occupiedCompartments}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Libres</span>
            <span className="text-xl font-bold text-green-600">{data.freeCompartments}</span>
          </div>
        </div>
        <div className="flex items-center text-medium text-gray-600 mt-2">
          <LayoutGrid className="h-4 w-4 mr-2" />
          <span>Total: {data.totalCompartments}</span>
        </div>
      </MetricCard>
    </div>
  )

  return (
    <div className="space-y-6 p-6">
      {/* Overall Metrics Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-orange-600" />
          Vue d'ensemble
        </h2>
        <OverallMetrics />
      </div>

      {/* Douala Metrics Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          Douala
        </h2>
        <TownMetrics town="Douala" data={doualaStats} iconColor="text-blue-600" />
      </div>

      {/* Yaoundé Metrics Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-green-600" />
          Yaoundé
        </h2>
        <TownMetrics town="Yaoundé" data={yaoundeStats} iconColor="text-green-600" />
      </div>
    </div>
  )
}