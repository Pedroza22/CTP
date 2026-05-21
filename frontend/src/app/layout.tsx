import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import { CookieConsent } from "@/components/ui/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Precision Flow - Sistema de Control de Proyectos",
  description: "Plataforma para la gestión eficiente de proyectos y tareas",
  icons: {
    icon: [
      { url: '/logo_transparent.png', type: 'image/png' },
    ],
    shortcut: '/logo_transparent.png',
    apple: '/logo_transparent.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full bg-gray-50">
      <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased text-gray-900`}>
        <QueryProvider>
          {children}
          <CookieConsent />
        </QueryProvider>
      </body>
    </html>
  );
}
