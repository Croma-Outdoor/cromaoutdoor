"use client";

import Image from "next/image";
import { useAppTranslation, useLanguage, type TranslationSchema } from "@/lib/i18n";
import type { ReactNode } from "react";

export function SiteShell({ children }: { children: ReactNode }) {
  const { locale, switchLocale } = useLanguage();
  const { t } = useAppTranslation();
  const brand = t("brand", { returnObjects: true }) as TranslationSchema["brand"];
  const navCopy = t("nav", { returnObjects: true }) as TranslationSchema["nav"];
  const languageCopy = t("language", { returnObjects: true }) as TranslationSchema["language"];
  const footer = t("footer", { returnObjects: true }) as TranslationSchema["footer"];
  const navItems = [
    { href: "#sobre", label: navCopy.about },
    { href: "#solucoes", label: navCopy.solutions },
    { href: "#mapa", label: navCopy.map },
    { href: "#contato", label: navCopy.contact },
  ];

  return (
    <div className="site-layout">
      <header className="site-header">
        <div className="brand">
          <Image src="/assets/brand/croma_logo.png" alt="Croma Outdoor" width={140} height={40} priority />
          <div>
            <p className="brand-kicker">{brand.tagline}</p>
            <p className="brand-subtitle">{brand.subtitle}</p>
          </div>
        </div>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="nav-link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="language-toggle" role="group" aria-label={languageCopy.toggleLabel}>
          {(["pt", "en"] as const).map((code) => (
            <button
              key={code}
              type="button"
              className={`language-chip ${locale === code ? "active" : ""}`}
              onClick={() => switchLocale(code)}
            >
              {languageCopy[code]}
            </button>
          ))}
        </div>
      </header>

      <main className="site-main" id="top">
        {children}
      </main>

      <footer className="site-footer">
        <div>
          <p className="footer-label">{footer.contact}</p>
          <a href="mailto:cromaoutdoor74@gmail.com">cromaoutdoor74@gmail.com</a>
          <a href="https://wa.me/5534988381931" rel="noreferrer" target="_blank">
            +55 (34) 98838-1931
          </a>
        </div>
        <div>
          <p className="footer-label">{footer.address}</p>
          {footer.addressLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div>
          <p className="footer-label">{footer.social}</p>
          <p>{footer.socialHandle}</p>
        </div>
      </footer>
    </div>
  );
}
