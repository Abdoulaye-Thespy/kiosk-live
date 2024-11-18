'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Download } from 'lucide-react'

const metrics = [
  { 
    id: 'all', 
    label: 'Toutes les factures', 
    value: '15,456.00', 
    count: '10',
    icon: '📄',
    bgColor: 'bg-orange-100',
    iconColor: 'text-orange-500'
  },
  { 
    id: 'pending', 
    label: 'En attente', 
    value: '15,456.00', 
    count: '10',
    icon: '⏳',
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-500'
  },
  { 
    id: 'paid', 
    label: 'Payé', 
    value: '15,456.00', 
    count: '10',
    icon: '✅',
    bgColor: 'bg-green-100',
    iconColor: 'text-green-500'
  },
  { 
    id: 'late', 
    label: 'En retard', 
    value: '15,456.00', 
    count: '10',
    icon: '⚠️',
    bgColor: 'bg-red-100',
    iconColor: 'text-red-500'
  }
]

const filters = [
  { id: 'all', label: 'Toutes les factures' },
  { id: 'paid', label: 'Payé' },
  { id: 'pending', label: 'En attente' },
  { id: 'late', label: 'En retard' },
  { id: 'cancelled', label: 'Annulé' }
]

const invoices = [
  {
    id: '1345',
    reference: 'FACT-2024-001',
    type: 'location',
    date: '01/02/2024',
    amount: '1 000 000 FCFA',
    status: 'late'
  },
  {
    id: '1345',
    reference: 'KioskX SARL*',
    type: 'Partenariat',
    date: '01/02/2024',
    amount: '1 000 000 FCFA',
    status: 'late'
  },
  {
    id: '1345',
    reference: 'NDOUMEmmmm',
    type: 'Maintenance',
    date: '01/02/2024',
    amount: '1 000 000 FCFA',
    status: 'pending'
  },
  {
    id: '1345',
    reference: 'Jean Dupont',
    type: 'location',
    date: '01/02/2024',
    amount: '1 000 000 FCFA',
    status: 'pending'
  },
  {
    id: '1345',
    reference: 'KioskX SARL*',
    type: 'location',
    date: '01/02/2024',
    amount: '1 000 000 FCFA',
    status: 'cancelled'
  },
  {
    id: '1345',
    reference: 'Jean Dupont',
    type: 'location',
    date: '01/02/2024',
    amount: '1 000 000 FCFA',
    status: 'cancelled'
  },
  {
    id: '1345',
    reference: 'KioskX SARL*',
    type: 'Partenariat',
    date: '01/02/2024',
    amount: '1 000 000 FCFA',
    status: 'paid'
  }
]

export default function TabTwoFacturePaiment() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 34

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-50 border-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-100'
      case 'late':
        return 'text-red-600 bg-red-50 border-red-100'
      case 'cancelled':
        return 'text-gray-600 bg-gray-50 border-gray-100'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-100'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payé'
      case 'pending':
        return 'En attente'
      case 'late':
        return 'En retard'
      case 'cancelled':
        return 'Annulé'
      default:
        return status
    }
  }

  const getTypeStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'location':
        return 'text-orange-500'
      case 'partenariat':
        return 'text-purple-500'
      case 'maintenance':
        return 'text-blue-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id} className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <span className={`text-2xl ${metric.bgColor} ${metric.iconColor} p-3 rounded-lg`}>
                  {metric.icon}
                </span>
                <div>
                  <p className="text-sm text-gray-500">{metric.label}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-semibold">{metric.value}</p>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                      {metric.count}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white rounded-lg border p-4 space-y-4">
        <div className="flex items-center gap-2 border-b pb-4">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-1 text-sm rounded-full transition-colors
                ${activeFilter === filter.id 
                  ? 'text-orange-500' 
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <div className="relative w-72">
            <Input
              placeholder="Rechercher"
              className="pl-4"
            />
          </div>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
            <span className="sr-only">Télécharger</span>
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input type="checkbox" className="rounded border-gray-300" />
              </TableHead>
              <TableHead>N° Facture</TableHead>
              <TableHead>Client/fournisseur</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date d'émission</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice, index) => (
              <TableRow key={index}>
                <TableCell>
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableCell>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.reference}</TableCell>
                <TableCell>
                  <span className={getTypeStyle(invoice.type)}>{invoice.type}</span>
                </TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full border ${getStatusStyle(invoice.status)}`}>
                    {getStatusLabel(invoice.status)}
                  </span>
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

        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {[1, 2, 3, '...', totalPages].map((page, index) => (
              <Button
                key={index}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (typeof page === 'number') setCurrentPage(page)
                }}
                className={`${
                  typeof page !== 'number' ? 'pointer-events-none' : ''
                } ${page === currentPage ? 'bg-orange-500 text-white hover:bg-orange-600' : ''}`}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}