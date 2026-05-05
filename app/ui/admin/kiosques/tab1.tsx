"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  LayoutGrid, 
  Warehouse, 
  TrendingUp, 
  Building2, 
  MapPin, 
  Globe, 
  BarChart3, 
  Package, 
  Wrench,
  CheckCircle,
  Boxes
} from "lucide-react"
import ThreeKioskSVG from "../../svg/threekiosks"
import OneKioskSVG from "../../svg/onekiosks"

// Interface pour les données formatées du serveur
interface DashboardData {
  totalKiosks: number
  kiosksAddedThisMonth: number
  percentageAddedThisMonth: number
  mono: {
    total: number
    inStock: number
    deployed: number
    occupied: number
    free: number
    underMaintenance: number
  }
  grand: {
    total: number
    inStock: number
    deployed: number
  }
  compartments: {
    total: number
    occupied: number
    free: number
    underMaintenance: number
  }
  totals: {
    totalCompartments: number
  }
  towns: {
    DOUALA: {
      MONO: { total: number; available: number; occupied: number; underMaintenance: number; instock: number }
      GRAND: { 
        total: number
        available: number
        occupied: number
        underMaintenance: number
        instock: number
        compartments: {
          available: number
          occupied: number
          underMaintenance: number
          total: number
        }
      }
    }
    YAOUNDE: {
      MONO: { total: number; available: number; occupied: number; underMaintenance: number; instock: number }
      GRAND: { 
        total: number
        available: number
        occupied: number
        underMaintenance: number
        instock: number
        compartments: {
          available: number
          occupied: number
          underMaintenance: number
          total: number
        }
      }
    }
  }
}

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
  metricsData?: DashboardData | null
  metricsLoading?: boolean
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
  metricsData,
  metricsLoading,
}: KioskTab1Props) {

  if (metricsLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#ff6b4a] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Chargement des métriques...</p>
        </div>
      </div>
    )
  }

  if (!metricsData) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-600">Erreur de chargement des données</p>
          <button 
            onClick={onRefresh}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  const MetricCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white rounded-t-lg">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">{children}</CardContent>
    </Card>
  )

  const OverallMetrics = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Carte 1: Total Kiosques */}
      <MetricCard title="Total Kiosques">
        <div className="text-3xl font-bold mt-2 text-orange-600">{metricsData.totalKiosks}</div>
        <div className="flex items-center justify-between text-sm mt-2">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-50">
            <OneKioskSVG />
            <span>MONO: <strong className="text-orange-600">{metricsData.mono.total}</strong></span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-50">
            <ThreeKioskSVG />
            <span>GRAND: <strong className="text-purple-600">{metricsData.grand.total}</strong></span>
          </div>
        </div>
      </MetricCard>


      {/* Carte 3: Kiosques MONO */}
      <MetricCard title="Kiosques MONO">
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-green-50">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Occupés</span>
            </div>
            <span className="text-xl font-bold text-green-600">{metricsData.mono.occupied}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Libres</span>
            </div>
            <span className="text-xl font-bold text-blue-600">{metricsData.mono.free}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-50">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">En maintenance</span>
            </div>
            <span className="text-xl font-bold text-yellow-600">{metricsData.mono.underMaintenance}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50">
            <div className="flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-purple-500" />
              <span className="text-sm">En stock</span>
            </div>
            <span className="text-xl font-bold text-purple-600">{metricsData.mono.inStock}</span>
          </div>
        </div>
        <div className="flex items-center text-medium text-gray-600 mt-3 pt-2 border-t">
          <OneKioskSVG />
          <span>Total: <strong>{metricsData.mono.total}</strong> kiosques</span>
        </div>
      </MetricCard>

      {/* Carte 4: Compartiments GRAND */}
      <MetricCard title="Compartiments GRAND">
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-green-50">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Occupés</span>
            </div>
            <span className="text-xl font-bold text-green-600">{metricsData.compartments.occupied}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Libres</span>
            </div>
            <span className="text-xl font-bold text-blue-600">{metricsData.compartments.free}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-50">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">En maintenance</span>
            </div>
            <span className="text-xl font-bold text-yellow-600">{metricsData.compartments.underMaintenance}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50">
            <div className="flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-purple-500" />
              <span className="text-sm">En stock (kiosques GRAND)</span>
            </div>
            <span className="text-xl font-bold text-purple-600">{metricsData.grand.inStock}</span>
          </div>
        </div>
        <div className="flex items-center text-medium text-gray-600 mt-3 pt-2 border-t">
          <ThreeKioskSVG />
          <span>Total: <strong>{metricsData.compartments.total}</strong> compartiments</span>
        </div>
      </MetricCard>
    </div>
  )

  // Mono metrics row (pour Douala et Yaoundé)
  const MonoMetrics = ({ town, data }: { town: string; data: { total: number; available: number; occupied: number; underMaintenance: number; instock: number } }) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard title={`Total Kiosques MONO - ${town}`}>
        <div className="text-3xl font-bold mt-2 text-orange-600">{data.total}</div>
        <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-orange-50">
          <OneKioskSVG />
          <span>Kiosques à 1 compartiment</span>
        </div>
      </MetricCard>

      <MetricCard title={`État des Kiosques MONO - ${town}`}>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-green-50">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Occupés (client)</span>
            </div>
            <span className="text-xl font-bold text-green-600">{data.occupied}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Libres (disponibles)</span>
            </div>
            <span className="text-xl font-bold text-blue-600">{data.available}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-50">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">En maintenance</span>
            </div>
            <span className="text-xl font-bold text-yellow-600">{data.underMaintenance}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50">
            <div className="flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-purple-500" />
              <span className="text-sm">En stock</span>
            </div>
            <span className="text-xl font-bold text-purple-600">{data.instock}</span>
          </div>
        </div>
      </MetricCard>

      <MetricCard title={`Stock & Déploiement - ${town}`}>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50">
            <div className="flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-purple-500" />
              <span className="text-sm">En stock</span>
            </div>
            <span className="text-xl font-bold text-purple-600">{data.instock}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-green-50">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm">Déployés</span>
            </div>
            <span className="text-xl font-bold text-green-600">{data.occupied}</span>
          </div>
        </div>
        <div className="flex items-center text-medium text-gray-600 mt-3 pt-2 border-t">
          <Building2 className="h-4 w-4 mr-2 text-orange-500" />
          <span>Kiosques MONO</span>
        </div>
      </MetricCard>
    </div>
  )

  // Grand compartments metrics row (pour Douala et Yaoundé)
  const GrandCompartmentsMetrics = ({ town, data }: { town: string; data: { 
    total: number
    available: number
    occupied: number
    underMaintenance: number
    instock: number
    compartments: {
      available: number
      occupied: number
      underMaintenance: number
      total: number
    }
  } }) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <MetricCard title={`Total Compartiments GRAND - ${town}`}>
        <div className="text-3xl font-bold mt-2 text-purple-600">{data.compartments.total}</div>
        <div className="flex items-center gap-2 mt-2 p-2 rounded-lg bg-purple-50">
          <ThreeKioskSVG />
          <span>{data.total} kiosques GRAND</span>
        </div>
      </MetricCard>

      <MetricCard title={`État des Compartiments - ${town}`}>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-green-50">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Occupés (client)</span>
            </div>
            <span className="text-xl font-bold text-green-600">{data.compartments.occupied}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Libres (disponibles)</span>
            </div>
            <span className="text-xl font-bold text-blue-600">{data.compartments.available}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-50">
            <div className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">En maintenance</span>
            </div>
            <span className="text-xl font-bold text-yellow-600">{data.compartments.underMaintenance}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50">
            <div className="flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Kiosques GRAND en stock</span>
            </div>
            <span className="text-xl font-bold text-purple-600">{data.instock}</span>
          </div>
        </div>
      </MetricCard>

      <MetricCard title={`Stock & Déploiement - ${town}`}>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 rounded-lg bg-purple-50">
            <div className="flex items-center gap-2">
              <Warehouse className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Kiosques en stock</span>
            </div>
            <span className="text-xl font-bold text-purple-600">{data.instock}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-green-50">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm">Kiosques déployés</span>
            </div>
            <span className="text-xl font-bold text-green-600">{data.occupied}</span>
          </div>
        </div>
        <div className="flex items-center text-medium text-gray-600 mt-3 pt-2 border-t">
          <Building2 className="h-4 w-4 mr-2 text-purple-500" />
          <span>Kiosques GRAND</span>
        </div>
      </MetricCard>
    </div>
  )

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8 bg-gradient-to-r from-gray-100 to-gray-200 p-1 rounded-lg">
        <TabsTrigger 
          value="overview" 
          className="data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-md transition-all duration-300 flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          Vue d'ensemble
        </TabsTrigger>
        <TabsTrigger 
          value="douala" 
          className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md transition-all duration-300 flex items-center gap-2"
        >
          <MapPin className="h-4 w-4" />
          Douala
        </TabsTrigger>
        <TabsTrigger 
          value="yaounde" 
          className="data-[state=active]:bg-white data-[state=active]:text-green-600 data-[state=active]:shadow-md transition-all duration-300 flex items-center gap-2"
        >
          <MapPin className="h-4 w-4" />
          Yaoundé
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-orange-500 to-orange-300 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Globe className="h-5 w-5 text-orange-600" />
              Statistiques Globales
            </h2>
          </div>
          <OverallMetrics />
        </div>

        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600 text-center">
            📊 Kiosques MONO : occupation client | Kiosques GRAND : occupation par compartiment
          </p>
        </div>
      </TabsContent>

      <TabsContent value="douala" className="mt-6 space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-300 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <OneKioskSVG />
              Douala - Kiosques MONO
            </h2>
          </div>
          <MonoMetrics town="Douala" data={metricsData.towns.DOUALA.MONO} />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6 mt-8">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-purple-300 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <ThreeKioskSVG />
              Douala - Compartiments GRAND
            </h2>
          </div>
          <GrandCompartmentsMetrics town="Douala" data={metricsData.towns.DOUALA.GRAND} />
        </div>
      </TabsContent>

      <TabsContent value="yaounde" className="mt-6 space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-green-300 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <OneKioskSVG />
              Yaoundé - Kiosques MONO
            </h2>
          </div>
          <MonoMetrics town="Yaoundé" data={metricsData.towns.YAOUNDE.MONO} />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6 mt-8">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-purple-300 rounded-full"></div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <ThreeKioskSVG />
              Yaoundé - Compartiments GRAND
            </h2>
          </div>
          <GrandCompartmentsMetrics town="Yaoundé" data={metricsData.towns.YAOUNDE.GRAND} />
        </div>
      </TabsContent>
    </Tabs>
  )
}