"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  EllipsisHorizontalIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline"
import {
  ArrowUpCircleIcon,
  XMarkIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/solid"
import { Loader2 } from "lucide-react"
import Header from "@/app/ui/header"
// Add imports for useSession
import { useSession } from "next-auth/react"
import {
  createProspect,
  fetchProspectStats,
  convertProspectToUser,
  deleteProspect,
  updateProspect,
} from "../actions/prospectactions"


type Prospect = {
  id: string
  name: string
  contact: string
  address?: string
  need?: string
  prospectStatus: string
  source?: string
  assignedToId?: string
  estimatedValue?: number
  notes?: string
  lastContactDate?: Date
  createdAt: Date
  updatedAt: Date
}

// Inside the component, add session handling
export default function UserManagement() {
  const { data: session } = useSession()
  // ... existing state variables
  const [selectedProspects, setSelectedProspects] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUserType, setSelectedUserType] = useState("all")
  const [filterRole, setFilterRole] = useState("")
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)
  const [filterStatus, setFilterStatus] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Update the formData state to include an id field
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    contact: "", // Single contact field instead of separate email/phone
    need: "",
    statusId: "", // Only used for editing, not for new prospects
    assignedToId: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [prospectStats, setProspectStats] = useState({
    totalProspects: 0,
    prospectsThisMonth: 0,
    percentageGrowth: 0,
    concludedProspects: 0,
  })

  useEffect(() => {
    const fetchProspects = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/prospects")
        const data = await response.json()
        console.log(data)
        setProspects(data)
      } catch (error) {
        console.error("Error fetching prospects:", error)
        setError("Failed to load prospects")
      } finally {
        setIsLoading(false)
      }
    }

    const loadStats = async () => {
      try {
        const result = await fetchProspectStats()
        if (result.success) {
          setProspectStats({
            totalProspects: result.totalProspects,
            prospectsThisMonth: result.prospectsThisMonth,
            percentageGrowth: result.percentageGrowth,
            concludedProspects: result.concludedProspects,
          })
        } else {
          setError("Failed to load prospect statistics")
        }
      } catch (error) {
        console.error("Error loading stats:", error)
        setError("An error occurred while loading statistics")
      }
    }

    fetchProspects()
    loadStats()
  }, [])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProspects(prospects.map((prospect) => prospect.id))
    } else {
      setSelectedProspects([])
    }
  }

  const handleDelete = async (prospectId: string) => {
    if (window.confirm("Are you sure you want to delete this prospect?")) {
      try {
        const result = await deleteProspect(prospectId)

        if (result.success) {
          setProspects(prospects.filter((prospect) => prospect.id !== prospectId))
          setSelectedProspects(selectedProspects.filter((id) => id !== prospectId))
          setProspectStats((prev) => ({
            ...prev,
            totalProspects: prev.totalProspects - 1,
          }))
        } else {
          throw new Error(result.error)
        }
      } catch (error) {
        console.error("Error deleting prospect:", error)
        setError("Failed to delete prospect. Please try again.")
      }
    }
  }

  const handleSelectProspect = (prospectId: string, checked: boolean) => {
    if (checked) {
      setSelectedProspects([...selectedProspects, prospectId])
    } else {
      setSelectedProspects(selectedProspects.filter((id) => id !== prospectId))
    }
  }

  // Update the openModal function to include the user ID from the session
  const openModal = (prospect?: Prospect) => {
    if (prospect) {
      setFormData({
        id: prospect.id,
        name: prospect.name || "",
        contact: prospect.email || prospect.phone || "",
        need: prospect.need || "",
        statusId: prospect.prospectStatus ? mapProspectStatusToStatusId(prospect.prospectStatus) : "",
        assignedToId: prospect.assignedToId || "",
        createdById: session?.user?.id, // Add the user ID from the session
      })
      setIsEditing(true)
    } else {
      // Generate a unique ID for new prospects
      const newId = crypto.randomUUID()
      setFormData({
        id: newId,
        name: "",
        contact: "",
        need: "",
        statusId: "", // No status for new prospects
        assignedToId: "",
        createdById: session?.user?.id, // Add the user ID from the session
      })
      setIsEditing(false)
    }
    setIsModalOpen(true)
  }

  // Add a helper function to map between status types
  const mapProspectStatusToStatusId = (prospectStatus: string) => {
    switch (prospectStatus) {
      case "QUALIFIED":
      case "PROPOSAL_SENT":
      case "NEGOTIATION":
      case "CONVERTED":
        return "ACTIVE"
      case "LOST":
        return "INACTIVE"
      case "NEW":
      case "CONTACTED":
      default:
        return "PENDING"
    }
  }

  const closeModal = () => setIsModalOpen(false)

  const resetFilters = () => {
    setFilterRole("")
    setFilterDate(undefined)
    setFilterStatus("")
    setIsFilterOpen(false)
  }

  const applyFilters = () => {
    console.log("Filters applied:", { filterRole, filterDate, filterStatus })
    setIsFilterOpen(false)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setFilterDate(date)
    setIsCalendarOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Update the handleSubmit function to pass the user ID from the session
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (isEditing) {
        // Update existing prospect using the server action
        const result = await updateProspect(formData.id, formData)

        if (result.success) {
          setProspects(prospects.map((p) => (p.id === result.prospect.id ? result.prospect : p)))
          closeModal()
        } else {
          throw new Error(result.error)
        }
      } else {
        // Create new prospect with the generated ID using the server action
        // Make sure to include the user ID from the session
        const result = await createProspect({
          ...formData,
          createdById: session?.user?.id,
        })

        if (result.success) {
          setProspects([result.prospect, ...prospects])
          setProspectStats((prev) => ({
            ...prev,
            totalProspects: prev.totalProspects + 1,
            prospectsThisMonth: prev.prospectsThisMonth + 1,
          }))
          closeModal()
        } else {
          throw new Error(result.error)
        }
      }
    } catch (error) {
      console.error("Error submitting prospect:", error)
      setError("Failed to submit prospect. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConvertToUser = async (prospectId: string) => {
    try {
      const result = await convertProspectToUser(prospectId)

      if (result.success) {
        // Update the prospect in the list to show it's been converted
        setProspects(prospects.map((p) => (p.id === prospectId ? { ...p, prospectStatus: "CONVERTED" } : p)))
        setSelectedProspects(selectedProspects.filter((id) => id !== prospectId))
        setProspectStats((prev) => ({
          ...prev,
          concludedProspects: prev.concludedProspects + 1,
        }))
        alert(`Prospect successfully converted to user! Temporary password: ${result.tempPassword}`)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error converting prospect to user:", error)
      setError("Failed to convert prospect to user. Please try again.")
    }
  }

  const filteredProspects = prospects.filter((prospect) => {
    return (
      (prospect.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prospect.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prospect.phone?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "" || prospect.prospectStatus === filterStatus) &&
      (selectedUserType === "all" ||
        (selectedUserType === "converted" && prospect.prospectStatus === "CONVERTED") ||
        (selectedUserType === "active" &&
          prospect.prospectStatus !== "CONVERTED" &&
          prospect.prospectStatus !== "LOST"))
    )
  })

  return (
    <div className="container mx-auto space-y-6">
      <Header title="Gestion des prospects" />

      <div className="flex justify-end items-center">
        <Button variant="ghost">
          <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
        </Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => openModal()}>
          <UserPlusIcon className="mr-2 h-4 w-4" />
          Ajouter des prospects
        </Button>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" onClick={closeModal}></div>
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
              <div className="p-6">
                <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:text-gray-500">
                  <XMarkIcon className="h-6 w-6" />
                </button>
                <h2 className="text-xl font-semibold mb-4">
                  {isEditing ? "Modifier le prospect" : "Créer un prospect"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet*
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Nom du prospect"
                      className="w-full"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                        Contact
                      </label>
                      <Input
                        id="contact"
                        name="contact"
                        type="text"
                        value={formData.contact}
                        onChange={handleInputChange}
                        placeholder="Email ou Téléphone"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="need" className="block text-sm font-medium text-gray-700 mb-1">
                        Besoin
                      </label>
                      <Input
                        id="need"
                        name="need"
                        value={formData.need}
                        onChange={handleInputChange}
                        placeholder="Besoin du prospect"
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Only show these fields when editing */}
                  {isEditing && (
                    <>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label htmlFor="statusId" className="block text-sm font-medium text-gray-700 mb-1">
                            Statut
                          </label>
                          <Select
                            value={formData.statusId}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, statusId: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Statut" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PENDING">En attente</SelectItem>
                              <SelectItem value="ACTIVE">Actif</SelectItem>
                              <SelectItem value="INACTIVE">Inactif</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                    </>
                  )}

                  {/* Always show assignedToId field for both creating and editing */}

                  <div className="flex justify-end space-x-3 mt-6">
                    <Button variant="outline" onClick={closeModal}>
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isEditing ? "Mise à jour..." : "Ajout..."}
                        </>
                      ) : isEditing ? (
                        "Mettre à jour"
                      ) : (
                        "Ajouter"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <hr />

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-column space-y-0 pb-2 shadow-md">
            <CardTitle className="text-sm font-medium">Total prospects</CardTitle>
            <div className="flex items-baseline space-x-3 ">
              <div className="text-2xl font-bold mt-2">{prospectStats.totalProspects}</div>
              <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                <ArrowUpCircleIcon className="inline-block h-5 w-5 text-green-500" />
                <div className="ml-2 text-medium text-gray-500">{prospectStats.percentageGrowth}%</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-medium">
              <p>
                <span className="font-bold">+{prospectStats.prospectsThisMonth}</span> le dernier mois
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-column space-y-0 pb-2 shadow-md">
            <CardTitle className="text-sm font-medium">Nouveaux prospects</CardTitle>
            <div className="flex items-baseline space-x-3 ">
              <div className="text-2xl font-bold mt-2">{prospectStats.prospectsThisMonth}</div>
              <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                <ArrowUpCircleIcon className="inline-block h-5 w-5 text-green-500" />
                <div className="ml-2 text-medium text-gray-500">{prospectStats.percentageGrowth}%</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-medium">
              <p>
                <span className="font-bold">+{prospectStats.prospectsThisMonth}</span> le dernier mois
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-column space-y-0 pb-2 shadow-md">
            <CardTitle className="text-sm font-medium">Prospects conclus</CardTitle>
            <div className="flex items-baseline space-x-3 ">
              <div className="text-2xl font-bold mt-2">{prospectStats.concludedProspects}</div>
              <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                <ArrowUpCircleIcon className="inline-block h-5 w-5 text-green-500" />
                <div className="ml-2 text-medium text-gray-500">{prospectStats.percentageGrowth}%</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-medium">
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between space-x-4 p-4 bg-white shadow rounded-lg">
        <div className="flex">
          <div className="relative mr-5">
            <Input
              type="text"
              placeholder="Recherche"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-md"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <Select value={selectedUserType} onValueChange={setSelectedUserType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tous les Propects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les Propects</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="converted">Convertis</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          {selectedProspects.length > 0 && (
            <Button
              onClick={() => {
                selectedProspects.forEach((id) => handleDelete(id))
              }}
              className="bg-white border border-gray-500 text-black-500 font-medium py-2 px-4 rounded inline-flex items-center"
            >
              <TrashIcon className="h-4 w-4" />
              Supprimer
            </Button>
          )}

          {selectedProspects.length === 1 && (
            <>
              <Button
                className="bg-white border border-gray-500 text-black-500 font-medium py-2 px-4 rounded inline-flex items-center ml-4"
                onClick={() => {
                  const prospect = prospects.find((p) => p.id === selectedProspects[0])
                  if (prospect) openModal(prospect)
                }}
              >
                <PencilIcon className="h-4 w-4" />
                Modifier
              </Button>
              <Button
                className="bg-white border border-gray-500 text-black-500 font-medium py-2 px-4 rounded inline-flex items-center ml-4"
                onClick={() => handleConvertToUser(selectedProspects[0])}
                disabled={prospects.find((p) => p.id === selectedProspects[0])?.prospectStatus === "CONVERTED"}
              >
                <UserPlusIcon className="h-4 w-4 mr-2" />
                Convertir en utilisateur
              </Button>
              <Link
                href={{
                  pathname: "/commercial/nouveauprospect",
                  query: { prospectId: selectedProspects[0] },
                }}
              >
                <Button className="bg-white border border-gray-500 text-black-500 font-medium py-2 px-4 rounded inline-flex items-center ml-4">
                  <PencilIcon className="h-4 w-4" />
                  Créer un devis
                </Button>
              </Link>
            </>
          )}

          {selectedProspects.length === 0 && (
            <div>
              <button className="p-2 hover:bg-gray-100 rounded-md">
                <ArrowsUpDownIcon className="h-6 w-6 text-gray-600" />
              </button>

              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <FunnelIcon className="h-6 w-6 text-gray-600" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <div className="p-4 space-y-4">
                    <h3 className="font-semibold text-lg">Filtre</h3>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Statut</label>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEW">Nouveau</SelectItem>
                          <SelectItem value="CONTACTED">Contacté</SelectItem>
                          <SelectItem value="QUALIFIED">Qualifié</SelectItem>
                          <SelectItem value="PROPOSAL_SENT">Devis envoyé</SelectItem>
                          <SelectItem value="NEGOTIATION">En négociation</SelectItem>
                          <SelectItem value="CONVERTED">Converti</SelectItem>
                          <SelectItem value="LOST">Perdu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={resetFilters}>
                        Réinitialiser
                      </Button>
                      <Button onClick={applyFilters} className="bg-orange-500 hover:bg-orange-600 text-white">
                        Appliquer
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
        </div>
      ) : (
        <Table className="shadow">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedProspects.length === filteredProspects.length && filteredProspects.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-[200px]">Nom complet</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Besoin</TableHead>
              <TableHead>Date de Création</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProspects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Aucun prospect trouvé
                </TableCell>
              </TableRow>
            ) : (
              filteredProspects.map((prospect) => (
                <TableRow key={prospect.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedProspects.includes(prospect.id)}
                      onCheckedChange={(checked) => handleSelectProspect(prospect.id, !!checked)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link
                      href={{
                        pathname: "/admin/prospects/details",
                        query: { prospectId: prospect.id },
                      }}
                      className="flex items-center hover:bg-gray-100 rounded-md p-1 transition-colors"
                    >
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt={prospect.name} />
                        <AvatarFallback>{prospect.name?.charAt(0) || "P"}</AvatarFallback>
                      </Avatar>
                      <span className="text-blue-600 hover:underline">{prospect.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        prospect.prospectStatus === "CONVERTED"
                          ? "bg-green-100 text-green-800"
                          : prospect.prospectStatus === "LOST"
                            ? "bg-red-100 text-red-800"
                            : prospect.prospectStatus === "NEGOTIATION"
                              ? "bg-purple-100 text-purple-800"
                              : prospect.prospectStatus === "PROPOSAL_SENT"
                                ? "bg-blue-100 text-blue-800"
                                : prospect.prospectStatus === "QUALIFIED"
                                  ? "bg-teal-100 text-teal-800"
                                  : prospect.prospectStatus === "CONTACTED"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {prospect.prospectStatus === "NEW"
                        ? "Nouveau"
                        : prospect.prospectStatus === "CONTACTED"
                          ? "Contacté"
                          : prospect.prospectStatus === "QUALIFIED"
                            ? "Qualifié"
                            : prospect.prospectStatus === "PROPOSAL_SENT"
                              ? "Devis envoyé"
                              : prospect.prospectStatus === "NEGOTIATION"
                                ? "En négociation"
                                : prospect.prospectStatus === "CONVERTED"
                                  ? "Converti"
                                  : prospect.prospectStatus === "LOST"
                                    ? "Perdu"
                                    : prospect.prospectStatus}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    <span className="text-[#E55210]">{prospect.contact || "Non renseigné"}</span>
                  </TableCell>
                  <TableCell className="font-medium">{prospect.need || "Non renseigné"}</TableCell>
                  <TableCell className="font-medium">{new Date(prospect.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <EllipsisHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40">
                        <div className="flex flex-col space-y-1">
                          <Button variant="ghost" onClick={() => openModal(prospect)}>
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Modifier
                          </Button>
                          <Button variant="ghost" onClick={() => handleDelete(prospect.id)}>
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Supprimer
                          </Button>
                          {prospect.prospectStatus !== "CONVERTED" && (
                            <Button variant="ghost" onClick={() => handleConvertToUser(prospect.id)}>
                              <UserPlusIcon className="h-4 w-4 mr-2" />
                              Convertir
                            </Button>
                          )}
                          <Link
                            href={{
                              pathname: "/commercial/nouveauprospect",
                              query: { prospectId: prospect.id },
                            }}
                          >
                            <Button variant="ghost" className="w-full justify-start">
                              <PencilIcon className="h-4 w-4 mr-2" />
                              Créer un devis
                            </Button>
                          </Link>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Page 1 of {Math.ceil(filteredProspects.length / 10)}</div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" disabled>
            &lt;
          </Button>
          <Button variant="outline" size="icon">
            1
          </Button>
          <Button variant="outline" size="icon">
            &gt;
          </Button>
        </div>
      </div>
    </div>
  )
}

