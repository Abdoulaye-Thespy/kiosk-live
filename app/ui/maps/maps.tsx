"use client"

import { useEffect, useState } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { KioskDetailsDialog } from './KioskDetailsDialog'
import { getKiosksWithCoordinates } from '@/app/actions/kiosk-actions'
import { KioskType } from '@prisma/client'

const mapContainerStyle = {
  width: '100%',
  height: '400px'
}

const center = {
  lat: 4.061536,
  lng: 9.786072
}

const oneCompartmentMarker = {
  path: 'M83.5135 123.523c15.1929 0 27.5096-12.3167 27.5096-27.5095 0-15.1929-12.3167-27.5096-27.5096-27.5096-15.1928 0-27.5095 12.3167-27.5095 27.5096 0 15.1928 12.3167 27.5095 27.5095 27.5095z',
  fillColor: '#E5520F',
  fillOpacity: 1,
  strokeWeight: 2,
  strokeColor: '#FFFFFF',
  scale: 0.5,
}

const threeCompartmentMarker = {
  path: 'M83.5135 123.523c15.1929 0 27.5096-12.3167 27.5096-27.5095 0-15.1929-12.3167-27.5096-27.5096-27.5096-15.1928 0-27.5095 12.3167-27.5095 27.5096 0 15.1928 12.3167 27.5095 27.5095 27.5095z',
  fillColor: '#2563EB',
  fillOpacity: 1,
  strokeWeight: 2,
  strokeColor: '#FFFFFF',
  scale: 0.5,
}

interface KioskMarker {
  id: string
  position: {
    lat: number
    lng: number
  }
  title: string
  client: string
  manager: string
  services: string
  location: string
  coordinates: string
  revenue: string
  type: KioskType
}

export default function MapView() {
  const [markers, setMarkers] = useState<KioskMarker[]>([])
  const [selectedKiosk, setSelectedKiosk] = useState<KioskMarker | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  useEffect(() => {
    const fetchKiosks = async () => {
      try {
        const kioskMarkers = await getKiosksWithCoordinates()
        setMarkers(kioskMarkers)
      } catch (error) {
        console.error('Error fetching kiosks:', error)
      }
    }
    fetchKiosks()
  }, [])

  const handleMarkerClick = (marker: KioskMarker) => {
    setSelectedKiosk(marker)
    setIsDetailsOpen(true)
  }

  const getMarkerIcon = (type: KioskType) => {
    switch (type) {
      case KioskType.ONE_COMPARTMENT_WITH_BRANDING:
      case KioskType.ONE_COMPARTMENT_WITHOUT_BRANDING:
        return oneCompartmentMarker
      case KioskType.THREE_COMPARTMENT_WITH_BRANDING:
      case KioskType.THREE_COMPARTMENT_WITHOUT_BRANDING:
        return threeCompartmentMarker
      default:
        return oneCompartmentMarker // fallback to default marker
    }
  }

  return (
    <div className="">
      <Card className="p-4">
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={14}
            options={{
              styles: [
                {
                  featureType: "all",
                  elementType: "labels.text.fill",
                  stylers: [{ color: "#666666" }],
                },
                {
                  featureType: "water",
                  elementType: "geometry",
                  stylers: [{ color: "#e9e9e9" }],
                },
              ],
            }}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                title={marker.title}
                icon={getMarkerIcon(marker.type)}
                onClick={() => handleMarkerClick(marker)}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </Card>

      {selectedKiosk && (
        <KioskDetailsDialog
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          kiosk={selectedKiosk}
        />
      )}
    </div>
  )
}