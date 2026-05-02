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
        
        if (kioskCountsResult) {
          const monoDeployed = (kioskCountsResult.kiosks?.MONO?.ACTIVE || 0) + 
                               (kioskCountsResult.kiosks?.MONO?.ACTIVE_UNDER_MAINTENANCE || 0)
          const grandDeployed = (kioskCountsResult.kiosks?.GRAND?.ACTIVE || 0) + 
                                (kioskCountsResult.kiosks?.GRAND?.ACTIVE_UNDER_MAINTENANCE || 0)
          
          const monoInStock = (kioskCountsResult.kiosks?.MONO?.IN_STOCK || 0) + 
                              (kioskCountsResult.kiosks?.MONO?.AVAILABLE || 0)
          const grandInStock = (kioskCountsResult.kiosks?.GRAND?.IN_STOCK || 0) + 
                               (kioskCountsResult.kiosks?.GRAND?.AVAILABLE || 0)
          
          const grandCompartmentsTotal = (kioskCountsResult.kiosks?.GRAND?.totalKiosks || 0) * 3
          const grandOccupiedCompartments = kioskCountsResult.compartments?.OCCUPIED || 0
          const grandFreeCompartments = kioskCountsResult.compartments?.AVAILABLE || 0
          
          const totalCompartments = (kioskCountsResult.kiosks?.MONO?.totalKiosks || 0) + grandCompartmentsTotal
          
          const monoOccupied = (kioskCountsResult.kiosks?.MONO?.ACTIVE || 0)
          
          setKioskStats({
            totalKiosks: kioskCountsResult.totalKiosks || 0,
            monoKiosks: (kioskCountsResult.kiosks?.MONO?.total || 0),
            grandKiosks: (kioskCountsResult.kiosks?.GRAND?.total || 0),
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
        {/* SECTION 1 : APERÇU DES KIOSQUES */}
        <div className="mb-4 mt-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-300 rounded-full"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              Aperçu des Kiosques
            </h2>
            <div className="flex gap-1">
              <OneKioskSVG />
              <ThreeKioskSVG />
            </div>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Total Kiosks Card */}
          <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${styles.carte}`}>
            <CardHeader className={`flex flex-col space-y-0 pb-2 shadow-md bg-gradient-to-r from-orange-50 to-orange-100 ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium text-orange-700">Total Kiosques</CardTitle>
              <div className="text-3xl font-bold mt-2 text-orange-600">{kioskStats.totalKiosks}</div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-orange-50">
                  <OneKioskSVG />
                  <span className="text-gray-700">MONO: <strong className="text-orange-600">{kioskStats.monoKiosks}</strong></span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-50">
                  <ThreeKioskSVG />
                  <span className="text-gray-700">GRAND: <strong className="text-purple-600">{kioskStats.grandKiosks}</strong></span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kiosks in Stock Card */}
          <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${styles.carte}`}>
            <CardHeader className={`flex flex-col space-y-0 pb-2 shadow-md bg-gradient-to-r from-blue-50 to-blue-100 ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium text-blue-700">Kiosques en Stock</CardTitle>
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white">
                  <div className="flex items-center gap-2">
                    <OneKioskSVG />
                    <span className="text-sm text-gray-700">MONO</span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">{kioskStats.monoInStock}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white">
                  <div className="flex items-center gap-2">
                    <ThreeKioskSVG />
                    <span className="text-sm text-gray-700">GRAND</span>
                  </div>
                  <span className="text-xl font-bold text-purple-600">{kioskStats.grandInStock}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center text-medium text-gray-600">
                <Warehouse className="h-4 w-4 mr-2 text-blue-500" />
                <span>Disponibles en inventaire</span>
              </div>
            </CardContent>
          </Card>

          {/* Kiosks Deployed Card */}
          <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${styles.carte}`}>
            <CardHeader className={`flex flex-col space-y-0 pb-2 shadow-md bg-gradient-to-r from-green-50 to-green-100 ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium text-green-700">Kiosques Déployés</CardTitle>
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white">
                  <div className="flex items-center gap-2">
                    <OneKioskSVG />
                    <span className="text-sm text-gray-700">MONO</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">{kioskStats.monoDeployed}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white">
                  <div className="flex items-center gap-2">
                    <ThreeKioskSVG />
                    <span className="text-sm text-gray-700">GRAND</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">{kioskStats.grandDeployed}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center text-medium text-gray-600">
                <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                <span>Actuellement en activité</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SECTION 2 : STATISTIQUES UTILISATEURS */}
        <div className="mb-4 mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Statistiques Utilisateurs
            </h2>
            <Users className="h-6 w-6 text-blue-500" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {/* Staff Card */}
          <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${styles.carte}`}>
            <CardHeader className={`flex flex-col space-y-0 pb-2 shadow-md bg-gradient-to-r from-indigo-50 to-indigo-100 ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium text-indigo-700">Staff</CardTitle>
              <div className="text-3xl font-bold mt-2 text-indigo-600">{userStats.staffCount}</div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center text-medium text-gray-600">
                <Briefcase className="h-4 w-4 mr-2 text-indigo-500" />
                <span>Administrateurs et responsables</span>
              </div>
            </CardContent>
          </Card>

          {/* Clients Card */}
          <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${styles.carte}`}>
            <CardHeader className={`flex flex-col space-y-0 pb-2 shadow-md bg-gradient-to-r from-emerald-50 to-teal-100 ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium text-emerald-700">Clients</CardTitle>
              <div className="text-3xl font-bold mt-2 text-emerald-600">{userStats.clientCount}</div>
              <div className="space-y-2 mt-3">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white">
                  <div className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm text-gray-700">Particuliers</span>
                  </div>
                  <span className="text-xl font-bold text-emerald-600">{userStats.particulierCount}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-700">Entreprises</span>
                  </div>
                  <span className="text-xl font-bold text-blue-600">{userStats.entrepriseCount}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center text-medium text-gray-600">
                <Users className="h-4 w-4 mr-2 text-emerald-500" />
                <span>Total utilisateurs: <strong className="text-emerald-600">{userStats.totalUsers}</strong></span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SECTION 3 : DEMANDES NOUVEAUX CLIENTS */}
        <div className="mb-8 mt-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Demandes Nouveaux Clients
            </h2>
            <ClipboardList className="h-6 w-6 text-orange-500" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          <Card className="shadow-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 via-orange-50 to-amber-50 hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-t-lg">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-200 rounded-lg">
                    <ClipboardList className="h-5 w-5 text-orange-700" />
                  </div>
                  <CardTitle className="text-lg font-bold text-orange-800">
                    Demandes en Attente
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-200 rounded-full">
                  <Mail className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-orange-700 font-semibold">
                    Total: <strong className="text-2xl text-orange-600 ml-1">{requestStats.totalRequests}</strong>
                  </span>
                </div>
              </div>
              <p className="text-xs text-orange-600 mt-2 ml-2">
                ⚠️ Requêtes de nouveaux clients souhaitant obtenir un kiosque
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Demandes MONO */}
                <div className="text-center p-6 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-orange-200 rounded-full">
                      <OneKioskSVG />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-orange-600 mb-2">{requestStats.monoRequests}</div>
                  <p className="text-sm font-semibold text-gray-700">Demandes MONO</p>
                  <p className="text-xs text-gray-500">Kiosque 1 compartiment</p>
                </div>
                
                {/* Demandes GRAND */}
                <div className="text-center p-6 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-purple-200 rounded-full">
                      <ThreeKioskSVG />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-purple-600 mb-2">{requestStats.grandRequests}</div>
                  <p className="text-sm font-semibold text-gray-700">Demandes GRAND</p>
                  <p className="text-xs text-gray-500">Kiosque 3 compartiments</p>
                </div>
              </div>
              
              {requestStats.totalRequests > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-orange-200 to-amber-200 rounded-lg text-center animate-pulse">
                  <p className="text-sm text-orange-800 font-bold">
                    📋 {requestStats.totalRequests} client(s) en attente de traitement
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