'use client';

import { useAppTranslation, type TranslationSchema } from "@/app/i18n";

export function MediaShowcase() {
  const { t } = useAppTranslation();
  const media = t("media", { returnObjects: true }) as TranslationSchema["media"];

  return (
    <section className="section" id="solucoes" aria-labelledby="media-title">
      <p className="section-label">{media.label}</p>
      <h2 id="media-title">{media.title}</h2>
      <div className="media-grid" role="list">
        {media.cards.map((card) => (
          <article className="media-card" role="listitem" key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
