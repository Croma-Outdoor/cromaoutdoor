'use client';

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

const position: [number, number] = [-18.646, -48.193];

export default function LeafletMapInner() {
  useEffect(() => {
    // Ensure Leaflet markers have default icon paths resolved in Next.js
    delete (L.Icon.Default as any).prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: 320, width: "100%", borderRadius: 24 }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>Croma Outdoor &bull; Araguari</Popup>
      </Marker>
    </MapContainer>
  );
}
