'use client'

import { RefreshCw, Trash2, Eye, Wallet, Star, Pencil, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react'
import { INVESTMENT_TYPE_CONFIG } from '@front/constants'
import { formatBRL, formatPercent, formatDate, toUpperLabel } from '@front/utils'
import type { SortField } from '@front/providers/HistoryContext'
import type { HistoryTableProps } from './type'

const COLUMNS: { label: string; field: SortField | null }[] = [
  { label: 'ID', field: 'id' },
  { label: 'Tipo', field: 'investment_type' },
  { label: 'CDI', field: 'cdi' },
  { label: 'Capital', field: 'capital' },
  { label: 'Lucro L\u00EDq.', field: 'profit_liquid' },
  { label: 'Lucro Di\u00E1rio', field: 'daily_profit_display' },
  { label: 'Rendimento', field: 'profit_percentage' },
  { label: 'Prazo', field: 'months' },
  { label: 'Aplica.', field: 'application_date' },
  { label: 'Resg.', field: 'redemption_date' },
  { label: 'A\u00E7\u00F5es', field: null },
]

function getPageNumbers(current: number, last: number): (number | '...')[] {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1)
  const pages: (number | '...')[] = [1]
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) {
    pages.push(i)
  }
  if (current < last - 2) pages.push('...')
  pages.push(last)
  return pages
}

export function HistoryTable({
  items,
  isLoading,
  deletingId,
  selectedId,
  currentPage,
  lastPage,
  total,
  sortField,
  sortDirection,
  onSelect,
  onEdit,
  onDelete,
  onRefresh,
  onPageChange,
  onSort,
}: HistoryTableProps) {
  const pages = getPageNumbers(currentPage, lastPage)
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
            {total}
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
          <p className="text-(--text-muted) text-xs mt-1">Use a aba &quot;Salvar&quot; para persistir simulações</p>
        </div>
      )}

      {!isLoading && items.length > 0 && (
        <div
          className="card-surface rounded-2xl overflow-hidden border border-(--border)"
        >
          <div className="overflow-x-auto">
            <table className="w-full max-w-full inv-table">
              <thead>
                <tr className="border-b border-[rgba(212,168,67,0.1)]">
                  {COLUMNS.map((col) => (
                    <th
                      key={col.label}
                      className={`text-left px-2 py-3 whitespace-nowrap ${col.field ? 'cursor-pointer select-none hover:bg-[rgba(212,168,67,0.05)] transition-colors' : ''}`}
                      onClick={col.field ? () => onSort(col.field!) : undefined}
                    >
                      <div className="flex items-center gap-1">
                        <span>{col.label}</span>
                        {col.field && sortField === col.field && (
                          sortDirection === 'asc'
                            ? <ChevronUp size={12} className="text-[#D4A843]" />
                            : <ChevronDown size={12} className="text-[#D4A843]" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const pct = item.result.profit_percentage
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
                      <td className="px-2 py-3 whitespace-nowrap">
                        <span className="text-xs font-mono font-bold text-[#D4A843]">
                          #{item.id}
                        </span>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{info?.icon && <info.icon size={14} strokeWidth={1.5} />}</span>
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
                     <td className="px-2 py-3 whitespace-nowrap">
                        <span className="text-xs font-mono font-bold text-[#D4A843]">
                          {item.input.pre_fixed_rate === 1 ||  item.input.pre_fixed_rate === 0 ?  item.input.cdi_percentage : item.input.pre_fixed_rate}%
                        </span>
                      </td>
                      <td className="px-2 py-3 text-xs font-semibold text-white whitespace-nowrap">
                        {formatBRL(item.input.initial_capital)}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <span className="text-xs font-bold text-[#10C98A]">
                          {formatBRL(item.result.profit_liquid)}
                        </span>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <span className="text-xs font-bold text-[#6DD5FA]">
                          {formatBRL(item.result.daily_profit_display)}
                        </span>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <span className="text-xs font-semibold text-[#D4A843]">+{formatPercent(pct)}</span>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <span className="text-xs text-[#8A94A6]">{item.input.months}m</span>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <span className="text-xs font-mono text-[#555]">
                          {formatDate(item.input.application_date)}
                        </span>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <span className="text-xs font-mono text-[#555]">
                          {formatDate(item.input.redemption_date)}
                        </span>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); onSelect(item) }}
                            className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(212,168,67,0.1)] text-[#555] hover:text-[#D4A843]"
                            aria-label="Ver detalhes do investimento"
                          >
                            <Eye size={12} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onEdit(item) }}
                            className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(66,153,225,0.1)] text-[#555] hover:text-[#4299E1]"
                            aria-label="Editar investimento"
                          >
                            <Pencil size={12} />
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

          {items.length > 0 && (
            <div className="flex items-center justify-between px-2 py-3 border-t border-[rgba(212,168,67,0.1)]">
              <span className="text-xs text-[#555]">
                Página {currentPage} de {lastPage}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(212,168,67,0.1)] text-[#555] hover:text-[#D4A843] disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Página anterior"
                >
                  <ChevronLeft size={14} />
                </button>
                {pages.map((p, i) =>
                  p === '...' ? (
                    <span key={`dots-${i}`} className="text-xs text-[#555] px-1">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => onPageChange(p)}
                      disabled={p === currentPage}
                      className={`min-w-[28px] h-7 rounded-lg text-xs font-bold transition-colors ${
                        p === currentPage
                          ? 'bg-[rgba(212,168,67,0.15)] text-[#D4A843] cursor-default'
                          : 'text-[#555] hover:bg-[rgba(212,168,67,0.08)] hover:text-[#D4A843]'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= lastPage}
                  className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(212,168,67,0.1)] text-[#555] hover:text-[#D4A843] disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Próxima página"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
