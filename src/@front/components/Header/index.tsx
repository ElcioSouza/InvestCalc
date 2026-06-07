import { TrendingUp } from 'lucide-react'

export function Header() {
  return (
    <header className="dashboard-header mb-10 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-linear-to-br from-[#D4A843] to-[#A07820] shadow-[0_0_24px_rgba(212,168,67,0.3)]"
        >
          <TrendingUp size={20} className="text-black" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-gradient-gold tracking-tight leading-none">
            InvestCalc
          </h1>
          <p className="text-[11px] text-[#555] mt-0.5 tracking-widest uppercase">
            Investimentos &middot; CDI &middot; SELIC
          </p>
        </div>

        <div
          className="ml-auto hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-[#0D9E6E] font-medium bg-[rgba(13,158,110,0.08)] border-[rgba(13,158,110,0.2)]"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#0D9E6E] animate-pulse" />
          Taxas oficiais
        </div>
      </div>

      <div
        className="h-px bg-linear-to-r from-[#D4A843] via-[rgba(212,168,67,0.2)] to-transparent"
      />
    </header>
  )
}
