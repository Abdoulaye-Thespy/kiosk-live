'use client'

import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline"

const weeklyData = [
  { name: "Jun 12", value: 20 },
  { name: "Jun 13", value: 25 },
  { name: "Jun 14", value: 15 },
  { name: "Sep 15", value: 30 },
  { name: "Sep 16", value: 45 },
  { name: "Sep 17", value: 25 },
  { name: "Sep 18", value: 35 },
  { name: "Sep 19", value: 20 },
]

const reportData = [
  { period: "Dernier mois", bonsCommande: 12, bonsLivres: 12, bonsNonLivres: 12, livraison: 12, retard: 12 },
  { period: "Ce trimestre", bonsCommande: 20, bonsLivres: 20, bonsNonLivres: 20, livraison: 20, retard: 20 },
  { period: "Année en cours", bonsCommande: 380, bonsLivres: 380, bonsNonLivres: 380, livraison: 380, retard: 380 },
]

const invoiceData = [
  { client: "Alain NGONO", amount: "100 000 fcfa", status: "Livré" },
  { client: "Thierry NTAMACK", amount: "100 000 fcfa", status: "Livré" },
  { client: "Boris ADJOGO", amount: "100 000 fcfa", status: "Non livré" },
  { client: "Bruno AYOLO", amount: "600 000 fcfa", status: "Non livré" },
  { client: "Alain NGONO", amount: "400 000 fcfa", status: "Livré" },
]

export default function Component() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-base font-semibold mb-4">Nombre de factures Générées par semaine</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#888', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#888', fontSize: 12 }}
                />
                <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Report Table */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-base font-semibold mb-4">Rapport de commande par client</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Période</TableHead>
                <TableHead>Taux de bons de comm.</TableHead>
                <TableHead>Bons livrés</TableHead>
                <TableHead>Bons non livrés</TableHead>
                <TableHead>% de livraison effectuées</TableHead>
                <TableHead>Taux de retard</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((row) => (
                <TableRow key={row.period}>
                  <TableCell className="font-medium">{row.period}</TableCell>
                  <TableCell>{row.bonsCommande}</TableCell>
                  <TableCell>{row.bonsLivres}</TableCell>
                  <TableCell>{row.bonsNonLivres}</TableCell>
                  <TableCell>{row.livraison}</TableCell>
                  <TableCell>{row.retard}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Invoices Table */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-base font-semibold mb-4">Valeur des factures échues par client</h3>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input className="pl-9" placeholder="Rechercher" />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <FunnelIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Montant factures échues</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceData.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.client}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-center gap-2 mt-4">
            <button className="px-3 py-1 bg-orange-500 text-white rounded-md">1</button>
            <button className="px-3 py-1 hover:bg-gray-100 rounded-md">2</button>
            <button className="px-3 py-1 hover:bg-gray-100 rounded-md">3</button>
            <span>...</span>
            <button className="px-3 py-1 hover:bg-gray-100 rounded-md">34</button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-base font-semibold mb-4">Rapport de commande par client</h3>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input className="pl-9" placeholder="Rechercher" />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-md">
              <FunnelIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Commande</TableHead>
                <TableHead>État</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceData.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.client}</TableCell>
                  <TableCell>Nom Commande</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      row.status === 'Livré' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {row.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-center gap-2 mt-4">
            <button className="px-3 py-1 bg-orange-500 text-white rounded-md">1</button>
            <button className="px-3 py-1 hover:bg-gray-100 rounded-md">2</button>
            <button className="px-3 py-1 hover:bg-gray-100 rounded-md">3</button>
            <span>...</span>
            <button className="px-3 py-1 hover:bg-gray-100 rounded-md">34</button>
          </div>
        </div>
      </div>
    </div>
  )
}