"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUsers, createProforma } from "@/app/actions/proformaActions"
import { Loader2, Search, User, MapPin, ArrowLeft, Plus, Minus, Edit2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Kiosk type and pricing data
const KIOSK_TYPES = {
  MONO: {
    name: "Mono Kiosque",
    basePrice: 150000,
    surfaces: {
      joues: { count: 2, price: 25000, name: "Joues" },
      oreilles: { count: 2, price: 15000, name: "Oreilles" },
      menton: { count: 1, price: 20000, name: "Menton" },
      fronton: { count: 1, price: 30000, name: "Fronton" },
    },
  },
  GRAND: {
    name: "Grand Kiosque",
    basePrice: 250000,
    surfaces: {
      joues: { count: 2, price: 35000, name: "Joues" },
      oreilles: { count: 4, price: 15000, name: "Oreilles" },
      menton: { count: 1, price: 25000, name: "Menton" },
      fronton: { count: 1, price: 40000, name: "Fronton" },
    },
  },
  COMPARTIMENT: {
    name: "Compartiment",
    basePrice: 100000,
    surfaces: {
      joues: { count: 1, price: 20000, name: "Joues" },
      oreilles: { count: 1, price: 10000, name: "Oreilles" },
      menton: { count: 1, price: 15000, name: "Menton" },
      fronton: { count: 1, price: 25000, name: "Fronton" },
    },
  },
}

type KioskTypeKey = keyof typeof KIOSK_TYPES
type SurfaceKey = keyof typeof KIOSK_TYPES.MONO.surfaces

interface KioskSelection {
  type: "MONO" | "GRAND" | "COMPARTIMENT"
  quantity: number
  basePrice: number
  surfaces: {
    joues: { selected: boolean; price: number }
    oreilles: { selected: boolean; price: number }
    menton: { selected: boolean; price: number }
    fronton: { selected: boolean; price: number }
  }
}

// Surface count mapping for calculations
const SURFACE_COUNTS = {
  MONO: { joues: 2, oreilles: 2, menton: 1, fronton: 1 },
  GRAND: { joues: 2, oreilles: 4, menton: 1, fronton: 1 },
  COMPARTIMENT: { joues: 1, oreilles: 1, menton: 1, fronton: 1 },
} as const

export default function NewProformaPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSearchingUsers, setIsSearchingUsers] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("client")

  // User state
  const [users, setUsers] = useState<any[]>([])
  const [userSearchTerm, setUserSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<any | null>(null)

  // Proforma state - now supporting multiple kiosk types
  const [kioskSelections, setKioskSelections] = useState<KioskSelection[]>([])

  // Tax rates
  const [dtspRate, setDtspRate] = useState(3) // 3%
  const [tvaRate, setTvaRate] = useState(19.25) // 19.25%

  // Utility function to calculate proforma totals
  const calculateProformaTotals = (selections: KioskSelection[], dtspRateValue: number, tvaRateValue: number) => {
    // Calculate subtotal
    const subtotal = selections.reduce((total, selection) => {
      const kioskTotal = selection.basePrice * selection.quantity
      const surfacesTotal = Object.entries(selection.surfaces).reduce((surfaceTotal, [surfaceKey, surface]) => {
        if (surface.selected) {
          const count = SURFACE_COUNTS[selection.type][surfaceKey as keyof typeof SURFACE_COUNTS.MONO] || 0
          return surfaceTotal + surface.price * count * selection.quantity
        }
        return surfaceTotal
      }, 0)
      return total + kioskTotal + surfacesTotal
    }, 0)

    // Calculate DTSP (percentage of subtotal)
    const dtsp = subtotal * (dtspRateValue / 100)

    // Calculate TVA (percentage of subtotal + DTSP)
    const tva = (subtotal + dtsp) * (tvaRateValue / 100)

    // Calculate total
    const totalAmount = subtotal + dtsp + tva

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      dtsp: Math.round(dtsp * 100) / 100,
      tva: Math.round(tva * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
    }
  }

  // Fetch initial data
  useEffect(() => {
    fetchUsers()
  }, [])

  // Fetch users with search term
  const fetchUsers = async (term?: string) => {
    setIsSearchingUsers(true)
    try {
      const result = await getUsers(term || userSearchTerm)
      if (result.success) {
        setUsers(result.users)
      } else {
        setError(result.error || "Échec du chargement des utilisateurs")
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error)
      setError("Une erreur s'est produite lors du chargement des utilisateurs")
    } finally {
      setIsSearchingUsers(false)
    }
  }

  // Handle user search input change
  const handleUserSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserSearchTerm(e.target.value)
  }

  // Handle user search submission
  const handleUserSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers(userSearchTerm)
  }

  // Handle user selection
  const handleUserSelection = (user: any) => {
    setSelectedUser(user)
  }

  // Add a new kiosk selection
  const addKioskSelection = (type: KioskTypeKey) => {
    const kioskType = KIOSK_TYPES[type]
    const newSelection: KioskSelection = {
      type: type as "MONO" | "GRAND" | "COMPARTIMENT",
      quantity: 1,
      basePrice: kioskType.basePrice,
      surfaces: {
        joues: { selected: false, price: kioskType.surfaces.joues.price },
        oreilles: { selected: false, price: kioskType.surfaces.oreilles.price },
        menton: { selected: false, price: kioskType.surfaces.menton.price },
        fronton: { selected: false, price: kioskType.surfaces.fronton.price },
      },
    }
    setKioskSelections([...kioskSelections, newSelection])
  }

  // Remove a kiosk selection
  const removeKioskSelection = (index: number) => {
    setKioskSelections(kioskSelections.filter((_, i) => i !== index))
  }

  // Update kiosk quantity
  const updateKioskQuantity = (index: number, quantity: number) => {
    if (quantity >= 1) {
      const updated = [...kioskSelections]
      updated[index].quantity = quantity
      setKioskSelections(updated)
    }
  }

  // Update kiosk base price
  const updateKioskBasePrice = (index: number, price: number) => {
    const updated = [...kioskSelections]
    updated[index].basePrice = price
    setKioskSelections(updated)
  }

  // Update surface selection
  const updateSurfaceSelection = (index: number, surface: SurfaceKey, selected: boolean) => {
    const updated = [...kioskSelections]
    updated[index].surfaces[surface].selected = selected
    setKioskSelections(updated)
  }

  // Update surface price
  const updateSurfacePrice = (index: number, surface: SurfaceKey, price: number) => {
    const updated = [...kioskSelections]
    updated[index].surfaces[surface].price = price
    setKioskSelections(updated)
  }

  // Calculate subtotal for all kiosks
  const calculateKioskSubtotal = () => {
    return kioskSelections.reduce((total, selection) => {
      return total + selection.basePrice * selection.quantity
    }, 0)
  }

  // Calculate subtotal for all surfaces
  const calculateSurfacesSubtotal = () => {
    return kioskSelections.reduce((total, selection) => {
      let selectionTotal = 0
      Object.entries(selection.surfaces).forEach(([surfaceKey, surface]) => {
        if (surface.selected) {
          const surfaceCount = KIOSK_TYPES[selection.type].surfaces[surfaceKey as SurfaceKey].count
          selectionTotal += surface.price * surfaceCount * selection.quantity
        }
      })
      return total + selectionTotal
    }, 0)
  }

  // Calculate subtotal (before taxes)
  const calculateSubtotal = () => {
    return Math.round((calculateKioskSubtotal() + calculateSurfacesSubtotal()) * 100) / 100
  }

  // Calculate DTSP (3% of subtotal)
  const calculateDTSP = () => {
    return Math.round(calculateSubtotal() * (dtspRate / 100) * 100) / 100
  }

  // Calculate TVA (19.25% of subtotal + DTSP)
  const calculateTVA = () => {
    return Math.round((calculateSubtotal() + calculateDTSP()) * (tvaRate / 100) * 100) / 100
  }

  // Calculate total with taxes
  const calculateTotal = () => {
    return Math.round((calculateSubtotal() + calculateDTSP() + calculateTVA()) * 100) / 100
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR").format(amount) + " FCFA"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!session?.user?.id) {
        throw new Error("Utilisateur non authentifié")
      }

      if (!selectedUser) {
        throw new Error("Veuillez sélectionner un client")
      }

      if (kioskSelections.length === 0) {
        throw new Error("Veuillez ajouter au moins un kiosque")
      }

      // Validation: Ensure all prices are positive and quantities are at least 1
      for (const selection of kioskSelections) {
        if (selection.quantity < 1) {
          throw new Error("La quantité de kiosque doit être au moins 1.")
        }
        if (selection.basePrice < 0) {
          throw new Error("Le prix de base du kiosque doit être positif.")
        }
        for (const surfaceKey in selection.surfaces) {
          if (selection.surfaces.hasOwnProperty(surfaceKey)) {
            const surface = selection.surfaces[surfaceKey as SurfaceKey]
            if (surface.selected && surface.price < 0) {
              throw new Error("Le prix de la surface doit être positif.")
            }
          }
        }
      }

      // Calculate totals
      const totals = calculateProformaTotals(kioskSelections, dtspRate, tvaRate)

      const formData = {
        clientId: selectedUser.id,
        clientName: selectedUser.name,
        clientEmail: selectedUser.email || "",
        clientPhone: selectedUser.phone || "",
        clientAddress: selectedUser.address || "",
        kioskSelections,
        subtotal: totals.subtotal,
        dtsp: totals.dtsp,
        tva: totals.tva,
        totalAmount: totals.totalAmount,
        dtspRate,
        tvaRate,
        createdById: session.user.id,
      }

      const result = await createProforma(formData)

      if (result.success) {
        router.push(`/admin/proforma/${result.proforma.id}`)
      } else {
        setError(result.error || "Échec de la création de la proforma")
      }
    } catch (error: any) {
      console.error("Erreur lors de la création de la proforma:", error)
      setError(error.message || "Une erreur s'est produite lors de la création de la proforma")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold">Nouvelle Proforma</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <Tabs defaultValue="client" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="client">Sélection du client</TabsTrigger>
            <TabsTrigger value="kiosk">Configuration des kiosques</TabsTrigger>
            <TabsTrigger value="summary">Récapitulatif</TabsTrigger>
          </TabsList>

          <TabsContent value="client">
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Rechercher un client ou prospect</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                {/* User search form */}
                <form onSubmit={handleUserSearch} className="flex gap-2 mb-6">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Rechercher par nom, email ou téléphone"
                      value={userSearchTerm}
                      onChange={handleUserSearchChange}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <Button type="submit" disabled={isSearchingUsers}>
                    {isSearchingUsers ? <Loader2 className="h-4 w-4 animate-spin" /> : "Rechercher"}
                  </Button>
                </form>
                <div className="space-y-4">
                  <Label>Sélectionnez un client</Label>

                  {users.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {isSearchingUsers ? "Recherche en cours..." : "Aucun utilisateur trouvé"}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto p-2">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className={`flex items-start space-x-3 border p-4 rounded-md cursor-pointer hover:bg-gray-50 ${
                            selectedUser?.id === user.id ? "border-orange-500 bg-orange-50" : ""
                          }`}
                          onClick={() => handleUserSelection(user)}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.image || "/placeholder.svg?height=40&width=40"} alt={user.name} />
                            <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1 flex-1">
                            <p className="font-medium">{user.name}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <User className="h-3 w-3 mr-1" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="h-3 w-3 mr-1" />
                                {user.phone}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 whitespace-nowrap">
                            <Badge variant={user.status === "ACTIVE" ? "success" : "secondary"}>{user.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedUser && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-700 font-medium">Client sélectionné: {selectedUser.name}</p>
                      <p className="text-xs text-green-600">
                        Les informations de ce client seront utilisées pour la proforma.
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      onClick={() => setActiveTab("kiosk")}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      disabled={!selectedUser}
                    >
                      Continuer vers la configuration des kiosques
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kiosk">
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Configuration des Kiosques</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-6">
                  {/* Add kiosk buttons */}
                  <div className="space-y-4">
                    <Label>Ajouter des kiosques</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(KIOSK_TYPES).map(([key, type]) => (
                        <Button
                          key={key}
                          type="button"
                          variant="outline"
                          onClick={() => addKioskSelection(key as KioskTypeKey)}
                          className="h-auto p-4 flex flex-col items-center space-y-2"
                        >
                          <Plus className="h-5 w-5" />
                          <div className="text-center">
                            <div className="font-medium">{type.name}</div>
                            <div className="text-sm text-gray-500">{formatCurrency(type.basePrice)}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Kiosk selections */}
                  <div className="space-y-6">
                    {kioskSelections.map((selection, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-medium">{KIOSK_TYPES[selection.type].name}</h3>
                          <Button type="button" variant="outline" size="sm" onClick={() => removeKioskSelection(index)}>
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* Quantity */}
                          <div className="space-y-2">
                            <Label>Quantité</Label>
                            <div className="flex items-center space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => updateKioskQuantity(index, selection.quantity - 1)}
                                disabled={selection.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="text-lg font-medium w-8 text-center">{selection.quantity}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => updateKioskQuantity(index, selection.quantity + 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Base Price */}
                          <div className="space-y-2">
                            <Label>Prix de base (FCFA)</Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                type="number"
                                value={selection.basePrice}
                                onChange={(e) => updateKioskBasePrice(index, Number(e.target.value))}
                                className="flex-1"
                              />
                              <Edit2 className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        {/* Surfaces */}
                        <div className="space-y-4">
                          <Label>Surfaces à brander</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(selection.surfaces).map(([surfaceKey, surface]) => {
                              const surfaceInfo = KIOSK_TYPES[selection.type].surfaces[surfaceKey as SurfaceKey]
                              return (
                                <div key={surfaceKey} className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`${index}-${surfaceKey}`}
                                      checked={surface.selected}
                                      onCheckedChange={(checked) =>
                                        updateSurfaceSelection(index, surfaceKey as SurfaceKey, checked as boolean)
                                      }
                                    />
                                    <Label htmlFor={`${index}-${surfaceKey}`} className="font-medium">
                                      {surfaceInfo.name} ({surfaceInfo.count})
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2 ml-6">
                                    <Input
                                      type="number"
                                      value={surface.price}
                                      onChange={(e) =>
                                        updateSurfacePrice(index, surfaceKey as SurfaceKey, Number(e.target.value))
                                      }
                                      className="w-32"
                                      disabled={!surface.selected}
                                    />
                                    <span className="text-sm text-gray-500">
                                      FCFA par {surfaceInfo.name.toLowerCase()}
                                    </span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </Card>
                    ))}

                    {kioskSelections.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        Aucun kiosque ajouté. Utilisez les boutons ci-dessus pour ajouter des kiosques.
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end mt-4 space-x-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("client")}>
                      Retour
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab("summary")}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      disabled={kioskSelections.length === 0}
                    >
                      Voir le récapitulatif
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary">
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Récapitulatif de la Proforma</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                {selectedUser && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-md">
                    <h3 className="font-medium text-lg mb-2">Informations du client</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-500">Nom:</span> {selectedUser.name}
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span> {selectedUser.email}
                      </div>
                      {selectedUser.phone && (
                        <div>
                          <span className="text-gray-500">Téléphone:</span> {selectedUser.phone}
                        </div>
                      )}
                      {selectedUser.address && (
                        <div>
                          <span className="text-gray-500">Adresse:</span> {selectedUser.address}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-medium text-lg mb-4">Détails de la commande</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Quantité</TableHead>
                        <TableHead>Prix unitaire</TableHead>
                        <TableHead className="text-right">Montant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {kioskSelections.map((selection, index) => (
                        <React.Fragment key={index}>
                          {/* Kiosk base price */}
                          <TableRow>
                            <TableCell className="font-medium">{KIOSK_TYPES[selection.type].name}</TableCell>
                            <TableCell>{selection.quantity}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={selection.basePrice}
                                onChange={(e) => updateKioskBasePrice(index, Number(e.target.value))}
                                className="w-32"
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(selection.basePrice * selection.quantity)}
                            </TableCell>
                          </TableRow>

                          {/* Surface branding */}
                          {Object.entries(selection.surfaces).map(([surfaceKey, surface]) => {
                            if (!surface.selected) return null
                            const surfaceInfo = KIOSK_TYPES[selection.type].surfaces[surfaceKey as SurfaceKey]
                            const totalQuantity = surfaceInfo.count * selection.quantity
                            return (
                              <TableRow key={`${index}-${surfaceKey}`}>
                                <TableCell>
                                  Branding {surfaceInfo.name} ({surfaceInfo.count} par kiosque)
                                </TableCell>
                                <TableCell>{totalQuantity}</TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    value={surface.price}
                                    onChange={(e) =>
                                      updateSurfacePrice(index, surfaceKey as SurfaceKey, Number(e.target.value))
                                    }
                                    className="w-32"
                                  />
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatCurrency(surface.price * totalQuantity)}
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </React.Fragment>
                      ))}

                      {/* Subtotal */}
                      <TableRow className="border-t-2">
                        <TableCell colSpan={3} className="text-right font-medium">
                          Sous-total (HT)
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(calculateSubtotal())}</TableCell>
                      </TableRow>

                      {/* DTSP */}
                      <TableRow>
                        <TableCell colSpan={2} className="text-right">
                          DTSP ({dtspRate}%)
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={dtspRate}
                            onChange={(e) => setDtspRate(Number(e.target.value))}
                            className="w-20"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(calculateDTSP())}</TableCell>
                      </TableRow>

                      {/* TVA */}
                      <TableRow>
                        <TableCell colSpan={2} className="text-right">
                          TVA ({tvaRate}%)
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={tvaRate}
                            onChange={(e) => setTvaRate(Number(e.target.value))}
                            className="w-20"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(calculateTVA())}</TableCell>
                      </TableRow>

                      {/* Total */}
                      <TableRow className="border-t-2">
                        <TableCell colSpan={3} className="text-right font-bold text-lg">
                          Total TTC
                        </TableCell>
                        <TableCell className="text-right font-bold text-lg">
                          {formatCurrency(calculateTotal())}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("kiosk")}>
                    Retour
                  </Button>
                  <Button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={isLoading || kioskSelections.length === 0}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Création en cours...
                      </>
                    ) : (
                      "Créer la proforma"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
