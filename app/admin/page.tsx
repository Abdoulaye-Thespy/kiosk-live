'use client';
import React, { useState, useRef, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

import {
  ArrowDownTrayIcon,
  ArrowUpCircleIcon,
} from '@heroicons/react/24/solid';
import { Search, RefreshCw, TrendingUp, Users, Store, FileText, Building2, ArrowUpRight, ArrowRight, ArrowUpLeft } from "lucide-react"

import styles from '@/app/ui/dashboard.module.css';
import Header from '../ui/header';


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
      <Header title="Tableau de Bord" />

      <div className="flex justify-end items-center">


        <div className='flex justify-around'>
          <Button className={styles.refresh}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8.00008 2.66671C5.05456 2.66671 2.66675 5.05452 2.66675 8.00004C2.66675 9.97413 3.73928 11.6977 5.33341 12.6199M8.00008 2.66671L6.66675 1.33337M8.00008 2.66671L7.00008 4.33337M8.00008 13.3334C10.9456 13.3334 13.3334 10.9456 13.3334 8.00004C13.3334 6.02595 12.2609 4.30237 10.6667 3.38021M8.00008 13.3334L9.33341 14.6667M8.00008 13.3334L9.00008 11.6667" stroke="#0D0D12" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </Button>

          <Select defaultValue="monthly">
            <SelectTrigger className="text-sm w-40 mr-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M5.33333 2.00004H4C2.89543 2.00004 2 2.89547 2 4.00004V6.00004M5.33333 2.00004V1.33337M5.33333 2.00004H10.6667M5.33333 2.00004V2.66671M10.6667 2.00004H12C13.1046 2.00004 14 2.89547 14 4.00004V6.00004M10.6667 2.00004V1.33337M10.6667 2.00004V2.66671M2 6.00004V12.6667C2 13.7713 2.89543 14.6667 4 14.6667H12C13.1046 14.6667 14 13.7713 14 12.6667V6.00004M2 6.00004H14" stroke="#0D0D12" stroke-width="1.5" stroke-linecap="round" />
              </svg>
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
              <CardTitle className="text-xs font-medium">Contrats actif et exprirés</CardTitle>
              <div className="flex items-baseline space-x-3 ">
                <div className="text-xl font-bold mt-2">14</div>
                <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                  <div className="ml-2 text-xm text-black-500 font-bold">Actifs</div>
                </div>
              </div>
              <div className="flex items-baseline space-x-3 ">
                <div className="text-xl font-bold mt-2">1,822</div>
                <div className="flex items-center bg-red-500 rounded-full bg-opacity-15 px-2 py-0.5">
                  <div className="ml-2 text-xm font-bold text-black-500">Expirés</div>
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
                <div className="flex items-center bg-red-500 rounded-full bg-opacity-15 px-2 py-0.5">

                  <div className="ml-2 text-xm font-bold text-black-500">En attente</div>
                </div>
              </div>
              <div className="flex items-baseline space-x-3 ">
                <div className="text-2xl font-bold mt-2">1,822</div>
                <div className="flex items-center bg-red-500 rounded-full bg-opacity-15 px-2 py-0.5">
                  <div className="ml-2 text-xm font-bold text-black-500">En attente</div>
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
                  <div className="space-y-6 lg:w-1/3">
                    {/* Revenue Card */}
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-medium font-semibold text-muted-foreground">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M1.33325 5.71275C1.33325 4.9153 1.65484 4.42659 2.32034 4.05623L5.05983 2.53167C6.49532 1.73281 7.21306 1.33337 7.99992 1.33337C8.78678 1.33337 9.50452 1.73281 10.94 2.53167L13.6795 4.05623C14.345 4.42659 14.6666 4.9153 14.6666 5.71275C14.6666 5.929 14.6666 6.03712 14.643 6.126C14.5189 6.593 14.0957 6.66671 13.6871 6.66671H2.31277C1.9041 6.66671 1.48093 6.593 1.35687 6.126C1.33325 6.03712 1.33325 5.929 1.33325 5.71275Z" stroke="#555F75" stroke-width="1.3" />
                            <path d="M7.99719 4.66663H8.00317" stroke="#555F75" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M2.6665 6.66675V12.3334M5.33317 6.66675V12.3334" stroke="#555F75" stroke-width="1.3" />
                            <path d="M10.6665 6.66663V12.3333M13.3332 6.66663V12.3333" stroke="#555F75" stroke-width="1.3" />
                            <path d="M12.6666 12.3334H3.33325C2.22868 12.3334 1.33325 13.2288 1.33325 14.3334C1.33325 14.5175 1.48249 14.6667 1.66658 14.6667H14.3333C14.5173 14.6667 14.6666 14.5175 14.6666 14.3334C14.6666 13.2288 13.7712 12.3334 12.6666 12.3334Z" stroke="#555F75" stroke-width="1.3" />
                          </svg>
                          Revenus
                          <span className="text-xs font-medium text-green-500 bg-red flex bg-green-500 rounded-full bg-opacity-15 pt-1 pr-2 pb-1 pl-2"> <ArrowUpLeft className="h-4 w-4 text-green-500" />160%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M3.3335 12.5L3.3335 15.8333" stroke="#555F75" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M10 7.5L10 15.8333" stroke="#555F75" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M18.3335 18.3333L1.66683 18.3333" stroke="#555F75" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M16.6667 10.8333L16.6667 15.8333" stroke="#555F75" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M4.66683 7.33323C4.36275 6.92845 3.87866 6.66663 3.33341 6.66663C2.41294 6.66663 1.66675 7.41282 1.66675 8.33329C1.66675 9.25377 2.41294 9.99996 3.33341 9.99996C4.25389 9.99996 5.00008 9.25377 5.00008 8.33329C5.00008 7.95806 4.87608 7.6118 4.66683 7.33323ZM4.66683 7.33323L8.66667 4.33335M8.66667 4.33335C8.97074 4.73813 9.45484 4.99996 10.0001 4.99996C10.6526 4.99996 11.2175 4.62501 11.4911 4.07881M8.66667 4.33335C8.45741 4.05479 8.33342 3.70852 8.33342 3.33329C8.33342 2.41282 9.07961 1.66663 10.0001 1.66663C10.9206 1.66663 11.6667 2.41282 11.6667 3.33329C11.6667 3.60128 11.6035 3.85449 11.4911 4.07881M11.4911 4.07881L15.1757 5.92111M15.1757 5.92111C15.0633 6.14543 15.0001 6.39864 15.0001 6.66663C15.0001 7.5871 15.7463 8.33329 16.6667 8.33329C17.5872 8.33329 18.3334 7.5871 18.3334 6.66663C18.3334 5.74615 17.5872 4.99996 16.6667 4.99996C16.0143 4.99996 15.4493 5.37491 15.1757 5.92111Z" stroke="#555F75" stroke-width="1.5" />
                          </svg>
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
                    </div>

                    {/* Transactions Card */}
                    <hr className="border-t border-[#555F75]-300" />
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-medium font-semibold text-muted-foreground">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M1.33325 5.71275C1.33325 4.9153 1.65484 4.42659 2.32034 4.05623L5.05983 2.53167C6.49532 1.73281 7.21306 1.33337 7.99992 1.33337C8.78678 1.33337 9.50452 1.73281 10.94 2.53167L13.6795 4.05623C14.345 4.42659 14.6666 4.9153 14.6666 5.71275C14.6666 5.929 14.6666 6.03712 14.643 6.126C14.5189 6.593 14.0957 6.66671 13.6871 6.66671H2.31277C1.9041 6.66671 1.48093 6.593 1.35687 6.126C1.33325 6.03712 1.33325 5.929 1.33325 5.71275Z" stroke="#555F75" stroke-width="1.3" />
                            <path d="M7.99719 4.66663H8.00317" stroke="#555F75" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M2.6665 6.66675V12.3334M5.33317 6.66675V12.3334" stroke="#555F75" stroke-width="1.3" />
                            <path d="M10.6665 6.66663V12.3333M13.3332 6.66663V12.3333" stroke="#555F75" stroke-width="1.3" />
                            <path d="M12.6666 12.3334H3.33325C2.22868 12.3334 1.33325 13.2288 1.33325 14.3334C1.33325 14.5175 1.48249 14.6667 1.66658 14.6667H14.3333C14.5173 14.6667 14.6666 14.5175 14.6666 14.3334C14.6666 13.2288 13.7712 12.3334 12.6666 12.3334Z" stroke="#555F75" stroke-width="1.3" />
                          </svg>
                          Transactions
                          <span className="text-xs font-medium text-green-500 bg-red flex bg-green-500 rounded-full bg-opacity-15 pt-1 pr-2 pb-1 pl-2"> <ArrowUpLeft className="h-4 w-4 text-green-500" />160%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M3.3335 12.5L3.3335 15.8333" stroke="#555F75" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M10 7.5L10 15.8333" stroke="#555F75" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M18.3335 18.3333L1.66683 18.3333" stroke="#555F75" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M16.6667 10.8333L16.6667 15.8333" stroke="#555F75" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M4.66683 7.33323C4.36275 6.92845 3.87866 6.66663 3.33341 6.66663C2.41294 6.66663 1.66675 7.41282 1.66675 8.33329C1.66675 9.25377 2.41294 9.99996 3.33341 9.99996C4.25389 9.99996 5.00008 9.25377 5.00008 8.33329C5.00008 7.95806 4.87608 7.6118 4.66683 7.33323ZM4.66683 7.33323L8.66667 4.33335M8.66667 4.33335C8.97074 4.73813 9.45484 4.99996 10.0001 4.99996C10.6526 4.99996 11.2175 4.62501 11.4911 4.07881M8.66667 4.33335C8.45741 4.05479 8.33342 3.70852 8.33342 3.33329C8.33342 2.41282 9.07961 1.66663 10.0001 1.66663C10.9206 1.66663 11.6667 2.41282 11.6667 3.33329C11.6667 3.60128 11.6035 3.85449 11.4911 4.07881M11.4911 4.07881L15.1757 5.92111M15.1757 5.92111C15.0633 6.14543 15.0001 6.39864 15.0001 6.66663C15.0001 7.5871 15.7463 8.33329 16.6667 8.33329C17.5872 8.33329 18.3334 7.5871 18.3334 6.66663C18.3334 5.74615 17.5872 4.99996 16.6667 4.99996C16.0143 4.99996 15.4493 5.37491 15.1757 5.92111Z" stroke="#555F75" stroke-width="1.5" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-semibold">132</span>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Sur six mois
                        </div>
                      </div>
                    </div>

                    {/* Average Transactions Card */}
                    <hr className="border-t border-[#555F75]-300" />
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-medium font-semibold text-muted-foreground">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M9.33325 1.46661C8.90245 1.37916 8.45652 1.33325 7.99992 1.33325C4.31802 1.33325 1.33325 4.31802 1.33325 7.99992C1.33325 11.6818 4.31802 14.6666 7.99992 14.6666C11.6818 14.6666 14.6666 11.6818 14.6666 7.99992C14.6666 7.54332 14.6207 7.09739 14.5333 6.66659" stroke="#555F75" stroke-width="1.2" stroke-linecap="round" />
                            <path d="M7.99984 5.99992C7.26344 5.99992 6.6665 6.44763 6.6665 6.99992C6.6665 7.55219 7.26344 7.99992 7.99984 7.99992C8.73624 7.99992 9.33317 8.44765 9.33317 8.99992C9.33317 9.55219 8.73624 9.99992 7.99984 9.99992M7.99984 5.99992C8.58037 5.99992 9.07424 6.27819 9.2573 6.66659M7.99984 5.99992V5.33325M7.99984 9.99992C7.4193 9.99992 6.92544 9.72165 6.74237 9.33325M7.99984 9.99992V10.6666" stroke="#555F75" stroke-width="1.2" stroke-linecap="round" />
                            <path d="M11.3319 4.66785L14.1158 1.88238M14.6653 4.32001L14.5865 2.25901C14.5865 1.77325 14.2964 1.47059 13.7681 1.43242L11.6854 1.33451" stroke="#555F75" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          Transactions
                          <span className="text-xs font-medium text-green-500 bg-red flex bg-green-500 rounded-full bg-opacity-15 pt-1 pr-2 pb-1 pl-2"> <ArrowUpLeft className="h-4 w-4 text-green-500" />160%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M3.3335 12.5L3.3335 15.8333" stroke="#555F75" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M10 7.5L10 15.8333" stroke="#555F75" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M18.3335 18.3333L1.66683 18.3333" stroke="#555F75" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M16.6667 10.8333L16.6667 15.8333" stroke="#555F75" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M4.66683 7.33323C4.36275 6.92845 3.87866 6.66663 3.33341 6.66663C2.41294 6.66663 1.66675 7.41282 1.66675 8.33329C1.66675 9.25377 2.41294 9.99996 3.33341 9.99996C4.25389 9.99996 5.00008 9.25377 5.00008 8.33329C5.00008 7.95806 4.87608 7.6118 4.66683 7.33323ZM4.66683 7.33323L8.66667 4.33335M8.66667 4.33335C8.97074 4.73813 9.45484 4.99996 10.0001 4.99996C10.6526 4.99996 11.2175 4.62501 11.4911 4.07881M8.66667 4.33335C8.45741 4.05479 8.33342 3.70852 8.33342 3.33329C8.33342 2.41282 9.07961 1.66663 10.0001 1.66663C10.9206 1.66663 11.6667 2.41282 11.6667 3.33329C11.6667 3.60128 11.6035 3.85449 11.4911 4.07881M11.4911 4.07881L15.1757 5.92111M15.1757 5.92111C15.0633 6.14543 15.0001 6.39864 15.0001 6.66663C15.0001 7.5871 15.7463 8.33329 16.6667 8.33329C17.5872 8.33329 18.3334 7.5871 18.3334 6.66663C18.3334 5.74615 17.5872 4.99996 16.6667 4.99996C16.0143 4.99996 15.4493 5.37491 15.1757 5.92111Z" stroke="#555F75" stroke-width="1.5" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-semibold">6000</span>
                          <span className="text-sm text-muted-foreground">Fcfa</span>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          Sur Six Mois
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
                            tickFormatter={(value) => `${value / 1000}k`}
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