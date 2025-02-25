"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Info, HelpCircle } from 'lucide-react'
import { EnvelopeIcon, BellIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getUserDetails } from "@/app/actions/fetchUserStats"
import { format } from "date-fns"

interface ConnectionEvent {
  type: 'connection'
  date: string
  time: string
}

export default function UserDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("htrinnjkjkjk", params.id)
        const userData = await getUserDetails(params.id)
        setUser(userData)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError("Failed to load user data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error || !user) {
    return <div>Error: {error || "User not found"}</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      {/* Header */}
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Details</h1>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <EnvelopeIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <BellIcon className="h-4 w-4" />
          </Button>
          <Avatar>
            <AvatarImage src={user.image || "/placeholder.svg?height=32&width=32"} alt={user.name} />
            <AvatarFallback>{user.name?.[0]}</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon">
            <EllipsisHorizontalIcon className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <hr className="mt-10 mb-10" />
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/utilisateurs">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-medium">{user.name}</h1>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* General Information */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">
              Informations générales
            </CardTitle>
            <Button variant="ghost" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Nom complet</label>
              <p className="font-medium">{user.name}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Email</label>
              <p className="font-medium">{user.email}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Numéro de téléphone</label>
              <p className="font-medium">{user.phone || 'Non spécifié'}</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Address</label>
              <p className="font-medium">{user.address || 'Non spécifié'}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Rôle</label>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs text-red-500">
                {user.role}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Connection History */}
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-medium">
              Historiques des connexions
            </CardTitle>
            <Button variant="ghost" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {connectionHistory.map((event, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm text-green-500">
                  Connexion
                </span>
                <span className="text-sm text-muted-foreground ml-auto">
                  {event.date} {event.time}
                </span>
              </div>
            ))}
            {connectionHistory.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucun historique de connexion</p>
            )}
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}