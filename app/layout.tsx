import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

const inter = Inter({ subsets: ["latin"] });

export const metadacideAIta: Metadata = {
  title: "TriaTu",
  description: "Decisions en grup fàcils i ràpides",
  // Next.js injectarà automàticament el link al manifest generat
};

export const viewport: Viewport = {
  // Fixem el color exacte del fons (#131f24)
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
    <html lang="ca">
      <head>
        <style>{`
          html, body { background-color: #131f24 !important; }
        `}</style>
      </head>
      
      {/* CORRECCIÓ AQUÍ: Canvia 'bg-dot-pattern' per 'bg-gamified-pattern' */}
      <body className={`${inter.className} min-h-dvh bg-[#131f24] text-white bg-gamified-pattern overflow-x-hidden`}>
        <LanguageProvider>
           {children}
        </LanguageProvider>
      </body>
    </html>
  );
}