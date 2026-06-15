import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  title: 'InvestCalc — Calculadora de Renda Fixa Brasileira',
  description: 'Simule e compare CDB, LCI e LCA com taxas CDI e SELIC em tempo real.',
  icons: '/favicon.svg',
  openGraph: {
    title: 'InvestCalc — Calculadora de Renda Fixa Brasileira',
    description: 'Simule e compare CDB, LCI e LCA com taxas CDI e SELIC em tempo real.',
    images: [
      {
        url: `${siteUrl}/api/og`,
        width: 1200,
        height: 630,
        alt: 'InvestCalc',
      },
    ],
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InvestCalc — Calculadora de Renda Fixa Brasileira',
    description: 'Simule e compare CDB, LCI e LCA com taxas CDI e SELIC em tempo real.',
    images: [`${siteUrl}/api/og`],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
