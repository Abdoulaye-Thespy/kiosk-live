"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PhotoIcon } from "@heroicons/react/24/outline"
import { getUserDetails } from "@/app/actions/fetchUserStats"

type UserStatus = "PENDING" | "ACTIVE" | "INACTIVE"
type Role = "CLIENT" | "ADMIN" | "TECHNICIAN"

interface UserData {
  id: string
  name: string
  email: string
  role: Role
  status: UserStatus
  address: string | null
  phone: string | null
  image: string | null
}

export default function TabOneParametre() {
  const { data: session } = useSession()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isModified, setIsModified] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUserData() {
      if (session?.user?.id) {
        try {
          const data = await getUserDetails(session.user.id)
          setUserData(data)
        } catch (error) {
          console.error("Failed to fetch user data:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchUserData()
  }, [session])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData((prev) => (prev ? { ...prev, [name]: value } : null))
    setIsModified(true)
  }

  const handleSave = async () => {
    if (!userData) return

    // Here you would typically send the updated data to your backend
    // For now, we'll just log it
    console.log("Saving changes:", userData)
    setIsModified(false)

    // TODO: Implement the actual save functionality
    // For example:
    // try {
    //   await updateUserDetails(userData)
    //   // Show success message
    // } catch (error) {
    //   console.error("Failed to update user data:", error)
    //   // Show error message
    // }
  }

  const handleCancel = () => {
    // Reset the form to its initial state
    if (session?.user?.id) {
      getUserDetails(session.user.id).then(setUserData)
    }
    setIsModified(false)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!userData) {
    return <div>No user data available</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-medium">Général</h2>
          <p className="text-sm text-gray-500">Mettez en place et gérez votre profil.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleCancel}>
            Annuler
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSave} disabled={!isModified}>
            Enregistrer les changements
          </Button>
        </div>
      </div>

      <div className="max-w-3xl space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-1/3">
            <label className="text-sm font-medium">Avatar</label>
          </div>
          <div className="w-2/3 flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {userData.image ? (
                <img
                  src={userData.image || "/placeholder.svg"}
                  alt="User avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <PhotoIcon className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <Button variant="outline">Choisissez</Button>
            <span className="text-sm text-gray-500">JPG ou PNG, 1MB maximum</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-1/3">
            <label htmlFor="name" className="text-sm font-medium">
              Nom*
            </label>
          </div>
          <div className="w-2/3">
            <Input id="name" name="name" value={userData.name} onChange={handleInputChange} />
          </div>
        </div>

        <div className="flex justify-between items-center gap-4">
          <div className="w-1/3">
            <label htmlFor="email" className="text-sm font-medium">
              E-mail*
            </label>
          </div>
          <div className="w-2/3">
            <Input id="email" name="email" value={userData.email} onChange={handleInputChange} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-1/3">
            <label htmlFor="role" className="text-sm font-medium">
              Rôle
            </label>
          </div>
          <div className="w-2/3">
            <Input id="role" value={userData.role} disabled className="bg-gray-100" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-1/3">
            <label htmlFor="status" className="text-sm font-medium">
              Statut
            </label>
          </div>
          <div className="w-2/3">
            <Input id="status" value={userData.status} disabled className="bg-gray-100" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-1/3">
            <label htmlFor="address" className="text-sm font-medium">
              Adresse
            </label>
          </div>
          <div className="w-2/3">
            <Input
              id="address"
              name="address"
              value={userData.address || ""}
              onChange={handleInputChange}
              placeholder="Entrez votre adresse"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-1/3">
            <label htmlFor="phone" className="text-sm font-medium">
              Téléphone
            </label>
          </div>
          <div className="w-2/3">
            <Input
              id="phone"
              name="phone"
              value={userData.phone || ""}
              onChange={handleInputChange}
              placeholder="Entrez votre numéro de téléphone"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

