import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { DecisionProvider } from '@/context/DecisionContext';

const inter = Inter({ subsets: ["latin"] });

// 1. Defineix la URL real de la teva web (si estàs en local, posa localhost)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://triatu.vercel.app"; // Canvia pel teu domini real!

export const metadata: Metadata = {
  // ✅ Això arregla les rutes de les imatges
  metadataBase: new URL(BASE_URL), 

  title: {
    default: "TriaTu",
    template: "%s | TriaTu"
  },
  description: "Decisions en grup fàcils i ràpides",
  
  // ✅ CONFIGURACIÓ OPEN GRAPH (PER A WHATSAPP)
  openGraph: {
    title: "TriaTu",
    description: "Decisions en grup fàcils i ràpides",
    url: BASE_URL,
    siteName: "TriaTu",
    locale: "ca_ES",
    type: "website",
    // Si has posat el fitxer 'opengraph-image.png' a /app, Next.js omplirà això sol,
    // però deixar-ho explícit va bé per assegurar el tret.
    images: [
      {
        url: "/opengraph-image.png", // Next.js buscarà el fitxer màgicament
        width: 1200,
        height: 630,
        alt: "TriaTu - Decisions en grup",
      },
    ],
  },

  // ✅ CONFIGURACIÓ TWITTER / X (Targetes grans)
  twitter: {
    card: "summary_large_image",
    title: "TriaTu",
    description: "Decisions en grup fàcils i ràpides",
    images: ["/opengraph-image.png"], // Mateixa imatge
  },

  // Configuració Apple (ja la tenies bé)
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TriaTu",
    startupImage: [],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#131f24",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca">
      <head>
        <style>{`html, body { background-color: #131f24 !important; }`}</style>
      </head>

      <body className={`${inter.className} min-h-dvh bg-[#131f24] text-white bg-gamified-pattern overflow-x-hidden antialiased`}>
        <LanguageProvider >
          <DecisionProvider>
            {children}
          </DecisionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}