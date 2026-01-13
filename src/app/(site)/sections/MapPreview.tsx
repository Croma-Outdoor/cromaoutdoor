'use client';

import { useEffect, useRef, useState } from "react";
import { useAppTranslation, type TranslationSchema } from "@/lib/i18n";
import type { BillboardPoint } from "@/app/hooks/useBillboards";
import { LeafletMap } from "./LeafletMap";

const PANEL_EXIT_DURATION = 600;

export function MapPreview() {
  const { t } = useAppTranslation();
  const map = t("map", { returnObjects: true }) as TranslationSchema["map"];
  const panelCopy = t("mapPanel", { returnObjects: true }) as TranslationSchema["mapPanel"];
  const [interactionHint, setInteractionHint] = useState(map.zoomHintDesktop);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [panelBoard, setPanelBoard] = useState<BillboardPoint | null>(null);
  const [isPanelClosing, setPanelClosing] = useState(false);
  const closingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: coarse)");

    const updateHint = () => {
      setInteractionHint(mediaQuery.matches ? map.zoomHintMobile : map.zoomHintDesktop);
    };

    updateHint();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateHint);
      return () => mediaQuery.removeEventListener("change", updateHint);
    }

    mediaQuery.addListener(updateHint);
    return () => mediaQuery.removeListener(updateHint);
  }, [map.zoomHintDesktop, map.zoomHintMobile]);

  useEffect(() => {
    return () => {
      if (closingTimer.current) {
        clearTimeout(closingTimer.current);
      }
    };
  }, []);

  const handleSelectBoard = (board: BillboardPoint) => {
    if (closingTimer.current) {
      clearTimeout(closingTimer.current);
      closingTimer.current = null;
    }
    setPanelClosing(false);
    setPanelBoard(board);
    setSelectedBoardId(board.id);
  };

  const dismissPanel = () => {
    if (!panelBoard) return;
    setPanelClosing(true);
    setSelectedBoardId(null);
    closingTimer.current = setTimeout(() => {
      setPanelBoard(null);
      setPanelClosing(false);
      closingTimer.current = null;
    }, PANEL_EXIT_DURATION);
  };

  const mapPreviewClass = `map-preview ${panelBoard ? "map-preview--split" : ""}`;

  return (
    <section className="section" id="mapa" aria-labelledby="map-title">
      <h2 id="map-title">{map.title}</h2>
      <p className="map-status">{map.status}</p>
      <div className={mapPreviewClass}>
        <LeafletMap onSelectBoard={handleSelectBoard} selectedBoardId={selectedBoardId} />
        {panelBoard && (
          <aside
            key={panelBoard.id}
            className={`map-detail-card ${isPanelClosing ? "is-closing" : ""}`}
            aria-live="polite"
          >
            <header>
              <p className="section-label">{panelCopy.label}</p>
              <h3>{panelBoard.title}</h3>
              <p className="body-copy">{panelBoard.address}</p>
            </header>
            <dl>
              <div>
                <dt>{panelCopy.fields.code}</dt>
                <dd>{panelBoard.code}</dd>
              </div>
              <div>
                <dt>{panelCopy.fields.status}</dt>
                <dd>{panelBoard.status}</dd>
              </div>
              {panelBoard.neighborhood && (
                <div>
                  <dt>{panelCopy.fields.neighborhood}</dt>
                  <dd>{panelBoard.neighborhood}</dd>
                </div>
              )}
              {panelBoard.city && (
                <div>
                  <dt>{panelCopy.fields.city}</dt>
                  <dd>{panelBoard.city}</dd>
                </div>
              )}
            </dl>
            <button type="button" className="link-button" onClick={dismissPanel}>
              {panelCopy.close}
            </button>
          </aside>
        )}
        <div className="map-meta" aria-live="polite">
          <p className="map-hint">{interactionHint}</p>
        </div>
      </div>
    </section>
  );
}
