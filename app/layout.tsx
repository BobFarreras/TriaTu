import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DecideAI",
  description: "Decisions en grup fàcils i ràpides",
  // NO posis manifest aquí, Next.js ho fa automàticament amb manifest.ts
};

// FORCEM UN ÚNIC COLOR DE TEMA (BLAU NIT)
export const viewport: Viewport = {
  themeColor: "#131f24",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Forcem la classe 'dark' per si tens components que usen 'dark:'
    <html lang="ca" className="dark" suppressHydrationWarning>
      <head>
        {/* Estil inline per evitar el flash blanc inicial */}
        <style>{`
          html, body { background-color: #131f24; } 
        `}</style>
      </head>
      
      <body className={`${inter.className} min-h-dvh bg-gamified-pattern overflow-x-hidden selection:bg-brand-green selection:text-white`}>
        <LanguageProvider>
           {children}
        </LanguageProvider>
      </body>
    </html>
  );
}