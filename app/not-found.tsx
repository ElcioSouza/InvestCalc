'use client'

import Link from 'next/link'
import { ArrowLeft, FileX, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#060810] px-6 font-sans text-slate-100">
      <div className="relative flex flex-col items-center">
        <div className="absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#D4A843]/5 blur-3xl" />

        <div className="relative flex flex-col items-center gap-8 text-center animate-fade-in-up">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[rgba(212,168,67,0.18)] bg-[#0C1018]">
            <FileX className="h-10 w-10 text-[#D4A843]" strokeWidth={1.5} />
          </div>

          <div className="flex flex-col items-center gap-2">
            <h1 className="m-0 text-7xl font-black tracking-tight text-[#D4A843]">
              404
            </h1>
            <p className="m-0 text-lg font-medium text-slate-200">
              Página não encontrada
            </p>
            <p className="m-0 max-w-sm text-sm leading-relaxed text-[#8A94A6]">
              O endereço que você acessou não existe ou foi movido. Verifique a URL ou volte para o início.
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border-0 bg-[#D4A843] px-6 py-2.5 text-sm font-semibold text-[#060810] no-underline transition-all hover:bg-[#E0B95A] hover:shadow-[0_0_20px_rgba(212,168,67,0.25)]"
            >
              <Home className="h-4 w-4" />
              Voltar ao início
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[rgba(212,168,67,0.18)] bg-[#0C1018] px-6 py-2.5 text-sm font-medium text-slate-300 transition-all hover:border-[#D4A843]/40 hover:text-slate-100"
            >
              <ArrowLeft className="h-4 w-4" />
              Página anterior
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
