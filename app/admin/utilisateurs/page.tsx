"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  EllipsisHorizontalIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline"
import {
  ArrowLongRightIcon,
  ArrowUpCircleIcon,
  XMarkIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/solid"
import { Loader2 } from "lucide-react"
import { format, isAfter, isBefore, isEqual } from "date-fns"
import { fr } from "date-fns/locale"
import Header from "@/app/ui/header"
import { createUserByAdmin } from "@/app/actions/createUserByAdmin"
import { fetchUserStats } from "@/app/actions/fetchUserStats"

type User = {
  id: number
  name: string
  role: string
  email: string
  phone: string
  CreatedAt: Date
  status: string
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("")
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)
  const [filterStatus, setFilterStatus] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    email: "",
    phone: "",
    role: "",
    address: "",
    status: "VERIFIED",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [totalUsers, setTotalUsers] = useState(0)
  const [newUsersThisMonth, setNewUsersThisMonth] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
    const [userStats, setUserStats] = useState({
      totalUsers: 0,
      usersThisMonth: 0,
      percentageGrowth: 0,
      lastNineUsers: [] as User[],
    })

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const response = await fetch("/api/users")
        const data: User[] = await response.json()
        setUsers(data.sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()))
        setTotalUsers(data.length)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUsers()
  }, [])

    useEffect(() => {
      async function loadStats() {
        setIsLoading(true)
        try {
          const [userResult] = await Promise.all([fetchUserStats()])
  
          if (userResult.success) {
            setUserStats({
              totalUsers: userResult.totalUsers,
              usersThisMonth: userResult.usersThisMonth,
              percentageGrowth: userResult.percentageGrowth,
              lastNineUsers: userResult.lastNineUsers,
            })
            setError(null)
          } else {
            setError("Échec du chargement des statistiques")
          }
        } catch (error) {
          console.error("Error loading stats:", error)
          setError("Une erreur est survenue lors du chargement des statistiques")
        }
        setIsLoading(false)
      }
  
      loadStats()
    }, [])



  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = !filterRole || user.role === filterRole
      const matchesStatus = !filterStatus || user.status === filterStatus
      const matchesDate =
        !filterDate || isEqual(new Date(user.CreatedAt), filterDate) || isAfter(new Date(user.CreatedAt), filterDate)
      return matchesSearch && matchesRole && matchesStatus && matchesDate
    })
  }, [users, searchTerm, filterRole, filterStatus, filterDate])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((user) => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete the selected users?")) {
      try {
        const response = await fetch("/api/users", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userIds: selectedUsers }),
        })
        if (response.ok) {
          setUsers(users.filter((user) => !selectedUsers.includes(user.id)))
          setSelectedUsers([])
        } else {
          throw new Error("Failed to delete users")
        }
      } catch (error) {
        console.error("Error deleting users:", error)
        setError("Failed to delete users. Please try again.")
      }
    }
  }

  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    }
  }

  const openModal = (user?: User) => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: "", // Assuming address is not in the User type
        status: user.status,
      })
      setIsEditing(true)
    } else {
      setFormData({
        id: 0,
        name: "",
        email: "",
        phone: "",
        role: "",
        address: "",
        status: "VERIFIED",
      })
      setIsEditing(false)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setIsEditing(false)
  }

  const resetFilters = () => {
    setFilterRole("")
    setFilterDate(undefined)
    setFilterStatus("")
    setIsFilterOpen(false)
  }

  const applyFilters = () => {
    setIsFilterOpen(false)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setFilterDate(date)
    setIsCalendarOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (isEditing) {
        const response = await fetch(`/api/users/${formData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
        if (response.ok) {
          const updatedUser = await response.json()
          setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
        } else {
          throw new Error("Failed to update user")
        }
      } else {
        const result = await createUserByAdmin(formData)
        if (result.success) {
          setUsers((prevUsers) => [result.user, ...prevUsers])
        } else {
          throw new Error(result.error)
        }
      }
      closeModal()
    } catch (error) {
      console.error("Error submitting user:", error)
      setError("Failed to submit user. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto space-y-6">
      <Header title="Utilisateurs" />

      <div className="flex justify-end items-center">
        <Button variant="ghost">
          <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
        </Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => openModal()}>
          <UserPlusIcon className="mr-2 h-4 w-4" />
          Ajouter des utilisateurs
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
                  {isEditing ? "Modifier l'utilisateur" : "Créer un utilisateur"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet
                    </label>
                    <Input
                      id="fullName"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Tahsan Khan"
                      className="w-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Adresse mail"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro
                      </label>
                      <Input
                        id="number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="6 012 345 678"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Rôle
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Sélectionner un rôle</option>
                      <option value="CLIENT">Client</option>
                      <option value="ADMIN">Admin</option>
                      <option value="RESPONSABLE">Responsable Kiosque</option>
                      <option value="TECHNICIEN">Technicien</option>
                      <option value="COMMERCIAL">Commercial</option>
                      <option value="JURIDIQUE">Responsable Juridique</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="address line"
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button variant="outline" onClick={closeModal}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {isEditing ? "Updating..." : "Adding..."}
                        </>
                      ) : isEditing ? (
                        "Modifier"
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

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-column space-y-0 pb-2 shadow-md">
            <CardTitle className="text-sm font-medium">Nombre Total d'utilisateurs</CardTitle>
            <div className="flex items-baseline space-x-3 ">
              <div className="text-2xl font-bold mt-2">{totalUsers}</div>
              <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                <ArrowUpCircleIcon className="inline-block h-5 w-5 text-green-500" />
                <div className="ml-2 text-medium text-gray-500">{userStats.percentageGrowth} %</div>
              </div>
            </div>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux utilisateurs</CardTitle>
            <UserPlusIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-8">
              <div className="text-2xl font-bold">{userStats.usersThisMonth}</div>
              <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                <ArrowUpCircleIcon className="inline-block h-5 w-5 text-green-500" />
                <div className="ml-2 text-medium text-gray-500">{userStats.percentageGrowth} %</div>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground w-70">
              <span>
                <b>+{userStats.usersThisMonth}</b> Ce dernier mois
              </span>
              <ArrowLongRightIcon className="h-4 w-4" />
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
        </div>
        <div>
          {selectedUsers.length > 0 && (
            <Button
              onClick={handleDelete}
              className="bg-white border border-gray-500 text-black-500 font-medium py-2 px-4 rounded inline-flex items-center"
            >
              <TrashIcon className="h-4 w-4" />
              Supprimer
            </Button>
          )}

          {selectedUsers.length === 1 && (
            <Button
              className="bg-white border border-gray-500 text-black-500 font-medium py-2 px-4 rounded inline-flex items-center ml-4"
              onClick={() => openModal(users.find((user) => user.id === selectedUsers[0]))}
            >
              <PencilIcon className="h-4 w-4" />
              Modifier
            </Button>
          )}

          {selectedUsers.length === 0 && (
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
                      <label className="text-sm font-medium">Rôle</label>
                      <Select value={filterRole} onValueChange={setFilterRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ADMIN">Administrateur</SelectItem>
                          <SelectItem value="CLIENT">Client</SelectItem>
                          <SelectItem value="RESPONSABLE">Responsable Kiosque</SelectItem>
                          <SelectItem value="TECHNICIEN">Technicien</SelectItem>
                          <SelectItem value="JURIDIQUE">Responsable Juridique</SelectItem>
                          <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                          <SelectItem value="COMPTABLE">Comptable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date</label>
                      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            onClick={() => setIsCalendarOpen(true)}
                          >
                            {filterDate ? format(filterDate, "PP", { locale: fr }) : "Sélectionner une date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={filterDate} onSelect={handleDateSelect} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Statut</label>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">En Attente</SelectItem>
                          <SelectItem value="VERIFIED">Vérifié</SelectItem>
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
                <Checkbox checked={selectedUsers.length === filteredUsers.length} onCheckedChange={handleSelectAll} />
              </TableHead>
              <TableHead className="w-[200px]">Nom complet</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Adresse Email</TableHead>
              <TableHead>Numéro</TableHead>
              <TableHead>Date d&apos;insc.</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={(checked) => handleSelectUser(user.id, checked)}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <Link
                    href={{
                      pathname: "/admin/utilisateurs/details",
                      query: { userId: user.id },
                    }}
                    className="flex items-center hover:bg-gray-100 rounded-md p-1 transition-colors"
                  >
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-blue-600 hover:underline">{user.name}</span>
                  </Link>
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="font-medium">
                  <span className="text-[#E55210]">{user.email}</span>
                </TableCell>
                <TableCell className="font-medium">{user.phone}</TableCell>
                <TableCell className="font-medium">
                  4444
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.status === "VERIFIED"
                        ? "bg-green-100 text-green-800"
                        : user.status === "PENDING"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <EllipsisHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40">
                      <div className="flex flex-col space-y-1">
                        <Button variant="ghost" onClick={() => openModal(user)}>
                          <PencilIcon className="h-4 w-4 mr-2" />
                          Modifier
                        </Button>
                        <Button variant="ghost" onClick={() => handleDelete()}>
                          <TrashIcon className="h-4 w-4 mr-2" />
                          Supprimer
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Page 1 of 34</div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" disabled>
            &lt;
          </Button>
          <Button variant="outline" size="icon">
            1
          </Button>
          <Button variant="outline" size="icon">
            2
          </Button>
          <Button variant="outline" size="icon">
            3
          </Button>
          <Button variant="outline" size="icon">
            ...
          </Button>
          <Button variant="outline" size="icon">
            34
          </Button>
          <Button variant="outline" size="icon">
            &gt;
          </Button>
        </div>
      </div>
    </div>
  )
}

