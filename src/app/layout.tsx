import type { Metadata, Viewport } from "next";
import { Inter, Roboto } from "next/font/google"
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-roboto"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: 'ANA Gaming - Plataforma de Apostas Esportivas',
    template: '%s | ANA Gaming',
  },
  description:
    'A melhor plataforma para visualizar odds de apostas esportivas. Compare cotações de diferentes casas de apostas e encontre as melhores oportunidades.',
  keywords: [
    'apostas esportivas',
    'odds',
    'futebol',
    'basquete',
    'tênis',
    'esports',
    'comparação de odds',
    'casas de apostas',
  ],
  authors: [{ name: 'ANA Gaming' }],
  creator: 'ANA Gaming',
  publisher: 'ANA Gaming',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    siteName: 'ANA Gaming',
    title: 'ANA Gaming - Plataforma de Apostas Esportivas',
    description: 'Compare odds de apostas esportivas e encontre as melhores oportunidades.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ANA Gaming - Plataforma de Apostas',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ANA Gaming - Plataforma de Apostas Esportivas',
    description: 'Compare odds de apostas esportivas e encontre as melhores oportunidades.',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'SEU_GOOGLE_SITE_VERIFICATION_CODE',
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${roboto.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-inter antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
