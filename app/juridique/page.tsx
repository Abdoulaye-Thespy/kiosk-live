'use client'

import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowUpCircleIcon, FunnelIcon, ArrowsUpDownIcon } from '@heroicons/react/24/solid'
import { Eye, Download, RotateCcw, Ban, Trash, PenSquare } from 'lucide-react'

interface Contract {
  id: string
  contractNumber: string
  client: {
    name: string
    avatar: string
  }
  type: "Location" | "Maintenance" | "Partenariat"
  validationDate: string
  status: "En cours" | "Signé" | "Expiré"
  lastAction: string
}

const contracts: Contract[] = [
  {
    id: "16829",
    contractNumber: "16829",
    client: {
      name: "Darlene Robertson",
      avatar: "/avatars/darlene.jpg"
    },
    type: "Location",
    validationDate: "01/02/2024",
    status: "En cours",
    lastAction: "En attente de validation"
  },
  {
    id: "16885",
    contractNumber: "16885",
    client: {
      name: "Jane Cooper",
      avatar: "/avatars/jane.jpg"
    },
    type: "Location",
    validationDate: "01/02/2024",
    status: "Signé",
    lastAction: "Envoyé pour signature"
  },
  {
    id: "15396",
    contractNumber: "15396",
    client: {
      name: "Jenny Wilson",
      avatar: "/avatars/jenny.jpg"
    },
    type: "Maintenance",
    validationDate: "01/02/2024",
    status: "En cours",
    lastAction: "Signé par le client"
  },
  {
    id: "16964",
    contractNumber: "16964",
    client: {
      name: "Robert Fox",
      avatar: "/avatars/robert.jpg"
    },
    type: "Maintenance",
    validationDate: "01/02/2024",
    status: "Expiré",
    lastAction: "Rejeté par le client"
  },
  {
    id: "16829",
    contractNumber: "16829",
    client: {
      name: "Wade Warren",
      avatar: "/avatars/wade.jpg"
    },
    type: "Partenariat",
    validationDate: "01/02/2024",
    status: "Signé",
    lastAction: "Contrat expiré"
  }
]

export default function ContractManagement() {
  const [selectedContracts, setSelectedContracts] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedContractType, setSelectedContractType] = useState('all')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContracts(contracts.map(contract => contract.id))
    } else {
      setSelectedContracts([])
    }
  }

  const handleSelectContract = (contractId: string, checked: boolean) => {
    if (checked) {
      setSelectedContracts([...selectedContracts, contractId])
    } else {
      setSelectedContracts(selectedContracts.filter(id => id !== contractId))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours':
        return 'bg-blue-100 text-blue-800'
      case 'Signé':
        return 'bg-green-100 text-green-800'
      case 'Expiré':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getActionColor = (action: string) => {
    if (action.includes('Rejeté') || action.includes('expiré')) {
      return 'text-red-500'
    }
    if (action.includes('Signé') || action.includes('validé')) {
      return 'text-green-500'
    }
    if (action.includes('attente')) {
      return 'text-orange-500'
    }
    return 'text-blue-500'
  }

  return (
    <div className="container mx-auto space-y-6">

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-column space-y-0 pb-2 shadow-md">
            <CardTitle className="text-sm font-medium">Total prospects</CardTitle>
            <div className="flex items-baseline space-x-3 ">
              <div className="text-2xl font-bold mt-2">1,822</div>
              <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                <ArrowUpCircleIcon className='inline-block h-5 w-5 text-green-500' />
                <div className="ml-2 text-medium text-gray-500">5.2%</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-medium">
              <p><span className='font-bold'>+22</span> le dernier mois</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-column space-y-0 pb-2 shadow-md">
            <CardTitle className="text-sm font-medium">Nouveaux prospects</CardTitle>
            <div className="flex items-baseline space-x-3 ">
              <div className="text-2xl font-bold mt-2">1,822</div>
              <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                <ArrowUpCircleIcon className='inline-block h-5 w-5 text-green-500' />
                <div className="ml-2 text-medium text-gray-500">5.2%</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-medium">
              <p><span className='font-bold'>+22</span> le dernier mois</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-column space-y-0 pb-2 shadow-md">
            <CardTitle className="text-sm font-medium">Prospects conclus</CardTitle>
            <div className="flex items-baseline space-x-3 ">
              <div className="text-2xl font-bold mt-2">1,822</div>
              <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                <ArrowUpCircleIcon className='inline-block h-5 w-5 text-green-500' />
                <div className="ml-2 text-medium text-gray-500">5.2%</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-medium">
              <p><span className='font-bold'>+22</span> le dernier mois</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between space-x-4 p-4 bg-white shadow rounded-lg">
        <div className="flex gap-4">
          <Input
            placeholder="Recherche"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[250px]"
          />
          <Select value={selectedContractType} onValueChange={setSelectedContractType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Type de contrat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les contrats</SelectItem>
              <SelectItem value="location">Location</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="partenariat">Partenariat</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ArrowsUpDownIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <FunnelIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedContracts.length === contracts.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>N° contrat</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date de validation</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Dernière action</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedContracts.includes(contract.id)}
                    onCheckedChange={(checked) => handleSelectContract(contract.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell>{contract.contractNumber}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={contract.client.avatar} />
                      <AvatarFallback>{contract.client.name[0]}</AvatarFallback>
                    </Avatar>
                    <span>{contract.client.name}</span>
                  </div>
                </TableCell>
                <TableCell>{contract.type}</TableCell>
                <TableCell>{contract.validationDate}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(contract.status)}>
                    {contract.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={`flex items-center gap-2 ${getActionColor(contract.lastAction)}`}>
                    <ArrowUpCircleIcon className="h-4 w-4" />
                    {contract.lastAction}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <PenSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
    </div>
  )
}

