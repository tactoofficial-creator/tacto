import { useEffect, useRef } from 'react'

// Dynamic import of Leaflet to avoid SSR issues
let L = null

export function MapView({
  lat,
  lng,
  zoom = 14,
  blurred = false,   // true = show neighborhood blur, false = exact pin
  className = '',
  markerLabel,
  height = 200,
}) {
  const containerRef = useRef(null)
  const mapRef       = useRef(null)

  useEffect(() => {
    if (!lat || !lng || !containerRef.current) return

    // Lazy-load Leaflet
    import('leaflet').then((mod) => {
      L = mod.default

      // Fix Leaflet default icon path in Vite
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }

      const displayLat = blurred ? lat + (Math.random() - 0.5) * 0.004 : lat
      const displayLng = blurred ? lng + (Math.random() - 0.5) * 0.004 : lng

      const map = L.map(containerRef.current, {
        center: [displayLat, displayLng],
        zoom: blurred ? zoom - 1 : zoom,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: !blurred,
        touchZoom: false,
        doubleClickZoom: false,
        attributionControl: true,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map)

      if (!blurred) {
        const customIcon = L.divIcon({
          className: '',
          html: `<div style="
            width:36px;height:36px;
            background:#1A1A1A;
            border:3px solid white;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            box-shadow:0 2px 8px rgba(0,0,0,0.3);
          "></div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        })
        const marker = L.marker([displayLat, displayLng], { icon: customIcon }).addTo(map)
        if (markerLabel) marker.bindPopup(markerLabel)
      } else {
        // Blurred circle for approximate area
        L.circle([displayLat, displayLng], {
          radius: 350,
          fillColor: '#4A7C6F',
          fillOpacity: 0.15,
          color: '#4A7C6F',
          weight: 2,
          opacity: 0.4,
        }).addTo(map)
      }

      mapRef.current = map
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [lat, lng, blurred, zoom, markerLabel])

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`} style={{ height }}>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div ref={containerRef} className="w-full h-full" />
      {blurred && (
        <div className="absolute inset-0 flex items-end justify-center pb-3 pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
            <span className="text-xs text-charcoal-500">
              📍 Zona approssimativa — punto esatto dopo la conferma
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
