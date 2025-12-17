'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import { useBillboards } from "@/app/hooks/useBillboards";

const defaultCenter: [number, number] = [-18.646, -48.193];

export default function LeafletMapInner() {
  const { billboards, isLoading, error } = useBillboards();

  useEffect(() => {
    const defaultIconPrototype = L.Icon.Default.prototype as unknown as { _getIconUrl?: () => void };
    delete defaultIconPrototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const center = useMemo(() => {
    if (billboards.length === 0) return defaultCenter;
    const [first] = billboards;
    return [first.latitude, first.longitude] as [number, number];
  }, [billboards]);

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={false} style={{ height: 320, width: "100%", borderRadius: 24 }}>
      <MapCenterer center={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {error && (
        <Popup position={defaultCenter}>Não foi possível carregar os pontos. Tente novamente.</Popup>
      )}
      {billboards.map((board) => (
        <Marker key={board.id} position={[board.latitude, board.longitude]}>
          <Popup>
            <strong>{board.title}</strong>
            <br />
            {board.address}
            <br />
            {board.status}
          </Popup>
        </Marker>
      ))}
      {isLoading && billboards.length === 0 && (
        <Popup position={defaultCenter}>Carregando inventário...</Popup>
      )}
    </MapContainer>
  );
}

function MapCenterer({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
}
