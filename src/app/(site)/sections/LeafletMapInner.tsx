'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useBillboards, type BillboardPoint } from "@/app/hooks/useBillboards";
import { useCtrlScrollZoom } from "@/app/hooks/useCtrlScrollZoom";
import { useAppTranslation, type TranslationSchema } from "@/lib/i18n";

const defaultCenter: [number, number] = [-18.646, -48.193];

type LeafletMapInnerProps = {
  onSelectBoard?: (board: BillboardPoint) => void;
  selectedBoardId?: string | null;
};

export default function LeafletMapInner({ onSelectBoard, selectedBoardId }: LeafletMapInnerProps) {
  const { billboards, isLoading, error } = useBillboards();
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const { t } = useAppTranslation();
  const mapCopy = t("map", { returnObjects: true }) as TranslationSchema["map"];

  useEffect(() => {
    // Ensure Leaflet markers have default icon paths resolved in Next.js
    const defaultIconPrototype = L.Icon.Default.prototype as unknown as { _getIconUrl?: () => void };
    delete defaultIconPrototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  useCtrlScrollZoom(mapInstance);

  const center = useMemo(() => {
    if (billboards.length === 0) return defaultCenter;
    const [first] = billboards;
    return [first.latitude, first.longitude] as [number, number];
  }, [billboards]);

  useEffect(() => {
    if (!selectedBoardId || !mapInstance) return;
    const board = billboards.find((item) => item.id === selectedBoardId);
    if (board) {
      mapInstance.flyTo([board.latitude, board.longitude], 15, { duration: 0.6 });
    }
  }, [billboards, mapInstance, selectedBoardId]);

  return (
    <MapContainer
      center={center}
      zoom={14}
      scrollWheelZoom
      touchZoom
      zoomControl
      wheelDebounceTime={80}
      className="home-map interactive-map"
      attributionControl={false}
    >
      <MapInstanceHandler onReady={setMapInstance} />
      <MapCenterer center={center} />
      <RecenterControl center={defaultCenter} />
      <CustomAttribution label={mapCopy.attribution} />
      <TileLayer
        attribution='Tiles &copy; Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        opacity={0.25}
      />
      {error && (
        <Popup position={defaultCenter}>Não foi possível carregar os pontos. Recarregue a página.</Popup>
      )}
      {billboards.map((board) => (
        <Marker
          key={board.id}
          position={[board.latitude, board.longitude]}
          eventHandlers={{
            click: () => {
              onSelectBoard?.(board);
            },
          }}
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

function RecenterControl({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    const Recenter = L.Control.extend({
      onAdd() {
        const btn = L.DomUtil.create("button", "map-recenter-btn leaflet-bar");
        btn.type = "button";
        btn.setAttribute("aria-label", "Recentrar mapa em Araguari");
        btn.innerHTML = `
          <svg aria-hidden="true" viewBox="0 0 24 24" class="map-recenter-icon" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 5V2" />
            <path d="M12 22v-3" />
            <path d="M19 12h3" />
            <path d="M2 12h3" />
            <path d="M5.64 5.64l2.12 2.12" />
            <path d="M16.24 16.24l2.12 2.12" />
          </svg>
        `;
        L.DomEvent.disableClickPropagation(btn);
        L.DomEvent.on(btn, "click", () => {
          map.setView(center, 14, { animate: true });
        });
        return btn;
      },
    });

    const control = new Recenter({ position: "topleft" });
    map.addControl(control);

    return () => {
      map.removeControl(control);
    };
  }, [center, map]);

  return null;
}

function MapInstanceHandler({ onReady }: { onReady: Dispatch<SetStateAction<L.Map | null>> }) {
  const map = useMap();

  useEffect(() => {
    onReady(map);
    return () => {
      onReady(null);
    };
  }, [map, onReady]);

  return null;
}

function CustomAttribution({ label }: { label: string }) {
  const map = useMap();

  useEffect(() => {
    const Attribution = L.Control.extend({
      onAdd() {
        const container = L.DomUtil.create("div", "custom-map-attribution leaflet-control");
        container.textContent = label;
        container.setAttribute("role", "contentinfo");
        return container;
      },
    });

    const control = new Attribution({ position: "bottomright" });
    map.addControl(control);

    return () => {
      map.removeControl(control);
    };
  }, [label, map]);

  return null;
}
