'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Header from '@/app/ui/header'
import { ReminderLetterDialog } from './nouveau/page'


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, MoreHorizontal, Search } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Invoice {
  id: string
  number: string
  client: string
  type: 'location' | 'Maintenance' | 'Partenariat'
  date: string
  amount: string
  status: 'En retard' | 'Annulé'
}

const invoices: Invoice[] = [
  { id: '1', number: '1345', client: 'FACT-2024-001', type: 'location', date: '01/02/2024', amount: '1 000 000 FCFA', status: 'En retard' },
  { id: '2', number: '1345', client: 'KioskX SARL', type: 'Partenariat', date: '01/02/2024', amount: '1 000 000 FCFA', status: 'En retard' },
  { id: '3', number: '1345', client: 'NDOUME/mmmm', type: 'Maintenance', date: '01/02/2024', amount: '1 000 000 FCFA', status: 'En retard' },
  { id: '4', number: '1345', client: 'Jean Dupont', type: 'location', date: '01/02/2024', amount: '1 000 000 FCFA', status: 'En retard' },
  { id: '5', number: '1345', client: 'KioskX SARL', type: 'location', date: '01/02/2024', amount: '1 000 000 FCFA', status: 'En retard' },
  { id: '6', number: '1345', client: 'Jean Dupont', type: 'location', date: '01/02/2024', amount: '1 000 000 FCFA', status: 'En retard' },
  { id: '7', number: '1345', client: 'KioskX SARL', type: 'Partenariat', date: '01/02/2024', amount: '1 000 000 FCFA', status: 'En retard' },
]

export default function RecoveryTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 34
  const [isReminderOpen, setIsReminderOpen] = useState(false)

  return (
    <div className="space-y-4 p-4">
      <Header title="Recouvrement" />
      <div className="flex items-center justify-between">
        <Tabs defaultValue="late" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="late" className="flex items-center gap-2">
              <Badge variant="destructive" className="h-2 w-2 rounded-full p-0" />
              En retard
            </TabsTrigger>
            <TabsTrigger value="cancelled">Annulé</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input className="pl-8 w-[300px]" placeholder="Rechercher" />
          </div>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button 
        className="bg-orange-500 hover:bg-orange-600"
        onClick={() => setIsReminderOpen(true)}
      >
        Générer une lettre de relance
      </Button>

      <ReminderLetterDialog 
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
      />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>N° Facture</TableHead>
            <TableHead>Client/fournisseur</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date d&apos;émission</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.number}</TableCell>
              <TableCell>{invoice.client}</TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={
                    invoice.type === 'location' ? 'border-blue-500 text-blue-500' :
                    invoice.type === 'Maintenance' ? 'border-purple-500 text-purple-500' :
                    'border-green-500 text-green-500'
                  }
                >
                  {invoice.type}
                </Badge>
              </TableCell>
              <TableCell>{invoice.date}</TableCell>
              <TableCell>{invoice.amount}</TableCell>
              <TableCell>
                <Badge variant="destructive" className="bg-red-100 text-red-600 hover:bg-red-100">
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Page {currentPage} sur {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          {[1, 2, 3].map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
              size="sm"
            >
              {page}
            </Button>
          ))}
          <Button variant="outline" size="sm">...</Button>
          <Button variant="outline" size="sm">{totalPages}</Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            {'>'}
          </Button>
        </div>
      </div>
    </div>
  )
}

