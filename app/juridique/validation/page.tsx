'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from '@/app/ui/header'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Download, RotateCcw, X } from 'lucide-react'

interface Contract {
  id: string
  client: {
    name: string
    avatar: string
  }
  type: "Location" | "Maintenance" | "Partenariat"
  date: string
  status: "En attente" | "Post à valider"
  responsibilities: string
  cancellationTerms: string
  duration: string
  payment: {
    amount: number
    dueDate: string
    lateFees: number
  }
  documents: Array<{
    name: string
    type: string
  }>
}

const contracts: Contract[] = [
  {
    id: "16829",
    client: {
      name: "Darlene Robertson",
      avatar: "/placeholder.svg"
    },
    type: "Location",
    date: "01/02/2024",
    status: "En attente",
    responsibilities: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor...",
    cancellationTerms: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor...",
    duration: "1 mois",
    payment: {
      amount: 1000000,
      dueDate: "22/12/2024",
      lateFees: 1000000
    },
    documents: [
      { name: "Brief", type: "pdf" },
      { name: "Documentation", type: "pdf" },
      { name: "Cahier de charge", type: "pdf" },
      { name: "Brief", type: "pdf" },
      { name: "Documentation", type: "pdf" }
    ]
  },
  {
    id: "16885",
    client: {
      name: "Jane Cooper",
      avatar: "/placeholder.svg"
    },
    type: "Location",
    date: "01/02/2024",
    status: "En attente",
    responsibilities: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    cancellationTerms: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    duration: "1 mois",
    payment: {
      amount: 1000000,
      dueDate: "22/12/2024",
      lateFees: 1000000
    },
    documents: [
      { name: "Brief", type: "pdf" },
      { name: "Documentation", type: "pdf" }
    ]
  },
  {
    id: "15396",
    client: {
      name: "Jenny Wilson",
      avatar: "/placeholder.svg"
    },
    type: "Maintenance",
    date: "01/02/2024",
    status: "Post à valider",
    responsibilities: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    cancellationTerms: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    duration: "1 mois",
    payment: {
      amount: 1000000,
      dueDate: "22/12/2024",
      lateFees: 1000000
    },
    documents: [
      { name: "Brief", type: "pdf" },
      { name: "Documentation", type: "pdf" }
    ]
  }
]

export default function ContractManagement() {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En attente':
        return 'bg-purple-100 text-purple-800'
      case 'Post à valider':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      <Header title="Contrat à Valider" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID demande</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date de soumission</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell>{contract.id}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={contract.client.avatar} />
                    <AvatarFallback>{contract.client.name[0]}</AvatarFallback>
                  </Avatar>
                  {contract.client.name}
                </div>
              </TableCell>
              <TableCell>{contract.type}</TableCell>
              <TableCell>{contract.date}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(contract.status)}>
                  {contract.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setSelectedContract(contract)
                      setIsDetailsOpen(true)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">
          Page 1 sur 34
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" disabled>
            &lt;
          </Button>
          <Button variant="outline" size="icon" className="bg-orange-500 text-white hover:bg-orange-600">
            1
          </Button>
          <Button variant="outline" size="icon">2</Button>
          <Button variant="outline" size="icon">3</Button>
          <Button variant="outline" size="icon">...</Button>
          <Button variant="outline" size="icon">34</Button>
          <Button variant="outline" size="icon">&gt;</Button>
        </div>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Details du contrat</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 top-4"
              onClick={() => setIsDetailsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-6 pr-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Responsabilités</h3>
                <p className="text-sm">{selectedContract.responsibilities}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Condition de résiliation</h3>
                <p className="text-sm">{selectedContract.cancellationTerms}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Durée</h3>
                <p className="text-sm">{selectedContract.duration}</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Paiement</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Détails des paiements</div>
                  <div>{selectedContract.payment.amount.toLocaleString()} Fcfa</div>
                  <div>Échéance</div>
                  <div>{selectedContract.payment.dueDate}</div>
                  <div>Pénalités en cas de retard</div>
                  <div>{selectedContract.payment.lateFees.toLocaleString()} Fcfa</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Documents associés</h3>
                <div className="space-y-2">
                  {selectedContract.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                          <Eye className="h-4 w-4 text-blue-500" />
                        </div>
                        <span className="text-sm">{doc.name}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                  Valider
                </Button>
                <Button className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                  Refuser
                </Button>
              </div>
              
              <Button 
                variant="link" 
                className="w-full text-muted-foreground hover:text-primary"
              >
                Modifier
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

