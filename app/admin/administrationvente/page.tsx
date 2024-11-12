'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  CalendarIcon,
  ChartBarIcon,
  ClipboardDocumentCheckIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline"
import { CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/solid"

import TabTwo from '@/app/ui/administrationvente/tab2';
import TabOne from '@/app/ui/administrationvente/tab1';
import TabThree from '@/app/ui/administrationvente/tab3';
import TabFour from '@/app/ui/administrationvente/tab4';
import Header from '@/app/ui/header';

const proformas = [
  {
    id: "1345",
    client: "Alain NGONO",
    amount: "100 000 fcfa",
    date: "01/02/2024",
    status: "Rejetée"
  },
  {
    id: "1339",
    client: "Thierry NTAMACK",
    amount: "100 000 fcfa",
    date: "01/02/2024",
    status: "Rejetée"
  },
  {
    id: "1340",
    client: "Boris ADJOGO",
    amount: "100 000 fcfa",
    date: "01/02/2024",
    status: "Validée"
  },
  {
    id: "1346",
    client: "Bruno AYOLO",
    amount: "600 000 fcfa",
    date: "01/02/2024",
    status: "Validée"
  },
  {
    id: "1332",
    client: "Alain NGONO",
    amount: "400 000 fcfa",
    date: "01/02/2024",
    status: "En attente"
  }
]

export default function AdminDashboard() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  return (
    <div className="container mx-auto space-y-6">
      <Header title ="Administration de Vente"/>

      <Tabs defaultValue="validation" className="space-y-6">
        <TabsList className="border-b w-full rounded-none p-0 h-auto">
          <div className="flex gap-6 text-muted-foreground">
            <TabsTrigger
              value="validation"
              className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold data-[state=active]:border-primary data-[state=active]:text-primary"
            >
              <ClipboardDocumentCheckIcon className="h-4 w-4 mr-2" />
              Validation des proformas
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold data-[state=active]:border-primary data-[state=active]:text-primary"
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Suivi de l&apos;activité
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold data-[state=active]:border-primary data-[state=active]:text-primary"
            >
              <ChartBarIcon className="h-4 w-4 mr-2" />
              Chiffres sur l&apos;activité
            </TabsTrigger>
            <TabsTrigger
              value="compartments"
              className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold data-[state=active]:border-primary data-[state=active]:text-primary"
            >
              <TableCellsIcon className="h-4 w-4 mr-2" />
              Suivi des compartiments
            </TabsTrigger>
            <TabsTrigger
              value="dashboard"
              className="relative h-10 rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold data-[state=active]:border-primary data-[state=active]:text-primary"
            >
              <ChartBarIcon className="h-4 w-4 mr-2" />
              Tableau de bord
            </TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value="validation" className="space-y-4">
        <TabOne />
        </TabsContent>

        <TabsContent value="activity">
          <div className=" flex items-center justify-center border rounded-lg">
            <TabTwo />
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <div className=" flex items-center justify-center border rounded-lg">
          <TabThree />
          </div>
        </TabsContent>

        <TabsContent value="compartments">
          <div className=" flex items-center justify-center border rounded-lg">
          <TabFour />
          </div>
        </TabsContent>

        <TabsContent value="dashboard">
          <div className="h-[400px] flex items-center justify-center border rounded-lg">
            <p className="text-muted-foreground">Tableau de bord content</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}