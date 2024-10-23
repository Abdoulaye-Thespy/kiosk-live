'use client';
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { EnvelopeIcon, BellIcon, EllipsisHorizontalIcon, ArrowDownTrayIcon, MagnifyingGlassIcon, UserGroupIcon, UserPlusIcon } from '@heroicons/react/24/outline'

const users = [
  { id: 1, name: 'Darlene Robertson', role: 'Client', email: 'darlenerobertson@gmail.com', number: '+237 691 234 567', date: '01/02/2024', status: 'Inactif' },
  { id: 2, name: 'Jane Cooper', role: 'Admin', email: 'janecooper@gmail.com', number: '+237 691 234 567', date: '01/02/2024', status: 'Suspendu' },
  { id: 3, name: 'Jenny Wilson', role: 'Comptable', email: 'jennywilson@gmail.com', number: '+237 691 234 567', date: '01/02/2024', status: 'Actif' },
  { id: 4, name: 'Robert Fox', role: 'Client', email: 'robertfox@gmail.com', number: '+237 691 234 567', date: '01/02/2024', status: 'Inactif' },
  { id: 5, name: 'Wade Warren', role: 'R. Kiosque', email: 'wadewarren@gmail.com', number: '+237 691 234 567', date: '01/02/2024', status: 'Inactif' },
]

export default function UserManagement() {
  const [selectedUsers, setSelectedUsers] = React.useState<number[]>([])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(user => user.id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Utilisateurs</h1>
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
      <hr />

      <div className="flex justify-between items-center">
        <Button variant="ghost">
          <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
          Exporter
        </Button>
        <Button>
          <UserPlusIcon className="mr-2 h-4 w-4" />
          Ajouter des utilisateurs
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total d&apos;utilisateurs</CardTitle>
            <UserGroupIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,822</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+5.2%</span> ce dernier mois
            </p>
            <div className="text-sm text-muted-foreground mt-2">+140 Ce dernier mois</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux utilisateurs</CardTitle>
            <UserPlusIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">341</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+8.5%</span> ce dernier mois
            </p>
            <div className="text-sm text-muted-foreground mt-2">+76 Ce dernier mois</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Recherche" className="pl-8 w-[300px]" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tous les utilisateurs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les utilisateurs</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
            <SelectItem value="suspended">Suspendu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedUsers.length === users.length}
                onCheckedChange={handleSelectAll}
              />
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
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={(checked) => handleSelectUser(user.id, checked)}
                />
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {user.name}
                </div>
              </TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.number}</TableCell>
              <TableCell>{user.date}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.status === 'Actif' ? 'bg-green-100 text-green-800' :
                  user.status === 'Inactif' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {user.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <EllipsisHorizontalIcon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page 1 of 34
        </div>
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