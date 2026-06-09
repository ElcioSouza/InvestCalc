import { formatBRL, clampPercent } from '@front/utils'
import type { BarRowProps } from './type'

const BAR_COLOR_CLASSES = {
  '#D4A843': { text: 'text-[#D4A843]', fill: 'bg-[#D4A843]' },
  '#0D9E6E': { text: 'text-[#0D9E6E]', fill: 'bg-[#0D9E6E]' },
  '#6366F1': { text: 'text-[#6366F1]', fill: 'bg-[#6366F1]' },
  '#8A94A6': { text: 'text-[#8A94A6]', fill: 'bg-[#8A94A6]' },
  '#3A4055': { text: 'text-[#3A4055]', fill: 'bg-[#3A4055]' },
  '#7F3535': { text: 'text-[#7F3535]', fill: 'bg-[#7F3535]' },
  '#10C98A': { text: 'text-[#10C98A]', fill: 'bg-[#10C98A]' },
} as const

const WIDTH_STEPS = [
  'w-[0%]', 'w-[5%]', 'w-[10%]', 'w-[15%]', 'w-[20%]', 'w-[25%]',
  'w-[30%]', 'w-[35%]', 'w-[40%]', 'w-[45%]', 'w-[50%]', 'w-[55%]',
  'w-[60%]', 'w-[65%]', 'w-[70%]', 'w-[75%]', 'w-[80%]', 'w-[85%]',
  'w-[90%]', 'w-[95%]', 'w-[100%]',
] as const

function getWidthClass(percent: number) {
  const step = Math.max(0, Math.min(20, Math.round(percent / 5)))
  return WIDTH_STEPS[step]
}

export function BarRow({ label, value, max, color }: BarRowProps) {
  const pct = max > 0 ? clampPercent((value / max) * 100) : 0
  const colorConfig = BAR_COLOR_CLASSES[color as keyof typeof BAR_COLOR_CLASSES] ?? BAR_COLOR_CLASSES['#D4A843']
  const fillWidthClass = getWidthClass(pct)

  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px]">
        <span className="text-[#555]">{label}</span>
        <span className={`font-semibold ${colorConfig.text}`}>
          {formatBRL(value)}
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-[rgba(255,255,255,0.04)]">
        <div className={`h-full rounded-full transition-all duration-700 ${colorConfig.fill} ${fillWidthClass}`} />
      </div>
    </div>
  )
}