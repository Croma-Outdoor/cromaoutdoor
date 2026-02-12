"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import cromaLogo from "../../public/assets/brand/croma_logo.webp";
import { useAppTranslation, type TranslationSchema } from "@/lib/i18n";
import { useSupabaseAuth } from "@/app/hooks/useSupabaseAuth";
import { formatServerTimestamp, useServerTime } from "@/app/hooks/useServerTime";
import { ContactModalProvider, useContactModal } from "@/app/hooks/useContactModal";

type ContactModalCopy = {
  title: string;
  description: string;
  emailLabel: string;
  phoneLabel: string;
  close: string;
};

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <ContactModalProvider>
      <SiteShellInner>{children}</SiteShellInner>
    </ContactModalProvider>
  );
}

function SiteShellInner({ children }: { children: ReactNode }) {
  const { t } = useAppTranslation();
  const navCopy = t("nav", { returnObjects: true }) as TranslationSchema["nav"] & { signOut?: string };
  const footer = t("footer", { returnObjects: true }) as TranslationSchema["footer"];
  const sessionCopy = t("session", { returnObjects: true }) as TranslationSchema["session"];
  const contactModalCopy = t("contactModal", { returnObjects: true }) as ContactModalCopy;
  const auth = useSupabaseAuth();
  const contactModal = useContactModal();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const isAuthenticated = Boolean(auth.session);
  const { serverTime, error: serverTimeError } = useServerTime(isAuthenticated);
  const formattedServerTime = serverTime ? formatServerTimestamp(serverTime, "pt-BR") : null;
  const sessionClock = serverTimeError ?? formattedServerTime ?? sessionCopy.syncing;
  const sessionEmail = auth.session?.user.email ?? "Conta autenticada";
  const pathname = usePathname();

  useEffect(() => {
    function handleScroll() {
      setShowBackToTop(window.scrollY > 320);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  function handleContactClick() {
    setMobileMenuOpen(false);
    contactModal.open();
  }

  const navItems = [
    { href: "/#mapa", label: navCopy.map },
    { href: "/sobre", label: navCopy.about },
    { href: "/metodos", label: navCopy.methods },
  ];

  const contactItem = { label: navCopy.contact };

  function isNavActive(href: string) {
    const [basePath] = href.split("#");
    if (!basePath || basePath === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(basePath);
  }

  const navLinks = navItems.map((item) => {
    const isActive = isNavActive(item.href);
    return (
      <li key={item.href}>
        <Link href={item.href} className={`nav-link ${isActive ? "active" : ""}`} onClick={handleNavLinkClick}>
          {item.label}
        </Link>
      </li>
    );
  });

  const contactNavItem = (
    <li key="contato">
      <button type="button" className="nav-link nav-link-button" onClick={handleContactClick}>
        {contactItem.label}
      </button>
    </li>
  );

  const desktopNav = isAuthenticated ? (
    <SessionSummary
      email={sessionEmail}
      sessionClock={sessionClock}
      isSigningOut={isSigningOut}
      onSignOut={handleHeaderSignOut}
      label={navCopy.signOut}
      sessionCopy={sessionCopy}
    />
  ) : (
    <nav>
      <ul>{navLinks}{contactNavItem}</ul>
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
          sessionCopy={sessionCopy}
        />
      )}
      <nav>
        <ul>{navLinks}{contactNavItem}</ul>
      </nav>
    </div>
  );

  return (
    <div className="site-layout">
      <header className="site-header">
        <Link href="/" className="brand" aria-label="Ir para a página inicial">
          <Image src={cromaLogo} alt="Croma Outdoor" width={180} height={60} priority />
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
      </header>

      <main className="site-main" id="top">
        {children}
      </main>

      <button
        type="button"
        className={`back-to-top ${showBackToTop ? "visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Voltar ao topo"
      >
        <svg
          aria-hidden="true"
          className="back-to-top-icon"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5" />
          <path d="m5 12 7-7 7 7" />
        </svg>
      </button>

      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-column">
            <p className="footer-label">{footer.contact}</p>
            <div className="footer-item">
              <span className="footer-meta">{footer.emailLabel}</span>
              <a href="mailto:cromaoutdoor74@gmail.com">cromaoutdoor74@gmail.com</a>
            </div>
            <div className="footer-item">
              <span className="footer-meta">{footer.phoneLabel}</span>
              <a href="https://wa.me/553499270074" rel="noreferrer" target="_blank">
                +55 (34) 9927-0074
              </a>
            </div>
          </div>
          <div className="footer-column">
            <p className="footer-label">{footer.social}</p>
            <p>{footer.socialHandle}</p>
            <Link href="/privacidade" className="footer-label footer-link" id="privacy-color">
              {footer.privacy}
            </Link>
            <p>{footer.cnpj}</p>
            <p>{footer.responsible}</p>
          </div>
        </div>
        <p className="footer-note">{footer.note}</p>
      </footer>

      {/* Contact Modal */}
      {contactModal.isOpen && (
        <div className="contact-modal-overlay" onClick={() => contactModal.close()}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="contact-modal-close"
              onClick={() => contactModal.close()}
              aria-label={contactModalCopy.close}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
            <h2 className="contact-modal-title">{contactModalCopy.title}</h2>
            <p className="contact-modal-description">{contactModalCopy.description}</p>
            <div className="contact-modal-links">
              <div className="contact-modal-item">
                <span className="contact-modal-label">{contactModalCopy.emailLabel}</span>
                <a href="mailto:cromaoutdoor74@gmail.com" className="contact-modal-link">
                  cromaoutdoor74@gmail.com
                </a>
              </div>
              <div className="contact-modal-item">
                <span className="contact-modal-label">{contactModalCopy.phoneLabel}</span>
                <a
                  href="https://wa.me/553499270074"
                  rel="noreferrer"
                  target="_blank"
                  className="contact-modal-link"
                >
                  +55 (34) 9927-0074
                </a>
              </div>
            </div>
            <div className="contact-modal-buttons">
              <a href="mailto:cromaoutdoor74@gmail.com" className="cta-button">
                {contactModalCopy.emailLabel}
              </a>
              <a
                href="https://wa.me/553499270074"
                rel="noreferrer"
                target="_blank"
                className="cta-button whatsapp"
              >
                {contactModalCopy.phoneLabel}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SessionSummary({
  email,
  sessionClock,
  isSigningOut,
  onSignOut,
  label,
  sessionCopy,
}: {
  email: string;
  sessionClock: string;
  isSigningOut: boolean;
  onSignOut: () => Promise<void>;
  label?: string;
  sessionCopy: TranslationSchema["session"];
}) {
  return (
    <div className="session-badge">
      <div>
        <p className="section-label">{sessionCopy.active}</p>
        <p className="body-copy">{email}</p>
        <p className="helper-text">
          {sessionCopy.serverTime}: {sessionClock}
        </p>
        <p className="helper-text subtle">{sessionCopy.restricted}</p>
      </div>
      <button type="button" className="cta-button outline" onClick={onSignOut} disabled={isSigningOut}>
        {isSigningOut ? "Saindo..." : label ?? "Encerrar sessão"}
      </button>
    </div>
  );
}
