"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUsers, createProforma } from "@/app/actions/proformaActions"
import { Loader2, Search, User, MapPin, ArrowLeft, Plus, Minus } from "lucide-react"
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

  // Proforma state
  const [kioskType, setKioskType] = useState<"MONO" | "GRAND" | "COMPARTIMENT">("MONO")
  const [quantity, setQuantity] = useState(1)
  const [selectedSurfaces, setSelectedSurfaces] = useState<{
    joues: boolean
    oreilles: boolean
    menton: boolean
    fronton: boolean
  }>({
    joues: false,
    oreilles: false,
    menton: false,
    fronton: false,
  })

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

  // Handle kiosk type change
  const handleKioskTypeChange = (value: "MONO" | "GRAND" | "COMPARTIMENT") => {
    setKioskType(value)
  }

  // Handle quantity change
  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value)
    }
  }

  // Handle surface selection
  const handleSurfaceChange = (surface: keyof typeof selectedSurfaces) => {
    setSelectedSurfaces((prev) => ({
      ...prev,
      [surface]: !prev[surface],
    }))
  }

  // Calculate subtotal for kiosk base price
  const calculateKioskSubtotal = () => {
    return KIOSK_TYPES[kioskType].basePrice * quantity
  }

  // Calculate subtotal for selected surfaces
  const calculateSurfacesSubtotal = () => {
    let total = 0
    const surfaces = KIOSK_TYPES[kioskType].surfaces

    if (selectedSurfaces.joues) {
      total += surfaces.joues.price * surfaces.joues.count * quantity
    }
    if (selectedSurfaces.oreilles) {
      total += surfaces.oreilles.price * surfaces.oreilles.count * quantity
    }
    if (selectedSurfaces.menton) {
      total += surfaces.menton.price * surfaces.menton.count * quantity
    }
    if (selectedSurfaces.fronton) {
      total += surfaces.fronton.price * surfaces.fronton.count * quantity
    }

    return total
  }

  // Calculate total
  const calculateTotal = () => {
    return calculateKioskSubtotal() + calculateSurfacesSubtotal()
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

      const formData = {
        clientId: selectedUser.id,
        clientName: selectedUser.name,
        clientEmail: selectedUser.email,
        clientPhone: selectedUser.phone || "",
        clientAddress: selectedUser.address || "",
        kioskType,
        quantity,
        surfaces: selectedSurfaces,
        basePrice: calculateKioskSubtotal(),
        brandingPrice: calculateSurfacesSubtotal(),
        totalAmount: calculateTotal(),
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
            <TabsTrigger value="kiosk">Configuration du kiosque</TabsTrigger>
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
                      Continuer vers la configuration du kiosque
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kiosk">
            <Card className="p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle>Configuration du Kiosque</CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="kioskType">Type de Kiosque</Label>
                    <RadioGroup
                      value={kioskType}
                      onValueChange={(value: "MONO" | "GRAND" | "COMPARTIMENT") => handleKioskTypeChange(value)}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <div className="flex items-center space-x-2 border p-4 rounded-md">
                        <RadioGroupItem value="MONO" id="mono" />
                        <Label htmlFor="mono" className="flex flex-col">
                          <span className="font-medium">Mono Kiosque</span>
                          <span className="text-sm text-gray-500">{formatCurrency(KIOSK_TYPES.MONO.basePrice)}</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-4 rounded-md">
                        <RadioGroupItem value="GRAND" id="grand" />
                        <Label htmlFor="grand" className="flex flex-col">
                          <span className="font-medium">Grand Kiosque</span>
                          <span className="text-sm text-gray-500">{formatCurrency(KIOSK_TYPES.GRAND.basePrice)}</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-4 rounded-md">
                        <RadioGroupItem value="COMPARTIMENT" id="compartiment" />
                        <Label htmlFor="compartiment" className="flex flex-col">
                          <span className="font-medium">Compartiment</span>
                          <span className="text-sm text-gray-500">
                            {formatCurrency(KIOSK_TYPES.COMPARTIMENT.basePrice)}
                          </span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <Label>Quantité</Label>
                    <div className="flex items-center space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-xl font-medium w-8 text-center">{quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label>Surfaces à brander</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="joues"
                          checked={selectedSurfaces.joues}
                          onCheckedChange={() => handleSurfaceChange("joues")}
                        />
                        <div className="grid gap-1.5">
                          <Label htmlFor="joues" className="font-medium">
                            Joues ({KIOSK_TYPES[kioskType].surfaces.joues.count})
                          </Label>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(KIOSK_TYPES[kioskType].surfaces.joues.price)} par joue
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="oreilles"
                          checked={selectedSurfaces.oreilles}
                          onCheckedChange={() => handleSurfaceChange("oreilles")}
                        />
                        <div className="grid gap-1.5">
                          <Label htmlFor="oreilles" className="font-medium">
                            Oreilles ({KIOSK_TYPES[kioskType].surfaces.oreilles.count})
                          </Label>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(KIOSK_TYPES[kioskType].surfaces.oreilles.price)} par oreille
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="menton"
                          checked={selectedSurfaces.menton}
                          onCheckedChange={() => handleSurfaceChange("menton")}
                        />
                        <div className="grid gap-1.5">
                          <Label htmlFor="menton" className="font-medium">
                            Menton ({KIOSK_TYPES[kioskType].surfaces.menton.count})
                          </Label>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(KIOSK_TYPES[kioskType].surfaces.menton.price)} par menton
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="fronton"
                          checked={selectedSurfaces.fronton}
                          onCheckedChange={() => handleSurfaceChange("fronton")}
                        />
                        <div className="grid gap-1.5">
                          <Label htmlFor="fronton" className="font-medium">
                            Fronton ({KIOSK_TYPES[kioskType].surfaces.fronton.count})
                          </Label>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(KIOSK_TYPES[kioskType].surfaces.fronton.price)} par fronton
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 space-x-4">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("client")}>
                      Retour
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab("summary")}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
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
                      <TableRow>
                        <TableCell className="font-medium">{KIOSK_TYPES[kioskType].name}</TableCell>
                        <TableCell>{quantity}</TableCell>
                        <TableCell>{formatCurrency(KIOSK_TYPES[kioskType].basePrice)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(calculateKioskSubtotal())}</TableCell>
                      </TableRow>

                      {selectedSurfaces.joues && (
                        <TableRow>
                          <TableCell>
                            Branding Joues ({KIOSK_TYPES[kioskType].surfaces.joues.count} par kiosque)
                          </TableCell>
                          <TableCell>{KIOSK_TYPES[kioskType].surfaces.joues.count * quantity}</TableCell>
                          <TableCell>{formatCurrency(KIOSK_TYPES[kioskType].surfaces.joues.price)}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(
                              KIOSK_TYPES[kioskType].surfaces.joues.price *
                                KIOSK_TYPES[kioskType].surfaces.joues.count *
                                quantity,
                            )}
                          </TableCell>
                        </TableRow>
                      )}

                      {selectedSurfaces.oreilles && (
                        <TableRow>
                          <TableCell>
                            Branding Oreilles ({KIOSK_TYPES[kioskType].surfaces.oreilles.count} par kiosque)
                          </TableCell>
                          <TableCell>{KIOSK_TYPES[kioskType].surfaces.oreilles.count * quantity}</TableCell>
                          <TableCell>{formatCurrency(KIOSK_TYPES[kioskType].surfaces.oreilles.price)}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(
                              KIOSK_TYPES[kioskType].surfaces.oreilles.price *
                                KIOSK_TYPES[kioskType].surfaces.oreilles.count *
                                quantity,
                            )}
                          </TableCell>
                        </TableRow>
                      )}

                      {selectedSurfaces.menton && (
                        <TableRow>
                          <TableCell>
                            Branding Menton ({KIOSK_TYPES[kioskType].surfaces.menton.count} par kiosque)
                          </TableCell>
                          <TableCell>{KIOSK_TYPES[kioskType].surfaces.menton.count * quantity}</TableCell>
                          <TableCell>{formatCurrency(KIOSK_TYPES[kioskType].surfaces.menton.price)}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(
                              KIOSK_TYPES[kioskType].surfaces.menton.price *
                                KIOSK_TYPES[kioskType].surfaces.menton.count *
                                quantity,
                            )}
                          </TableCell>
                        </TableRow>
                      )}

                      {selectedSurfaces.fronton && (
                        <TableRow>
                          <TableCell>
                            Branding Fronton ({KIOSK_TYPES[kioskType].surfaces.fronton.count} par kiosque)
                          </TableCell>
                          <TableCell>{KIOSK_TYPES[kioskType].surfaces.fronton.count * quantity}</TableCell>
                          <TableCell>{formatCurrency(KIOSK_TYPES[kioskType].surfaces.fronton.price)}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(
                              KIOSK_TYPES[kioskType].surfaces.fronton.price *
                                KIOSK_TYPES[kioskType].surfaces.fronton.count *
                                quantity,
                            )}
                          </TableCell>
                        </TableRow>
                      )}

                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-bold">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-bold">{formatCurrency(calculateTotal())}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("kiosk")}>
                    Retour
                  </Button>
                  <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white" disabled={isLoading}>
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
