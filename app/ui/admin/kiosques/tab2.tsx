'use client'

import React from 'react'

import MapView from '../../maps/maps';
import KioskMetrics from './metrics';



export default function KioskTab2() {


  return (
    <div className="space-y-4 p-6">
      <KioskMetrics />
      <MapView />
    </div>
  )
}