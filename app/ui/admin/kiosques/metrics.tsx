'use client'
import { Button,  } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, PlusCircle, ArrowUpCircleIcon } from 'lucide-react'
import styles from '@/app/ui/dashboard.module.css';

const metrics = [
  {
    title: "nouveaux kiosques",
    metrics: { current: 455, target: 455 },
    stock: "+412 stock",
    period: "ce dernier mois"
  },
  {
    title: "Kiosques en activité",
    metrics: { current: 455, target: 455 },
    stock: "+412 stock",
    period: "ce dernier mois"
  },
  {
    title: "Kiosques en maintenance",
    metrics: { current: 455, target: 455 },
    stock: "+412 stock",
    period: "ce dernier mois"
  }
]

export default function KioskMetrics() {
  return (
    <div className="p-6 space-y-6">

      <div className="grid md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <Card className={`shadow-md ${styles.carte}`} key={index}>
          <CardHeader className={`flex flex-column space-y-0 pb-2 shadow-md ${styles.carteEntete}`}>
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <div className="flex items-baseline space-x-3">
              <div className="text-2xl font-bold mt-2">132</div>
              <div className="flex items-center bg-green-500 rounded-full bg-opacity-15 px-2 py-0.5">
                <div className="inline-block  text-xs font-medium text-green-500 flex items-center">
                  <ArrowUpCircleIcon className='inline-block h-5 w-5' />

                </div>
                <div className="ml-2 text-medium text-gray-500">5.2%</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>

            <div className="flex items-center text-medium">
              <p> <span className='font-bold'>+29</span> le dernier mois</p>
            </div>
          </CardContent>
        </Card>
        ))}
      </div>
    </div>
  )
}