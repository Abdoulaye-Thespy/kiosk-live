'use client';
import React from 'react'

import Header from '@/app/ui/header';
import KioskMetrics from '@/app/ui/admin/kiosques/metrics';
import MapView from '@/app/ui/maps/maps';
import { AddKioskDialog } from '@/app/ui/admin/kiosques/nouveau';


export default function Commercial() {

  return (
    <div className="container mx-auto space-y-6">
      <Header title="Gestion des kiosques" />
      <div className="flex justify-between items-center mb-6">
        <div></div>
        <AddKioskDialog />
      </div>
      <KioskMetrics />
      <MapView />
    </div>
  )
}