'use client'

import * as React from "react"
import Link from 'next/link'
import Header from "../ui/header"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Download, Filter, Copy, ArrowUpRight, TrendingDown, TrendingUp, X } from 'lucide-react'
import TrashSVG from "../ui/svg/trash"
import ModifySVG from "../ui/svg/modify"
import { ExportDialog } from "../ui/commercial/facture/exportdialog"

interface Invoice {
  id: string
  clientName: string
  clientEmail: string
  invoiceNumber: string
  dueDate: string
  createdDate: string
  amount: string
  status: string
  avatarUrl: string
}

const invoices: Invoice[] = [
  {
    id: "1",
    clientName: "Tahsan Khan",
    clientEmail: "tahsankhan@gmail.com",
    invoiceNumber: "#546BH74W7S",
    dueDate: "3 juin 2024",
    createdDate: "14 Juin, 2024",
    amount: "64 575.00 $",
    status: "Faible en stock",
    avatarUrl: "/placeholder.svg"
  },
  {
    id: "2",
    clientName: "Harry Kane",
    clientEmail: "harrykane@gmail.com",
    invoiceNumber: "#647584T7A76",
    dueDate: "4 juin 2024",
    createdDate: "15 juin 2024",
    amount: "$53,536.09",
    status: "Disponible",
    avatarUrl: "/placeholder.svg"
  },
  {
    id: "3",
    clientName: "Matt Henry",
    clientEmail: "henrybooks@gmail.com",
    invoiceNumber: "#657K768M64P",
    dueDate: "05 Juin 2024",
    createdDate: "Dans 16 juin 20",
    amount: "$76,435.01",
    status: "Suspendu",
    avatarUrl: "/placeholder.svg"
  },
  {
    id: "4",
    clientName: "Tahera Khan",
    clientEmail: "matthenry@gmail.com",
    invoiceNumber: "#324575G63MB",
    dueDate: "06 Juin 2024",
    createdDate: "Jun 17,2024",
    amount: "$96,647.00",
    status: "Niveau de stock",
    avatarUrl: "/placeholder.svg"
  },
  {
    id: "5",
    clientName: "David Souhait",
    clientEmail: "taherakhan@gmail.com",
    invoiceNumber: "#97M64B47G84",
    dueDate: "07 juin 2024",
    createdDate: "No translation",
    amount: "$64,098.06",
    status: "Réglé",
    avatarUrl: "/placeholder.svg"
  },
  {
    id: "6",
    clientName: "Tim David",
    clientEmail: "davidwish@gmail.com",
    invoiceNumber: "#869L475F53Z",
    dueDate: "Jun 08, 2024",
    createdDate: "19 juin 2024",
    amount: "$73,435.01",
    status: "En rupture de st",
    avatarUrl: "/placeholder.svg"
  },
  {
    id: "7",
    clientName: "David Malan",
    clientEmail: "timdavid@gmail.com",
    invoiceNumber: "#758V758C64S",
    dueDate: "09 juin 2024",
    createdDate: "20 Juin 2024",
    amount: "$32,869.95",
    status: "Épuisé",
    avatarUrl: "/placeholder.svg"
  },
  {
    id: "8",
    clientName: "Janson Roy",
    clientEmail: "jansonroy@gmail.com",
    invoiceNumber: "#53645HFD647",
    dueDate: "Jun 10, 2024",
    createdDate: "21 juin 2024",
    amount: "$53,857.00",
    status: "En cours",
    avatarUrl: "/placeholder.svg"
  }
]

export default function InvoiceDashboard() {
  return (
    <div className="space-y-6 p-6">
       <Header title="Facturation" />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Factures</h1>
        <Link
            href={{
              pathname: '/comptable/facturecreate',
            }}
            className=""
          >
        <Button className="bg-orange-500 hover:bg-orange-600">
          Créer une nouvelle facture
        </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Toutes les factures</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11 324</div>
            <p className="text-xs text-green-500">+2.7% le mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">En cours</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <p className="text-xs text-red-500">+1.3% du mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Réglées</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 353</div>
            <p className="text-xs text-green-500">+3.7% du mois dernier</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">En retard</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">546</div>
            <p className="text-xs text-red-500">-1.2% du mois dernier</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="État" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les états</SelectItem>
                <SelectItem value="pending">En cours</SelectItem>
                <SelectItem value="paid">Payé</SelectItem>
                <SelectItem value="late">En retard</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Créé" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les dates</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Plus de filtres
            </Button>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader className="flex flex-row items-center justify-between">
                <DialogTitle>Exporter les factures</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 pt-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Fuseau horaire</h4>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    <span className="text-sm">GMT+6 (UTC+06:00)</span>
                    <span className="text-sm text-muted-foreground">Temps universel coordonné</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Période de date</h4>
                  <RadioGroup defaultValue="today" className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="today" id="today" />
                      <Label htmlFor="today">Aujourd'hui</Label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="current-month" id="current-month" />
                        <Label htmlFor="current-month">Mois en cours</Label>
                      </div>
                      <span className="text-sm text-muted-foreground">juin 01 - juil 02</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="last-7-days" id="last-7-days" />
                        <Label htmlFor="last-7-days">Derniers 7 jours</Label>
                      </div>
                      <span className="text-sm text-muted-foreground">26 mai - 01 juin</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="last-month" id="last-month" />
                        <Label htmlFor="last-month">Le Mois Dernier</Label>
                      </div>
                      <span className="text-sm text-muted-foreground">1er mai - 31 mai</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all">Tout</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Colonnes</h4>
                  <Select defaultValue="default">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sélectionner les colonnes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Par défaut (16)</SelectItem>
                      <SelectItem value="custom">Personnalisé</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-sm text-muted-foreground">
                    Identifiant, Montant dû, Facturation, Fermé, Devise, Client, Date (UTC), Date d'échéance (UTC), Numéro, Payé, Abonnement, Note total, Montant total de réduction, Coupons appliqués, Taxe, Taux de taxe, Total, Montant payé, Statut
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <DialogTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogTrigger>
                  <Button className="bg-orange-500 hover:bg-orange-600">Exporter</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom du client</TableHead>
              <TableHead>Email du client</TableHead>
              <TableHead>N° de facture</TableHead>
              <TableHead>Échéance</TableHead>
              <TableHead>Créé(e)</TableHead>
              <TableHead>Quantité</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={invoice.avatarUrl} />
                      <AvatarFallback>{invoice.clientName[0]}</AvatarFallback>
                    </Avatar>
                    {invoice.clientName}
                  </div>
                </TableCell>
                <TableCell>{invoice.clientEmail}</TableCell>
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
                <TableCell>{invoice.createdDate}</TableCell>
                <TableCell>{invoice.amount}</TableCell>
                <TableCell>
                  <Badge variant={
                    invoice.status === "Disponible" ? "success" :
                    invoice.status === "En cours" ? "warning" :
                    invoice.status === "Faible en stock" ? "warning" :
                    invoice.status === "Réglé" ? "success" :
                    "destructive"
                  }>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <TrashSVG  />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ModifySVG />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

