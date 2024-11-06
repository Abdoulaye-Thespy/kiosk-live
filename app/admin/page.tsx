'use client';
import React, { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { EnvelopeIcon, BellIcon, EllipsisHorizontalIcon, ArrowDownTrayIcon, MagnifyingGlassIcon, UserGroupIcon, UserPlusIcon } from '@heroicons/react/24/outline'

import {
  ArrowLongRightIcon,
  ArrowUpCircleIcon,
  XMarkIcon,
  FunnelIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/solid';
import { Search, RefreshCw, TrendingUp, Users, Store, FileText, Building2, ArrowUpRight, ArrowRight } from "lucide-react"

import styles from '@/app/ui/dashboard.module.css';

const data = [
  { name: 'Jan', value: 2000 },
  { name: 'Feb', value: 2500 },
  { name: 'Mar', value: 3000 },
  { name: 'Apr', value: 3500 },
  { name: 'May', value: 4000 },
  { name: 'Jun', value: 4500 },
  { name: 'Jul', value: 5000 },
  { name: 'Aug', value: 5500 },
  { name: 'Sep', value: 6000 },
  { name: 'Oct', value: 6500 },
  { name: 'Nov', value: 7000 },
  { name: 'Dec', value: 6000 },
]

const users = [
  { name: 'Darrell Steward', date: 'Sep 18', avatar: '/placeholder.svg?height=32&width=32' },
  { name: 'Robert Fox', date: 'Sep 18', avatar: '/placeholder.svg?height=32&width=32' },
  { name: 'Robert Fox', date: 'Sep 18', avatar: '/placeholder.svg?height=32&width=32' },
  { name: 'Robert Fox', date: 'Sep 18', avatar: '/placeholder.svg?height=32&width=32' },
  { name: 'Robert Fox', date: 'Sep 18', avatar: '/placeholder.svg?height=32&width=32' },
  { name: 'Robert Fox', date: 'Sep 18', avatar: '/placeholder.svg?height=32&width=32' },
  { name: 'Robert Fox', date: 'Sep 18', avatar: '/placeholder.svg?height=32&width=32' },
  { name: 'Robert Fox', date: 'Sep 18', avatar: '/placeholder.svg?height=32&width=32' },
  { name: 'Robert Fox', date: 'Sep 18', avatar: '/placeholder.svg?height=32&width=32' },
  // Add more users as needed
]

export default function UserManagement() {

  return (
    <div className="container mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tableau de Bord</h1>
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
      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className={`shadow-md ${styles.carte}`}>
            <CardHeader className={`flex flex-column space-y-0 pb-2 shadow-md ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium">Nombre Total de Kiosques</CardTitle>
              <div className="flex items-baseline space-x-3 ">
                <div className="text-2xl font-bold mt-2">1,822</div>
                <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                  <div className="inline-block  text-xs font-medium text-green-500 flex items-center">
                    <ArrowUpCircleIcon className='inline-block h-5 w-5' />

                  </div>
                  <div className="ml-2 text-medium text-gray-500">5.2%</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              
              <div className="flex items-center text-medium">
              <p> <span className='font-bold'>+22</span> le dernier mois</p>
              </div>
            </CardContent>
          </Card>
          <Card className={`shadow-md ${styles.carte}`}>
            <CardHeader className={`flex flex-column space-y-0 pb-2 shadow-md ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium">Nombre total d’utilisateurs</CardTitle>
              <div className="flex items-baseline space-x-3">
              <div className="text-2xl font-bold mt-2">132</div>
              <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                <div className="inline-block  text-xs font-medium text-green-500 flex items-center">
                  <ArrowUpCircleIcon className='inline-block h-5 w-5' />

                </div>
                <div className="ml-2 text-medium text-gray-500">5.2%</div>
              </div>
            </div>
            </CardHeader>
            <CardContent>
              
              <div className="flex items-center text-medium">
              <p> <span className='font-bold'>+29</span> le dernier mois</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`shadow-md ${styles.carte}`}>
            <CardHeader className={`flex flex-column space-y-0 pb-2 shadow-md ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium">Contrats actif et exprirés</CardTitle>
              <div className="flex items-baseline space-x-3 ">
                <div className="text-2xl font-bold mt-2">14</div>
                <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                  <div className="ml-2 text-medium text-gray-500">Actifs</div>
                </div>
              </div>
              <div className="flex items-baseline space-x-3 ">
                <div className="text-2xl font-bold mt-2">1,822</div>
                <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                  <div className="ml-2 text-medium text-gray-500">Expirés</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card>
          <Card className={`shadow-md ${styles.carte}`}>
            <CardHeader className={`flex flex-column space-y-0 pb-2 shadow-md ${styles.carteEntete}`}>
              <CardTitle className="text-sm font-medium">Factures en attentes</CardTitle>
              <div className="flex items-baseline space-x-3 ">
                <div className="text-2xl font-bold mt-2">14</div>
                <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                  <div className="inline-block  text-xs font-medium text-green-500 flex items-center">
                    <ArrowUpCircleIcon className='inline-block h-5 w-5' />

                  </div>
                  <div className="ml-2 text-medium text-gray-500">5.2%</div>
                </div>
              </div>
              <div className="flex items-baseline space-x-3 ">
                <div className="text-2xl font-bold mt-2">1,822</div>
                <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                  <div className="inline-block  text-xs font-medium text-green-500 flex items-center">
                    <ArrowUpCircleIcon className='inline-block h-5 w-5' />

                  </div>
                  <div className="ml-2 text-medium text-gray-500">5.2%</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card>

        </div>

        {/* Chart Section */}
        <div className="grid gap-4 md:grid-cols-7 mt-7">
          <div className="md:col-span-5">

            <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Metrics Column */}
          <div className="space-y-6 lg:w-1/3">
            {/* Revenue Card */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  Revenus
                </div>
                <div className="flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-xs font-medium text-green-500">160%</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold">86,044</span>
                  <span className="text-sm text-muted-foreground">Fcfa</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  From 175,26
                </div>
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="mt-4 text-sm">
                  <SelectValue placeholder="Tous les revenus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les revenus</SelectItem>
                  <SelectItem value="monthly">Revenus mensuels</SelectItem>
                  <SelectItem value="yearly">Revenus annuels</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transactions Card */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Transactions</span>
                <div className="flex items-center gap-1">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <span className="text-xs font-medium text-green-500">160%</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-semibold">132</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Sur 6 mois
                </div>
              </div>
            </div>

            {/* Average Transactions Card */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Moy. Transactions</span>
                <div className="flex items-center gap-1">
                  <ArrowRight className="h-4 w-4 text-orange-500" />
                  <span className="text-xs font-medium text-orange-500">60%</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold">6,144</span>
                  <span className="text-sm text-muted-foreground">Fcfa</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Sur 6 mois
                </div>
              </div>
            </div>
          </div>

          {/* Chart Column */}
          <div className="lg:w-2/3">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    vertical={false}
                    stroke="#f0f0f0" 
                  />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#888' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#888' }}
                    tickFormatter={(value) => `${value/1000}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
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


            {/* Kiosks Section */}
            <Card className="shadow-md mt-5">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Kiosks</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">390</div>
                  <span className="text-xs text-green-500">+12</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search kiosks..." className="pl-8" />
                  </div>
                  <Button size="icon" variant="outline">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}