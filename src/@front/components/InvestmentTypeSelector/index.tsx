import { Landmark, Home, Wheat } from 'lucide-react'
import type { InvestmentType } from '@front/types'
import type { InvestmentTypeSelectorProps } from './type'

const TYPES: InvestmentType[] = ['cdb', 'lci', 'lca']

const TYPE_ICONS: Record<InvestmentType, typeof Landmark> = {
  cdb: Landmark,
  lci: Home,
  lca: Wheat,
}

const TYPE_INFO: Record<InvestmentType, { label: string; taxed: boolean }> = {
  cdb: { label: 'CDB', taxed: true },
  lci: { label: 'LCI', taxed: false },
  lca: { label: 'LCA', taxed: false },
}

export function InvestmentTypeSelector({ selected, register }: InvestmentTypeSelectorProps) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-[#555] mb-2 uppercase tracking-widest">
        Tipo de Investimento
      </label>
      <div className="grid grid-cols-3 gap-4 items-stretch">
        {TYPES.map((type) => {
          const Icon = TYPE_ICONS[type]
          const info = TYPE_INFO[type]
          const isSelected = selected === type
          return (
            <label key={type} className="cursor-pointer block h-full">
              <input
                type="radio"
                value={type}
                {...register('investment_type')}
                className="sr-only"
              />
              <div
                className={`flex flex-col items-center justify-center gap-1.5 p-3 h-full min-h-[88] rounded-xl transition-all duration-200 border ${
                  isSelected
                    ? 'border-[#D4A843] bg-[rgba(212,168,67,0.07)]'
                    : 'border-[rgba(255,255,255,0.05)] hover:border-[rgba(212,168,67,0.25)] bg-[rgba(255,255,255,0.01)]'
                }`}
              >
                <Icon
                  size={20}
                  className={isSelected ? 'text-[#D4A843]' : 'text-[#8A94A6]'}
                  strokeWidth={1.5}
                />
                <span
                  className={`text-[11px] font-black tracking-wider ${
                    isSelected ? 'text-[#D4A843]' : 'text-[#8A94A6]'
                  }`}
                >
                  {info.label}
                </span>
                {!info.taxed && (
                  <span
                    className="text-[9px] font-semibold text-[#0D9E6E] bg-[rgba(13,158,110,0.1)] py-0.5 px-1.5 rounded"
                  >
                    IR Isento
                  </span>
                )}
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}
