import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import { DecisionProvider } from '@/context/DecisionContext'; // ✅ Import nou
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TriaTu",
  description: "Decisions en grup fàcils i ràpides",
};

export const viewport: Viewport = {
  themeColor: "#131f24",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // Omple tota la pantalla (notch inclòs)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca">
      <head>
        {/* Estil inline per evitar flaixos blancs abans que carregui el CSS */}
        <style>{`html, body { background-color: #131f24 !important; }`}</style>
      </head>

      <body className={`${inter.className} min-h-dvh bg-[#131f24] text-white bg-gamified-pattern overflow-x-hidden antialiased`}>
        <LanguageProvider >
          {/* ✅ AFEGIM EL PROVIDER AQUÍ */}
          <DecisionProvider>
            {children}
          </DecisionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}