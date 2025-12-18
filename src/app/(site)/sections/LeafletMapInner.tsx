'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useBillboards, type BillboardPoint } from "@/app/hooks/useBillboards";
import { useCtrlScrollZoom } from "@/app/hooks/useCtrlScrollZoom";

const defaultCenter: [number, number] = [-18.646, -48.193];

export default function LeafletMapInner() {
  const { billboards, isLoading, error } = useBillboards();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const defaultIconPrototype = L.Icon.Default.prototype as unknown as { _getIconUrl?: () => void };
    delete defaultIconPrototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const selectedBoard = useMemo(() => {
    if (!selectedId) return null;
    return billboards.find((board) => board.id === selectedId) ?? null;
  }, [billboards, selectedId]);

  const fallbackBoard = useMemo(() => {
    if (billboards.length === 0) return null;
    return billboards.find((board) => board.status !== "Disponível") ?? billboards[0];
  }, [billboards]);

  const activeBoard = selectedBoard ?? fallbackBoard;

  const center = useMemo(() => {
    if (activeBoard) {
      return [activeBoard.latitude, activeBoard.longitude] as [number, number];
    }
    return defaultCenter;
  }, [activeBoard]);

  return (
    <div className="map-shell">
      <MapContainer center={center} zoom={13} className="home-map" scrollWheelZoom={false}>
        <MapCenterer center={center} />
        <CtrlScrollZoomHandler />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {error && <Popup position={defaultCenter}>Não foi possível carregar os pontos. Tente novamente.</Popup>}
        {billboards.map((board) => (
          <Marker
            key={board.id}
            position={[board.latitude, board.longitude]}
            eventHandlers={{ click: () => setSelectedId(board.id) }}
          >
            <Popup>
              <strong>{board.title}</strong>
              <br />
              {board.address}
              <br />
              {board.status}
            </Popup>
          </Marker>
        ))}
        {isLoading && billboards.length === 0 && <Popup position={defaultCenter}>Carregando inventário...</Popup>}
      </MapContainer>

      <MapDetailPanel board={activeBoard} isLoading={isLoading} error={error} />
      <p className="map-hint">Segure CTRL (ou ⌘ no Mac) para usar o scroll do mouse.</p>
    </div>
  );
}

function MapCenterer({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
}

function CtrlScrollZoomHandler() {
  const map = useMap();
  useCtrlScrollZoom(map);
  return null;
}

function MapDetailPanel({ board, isLoading, error }: { board: BillboardPoint | null; isLoading: boolean; error: string | null }) {
  if (error) {
    return (
      <article className="map-detail-card">
        <p className="helper-text error">Não foi possível carregar o inventário.</p>
      </article>
    );
  }

  if (isLoading && !board) {
    return (
      <article className="map-detail-card">
        <p className="helper-text">Carregando inventário...</p>
      </article>
    );
  }

  if (!board) {
    return (
      <article className="map-detail-card">
        <p className="helper-text">Selecione um outdoor para ver os detalhes.</p>
      </article>
    );
  }

  return (
    <article className="map-detail-card">
      <header>
        <p className="section-label">Outdoor selecionado</p>
        <h3>{board.title}</h3>
      </header>
      <dl>
        <div>
          <dt>Código</dt>
          <dd>{board.code}</dd>
        </div>
        <div>
          <dt>Endereço</dt>
          <dd>{board.address}</dd>
        </div>
        <div>
          <dt>Bairro</dt>
          <dd>{board.neighborhood ?? "--"}</dd>
        </div>
        <div>
          <dt>Cidade</dt>
          <dd>{board.city ?? "--"}</dd>
        </div>
        <div>
          <dt>Tipo</dt>
          <dd>{board.type ?? "--"}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{board.status}</dd>
        </div>
        <div>
          <dt>Coordenadas</dt>
          <dd>
            {board.latitude.toFixed(4)}, {board.longitude.toFixed(4)}
          </dd>
        </div>
      </dl>
      {board.imageUrl && (
        <Image
          src={board.imageUrl}
          alt={`Outdoor ${board.title}`}
          className="map-detail-image"
          width={640}
          height={360}
          unoptimized
        />
      )}
    </article>
  );
}
