'use client'

import { useEffect, useRef, useState } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { KioskDetailsDialog } from './detailsmap'

const mapContainerStyle = {
  width: '100%',
  height: '400px'
}

const center = {
  lat: 4.061536,
  lng: 9.786072
}

const markers = [
  { 
    id: "11562",
    position: { lat: 4.072230392159226, lng: 9.715773339178742 }, 
    title: "FreelanceConnect-BOLO89",
    client: "Jenny Wilson",
    manager: "Gestionnaire 1",
    services: "Ventes de crédits de communication",
    city: "Douala",
    location: "Bonamoussadi - rue 2345",
    coordinates: "1628.2637.379.027",
    revenue: "2.000.000 CFA"
  },
]

const customSvgMarker = {
  path: 'M83.5135 123.523c15.1929 0 27.5096-12.3167 27.5096-27.5095 0-15.1929-12.3167-27.5096-27.5096-27.5096-15.1928 0-27.5095 12.3167-27.5095 27.5096 0 15.1928 12.3167 27.5095 27.5095 27.5095z',
  fillColor: '#E5520F',
  fillOpacity: 1,
  strokeWeight: 2,
  strokeColor: '#FFFFFF',
  scale: 0.5,
}

export default function MapView() {
  const [selectedKiosk, setSelectedKiosk] = useState<typeof markers[0] | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const handleMarkerClick = (marker: typeof markers[0]) => {
    setSelectedKiosk(marker)
    setIsDetailsOpen(true)
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
                icon={customSvgMarker}
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

