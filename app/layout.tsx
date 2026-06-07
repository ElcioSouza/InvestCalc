import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'InvestCalc — Calculadora de Renda Fixa Brasileira',
  description: 'Simule e compare CDB, LCI e LCA com taxas CDI e SELIC em tempo real.',
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
