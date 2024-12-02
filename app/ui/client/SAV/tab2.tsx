'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Download } from 'lucide-react'
import ContractDetails from '../contrat/details'

const metrics = [
  { 
    id: 'all', 
    label: 'Toutes les factures', 
    value: '15,456.00', 
    count: '10',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20" fill="none">
    <g filter="url(#filter0_d_4061_26723)">
      <path d="M11.9999 8.74992C11.3096 8.74992 10.7499 9.30956 10.7499 9.99992C10.7499 10.6903 11.3096 11.2499 11.9999 11.2499C12.6903 11.2499 13.2499 10.6903 13.2499 9.99992C13.2499 9.30956 12.6903 8.74992 11.9999 8.74992Z" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M6.30114 3.33325L17.6987 3.33325C18.138 3.33324 18.517 3.33323 18.8291 3.35873C19.1586 3.38565 19.4862 3.44508 19.8016 3.60574C20.272 3.84542 20.6544 4.22787 20.8941 4.69828C21.0548 5.0136 21.1142 5.34128 21.1411 5.67073C21.1666 5.98287 21.1666 6.36183 21.1666 6.80112V13.1987C21.1666 13.638 21.1666 14.017 21.1411 14.3291C21.1142 14.6586 21.0548 14.9862 20.8941 15.3016C20.6544 15.772 20.272 16.1544 19.8016 16.3941C19.4862 16.5548 19.1586 16.6142 18.8291 16.6411C18.517 16.6666 18.138 16.6666 17.6987 16.6666L6.30101 16.6666C5.86178 16.6666 5.48284 16.6666 5.17073 16.6411C4.84128 16.6142 4.51359 16.5548 4.19828 16.3941C3.72787 16.1544 3.34542 15.772 3.10574 15.3016C2.94508 14.9862 2.88565 14.6586 2.85873 14.3291C2.83323 14.017 2.83324 13.638 2.83325 13.1987V6.80109C2.83324 6.36183 2.83323 5.98286 2.85873 5.67073C2.88565 5.34128 2.94508 5.01359 3.10574 4.69828C3.34542 4.22787 3.72787 3.84542 4.19828 3.60574C4.5136 3.44508 4.84128 3.38565 5.17073 3.35873C5.48286 3.33323 5.86187 3.33324 6.30114 3.33325ZM9.08325 9.99992C9.08325 8.38909 10.3891 7.08325 11.9999 7.08325C13.6108 7.08325 14.9166 8.38909 14.9166 9.99992C14.9166 11.6108 13.6108 12.9166 11.9999 12.9166C10.3891 12.9166 9.08325 11.6108 9.08325 9.99992ZM6.99992 7.49992C7.46016 7.49992 7.83325 7.87302 7.83325 8.33325V11.6666C7.83325 12.1268 7.46016 12.4999 6.99992 12.4999C6.53968 12.4999 6.16659 12.1268 6.16659 11.6666V8.33325C6.16659 7.87302 6.53968 7.49992 6.99992 7.49992ZM17.8333 8.33325C17.8333 7.87302 17.4602 7.49992 16.9999 7.49992C16.5397 7.49992 16.1666 7.87302 16.1666 8.33325V11.6666C16.1666 12.1268 16.5397 12.4999 16.9999 12.4999C17.4602 12.4999 17.8333 12.1268 17.8333 11.6666V8.33325Z" fill="white"/>
    </g>
    <defs>
      <filter id="filter0_d_4061_26723" x="0.833252" y="2.33325" width="22.3333" height="17.3333" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="1"/>
        <feGaussianBlur stdDeviation="1"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0.0509804 0 0 0 0 0.0509804 0 0 0 0 0.0705882 0 0 0 0.2 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4061_26723"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4061_26723" result="shape"/>
      </filter>
    </defs>
  </svg>,
    bgColor: 'bg-orange-500',
    iconColor: 'text-orange-500'
  },
  { 
    id: 'pending', 
    label: 'En attente', 
    value: '15,456.00', 
    count: '10',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M18 11C18 14.7497 18 16.6246 17.0451 17.9389C16.7367 18.3634 16.3634 18.7367 15.9389 19.0451C14.6246 20 12.7497 20 9 20C5.25027 20 3.3754 20 2.06107 19.0451C1.6366 18.7367 1.26331 18.3634 0.954914 17.9389C0 16.6246 0 14.7497 0 11V9C0 8.16106 0 7.41596 0.0106945 6.75L0.0808201 6.75C0.932837 6.75007 1.45182 6.75011 1.8995 6.67921C4.35988 6.28952 6.28952 4.35988 6.67921 1.8995C6.75011 1.45182 6.75007 0.932837 6.75 0.0808201L6.75 0.0106945C7.41596 0 8.16106 0 9 0C12.7497 0 14.6246 0 15.9389 0.954914C16.3634 1.26331 16.7367 1.6366 17.0451 2.06107C18 3.3754 18 5.25027 18 9V11ZM6 10.25C5.58579 10.25 5.25 10.5858 5.25 11C5.25 11.4142 5.58579 11.75 6 11.75H12C12.4142 11.75 12.75 11.4142 12.75 11C12.75 10.5858 12.4142 10.25 12 10.25H6Z" fill="white"/>
    <path d="M1.66485 5.19768C1.35646 5.24652 0.975676 5.24987 0.0653362 5.25C0.159744 3.81037 0.390566 2.83783 0.954914 2.06107C1.26331 1.6366 1.6366 1.26331 2.06107 0.954914C2.83783 0.390566 3.81037 0.159744 5.25 0.0653362C5.24987 0.975676 5.24652 1.35645 5.19768 1.66485C4.90965 3.48339 3.48339 4.90965 1.66485 5.19768Z" fill="white"/>
    </svg>,
    bgColor: 'bg-orange-500',
    iconColor: 'text-yellow-500'
  },
  { 
    id: 'paid', 
    label: 'Payé', 
    value: '15,456.00', 
    count: '10',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M16.9945 2.64243C16.3813 2.44913 15.6921 2.35528 14.896 2.30615C13.986 2.25 12.8801 2.25 11.5233 2.25H8.46073C6.85735 2.24999 5.60039 2.24999 4.5962 2.34547C3.57265 2.44279 2.73455 2.64457 1.99573 3.09732C1.22203 3.57144 0.571533 4.22194 0.0974129 4.99563C0.0806159 5.02304 0.0641644 5.05059 0.0480508 5.07828C0.125345 3.63513 0.327231 2.67932 0.854544 1.92267C1.13049 1.5267 1.46451 1.17848 1.84432 0.89079C3.02036 0 4.69796 0 8.05317 0H13.4219C15.1091 0 15.9527 0 16.4769 0.546449C16.8794 0.966137 16.9728 1.58228 16.9945 2.64243Z" fill="white"/>
    <path d="M0.736799 5.38751C0 6.58985 0 8.22657 0 11.5C0 14.7734 0 16.4101 0.736799 17.6125C1.14908 18.2853 1.71473 18.8509 2.38751 19.2632C3.58985 20 5.22657 20 8.5 20H11.5C14.7734 20 16.4101 20 17.6125 19.2632C18.2853 18.8509 18.8509 18.2853 19.2632 17.6125C19.7471 16.8229 19.9132 15.8459 19.9702 14.3409H13.6365C11.716 14.3409 10.1592 12.7841 10.1592 10.8637C10.1592 8.94321 11.716 7.38638 13.6365 7.38638H19.8777C19.7775 6.55873 19.5951 5.92906 19.2632 5.38751C18.8509 4.71473 18.2853 4.14908 17.6125 3.7368C17.421 3.61943 17.2184 3.52076 17 3.43781C15.8472 3 14.252 3 11.5 3H8.5C5.22657 3 3.58985 3 2.38751 3.7368C1.71473 4.14908 1.14908 4.71473 0.736799 5.38751Z" fill="white"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M19.9779 8.88638H13.6365C12.5444 8.88638 11.6592 9.77164 11.6592 10.8637C11.6592 11.9557 12.5444 12.8409 13.6365 12.8409H19.9977C20 12.4268 20 11.9811 20 11.5C20 10.4828 20 9.62359 19.9779 8.88638ZM13.6365 10.1137C13.2222 10.1137 12.8865 10.4494 12.8865 10.8637C12.8865 11.2779 13.2222 11.6137 13.6365 11.6137H16.3637C16.7779 11.6137 17.1137 11.2779 17.1137 10.8637C17.1137 10.4494 16.7779 10.1137 16.3637 10.1137H13.6365Z" fill="white"/>
  </svg>,
    bgColor: 'bg-orange-500',
    iconColor: 'text-green-500'
  },
  { 
    id: 'late', 
    label: 'En retard', 
    value: '15,456.00', 
    count: '10',
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18" fill="none">
    <path d="M6.18465 0.977117L9.16135 10.118C9.16869 10.1406 9.177 10.1626 9.18622 10.1839V12.2C9.18622 12.6142 9.52201 12.95 9.93622 12.95C10.3504 12.95 10.6862 12.6142 10.6862 12.2V0.581696C10.9817 0.45057 11.3028 0.375484 11.6418 0.329915C12.2366 0.249949 12.9858 0.249973 13.8842 0.250001L18.4918 0.250003C21.3606 0.250003 23.6863 2.57564 23.6863 5.44445C23.6863 6.27618 23.2093 7.03421 22.4595 7.39413L21.9721 7.62807C20.8211 8.18056 20.8211 9.81945 21.9721 10.3719L22.4595 10.6059C23.2093 10.9658 23.6863 11.7238 23.6863 12.5556C23.6863 15.4244 21.3606 17.75 18.4918 17.75H9.93793C10.3514 17.7491 10.6862 17.4136 10.6862 17V15.8C10.6862 15.3858 10.3504 15.05 9.93622 15.05C9.52201 15.05 9.18622 15.3858 9.18622 15.8V17C9.18622 17.4134 9.5207 17.7487 9.9338 17.75L6.81991 17.75C5.07675 17.75 3.46745 16.8153 2.60378 15.3011L2.41643 14.9726C2.33486 14.8296 2.272 14.6767 2.22939 14.5177C2.03805 13.8036 2.27319 13.043 2.83417 12.5615L3.35914 12.1109C4.32795 11.2793 3.90377 9.6963 2.64897 9.46054L2.11766 9.36072C1.30023 9.20713 0.643309 8.59838 0.428041 7.79499C-0.314462 5.02393 1.33001 2.17562 4.10107 1.43312L4.13954 1.42281C4.81066 1.24297 5.37063 1.09291 5.8359 1.01936C5.9532 1.00082 6.06938 0.986226 6.18465 0.977117Z" fill="white"/>
  </svg>,
    bgColor: 'bg-orange-500',
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
            <CardContent className="p-2">
              <div className="flex items-start gap-4 flex-col">
                <span className={`text-2xl ${metric.bgColor} ${metric.iconColor} p-3 rounded-lg`}>
                  {metric.icon}
                </span>
                <div>
                  <div className="flex gap-2">
                    <p className="text-sm text-gray-500">{metric.label}</p>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                      {metric.count}
                    </span>
                  </div>
                  <p className="text-2xl font-semibold">{metric.value} <span className='text-sm'>FCFA</span></p>
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
            <TableCell className="text-right">
               <ContractDetails />
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