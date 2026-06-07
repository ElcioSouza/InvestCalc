import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-950 px-6 text-center font-sans text-slate-100">
      <h1 className="m-0 text-5xl font-black text-[#D4A843]">
        404
      </h1>
      <p className="m-0 text-sm text-slate-400">
        Página não encontrada
      </p>
      <Link
        href="/"
        className="inline-flex cursor-pointer rounded-lg border-0 bg-[#D4A843] px-6 py-2 font-bold text-slate-950 no-underline transition-colors hover:bg-[#E0B95A]"
      >
        Voltar ao início
      </Link>
    </div>
  )
}
