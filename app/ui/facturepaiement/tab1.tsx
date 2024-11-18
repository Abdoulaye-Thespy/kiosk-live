import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const metrics = [
  { 
    id: 'all', 
    label: 'Toutes les factures', 
    value: '15,456.00 Fcfa', 
    count: '10',
    icon: '📄',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-500'
  },
  { 
    id: 'pending', 
    label: 'En attente', 
    value: '15,456.00 Fcfa', 
    count: '10',
    icon: '⏳',
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-500'
  },
  { 
    id: 'paid', 
    label: 'Payé', 
    value: '15,456.00 Fcfa', 
    count: '10',
    icon: '✅',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-500'
  },
  { 
    id: 'late', 
    label: 'En retard', 
    value: '15,456.00 Fcfa', 
    count: '10',
    icon: '⚠️',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-500'
  },
]

const chartData = [
  { date: '2024-01-28', facture: 150000, encaisse: 120000 },
  { date: '2024-02-04', facture: 380000, encaisse: 140000 },
  { date: '2024-02-12', facture: 420000, encaisse: 150000 },
  { date: '2024-02-20', facture: 350000, encaisse: 130000 },
  { date: '2024-02-28', facture: 400000, encaisse: 145000 },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded shadow">
        <p className="text-sm text-gray-600">{`Date: ${label}`}</p>
        <p className="text-sm text-blue-600">{`Facturé: ${payload[0].value} Fcfa`}</p>
        <p className="text-sm text-green-600">{`Encaissé: ${payload[1].value} Fcfa`}</p>
      </div>
    );
  }
  return null;
};

export default function TabOneFacturePaiement() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <span className={`text-2xl ${metric.iconBg} ${metric.iconColor} p-3 rounded-lg`}>
                  {metric.icon}
                </span>
                <div>
                  <p className="text-sm text-gray-500">{metric.label}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-semibold">{metric.value}</p>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100">
                      {metric.count}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="font-medium">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">$23,569.00</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="facture" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="encaisse" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Bénéfices</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">$23,569.00</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="facture" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="encaisse" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}