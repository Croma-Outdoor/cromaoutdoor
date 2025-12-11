'use client';

import { useAppTranslation, type TranslationSchema } from "@/app/i18n";
import { LeafletMap } from "./LeafletMap";

export function MapPreview() {
  const { t } = useAppTranslation();
  const map = t("map", { returnObjects: true }) as TranslationSchema["map"];

  return (
    <section className="section" id="mapa" aria-labelledby="map-title">
      <p className="section-label">{map.label}</p>
      <h2 id="map-title">{map.title}</h2>
      <p className="body-copy">{map.copy}</p>
      <div className="map-preview">
        <p className="hero-label">{map.status}</p>
        <LeafletMap />
        <p className="map-caption">{map.caption}</p>
      </div>
    </section>
  );
}
