'use client';

import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useCtrlScrollZoom } from "@/app/hooks/useCtrlScrollZoom";
import type { OutdoorRecord } from "@/app/hooks/useOutdoorsCrud";

const MAP_HINT = "Dica: segure CTRL (ou ⌘) para aplicar zoom com o scroll.";

export type AdminMapCardProps = {
  records: OutdoorRecord[];
  selectedPosition: [number, number];
  onSelectPosition: (lat: number, lng: number) => void;
  onEditRecord: (record: OutdoorRecord) => void;
};

export default function AdminMapCard({ records, selectedPosition, onSelectPosition, onEditRecord }: AdminMapCardProps) {
  useEffect(() => {
    const proto = L.Icon.Default.prototype as unknown as { _getIconUrl?: () => void };
    delete proto._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <article className="stat-card admin-map-card">
      <header>
        <p className="section-label">Mapa administrativo</p>
        <h3>Selecione coordenadas com um clique</h3>
        <p className="body-copy">Clique em qualquer ponto do mapa ou em um pin existente para preencher o formulário automaticamente.</p>
      </header>
      <div className="admin-map-shell">
        <MapContainer center={selectedPosition} zoom={13} className="admin-map" scrollWheelZoom={false}>
          <AdminMapCenterer center={selectedPosition} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <AdminMapEvents onSelectPosition={onSelectPosition} />
          {records.map((record) => (
            <Marker key={record.id} position={[record.latitude, record.longitude]} eventHandlers={{ click: () => onEditRecord(record) }}>
              <Popup>
                <strong>{record.codigo || "Outdoor"}</strong>
                <br />
                {record.endereco || record.bairro || "Sem endereço"}
              </Popup>
            </Marker>
          ))}
          {selectedPosition && (
            <Marker position={selectedPosition}>
              <Popup>Coordenadas selecionadas</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
      <p className="map-hint">{MAP_HINT}</p>
    </article>
  );
}

function AdminMapEvents({ onSelectPosition }: { onSelectPosition: (lat: number, lng: number) => void }) {
  const map = useMapEvents({
    click(event) {
      onSelectPosition(event.latlng.lat, event.latlng.lng);
    },
  });

  useCtrlScrollZoom(map);
  return null;
}

function AdminMapCenterer({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
}
