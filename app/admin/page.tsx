"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { ArrowDownTrayIcon, ArrowUpCircleIcon } from "@heroicons/react/24/solid"
import { 
  RefreshCw, 
  FileText, 
  Building2, 
  Loader2, 
  ShoppingCart, 
  Users, 
  LayoutGrid, 
  Warehouse,
  Briefcase,
  UserCircle,
  TrendingUp,
  ClipboardList,
  Mail
} from "lucide-react"

import styles from "@/app/ui/dashboard.module.css"
import Header from "../ui/header"
import { fetchUserStats } from "../actions/fetchUserStats"
import { getKioskCounts, getAllKioskRequests } from "@/app/actions/kiosk-actions"
import OneKioskSVG from "../ui/svg/onekiosks"
import ThreeKioskSVG from "../ui/svg/threekiosks"

interface KioskRequest {
  id: string
  requestNumber: string
  status: string
  requestedKioskType: string
  requestedCompartments: any
  wantBranding: boolean
  kioskAddress: string
  createdAt: string
  clientName: string
  clientEmail: string
}

export default function AdminDashboard() {
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    staffCount: 0,
    clientCount: 0,
    particulierCount: 0,
    entrepriseCount: 0,
    usersThisMonth: 0,
    percentageGrowth: 0,
    lastNineUsers: [] as any[],
  })
  const [kioskStats, setKioskStats] = useState({
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
    totalCompartments: 0,
    monoOccupied: 0,
    grandOccupiedCompartments: 0,
    grandFreeCompartments: 0,
    grandCompartmentsTotal: 0,
    kiosksAddedThisMonth: 0,
    percentageAddedThisMonth: 0,
  })
  const [requestStats, setRequestStats] = useState({
    monoRequests: 0,
    grandRequests: 0,
    totalRequests: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      setLoading(true)
      try {
        const [userResult, kioskCountsResult, requestsResult] = await Promise.all([
          fetchUserStats(), 
          getKioskCounts(),
          getAllKioskRequests({ status: "PENDING", limit: 1000 })
        ])

        if (userResult.success) {
          setUserStats({
            totalUsers: userResult.totalUsers,
            staffCount: userResult.staffCount,
            clientCount: userResult.clientCount,
            particulierCount: userResult.particulierCount || 0,
            entrepriseCount: userResult.entrepriseCount || 0,
            usersThisMonth: userResult.usersThisMonth || 0,
            percentageGrowth: userResult.percentageGrowth || 0,
            lastNineUsers: userResult.lastNineUsers || [],
          })
        }
        
        // Process request counts by type
        if (requestsResult && requestsResult.requests) {
          let monoCount = 0
          let grandCount = 0
          
          requestsResult.requests.forEach((request: KioskRequest) => {
            if (request.requestedKioskType === "MONO") {
              monoCount++
            } else if (request.requestedKioskType === "GRAND") {
              grandCount++
            }
          })
          
          setRequestStats({
            monoRequests: monoCount,
            grandRequests: grandCount,
            totalRequests: requestsResult.totalCount || requestsResult.requests.length,
          })
        }
        
        // Update kiosk stats with real data
        if (kioskCountsResult) {
          // Calculate deployed vs in stock
          const monoDeployed = (kioskCountsResult.kiosks?.MONO?.ACTIVE || 0) + 
                               (kioskCountsResult.kiosks?.MONO?.ACTIVE_UNDER_MAINTENANCE || 0)
          const grandDeployed = (kioskCountsResult.kiosks?.GRAND?.ACTIVE || 0) + 
                                (kioskCountsResult.kiosks?.GRAND?.ACTIVE_UNDER_MAINTENANCE || 0)
          
          const monoInStock = (kioskCountsResult.kiosks?.MONO?.IN_STOCK || 0) + 
                              (kioskCountsResult.kiosks?.MONO?.AVAILABLE || 0)
          const grandInStock = (kioskCountsResult.kiosks?.GRAND?.IN_STOCK || 0) + 
                               (kioskCountsResult.kiosks?.GRAND?.AVAILABLE || 0)
          
          // Calculate compartment stats for GRAND kiosks
          const grandCompartmentsTotal = (kioskCountsResult.kiosks?.GRAND?.totalKiosks || 0) * 3
          const grandOccupiedCompartments = kioskCountsResult.compartments?.OCCUPIED || 0
          const grandFreeCompartments = kioskCountsResult.compartments?.AVAILABLE || 0
          
          const totalCompartments = (kioskCountsResult.kiosks?.MONO?.totalKiosks || 0) + grandCompartmentsTotal
          
          // MONO kiosks count as 1 occupied if active
          const monoOccupied = (kioskCountsResult.kiosks?.MONO?.ACTIVE || 0)
          
          setKioskStats({
            totalKiosks: kioskCountsResult.totalKiosks || 0,
            monoKiosks: (kioskCountsResult.kiosks?.MONO?.totalKiosks || 0),
            grandKiosks: (kioskCountsResult.kiosks?.GRAND?.totalKiosks || 0),
            monoInStock: monoInStock,
            grandInStock: grandInStock,
            monoDeployed: monoDeployed,
            grandDeployed: grandDeployed,
            freeCompartments: kioskCountsResult.compartments?.AVAILABLE || 0,
            occupiedCompartments: kioskCountsResult.compartments?.OCCUPIED || 0,
            compartmentsUnderMaintenance: kioskCountsResult.compartments?.UNDER_MAINTENANCE || 0,
            totalCompartments: totalCompartments,
            monoOccupied: monoOccupied,
            grandOccupiedCompartments: grandOccupiedCompartments,
            grandFreeCompartments: grandFreeCompartments,
            grandCompartmentsTotal: grandCompartmentsTotal,
            kiosksAddedThisMonth: kioskCountsResult.kiosksAddedThisMonth || 0,
            percentageAddedThisMonth: kioskCountsResult.percentageAddedThisMonth || 0,
          })
        }
        
        setError(null)
      } catch (error) {
        console.error("Error loading stats:", error)
        setError("Une erreur est survenue lors du chargement des statistiques")
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  // If loading, show full page spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#ff6b4a] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6">
      <Header title="Tableau de Bord Administratif" />

      <div className="flex justify-end items-center">
        <div className="flex justify-around">
          <Button className={styles.refresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Select defaultValue="monthly">
            <SelectTrigger className="text-sm w-40 mr-5">
              <FileText className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tous les revenus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="select">Select</SelectItem>
              <SelectItem value="weekly">Hebdomadaire</SelectItem>
              <SelectItem value="monthly">Mensuels</SelectItem>
              <SelectItem value="yearly">Annuels</SelectItem>
            </SelectContent>
          </Select>

          <Button className={styles.add}>
            <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
      <hr />

      <div className="p-6">
        {/* First Row: Kiosk Overview (Total, Stock, Deployed) - 3 cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Total Kiosks Card */}
          <Card className={`shadow-md ${styles.carte}`}>
            <CardHeader className={`flex flex-col space-y-0 pb-2 shadow-md ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium">Total Kiosques</CardTitle>
              <div className="text-3xl font-bold mt-2 text-orange-600">{kioskStats.totalKiosks}</div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <OneKioskSVG />
                  <span>MONO: <strong>{kioskStats.monoKiosks}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <ThreeKioskSVG />
                  <span>GRAND: <strong>{kioskStats.grandKiosks}</strong></span>
                </div>
              </div>
              <div className="flex items-center text-medium text-gray-600 mt-2">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>+{kioskStats.kiosksAddedThisMonth} ce mois-ci ({kioskStats.percentageAddedThisMonth.toFixed(1)}%)</span>
              </div>
            </CardContent>
          </Card>

          {/* Kiosks in Stock Card */}
          <Card className={`shadow-md ${styles.carte}`}>
            <CardHeader className={`flex flex-col space-y-0 pb-2 shadow-md ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium">Kiosques en Stock</CardTitle>
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <OneKioskSVG />
                    <span className="text-sm">MONO</span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">{kioskStats.monoInStock}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ThreeKioskSVG />
                    <span className="text-sm">GRAND</span>
                  </div>
                  <span className="text-xl font-bold text-purple-600">{kioskStats.grandInStock}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-medium text-gray-600">
                <Warehouse className="h-4 w-4 mr-2" />
                <span>Disponibles en inventaire</span>
              </div>
            </CardContent>
          </Card>

          {/* Kiosks Deployed Card */}
          <Card className={`shadow-md ${styles.carte}`}>
            <CardHeader className={`flex flex-col space-y-0 pb-2 shadow-md ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium">Kiosques Déployés</CardTitle>
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <OneKioskSVG />
                    <span className="text-sm">MONO</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">{kioskStats.monoDeployed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ThreeKioskSVG />
                    <span className="text-sm">GRAND</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">{kioskStats.grandDeployed}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-medium text-gray-600">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>Actuellement en activité</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row: Compartments Status */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {/* MONO Kiosks */}
          <Card className={`shadow-md ${styles.carte}`}>
            <CardHeader className={`flex flex-column space-y-0 pb-2 shadow-md ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium">Kiosques MONO</CardTitle>
              <div className="flex items-baseline justify-between mt-2">
                <div className="flex items-center gap-2">
                  <OneKioskSVG />
                  <span className="text-sm">Occupés</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{kioskStats.monoOccupied}</span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <div className="flex items-center gap-2">
                  <OneKioskSVG />
                  <span className="text-sm">Libres</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{kioskStats.monoInStock}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-medium text-gray-600">
                <LayoutGrid className="h-4 w-4 mr-2" />
                <span>{kioskStats.monoKiosks} kiosques MONO au total</span>
              </div>
            </CardContent>
          </Card>

          {/* GRAND Kiosks - Complete Status */}
          <Card className={`shadow-md ${styles.carte}`}>
            <CardHeader className={`flex flex-column space-y-0 pb-2 shadow-md ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium">Kiosques GRAND</CardTitle>
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ThreeKioskSVG />
                    <span className="text-sm">Compartiments occupés</span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">{kioskStats.grandOccupiedCompartments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ThreeKioskSVG />
                    <span className="text-sm">Compartiments libres</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">{kioskStats.grandFreeCompartments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ThreeKioskSVG />
                    <span className="text-sm">En maintenance</span>
                  </div>
                  <span className="text-xl font-bold text-red-600">{kioskStats.compartmentsUnderMaintenance}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-medium text-gray-600">
                <LayoutGrid className="h-4 w-4 mr-2" />
                <span>{kioskStats.grandCompartmentsTotal} compartiments au total</span>
              </div>
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card className={`shadow-md ${styles.carte}`}>
            <CardHeader className={`flex flex-column space-y-0 pb-2 shadow-md ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium">Résumé des Compartiments</CardTitle>
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total compartiments</span>
                  <span className="text-xl font-bold text-orange-600">{kioskStats.totalCompartments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Taux d'occupation</span>
                  <span className="text-xl font-bold text-green-600">
                    {kioskStats.totalCompartments > 0 
                      ? Math.round((kioskStats.occupiedCompartments / kioskStats.totalCompartments) * 100) 
                      : 0}%
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-medium text-gray-600">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>Compartiments MONO + GRAND</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Third Row: User Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-4">
          {/* Staff Card */}
          <Card className={`shadow-md ${styles.carte}`}>
            <CardHeader className={`flex flex-column space-y-0 pb-2 shadow-md ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium">Staff</CardTitle>
              <div className="text-3xl font-bold mt-2 text-blue-600">{userStats.staffCount}</div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-medium text-gray-600">
                <Briefcase className="h-4 w-4 mr-2" />
                <span>Administrateurs et responsables</span>
              </div>
              {/* <div className="flex items-center text-medium text-gray-600 mt-2">
                <Users className="h-4 w-4 mr-2" />
                <span>Total utilisateurs: {userStats.totalUsers}</span>
              </div> */}
            </CardContent>
          </Card>

          {/* Clients Card with breakdown */}
          <Card className={`shadow-md ${styles.carte}`}>
            <CardHeader className={`flex flex-column space-y-0 pb-2 shadow-md ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium">Clients</CardTitle>
              <div className="text-3xl font-bold mt-2 text-green-600">{userStats.clientCount}</div>
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Particuliers</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">{userStats.particulierCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Entreprises</span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">{userStats.entrepriseCount}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* <div className="flex items-center text-medium text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>+{userStats.usersThisMonth} nouveaux ce mois-ci ({userStats.percentageGrowth.toFixed(1)}%)</span>
              </div> */}
            </CardContent>
          </Card>
        </div>

        {/* Fourth Row: Client Requests - Nouveaux clients */}
        <div className="grid gap-4 md:grid-cols-1 mt-4">
          <Card className="shadow-md border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100">
            <CardHeader className="bg-orange-100 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-orange-600" />
                  <CardTitle className="text-lg font-semibold text-orange-800">
                    Demandes de Nouveaux Clients
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-orange-600">
                    Total: <strong className="text-xl">{requestStats.totalRequests}</strong> demandes en attente
                  </span>
                </div>
              </div>
              <p className="text-sm text-orange-700 mt-1">
                Ces demandes sont des requêtes faites par de nouveaux clients souhaitant obtenir un kiosque.
                Elles ne représentent pas des kiosques existants.
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex justify-center mb-3">
                    <OneKioskSVG />
                  </div>
                  <div className="text-3xl font-bold text-orange-600">{requestStats.monoRequests}</div>
                  <p className="text-sm text-gray-600 mt-1">Demandes de kiosques MONO</p>
                  <p className="text-xs text-gray-400">(1 compartiment)</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="flex justify-center mb-3">
                    <ThreeKioskSVG />
                  </div>
                  <div className="text-3xl font-bold text-orange-600">{requestStats.grandRequests}</div>
                  <p className="text-sm text-gray-600 mt-1">Demandes de kiosques GRAND</p>
                  <p className="text-xs text-gray-400">(3 compartiments)</p>
                </div>
              </div>
              {requestStats.totalRequests > 0 && (
                <div className="mt-4 p-3 bg-orange-200 rounded-lg text-center">
                  <p className="text-sm text-orange-800 font-medium">
                    {requestStats.totalRequests} client(s) en attente de traitement
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}