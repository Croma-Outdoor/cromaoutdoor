'use client';

import { useAppTranslation, type TranslationSchema } from "@/lib/i18n";

export function CallToAction() {
  const { t } = useAppTranslation();
  const cta = t("cta", { returnObjects: true }) as TranslationSchema["cta"];

  return (
    <section className="section" aria-labelledby="cta-title">
      <div className="cta-card" id="contato">
        <p className="section-label">{cta.label}</p>
        <h2 id="cta-title">{cta.title}</h2>
        <p className="body-copy">{cta.copy}</p>
        <div className="cta-buttons">
          <a className="cta-button" href="mailto:cromaoutdoor74@gmail.com">
            {cta.buttons.email}
          </a>
          <a className="cta-button outline" href="https://wa.me/5534988381931" target="_blank" rel="noreferrer">
            {cta.buttons.whatsapp}
          </a>
        </div>
      </div>
    </section>
  );
}
