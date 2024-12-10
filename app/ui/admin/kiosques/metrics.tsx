'use client'
import { Button,  } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {ArrowUpCircleIcon } from 'lucide-react'
import styles from '@/app/ui/dashboard.module.css';
import ThreeKioskSVG from "../../svg/threekiosks";
import OneKioskSVG from "../../svg/onekiosks";

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
    <div className="">

      <div className="grid md:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <Card className={`shadow-md ${styles.carte}`} key={index}>
          <CardHeader className={`flex flex-column space-y-0 pb-2 shadow-md ${styles.carteEntete}`}>
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>

              <div className="flex justify-between pt-2">
                <div className="flex items-baseline space-x-3">
                  <div className="flex items-center bg-gray-500 rounded-full bg-opacity-15 px-2 py-0.5">
                    <div className="inline-block  text-xs font-medium text-grey-500 flex items-center">
                      <ThreeKioskSVG />

                    </div>
                    <div className="ml-2 text-xl font-bold text-grey-500">445</div>
                  </div>
                </div>

                <div className="flex items-baseline space-x-3">
                  <div className="flex items-center bg-gray-500 rounded-full bg-opacity-15 px-2 py-0.5">
                    <div className="inline-block  text-xs font-medium text-grey-500 flex items-center">
                      <ThreeKioskSVG />

                    </div>
                    <div className="ml-2 text-xl font-bold text-grey-500">445</div>
                  </div>
                </div>

                <div className="flex items-baseline space-x-3">
                  <div className="flex items-center bg-gray-500 rounded-full bg-opacity-15 px-2 py-0.5">
                    <div className="inline-block  text-xs font-medium text-grey-500 flex items-center">
                      <OneKioskSVG />

                    </div>
                    <div className="ml-2 text-xl font-bold text-grey-500">445</div>
                  </div>
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