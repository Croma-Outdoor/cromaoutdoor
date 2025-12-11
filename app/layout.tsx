import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { TranslationProvider } from "./i18n";
import { SiteShell } from "./SiteShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Croma Outdoor",
  description: "Croma Outdoor - Comunicação - Site em construção",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-ZB80KWN7P3"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-ZB80KWN7P3');
            `,
          }}
        ></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} site-body`}>
        <TranslationProvider>
          <SiteShell>{children}</SiteShell>
        </TranslationProvider>
      </body>
    </html>
  );
}
