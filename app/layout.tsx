// =================== FILE: app/layout.tsx ===================
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DecideAI",
  description: "Decisions en grup fàcils i ràpides",
  // ❌ ESBORRA AQUESTA LÍNIA: manifest: "/manifest.json", 
  // Next.js ja carregarà automàticament el fitxer app/manifest.ts
};

// Mantén el viewport igual, està perfecte per evitar el blanc
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f0fdf4" },
    { media: "(prefers-color-scheme: dark)", color: "#131f24" },
  ],
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
    <html lang="ca" suppressHydrationWarning>
      <head>
        {/* Això ho mantenim per seguretat visual extra */}
        <style>{`
          html, body { background-color: #131f24; } 
          @media (prefers-color-scheme: light) { html, body { background-color: #f0fdf4; } }
        `}</style>
      </head>
      
      <body className={`${inter.className} min-h-dvh bg-gray-50 dark:bg-black bg-dot-pattern overflow-x-hidden selection:bg-purple-200`}>
        <LanguageProvider>
           {children}
        </LanguageProvider>
      </body>
    </html>
  );
}