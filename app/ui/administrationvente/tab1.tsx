'use client'

import React, { useState } from 'react'
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
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline"
import { CheckCircleIcon, XCircleIcon, ClockIcon } from "@heroicons/react/24/solid"
import Details from './/details'

interface Proforma {
  id: string
  client: string
  amount: string
  date: string
  status: 'Validée' | 'Rejetée' | 'En attente'
}

interface AdminVenteProps {
  proforma: Proforma
}

const AdminVente: React.FC<AdminVenteProps> = ({ proforma }) => {
  // Implement AdminVente component here if needed
  return null
}

export default function AdminSalesTable() {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const proformas: Proforma[] = [
    { id: '1', client: 'Client A', amount: '1000€', date: '2023-06-01', status: 'Validée' },
    { id: '2', client: 'Client B', amount: '2000€', date: '2023-06-02', status: 'Rejetée' },
    { id: '3', client: 'Client C', amount: '3000€', date: '2023-06-03', status: 'En attente' },
    { id: '4', client: 'Client C', amount: '3000€', date: '2023-06-03', status: 'En attente' },
    { id: '5', client: 'Client C', amount: '3000€', date: '2023-06-03', status: 'En attente' },
    // Add more sample data as needed
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher"
              className="pl-8 w-[250px]"
            />
          </div>
          <Button variant="outline" size="icon">
            <AdjustmentsHorizontalIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox />
              </TableHead>
              <TableHead>Numéro</TableHead>
              <TableHead>Client associé</TableHead>
              <TableHead>Montant total</TableHead>
              <TableHead>Date création</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proformas.map((proforma) => (
              <TableRow key={proforma.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(proforma.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedIds([...selectedIds, proforma.id])
                      } else {
                        setSelectedIds(selectedIds.filter(id => id !== proforma.id))
                      }
                    }}
                  />
                </TableCell>
                <TableCell>{proforma.id}</TableCell>
                <TableCell>{proforma.client}</TableCell>
                <TableCell>{proforma.amount}</TableCell>
                <TableCell>{proforma.date}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {proforma.status === "Validée" && (
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    )}
                    {proforma.status === "Rejetée" && (
                      <XCircleIcon className="h-4 w-4 text-red-500" />
                    )}
                    {proforma.status === "En attente" && (
                      <ClockIcon className="h-4 w-4 text-yellow-500" />
                    )}
                    {proforma.status}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 hover:text-green-700"
                    >
                      Valider
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      Rejeter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-orange-600 hover:text-orange-700"
                    >
                      Renvoyer au client
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                <Details proforma={proforma}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Page 1 of 34
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            ...
          </Button>
          <Button variant="outline" size="sm">
            34
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}