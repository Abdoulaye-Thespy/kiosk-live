'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Info, HelpCircle } from "lucide-react"
import { EnvelopeIcon, BellIcon, EllipsisHorizontalIcon, ArrowDownTrayIcon, MagnifyingGlassIcon, UserGroupIcon, UserPlusIcon } from '@heroicons/react/24/outline'
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ConnectionEvent {
  type: 'connection' | 'disconnection'
  date: string
  time: string
}

interface Activity {
  title: string
  date: string
}

const connectionHistory: ConnectionEvent[] = [
  { type: 'connection', date: 'Jun 19, 2024', time: '10:30 AM' },
  { type: 'connection', date: 'Jun 19, 2024', time: '11:45 AM' },
  { type: 'disconnection', date: 'Jun 19, 2024', time: '12:30 PM' },
  { type: 'disconnection', date: 'Jun 19, 2024', time: '2:15 PM' },
  { type: 'disconnection', date: 'Jun 19, 2024', time: '3:45 PM' },
  { type: 'disconnection', date: 'Jun 19, 2024', time: '4:30 PM' },
  { type: 'connection', date: 'Jun 19, 2024', time: '5:00 PM' },
]

const recentActivities: Activity[] = [
  { title: "Création d'un nouveau kiosque", date: 'Jun 19, 2024' },
  { title: "Modification d'une transaction", date: 'Jun 19, 2024' },
  { title: "Modification d'une transaction", date: 'Jun 19, 2024' },
]

export default function UserDetails() {
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
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>U</AvatarFallback>
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
          <h1 className="text-xl font-medium">Jenny Wilson</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Button>
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
              <p className="font-medium">Nicolas ELOUDIOU</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Email</label>
              <p className="font-medium">jennywilson@gmail.com</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Numéro de téléphone</label>
              <p className="font-medium">(555) 555-1234</p>
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Address</label>
              <p className="font-medium">Yaoundé&&&&&&&&&&&&&&&&&&&</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Rôle</label>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs text-red-500">
                Client
              </span>
            </div>
            <Button variant="outline" className="w-full">Modifier</Button>
          </CardContent>
        </Card>

        {/* Connection History and Activities */}
        <div className="space-y-6">
          <Card>
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
                  <span className={`h-2 w-2 rounded-full ${
                    event.type === 'connection' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <span className={`text-sm ${
                    event.type === 'connection' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {event.type === 'connection' ? 'Connexion' : 'Déconnexion'}
                  </span>
                  <span className="text-sm text-muted-foreground ml-auto">
                    {event.date}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium">
                Activités récentes
              </CardTitle>
              <Button variant="ghost" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}