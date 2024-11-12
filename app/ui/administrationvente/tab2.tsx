'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowUpIcon, InformationCircleIcon } from "@heroicons/react/24/outline"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const monthlyData = [
  { name: "Jan", value: 20 },
  { name: "Fév", value: 25 },
  { name: "Mar", value: 15 },
  { name: "Avr", value: 10 },
  { name: "Mai", value: 30 },
  { name: "Jun", value: 25 },
  { name: "Jul", value: 85 },
  { name: "Aoû", value: 35 },
  { name: "Sep", value: 15 },
  { name: "Oct", value: 5 },
  { name: "Nov", value: 20 },
  { name: "Déc", value: 30 },
]

export default function Component() {
  return (
    <div className="container mx-auto  ">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Suivi de l'activité</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Mensuel</span>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>

          <div className="grid gap-6 lg:grid-cols-4 p-6 space-y-6 bg-gray-50">
              <div className="flex justify-between space-y-6 lg:col-span-3">
                  {/* Proforma Section */}
                  <Card className="bg-white shadow-sm">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-base font-semibold">Proforma</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="space-y-4">
                              <div>
                                  <div className="flex items-baseline gap-2">
                                      <h3 className="text-2xl font-bold">$53,765</h3>
                                      <span className="flex items-center text-sm text-green-500 font-medium">
                                          <ArrowUpIcon className="h-4 w-4 mr-1" />
                                          16.9%
                                      </span>
                                  </div>
                                  <p className="text-sm text-gray-500">vs le mois dernier</p>
                              </div>

                              <div className="space-y-1">
                                  <div className="flex justify-between items-center text-sm">
                                      <span className="text-gray-500">Montant total des proformas</span>
                                      <InformationCircleIcon className="h-5 w-5 text-gray-400" />
                                  </div>
                                  <p className="text-lg font-semibold">1 560 000 Fcfa</p>
                              </div>

                              <div className="space-y-1">
                                  <span className="text-sm text-gray-500">Taux de conversion</span>
                                  <p className="text-lg font-semibold">60%</p>
                              </div>
                          </div>
                      </CardContent>
                  </Card>
                  {/* Chart Section */}
                  <Card className="bg-white shadow-sm flex-grow ml-4">
                      <CardHeader>
                          <CardTitle className="text-base font-semibold">Evolution des proformas par mois</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="h-[300px]">
                              <ResponsiveContainer width="100%" height="100%">
                                  <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                      <XAxis
                                          dataKey="name"
                                          axisLine={false}
                                          tickLine={false}
                                          tick={{ fill: '#888', fontSize: 12 }}
                                      />
                                      <YAxis
                                          axisLine={false}
                                          tickLine={false}
                                          tick={{ fill: '#888', fontSize: 12 }}
                                          tickFormatter={(value) => `${value}`}
                                      />
                                      <Tooltip
                                          contentStyle={{ background: 'white', border: '1px solid #ccc', borderRadius: '4px' }}
                                          labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                                      />
                                      <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
                                  </BarChart>
                              </ResponsiveContainer>
                          </div>
                      </CardContent>
                  </Card>
              </div>

              {/* Bon de commande Section */}
              <Card className="bg-white shadow-sm lg:col-span-1">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-base font-semibold">Bon de commande</CardTitle>
                      <TooltipProvider>
                          <UITooltip>
                              <TooltipTrigger>
                                  <InformationCircleIcon className="h-5 w-5 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                  <p>Bons confirmés</p>
                              </TooltipContent>
                          </UITooltip>
                      </TooltipProvider>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-4">
                          <div className="space-y-1">
                              <h3 className="text-2xl font-bold">29</h3>
                              <p className="text-sm text-gray-500">Bon confirmés</p>
                          </div>

                          <div className="space-y-1">
                              <span className="text-sm text-gray-500">Montant total</span>
                              <p className="text-lg font-semibold">1 560 000 Fcfa</p>
                          </div>

                          <div className="space-y-1">
                              <span className="text-sm text-gray-500">Taux de conversion</span>
                              <p className="text-lg font-semibold text-orange-500">60%</p>
                          </div>
                      </div>
                  </CardContent>
              </Card>


          </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Livraison Card */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Livraison</CardTitle>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <InformationCircleIcon className="h-5 w-5 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Suivi des commandes en cours de livraison</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Commandes en cours</span>
                <InformationCircleIcon className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-2xl font-bold">29</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Commandes terminées</span>
              <p className="text-2xl font-bold">17</p>
            </div>
          </CardContent>
        </Card>

        {/* Factures émises Card */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Factures émises</CardTitle>
            <p className="text-sm text-gray-500">Génération de factures pour les commandes livrées</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Nbre de factures générées</span>
                <InformationCircleIcon className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-2xl font-bold">29</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Montant total</span>
              <p className="text-2xl font-bold">1 560 000 Fcfa</p>
            </div>
          </CardContent>
        </Card>

        {/* Factures réglées Card */}
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Factures réglées à temps</CardTitle>
            <InformationCircleIcon className="h-5 w-5 text-gray-400" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-2xl font-bold text-green-500">29</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Factures réglées en retard</span>
              <p className="text-2xl font-bold text-red-500">12</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}