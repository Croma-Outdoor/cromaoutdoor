'use client';

import { useAppTranslation, type TranslationSchema } from "@/app/i18n";

export function AboutSection() {
  const { t } = useAppTranslation();
  const about = t("about", { returnObjects: true }) as TranslationSchema["about"];

  return (
    <section className="section" id="sobre" aria-labelledby="about-title">
      <p className="section-label">{about.label}</p>
      <h2 id="about-title">{about.title}</h2>
      <p className="body-copy">{about.copy}</p>

      <div className="media-grid" role="list">
        {about.highlights.map((card) => (
          <article className="media-card" role="listitem" key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
