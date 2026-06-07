'use client'

import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <html lang="pt-BR" className="bg-slate-950">
      <body className="m-0 flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 px-6 text-center font-sans text-slate-100">
        <h1 className="m-0 text-2xl font-bold">
          Algo deu errado
        </h1>
        <p className="m-0 text-sm text-slate-400">
          {error.message ?? 'Erro inesperado na aplicação.'}
        </p>
        <button
          onClick={reset}
          className="cursor-pointer rounded-lg border-0 bg-[#D4A843] px-6 py-2 font-bold text-slate-950 transition-colors hover:bg-[#E0B95A]"
        >
          Tentar novamente
        </button>
      </body>
    </html>
  )
}
