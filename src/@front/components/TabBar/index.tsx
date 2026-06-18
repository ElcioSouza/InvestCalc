'use client'

import { TrendingUp, History } from 'lucide-react'
import { TAB_LABELS, TABS } from '@front/constants'
import type { TabBarProps } from './type'

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <div
      className="dashboard-tabs flex gap-1 mb-8 p-1 rounded-xl w-fit bg-[rgba(255,255,255,0.03)] border border-[rgba(212,168,67,0.1)]"
    >
      {TABS.map((tab) => {
        const isActive = active === tab
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`flex items-center px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              isActive
                ? 'text-black bg-[linear-gradient(135deg,#D4A843,#A07820)] shadow-[0_2px_12px_rgba(212,168,67,0.25)]'
                : 'text-[#8A94A6] hover:text-[#D4A843]'
            }`}
          >
            {tab === 'simular' && <TrendingUp size={14} className="mr-1.5" />}
            {tab === 'historico' && <History size={14} className="mr-1.5" />}
            {TAB_LABELS[tab]}
          </button>
        )
      })}
    </div>
  )
}
