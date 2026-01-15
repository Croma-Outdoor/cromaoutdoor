'use client';

import Link from "next/link";
import { useAppTranslation, type TranslationSchema } from "@/lib/i18n";

export default function HeroSection() {
  const { t } = useAppTranslation();
  const hero = t("hero", { returnObjects: true }) as TranslationSchema["hero"];
  const navCopy = t("nav", { returnObjects: true }) as TranslationSchema["nav"];
  const featuredStats = hero.stats.slice(0, 2);

  return (
    <section className="section hero-section" aria-labelledby="hero-title">
      <div className="hero-layout">
        <div className="hero-content">
          <h1 className="hero-title" id="hero-title">
            {hero.title}
            <br />
            <span className="gradient-text hero-highlight">{hero.highlight}</span>
          </h1>
          <p className="body-copy">{hero.copy}</p>

          <div className="hero-cta-group" role="group" aria-label={hero.label}>
            <a className="hero-cta primary" href="#mapa">
              {hero.buttons?.map ?? navCopy.map ?? "Mapa"}
            </a>
            <Link className="hero-cta" href="/metodos">
              {hero.buttons?.methods ?? navCopy.methods}
            </Link>
            <Link className="hero-cta" href="/contato">
              {hero.buttons?.contact ?? navCopy.contact}
            </Link>
          </div>
        </div>

        <div className="hero-stats" aria-label="Indicadores de cobertura">
          {featuredStats.map((stat) => (
            <article className="hero-stat" key={stat.id}>
              <p className="hero-stat-value">{stat.value}</p>
              <p className="hero-stat-label">{stat.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
