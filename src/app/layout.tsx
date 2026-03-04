import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import AuthProvider from "@/components/AuthProvider";
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: "DentAI — AI Dental Pre-Screening & Smart Odontogram",
  description:
    "Sistem AI triage untuk skrining awal kesehatan gigi. Ceritakan keluhan Anda, dapatkan analisis cerdas dan visualisasi odontogram interaktif.",
  keywords: ["dental", "AI", "screening", "odontogram", "kesehatan gigi", "triage"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DentAI",
  },
  openGraph: {
    title: "DentAI — AI Dental Pre-Screening",
    description: "Skrining awal kesehatan gigi berbasis AI dengan odontogram interaktif",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#3B82F6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="antialiased min-h-screen">
        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 group">
              <span className="text-2xl group-hover:animate-float">🦷</span>
              <span className="text-xl font-bold gradient-text">DentAI</span>
            </a>
            <div className="flex items-center gap-1 sm:gap-2">
              <a
                href="/consult"
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
              >
                Konsultasi
              </a>
              <a
                href="/dashboard"
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
              >
                Dashboard
              </a>
              <a
                href="/history"
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
              >
                Riwayat
              </a>
              <a
                href="/about"
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
              >
                Tentang
              </a>
            </div>
          </div>
        </nav>
        <main className="pt-16">
          <AuthProvider>{children}</AuthProvider>
        </main>
        <ServiceWorkerRegister />
        <SpeedInsights />
      </body>
    </html>
  );
}
