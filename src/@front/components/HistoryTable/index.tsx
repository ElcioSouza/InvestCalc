'use client'

import { RefreshCw, Trash2, Eye, Wallet, Star } from 'lucide-react'
import { INVESTMENT_TYPE_CONFIG } from '@front/constants'
import { formatBRL, formatPercent, formatDate, calcProfitPercent, toUpperLabel } from '@front/utils'
import type { HistoryTableProps } from './type'

const COLUMNS = ['ID', 'Tipo', 'Capital', 'Lucro L\u00EDq.', 'Rendimento', 'Prazo', 'Resg.', 'A\u00E7\u00F5es']

export function HistoryTable({
  items,
  isLoading,
  deletingId,
  selectedId,
  onSelect,
  onDelete,
  onRefresh,
}: HistoryTableProps) {
  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Star size={15} className="text-(--gold)" />
          <span className="text-xs font-bold text-[#D4A843] uppercase tracking-widest">
            Investimentos Salvos
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-bold bg-[rgba(212,168,67,0.1)] text-[#D4A843]"
          >
            {items.length}
          </span>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-xs text-[#555] hover:text-[#D4A843] transition-colors"
        >
          <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
          Atualizar
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <RefreshCw size={22} className="animate-spin text-[#D4A843]" />
        </div>
      )}

      {!isLoading && items.length === 0 && (
        <div
          className="dashboard-empty card-surface rounded-2xl flex flex-col items-center justify-center py-24 border-dashed border-[rgba(212,168,67,0.12)]"
        >
          <Wallet size={28} className="text-[#444] mb-3" />
          <p className="text-[#555] text-sm">Nenhum investimento salvo ainda</p>
          <p className="text-[#3A3F4A] text-xs mt-1">Use a aba &quot;Salvar&quot; para persistir simula\u00E7\u00F5es</p>
        </div>
      )}

      {!isLoading && items.length > 0 && (
        <div
          className="card-surface rounded-2xl overflow-hidden border border-(--border)"
        >
          <div className="overflow-x-auto">
            <table className="w-full inv-table">
              <thead>
                <tr className="border-b border-[rgba(212,168,67,0.1)]">
                  {COLUMNS.map((col) => (
                    <th key={col} className="text-left px-4 py-3">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const pct = calcProfitPercent(item.input.initial_capital, item.result.profit_liquid)
                  const info = INVESTMENT_TYPE_CONFIG[item.input.investment_type]
                  const isSelected = selectedId === item.id

                  return (
                    <tr
                      key={item.id ?? idx}
                      onClick={() => onSelect(item)}
                      className={`cursor-pointer transition-all border-b border-[rgba(255,255,255,0.03)] ${
                        isSelected ? 'bg-[rgba(212,168,67,0.05)]' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono font-bold text-[#D4A843]">
                          #{item.id}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{info?.icon}</span>
                          <span className="text-xs font-bold text-white">
                            {toUpperLabel(item.input.investment_type)}
                          </span>
                          {item.result.is_isento && (
                            <span
                              className="text-[9px] font-semibold text-[#0D9E6E] bg-[rgba(13,158,110,0.1)] py-0.5 px-1 rounded"
                            >
                              Isento
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-white">
                        {formatBRL(item.input.initial_capital)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold text-[#10C98A]">
                          {formatBRL(item.result.profit_liquid)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-[#D4A843]">+{formatPercent(pct)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-[#8A94A6]">{item.input.months}m</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono text-[#555]">
                          {formatDate(item.input.redemption_date)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); onSelect(item) }}
                            className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(212,168,67,0.1)] text-[#555] hover:text-[#D4A843]"
                            aria-label="Ver detalhes do investimento"
                          >
                            <Eye size={12} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); if (item.id) onDelete(item.id) }}
                            disabled={deletingId === item.id}
                            className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(229,62,62,0.1)] text-[#555] hover:text-[#FC8181]"
                            aria-label={deletingId === item.id ? 'Removendo...' : 'Remover investimento'}
                          >
                            {deletingId === item.id
                              ? <RefreshCw size={12} className="animate-spin" />
                              : <Trash2 size={12} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
