"use client";

import { type ReactNode } from "react";
import i18next from "i18next";
import { I18nextProvider, initReactI18next, useTranslation as useI18NextTranslation } from "react-i18next";
import pt from "../locales/pt.json";

export type TranslationSchema = typeof pt;

const resources = {
  pt: { translation: pt },
} as const;

if (!i18next.isInitialized) {
  i18next
    .use(initReactI18next)
    .init({
      resources,
      lng: "pt",
      fallbackLng: "pt",
      supportedLngs: ["pt"],
      interpolation: { escapeValue: false },
    });
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}

export function useAppTranslation() {
  const translation = useI18NextTranslation();
  return translation;
}
