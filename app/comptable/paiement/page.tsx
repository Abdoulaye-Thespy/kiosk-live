'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Header from '@/app/ui/header'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Download, Filter, Plus, MoreHorizontal } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'

interface Payment {
  id: string
  name: string
  avatar: string
  invoice: string
  type: string
  amount: string
  date: string
  status: 'En attente' | 'Échoué' | 'Effectué' | 'Actif'
}

const payments: Payment[] = [
  { id: '1', name: 'Michael Hun', avatar: '/avatars/01.png', invoice: 'Fac_9768', type: 'Virement', amount: '450.000 FCfa', date: '10 Nov 2023, 08:00', status: 'En attente' },
  { id: '2', name: 'Courtney Henry', avatar: '/avatars/02.png', invoice: 'Fac_9768', type: 'Cash', amount: '100.000 FCfa', date: '10 Nov 2023, 08:00', status: 'Échoué' },
  { id: '3', name: 'Annette Black', avatar: '/avatars/03.png', invoice: 'Fac_9768', type: 'OM/MOMO', amount: '260.000 FCfa', date: '10 Nov 2023, 08:00', status: 'Échoué' },
  { id: '4', name: 'Jenny Wilson', avatar: '/avatars/04.png', invoice: 'Fac_9768', type: 'Virement', amount: '80.000 FCfa', date: '10 Nov 2023, 08:00', status: 'Effectué' },
  { id: '5', name: 'Ralph Edwards', avatar: '/avatars/05.png', invoice: 'Fac_9768', type: 'Virement', amount: '80.000 FCfa', date: '10 Nov 2023, 08:00', status: 'Effectué' },
  { id: '6', name: 'Cody Fisher', avatar: '/avatars/06.png', invoice: 'Fac_9768', type: 'Cash', amount: '80.000 FCfa', date: '10 Nov 2023, 08:00', status: 'En attente' },
  { id: '7', name: 'Ronald Richards', avatar: '/avatars/07.png', invoice: 'Fac_9768', type: 'Cash', amount: '80.000 FCfa', date: '10 Nov 2023, 08:00', status: 'Échoué' },
  { id: '8', name: 'Leslie Alexander', avatar: '/avatars/08.png', invoice: 'Fac_9768', type: 'OM/MOMO', amount: '90.000 FCfa', date: '10 Nov 2023, 08:00', status: 'Actif' },
  { id: '9', name: 'Jane Cooper', avatar: '/avatars/09.png', invoice: 'Fac_9768', type: 'OM/MOMO', amount: '2500.000 FCfa', date: '10 Nov 2023, 08:00', status: 'En attente' },
]

export default function PaymentTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 10

  return (
    <div className="space-y-4">
      <Header title="Paiements"/>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Rechercher une transaction..."
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Link
                  href={{
                    pathname: '/comptable/paiement/nouveau',
                  }}
              >
            <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter un paiement
            </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Toutes les transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les transactions</SelectItem>
              <SelectItem value="payments">Paiements</SelectItem>
              <SelectItem value="transfers">Virements</SelectItem>
              <SelectItem value="deposits">Dépôts</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="active">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Active" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archivée</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="7days">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="7 jours" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 jours</SelectItem>
              <SelectItem value="30days">30 jours</SelectItem>
              <SelectItem value="90days">90 jours</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="30days">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="30 derniers jours" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">30 derniers jours</SelectItem>
              <SelectItem value="last-month">Mois dernier</SelectItem>
              <SelectItem value="last-quarter">Trimestre dernier</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Client/fournisseur</TableHead>
            <TableHead>Facture</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={payment.avatar} alt={payment.name} />
                    <AvatarFallback>{payment.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {payment.name}
                </div>
              </TableCell>
              <TableCell>{payment.invoice}</TableCell>
              <TableCell>{payment.type}</TableCell>
              <TableCell>{payment.amount}</TableCell>
              <TableCell>{payment.date}</TableCell>
              <TableCell>
                <Badge 
                  variant={
                    payment.status === 'Effectué' ? 'success' :
                    payment.status === 'En attente' ? 'warning' :
                    payment.status === 'Échoué' ? 'destructive' :
                    'default'
                  }
                >
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
               
              <Button variant="ghost" size="icon">
                </Button>
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

