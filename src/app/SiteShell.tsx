"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import cromaLogo from "../../public/assets/brand/croma_logo.png";
import { useAppTranslation, useLanguage, type TranslationSchema } from "@/lib/i18n";
import { useSupabaseAuth } from "@/app/hooks/useSupabaseAuth";
import { formatServerTimestamp, useServerTime } from "@/app/hooks/useServerTime";

export function SiteShell({ children }: { children: ReactNode }) {
  const { locale, switchLocale } = useLanguage();
  const { t } = useAppTranslation();
  const brand = t("brand", { returnObjects: true }) as TranslationSchema["brand"];
  const navCopy = t("nav", { returnObjects: true }) as TranslationSchema["nav"] & { signOut?: string };
  const languageCopy = t("language", { returnObjects: true }) as TranslationSchema["language"];
  const footer = t("footer", { returnObjects: true }) as TranslationSchema["footer"];
  const auth = useSupabaseAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = Boolean(auth.session);
  const { serverTime, error: serverTimeError } = useServerTime(isAuthenticated);
  const sessionClock = serverTimeError ?? (serverTime ? formatServerTimestamp(serverTime) : "Sincronizando...");
  const sessionEmail = auth.session?.user.email ?? "Conta autenticada";

  async function handleHeaderSignOut() {
    setIsSigningOut(true);
    try {
      await auth.signOut();
    } finally {
      setIsSigningOut(false);
    }
  }

  function handleNavLinkClick() {
    setMobileMenuOpen(false);
  }

  const navItems = [
    { href: "#sobre", label: navCopy.about },
    { href: "#solucoes", label: navCopy.solutions },
    { href: "#mapa", label: navCopy.map },
    { href: "#contato", label: navCopy.contact },
  ];

  const navLinks = navItems.map((item) => (
    <li key={item.href}>
      <a href={item.href} className="nav-link" onClick={handleNavLinkClick}>
        {item.label}
      </a>
    </li>
  ));

  const desktopNav = isAuthenticated ? (
    <SessionSummary
      email={sessionEmail}
      sessionClock={sessionClock}
      isSigningOut={isSigningOut}
      onSignOut={handleHeaderSignOut}
      label={navCopy.signOut}
    />
  ) : (
    <nav>
      <ul>{navLinks}</ul>
    </nav>
  );

  const mobileMenuContent = (
    <div className="mobile-nav-content">
      {isAuthenticated && (
        <SessionSummary
          email={sessionEmail}
          sessionClock={sessionClock}
          isSigningOut={isSigningOut}
          onSignOut={handleHeaderSignOut}
          label={navCopy.signOut}
        />
      )}
      <nav>
        <ul>{navLinks}</ul>
      </nav>
    </div>
  );

  return (
    <div className="site-layout">
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Ir para a página inicial">
          <Image src={cromaLogo} alt="Croma Outdoor" width={140} height={40} priority />
          <div>
            <p className="brand-kicker">{brand.tagline}</p>
            <p className="brand-subtitle">{brand.subtitle}</p>
          </div>
        </Link>
        <div className="desktop-nav">{desktopNav}</div>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? "Fechar" : "Menu"}
        </button>
        <div id="mobile-nav" className={`mobile-nav ${isMobileMenuOpen ? "open" : ""}`}>
          {mobileMenuContent}
        </div>
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

function SessionSummary({
  email,
  sessionClock,
  isSigningOut,
  onSignOut,
  label,
}: {
  email: string;
  sessionClock: string;
  isSigningOut: boolean;
  onSignOut: () => Promise<void>;
  label?: string;
}) {
  return (
    <div className="session-badge">
      <div>
        <p className="section-label">Sessão ativa</p>
        <p className="body-copy">{email}</p>
        <p className="helper-text">Hora do servidor: {sessionClock}</p>
      </div>
      <button type="button" className="cta-button outline" onClick={onSignOut} disabled={isSigningOut}>
        {isSigningOut ? "Saindo..." : label ?? "Encerrar sessão"}
      </button>
    </div>
  );
}
