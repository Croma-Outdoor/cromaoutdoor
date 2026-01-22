'use client';

import Link from "next/link";
import { useAppTranslation, type TranslationSchema } from "@/lib/i18n";

export default function HeroSection() {
  const { t } = useAppTranslation();
  const hero = t("hero", { returnObjects: true }) as TranslationSchema["hero"];
  const navCopy = t("nav", { returnObjects: true }) as TranslationSchema["nav"];
  const featuredStats = hero.stats.slice(0, 2);
  const heroButtons = [
    {
      id: "map",
      href: "#mapa",
      label: hero.buttons?.map ?? navCopy.map ?? "Mapa",
      primary: true,
      isAnchor: true,
    },
    {
      id: "methods",
      href: "/metodos",
      label: hero.buttons?.methods ?? navCopy.methods,
    },
    {
      id: "contact",
      href: "/contato",
      label: hero.buttons?.contact ?? navCopy.contact,
    },
  ];

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
            {heroButtons.map((button) => {
              const buttonClass = `hero-cta${button.primary ? " primary" : ""}`;
              if (button.isAnchor) {
                return (
                  <a key={button.id} className={buttonClass} href={button.href}>
                    {button.label}
                  </a>
                );
              }
              return (
                <Link key={button.id} className={buttonClass} href={button.href}>
                  {button.label}
                </Link>
              );
            })}
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
