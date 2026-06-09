import type { RateTypeSelectorProps } from './type'

const RATE_OPTIONS: { value: RateTypeSelectorProps['selected']; label: string; sub: string }[] = [
  { value: 'pos', label: 'P\u00F3s-fixado', sub: '% do CDI' },
  { value: 'pre', label: 'Pr\u00E9-fixado', sub: '% a.a.' },
]

export function RateTypeSelector({ selected, register }: RateTypeSelectorProps) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-[#555] mb-2 uppercase tracking-widest">
        Tipo de Taxa
      </label>
      <div className="grid grid-cols-2 gap-2">
        {RATE_OPTIONS.map(({ value, label, sub }) => {
          const isSelected = selected === value
          return (
            <label key={value} className="cursor-pointer block">
              <input
                type="radio"
                value={value}
                {...register('rate_type')}
                className="sr-only"
              />
              <div
                className={`flex items-center gap-2.5 p-3 rounded-xl transition-all duration-200 border ${
                  isSelected
                    ? 'border-[#D4A843] bg-[rgba(212,168,67,0.07)]'
                    : 'border-[rgba(255,255,255,0.05)] hover:border-[rgba(212,168,67,0.25)] bg-[rgba(255,255,255,0.01)]'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-[#D4A843]' : 'border-[#444]'
                  }`}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4A843]" />
                  )}
                </div>
                <div>
                  <div
                    className={`text-xs font-bold ${
                      isSelected ? 'text-[#D4A843]' : 'text-[#8A94A6]'
                    }`}
                  >
                    {label}
                  </div>
                  <div className="text-[10px] text-[#444]">{sub}</div>
                </div>
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}
