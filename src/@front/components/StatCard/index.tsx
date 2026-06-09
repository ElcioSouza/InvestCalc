import type { StatCardProps } from './type'

const STAT_COLOR_CLASSES = {
  '#D4A843': 'text-[#D4A843]',
  '#6366F1': 'text-[#6366F1]',
  '#0D9E6E': 'text-[#0D9E6E]',
  '#8A94A6': 'text-[#8A94A6]',
  '#3A4055': 'text-[#3A4055]',
  '#7F3535': 'text-[#7F3535]',
  '#10C98A': 'text-[#10C98A]',
} as const

export function StatCard({ label, value, sub, color }: StatCardProps) {
  const colorClass = STAT_COLOR_CLASSES[color as keyof typeof STAT_COLOR_CLASSES] ?? STAT_COLOR_CLASSES['#D4A843']

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.018)] p-3 text-center">
      <div className="mb-1 text-[10px] uppercase tracking-wider text-[#555]">{label}</div>
      <div className={`text-sm font-black animate-count ${colorClass}`}>
        {value}
      </div>
      {sub && <div className="mt-0.5 text-[10px] text-[#444]">{sub}</div>}
    </div>
  )
}
