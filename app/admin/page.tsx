"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

import { ArrowDownTrayIcon, ArrowUpCircleIcon } from "@heroicons/react/24/solid"
import { RefreshCw, TrendingUp, Store, FileText, Building2, ArrowUpRight, ArrowUpLeft, Loader2 } from "lucide-react"

import styles from "@/app/ui/dashboard.module.css"
import Header from "../ui/header"
import { fetchUserStats } from "../actions/fetchUserStats"
import { getKioskCounts } from "../actions/kiosk-actions"

interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

const data = [
  { name: "Jan", value: 2000 },
  { name: "Feb", value: 2500 },
  { name: "Mar", value: 3000 },
  { name: "Apr", value: 3500 },
  { name: "May", value: 4000 },
  { name: "Jun", value: 4500 },
  { name: "Jul", value: 5000 },
  { name: "Aug", value: 5500 },
  { name: "Sep", value: 6000 },
  { name: "Oct", value: 6500 },
  { name: "Nov", value: 7000 },
  { name: "Dec", value: 6000 },
]

export default function UserManagement() {
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    usersThisMonth: 0,
    percentageGrowth: 0,
    lastNineUsers: [] as User[],
    particulierCount: 0,
    entrepriseCount: 0,
  })
  const [kioskStats, setKioskStats] = useState({
    totalKiosks: 0,
    newKiosksLastMonth: 0,
    activeContracts: 0,
    expiredContracts: 0,
    pendingInvoices: 0,
    kiosksAddedThisMonth: 0,
    percentageAddedThisMonth: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      setLoading(true)
      try {
        const [userResult, kioskCountsResult] = await Promise.all([fetchUserStats(), getKioskCounts()])

        if (userResult.success) {
          setUserStats({
            totalUsers: userResult.totalUsers,
            usersThisMonth: userResult.usersThisMonth,
            percentageGrowth: userResult.percentageGrowth,
            lastNineUsers: userResult.lastNineUsers,
            particulierCount: userResult.particulierCount || 0,
            entrepriseCount: userResult.entrepriseCount || 0,
          })
          setKioskStats((prevStats) => ({
            ...prevStats,
            totalKiosks: kioskCountsResult.totalKiosks,
            kiosksAddedThisMonth: kioskCountsResult.kiosksAddedThisMonth,
            percentageAddedThisMonth: kioskCountsResult.percentageAddedThisMonth,
          }))
          setError(null)
        } else {
          setError("Échec du chargement des statistiques")
        }
      } catch (error) {
        console.error("Error loading stats:", error)
        setError("Une erreur est survenue lors du chargement des statistiques")
      }
      setLoading(false)
    }

    loadStats()
  }, [])

  return (
    <div className="container mx-auto space-y-6">
      <Header title="Tableau de Bord" />

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
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className={`shadow-md ${styles.carte}`}>
            <CardHeader className={`flex flex-column space-y-0 pb-2 shadow-md ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium">Nombre Total de Kiosques</CardTitle>
              <div className="flex items-baseline space-x-3 ">
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <div className="text-2xl font-bold mt-2">{kioskStats.totalKiosks}</div>
                )}
                <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                  <div className="inline-block  text-xs font-medium text-green-500 flex items-center">
                    <ArrowUpCircleIcon className="inline-block h-5 w-5" />
                  </div>
                  <div className="ml-2 text-medium text-gray-500">
                    {kioskStats.percentageAddedThisMonth.toFixed(1)}%
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-medium">
                <p>
                  {" "}
                  <span className="font-bold">+{kioskStats.kiosksAddedThisMonth}</span> le dernier mois
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className={`shadow-md ${styles.carte}`}>
            <CardHeader className={`flex flex-column space-y-0 pb-2 shadow-md ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium">Nombre total d'utilisateurs</CardTitle>
              <div className="flex items-baseline space-x-3">
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                ) : (
                  <div className="text-2xl font-bold mt-2">{userStats.totalUsers}</div>
                )}
                <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                  <div className="inline-block  text-xs font-medium text-green-500 flex items-center">
                    <ArrowUpCircleIcon className="inline-block h-5 w-5" />
                  </div>
                  <div className="ml-2 text-medium text-gray-500">{userStats.percentageGrowth.toFixed(1)}%</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-medium">
                <p>
                  {" "}
                  <span className="font-bold">+{userStats.usersThisMonth}</span> ce mois-ci
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className={`shadow-md ${styles.carte}`}>
            <CardHeader className={`flex flex-column space-y-0 pb-2 shadow-md ${styles.carteEntete}`}>
              <CardTitle className="text-xs font-medium">Contrats actif et exprirés</CardTitle>
              <div className="flex items-baseline space-x-3 ">
                <div className="text-xl font-bold mt-2">{kioskStats.activeContracts}</div>
                <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                  <div className="ml-2 text-xm text-black-500 font-bold">Actifs</div>
                </div>
              </div>
              <div className="flex items-baseline space-x-3 ">
                <div className="text-xl font-bold mt-2">{kioskStats.expiredContracts}</div>
                <div className="flex items-center bg-red-500 rounded-full bg-opacity-15 px-2 py-0.5">
                  <div className="ml-2 text-xm font-bold text-black-500">Expirés</div>
                </div>
              </div>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
          <Card className={`shadow-md ${styles.carte}`}>
            <CardHeader className={`flex flex-column space-y-0 pb-2 shadow-md ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium">Factures en attentes et payés</CardTitle>
              <div className="flex items-baseline space-x-3 ">
                <div className="text-xl font-bold mt-2">{kioskStats.activeContracts}</div>
                <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                  <div className="ml-2 text-xm text-black-500 font-bold">Payés</div>
                </div>
              </div>
              <div className="flex items-baseline space-x-3 ">
                <div className="text-2xl font-bold mt-2">{kioskStats.pendingInvoices}</div>
                <div className="flex items-center bg-red-500 rounded-full bg-opacity-15 px-2 py-0.5">
                  <div className="ml-2 text-xm font-bold text-black-500">En attente</div>
                </div>
              </div>
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <div className="grid gap-4 md:grid-cols-7 mt-7">
          <div className="md:col-span-5">
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 mb-2">
              <Card className={`shadow-md ${styles.carte}`}>
                <CardHeader className={`flex flex-column space-y-0 pb-2 shadow-md ${styles.carteEntete}`}>
                  <CardTitle className="text-lg font-lg">Type de Client</CardTitle>
                  <div className="flex items-baseline space-x-3 ">
                    {loading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    ) : (
                      <div className="text-xl font-bold mt-2">{userStats.particulierCount}</div>
                    )}
                    <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                      <div className="ml-2 text-xm text-black-500 font-bold">PARTICULIERS</div>
                    </div>
                  </div>
                  <div className="flex items-baseline space-x-3 ">
                    {loading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    ) : (
                      <div className="text-xl font-bold mt-2">{userStats.entrepriseCount}</div>
                    )}
                    <div className="flex items-center bg-red-500 rounded-full bg-opacity-15 px-2 py-0.5">
                      <div className="ml-2 text-xm font-bold text-black-500">ENTREPRISES</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent></CardContent>
              </Card>
            </div>
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="space-y-6 lg:w-1/3">
                    {/* Revenue Card */}
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-medium font-semibold text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          Revenus
                          <span className="text-xs font-medium text-green-500 bg-red flex bg-green-500 rounded-full bg-opacity-15 pt-1 pr-2 pb-1 pl-2">
                            <ArrowUpLeft className="h-4 w-4 text-green-500" />
                            160%
                          </span>
                        </div>
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div className="mt-3">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-semibold">86,044</span>
                          <span className="text-sm text-muted-foreground">Fcfa</span>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">From 175,26</div>
                      </div>
                    </div>

                    {/* Transactions Card */}
                    <hr className="border-t border-[#555F75]-300" />
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-medium font-semibold text-muted-foreground">
                          <Store className="h-4 w-4" />
                          Transactions
                          <span className="text-xs font-medium text-green-500 bg-red flex bg-green-500 rounded-full bg-opacity-15 pt-1 pr-2 pb-1 pl-2">
                            <ArrowUpLeft className="h-4 w-4 text-green-500" />
                            160%
                          </span>
                        </div>
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div className="mt-3">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-semibold">132</span>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">Sur six mois</div>
                      </div>
                    </div>

                    {/* Average Transactions Card */}
                    <hr className="border-t border-[#555F75]-300" />
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-medium font-semibold text-muted-foreground">
                          <ArrowUpRight className="h-4 w-4" />
                          Transactions
                          <span className="text-xs font-medium text-green-500 bg-red flex bg-green-500 rounded-full bg-opacity-15 pt-1 pr-2 pb-1 pl-2">
                            <ArrowUpLeft className="h-4 w-4 text-green-500" />
                            160%
                          </span>
                        </div>
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div className="mt-3">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-semibold">6000</span>
                          <span className="text-sm text-muted-foreground">Fcfa</span>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">Sur Six Mois</div>
                      </div>
                    </div>
                  </div>

                  {/* Chart Column */}
                  <div className="lg:w-2/3">
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#888" }}
                            dy={10}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: "#888" }}
                            tickFormatter={(value) => `${value / 1000}k`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "none",
                              borderRadius: "8px",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#FF6B6B"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4, strokeWidth: 0 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Utilisateurs récents</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <div className="text-center text-red-500">{error}</div>
                ) : (
                  <div className="space-y-4">
                    {userStats.lastNineUsers.map((user) => (
                      <div key={user.id} className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
                            alt={user.name}
                          />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

