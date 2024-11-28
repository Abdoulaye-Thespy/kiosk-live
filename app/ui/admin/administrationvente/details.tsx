'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EyeIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { CalendarIcon } from "@heroicons/react/24/solid"

interface ProformaDetailsModalProps {
  proforma: {
    id: string
    client: string
    date: string
    amount: string
    status: string
  }
}

const products = [
  { name: 'Service 1', price: '100 000 fcfa', quantity: 20, discount: '10%' },
  { name: 'Service 2', price: '100 000 fcfa', quantity: 32, discount: '10%' },
  { name: 'Produit 1', price: '100 000 fcfa', quantity: 60, discount: '10%' },
  { name: 'Produit 2', price: '600 000 fcfa', quantity: 80, discount: '10%' },
  { name: 'Produit 2', price: '400 000 fcfa', quantity: 10, discount: '10%' },
  { name: 'Produit 2', price: '100 000 fcfa', quantity: 20, discount: '0%' },
]

export default function ProformaDetailsModal({ proforma }: ProformaDetailsModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <EyeIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Details proforma</DialogTitle>
            <DialogTrigger asChild>
            </DialogTrigger>
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium">Proforma N° {proforma.id}</p>
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Client associé</p>
                <p className="text-sm font-medium">{proforma.client}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date de création</p>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">{proforma.date}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date de validation</p>
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">{proforma.date}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Produits/Services</h3>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Produits/Services</TableHead>
                    <TableHead>Prix Unit.</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Remises</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <input type="checkbox" className="rounded border-gray-300" />
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.discount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="outline">Retour</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}