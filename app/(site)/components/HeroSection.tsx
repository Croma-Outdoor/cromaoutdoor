'use client';

import { useAppTranslation, type TranslationSchema } from "@/app/i18n";

export default function HeroSection() {
  const { t } = useAppTranslation();
  const hero = t("hero", { returnObjects: true }) as TranslationSchema["hero"];

  return (
    <section className="section" aria-labelledby="hero-title">
      <p className="hero-label">{hero.label}</p>
      <h1 className="hero-title" id="hero-title">
        {hero.title}
        <br />
        <span className="gradient-text">{hero.highlight}</span>
      </h1>
      <p className="body-copy">{hero.copy}</p>

      <div className="hero-grid">
        {hero.stats.map((stat) => (
          <article className="stat-card" key={stat.id}>
            <p className="hero-label">{stat.label}</p>
            <p className="stat-value">{stat.value}</p>
            <p className="stat-label">{stat.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
