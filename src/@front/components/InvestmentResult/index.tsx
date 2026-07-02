import {
  ArrowUpRight, X, Shield, CheckCircle2, ChevronRight,
  BarChart3, Percent
} from 'lucide-react'
import { StatCard } from '../StatCard'
import { BarRow } from '../BarRow'
import { INVESTMENT_TYPE_CONFIG } from '@front/constants'
import { formatBRL, formatPercent, formatDate, getRateTypeLabel, clampPercent } from '@front/utils'
import type { InvestmentResultProps } from './type'

const GLOW_CLASSES = {
  '#D4A843': 'bg-[radial-gradient(ellipse_at_80%_30%,#D4A843_0%,transparent_65%)]',
  '#0D9E6E': 'bg-[radial-gradient(ellipse_at_80%_30%,#0D9E6E_0%,transparent_65%)]',
  '#6366F1': 'bg-[radial-gradient(ellipse_at_80%_30%,#6366F1_0%,transparent_65%)]',
} as const

const PROGRESS_WIDTH_STEPS = [
  'w-[0%]', 'w-[5%]', 'w-[10%]', 'w-[15%]', 'w-[20%]', 'w-[25%]',
  'w-[30%]', 'w-[35%]', 'w-[40%]', 'w-[45%]', 'w-[50%]', 'w-[55%]',
  'w-[60%]', 'w-[65%]', 'w-[70%]', 'w-[75%]', 'w-[80%]', 'w-[85%]',
  'w-[90%]', 'w-[95%]', 'w-[100%]',
] as const

function getWidthClass(percent: number) {
  const step = Math.max(0, Math.min(20, Math.round(percent / 5)))
  return PROGRESS_WIDTH_STEPS[step]
}

export function InvestmentResult({ data, onClose, compact = false }: InvestmentResultProps) {
  const { input, result } = data
  const profit = result.profit_liquid
  const profitPct = result.profit_percentage
  const info = INVESTMENT_TYPE_CONFIG[input.investment_type] ?? INVESTMENT_TYPE_CONFIG.cdb

  const stats = [
    { label: 'LUCRO LÍQUIDO MENSAL', value: formatBRL(result.profit_liquid), color: '#D4A843' },
    { label: 'RENDIMENTO MENSAL', value: formatBRL(result.profit_liquid), color: '#6366F1' },
    { label: 'LUCRO DIÁRIO LÍQUIDO', value: formatBRL(result.daily_profit_display), color: '#0D9E6E' },
    { label: 'Dias Úteis', value: String(result.business_days), color: '#8A94A6' },
  ]

  const barRows = [
    { label: 'Capital Inicial', value: input.initial_capital, color: '#3A4055' },
    { label: 'Lucro Bruto', value: result.profit_bruto, color: '#D4A843' },
    { label: 'Impostos (IOF+IR)', value: result.iof_value + result.ir_tax_amount, color: '#7F3535' },
    { label: 'Lucro Líquido', value: result.profit_liquid, color: '#10C98A' },
  ]

  const glowClass = GLOW_CLASSES[info.color as keyof typeof GLOW_CLASSES] ?? GLOW_CLASSES['#D4A843']

  return (
    <div className="space-y-3 animate-reveal max-w-full xl:max-w-200  w-full overflow-x-auto">
      <div className="dashboard-card-tight relative rounded-2xl border-[1px_solid_rgba(13,158,110,0.3)] bg-(--bg-card) p-5 shadow-[0_0_40px_rgba(13,158,110,0.06)]">
        <div className={`absolute inset-0 opacity-[0.06] ${glowClass}`} />

        <div className="relative flex items-start justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-base"><info.icon size={16} strokeWidth={1.5} /></span>
              <span className="text-xs font-black uppercase tracking-wider text-[#D4A843]">{info.label}</span>
              <span className="text-[11px] text-[#555]">·</span>
              <span className="text-[11px] text-[#555]">{getRateTypeLabel(input.rate_type)}</span>
              {data.id && <span className="text-[11px] font-mono text-[#444]">#{data.id}</span>}
            </div>
            <div className="text-3xl font-black leading-none text-white">
              {formatBRL(result.amount_liquid)}
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-widest text-[#555]">
              Montante Líquido Final
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-xl font-black text-[#10C98A]">
              <ArrowUpRight size={18} />
              {formatBRL(profit)}
            </div>
            <div className="mt-0.5 text-xs font-bold text-[#0D9E6E]">
              +{formatPercent(profitPct)}
            </div>
            <button
              onClick={onClose}
              className="ml-auto mt-2 block text-[#444] transition-colors hover:text-[#8A94A6]"
              aria-label="Fechar resultado"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-[11px] text-[#444]">
            <span>Capital: {formatBRL(input.initial_capital)}</span>
            <span>Bruto: {formatBRL(result.amount_bruto)}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(255,255,255,0.04)]">
            <div className={`h-full rounded-full bg-linear-to-r from-[#0D9E6E] to-[#10C98A] transition-all duration-700 ${getWidthClass(clampPercent(50 + profitPct * 3))}`} />
          </div>
        </div>
      </div>

      <div className={`dashboard-card-tight w-full  grid ${compact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'} gap-2`}>
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} color={s.color} />
        ))}
      </div>

      <div className="dashboard-card-tight w-full rounded-xl border-[1px_solid_rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.015)] p-4">
        <div className="mb-3 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#D4A843]">
          <Shield size={11} /> Impostos & Datas
        </div>

        {result.is_isento ? (
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#10C98A]">
            <CheckCircle2 size={13} />
            {info.label} - Isento de IR e IOF
          </div>
        ) : (
          <div className="mb-3 grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#555]">IOF</span>
              <span className="text-xs font-bold text-[#FC8181]">{formatBRL(result.iof_value)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#555]">IR ({result.ir_aliquot}%)</span>
              <span className="text-xs font-bold text-[#FC8181]">{formatBRL(result.ir_tax_amount)}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 border-t-[1px_solid_rgba(255,255,255,0.04)] pt-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#555]">Aplicação</span>
            <span className="text-xs font-mono text-white">{formatDate(input.application_date)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#555]"></span>
            <span className="text-xs font-mono text-white">{formatDate(input.redemption_date)} Resgate</span>
          </div>
        </div>

        {input.cdi_percentage != null && (
          <div className="mt-3 flex items-center gap-2 text-[11px] text-[#555]">
            <BarChart3 size={10} />
            CDI: {input.cdi_percentage}%
            {input.cdi_over != null && <span>· Over: {formatPercent(input.cdi_over)}</span>}
            {input.selic_meta != null && <span>· Selic: {formatPercent(input.selic_meta)}</span>}
          </div>
        )}
        {input.pre_fixed_rate != null && (
          <div className="mt-3 flex items-center gap-2 text-[11px] text-[#555]">
            <Percent size={10} />
            Taxa pré: {formatPercent(input.pre_fixed_rate)} a.a.
          </div>
        )}
      </div>

      {!compact && (
        <div className="dashboard-card-tight w-full rounded-xl border-[1px_solid_rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.015)] p-4">
          <div className="mb-4 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[#D4A843]">
            <ChevronRight size={11} /> Composição do Resultado
          </div>
          <div className="space-y-3">
            {barRows.map((row) => (
              <BarRow key={row.label} label={row.label} value={row.value} max={result.amount_bruto} color={row.color} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}