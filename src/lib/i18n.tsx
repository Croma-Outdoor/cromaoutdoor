"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import i18next from "i18next";
import { I18nextProvider, initReactI18next, useTranslation as useI18NextTranslation } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import pt from "../locales/pt.json";
import en from "../locales/en.json";

type Locale = "pt" | "en";
export type TranslationSchema = typeof pt;

type LanguageContextValue = {
  locale: Locale;
  switchLocale: (next: Locale) => void;
};

const resources = {
  pt: { translation: pt },
  en: { translation: en },
} as const;

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "pt";
  const stored = window.localStorage.getItem("croma-locale");
  if (stored === "pt" || stored === "en") return stored;
  return window.navigator.language.toLowerCase().startsWith("pt") ? "pt" : "en";
}

if (!i18next.isInitialized) {
  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "pt",
      supportedLngs: ["pt", "en"],
      interpolation: { escapeValue: false },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
      },
    });
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    i18next.changeLanguage(locale);
    window.localStorage.setItem("croma-locale", locale);
    document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      switchLocale: setLocale,
    }),
    [locale]
  );

  return (
    <LanguageContext.Provider value={value}>
      <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within TranslationProvider");
  }
  return ctx;
}

export function useAppTranslation() {
  const translation = useI18NextTranslation();
  return translation;
}
