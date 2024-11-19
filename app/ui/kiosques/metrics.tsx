'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, PlusCircle } from 'lucide-react'

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
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-sm text-muted-foreground font-medium uppercase">
            NOMBRE TOTAL DE KIOSQUES
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">390</span>
            <span className="px-2 py-1 text-sm bg-green-100 text-green-700 rounded-md">
              +12
            </span>
          </div>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
          <PlusCircle className="h-4 w-4" />
          Ajouter un nouveau kiosque
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="font-medium capitalize">{metric.title}</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-sm" />
                    <span className="text-2xl font-bold">{metric.metrics.current}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                    <span className="text-2xl font-bold">{metric.metrics.target}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{metric.stock}</span>
                  <div className="flex items-center gap-2">
                    <span>{metric.period}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}