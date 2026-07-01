'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { InvestmentPayload, InvestmentResult } from '@front/types'
import { useServices } from './ServicesContext'
import { useToast } from './ToastContext'

const PAGE_SIZE = 10

export type SortField = 'id' | 'investment_type' | 'cdi' | 'capital' | 'profit_liquid' | 'profit_percentage' | 'months' | 'redemption_date' | 'application_date'
export type SortDirection = 'asc' | 'desc'

interface SortConfig {
  field: SortField | null
  direction: SortDirection
}

interface HistoryContextValue {
  items: InvestmentResult[]
  isLoading: boolean
  deletingId: number | null
  selectedItem: InvestmentResult | null
  editingItem: InvestmentResult | null
  currentPage: number
  lastPage: number
  total: number
  sortField: SortField | null
  sortDirection: SortDirection
  fetchHistory: () => void
  goToPage: (page: number) => void
  removeItem: (id: number) => Promise<boolean>
  selectItem: (item: InvestmentResult | null) => void
  editItem: (item: InvestmentResult) => void
  updateItem: (id: number, payload: InvestmentPayload) => Promise<boolean>
  cancelEdit: () => void
  sortBy: (field: SortField) => void
}

const HistoryContext = createContext<HistoryContextValue | null>(null)

export function HistoryProvider({ children }: { children: ReactNode }) {
  const { historyService } = useServices()
  const { showToast }      = useToast()

  const [allItems, setAllItems]       = useState<InvestmentResult[]>([])
  const [isLoading, setLoading]       = useState(false)
  const [deletingId, setDeletingId]   = useState<number | null>(null)
  const [selectedItem, setSelectedItem] = useState<InvestmentResult | null>(null)
  const [editingItem, setEditingItem] = useState<InvestmentResult | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig]   = useState<SortConfig>({ field: null, direction: 'asc' })

  const lastPage = useMemo(() => Math.max(1, Math.ceil(allItems.length / PAGE_SIZE)), [allItems])

  const effectiveCurrentPage = useMemo(
    () => Math.min(currentPage, lastPage),
    [currentPage, lastPage]
  )

  const total = allItems.length

  const sortedItems = useMemo(() => {
    if (!sortConfig.field) return allItems
    const field = sortConfig.field
    const dir = sortConfig.direction === 'asc' ? 1 : -1
    return [...allItems].sort((a, b) => {
      let valA: number | string
      let valB: number | string
      switch (field) {
        case 'id':
          valA = a.id ?? 0
          valB = b.id ?? 0
          return (valA - valB) * dir
        case 'investment_type':
          valA = a.input.investment_type
          valB = b.input.investment_type
          return valA.localeCompare(valB) * dir
        case 'cdi': {
          const cdiA = (a.input.pre_fixed_rate === 1 || a.input.pre_fixed_rate === 0) ? (a.input.cdi_percentage ?? 0) : (a.input.pre_fixed_rate ?? 0)
          const cdiB = (b.input.pre_fixed_rate === 1 || b.input.pre_fixed_rate === 0) ? (b.input.cdi_percentage ?? 0) : (b.input.pre_fixed_rate ?? 0)
          return (cdiA - cdiB) * dir
        }
        case 'capital':
          return (a.input.initial_capital - b.input.initial_capital) * dir
        case 'profit_liquid':
          return (a.result.profit_liquid - b.result.profit_liquid) * dir
        case 'profit_percentage':
          return (a.result.profit_percentage - b.result.profit_percentage) * dir
        case 'months':
          return (a.input.months - b.input.months) * dir
        case 'redemption_date':
          valA = a.input.redemption_date
          valB = b.input.redemption_date
          return valA.localeCompare(valB) * dir
        default:
          return 0
      }
    })
  }, [allItems, sortConfig])

  const items = useMemo(() => {
    const start = (effectiveCurrentPage - 1) * PAGE_SIZE
    return sortedItems.slice(start, start + PAGE_SIZE)
  }, [sortedItems, effectiveCurrentPage])

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    try {
      const res = await historyService.list({ page: 1, per_page: 9999 })
      setAllItems(Array.isArray(res.data) ? res.data : [])
      setCurrentPage(1)
    } catch {
      setAllItems([])
      showToast('error', 'Erro ao carregar hist\u00F3rico')
    } finally {
      setLoading(false)
    }
  }, [historyService, showToast])

  const goToPage = useCallback((page: number) => {
    const clamped = Math.max(1, Math.min(page, lastPage))
    setCurrentPage(clamped)
  }, [lastPage])

  const removeItem = useCallback(
    async (id: number): Promise<boolean> => {
      setDeletingId(id)
      try {
        await historyService.remove(id)
        setAllItems((prev) => prev.filter((i) => i.id !== id))
        showToast('success', `Investimento #${id} removido.`)
        return true
      } catch (err) {
        showToast('error', err instanceof Error ? err.message : 'Erro ao deletar')
        return false
      } finally {
        setDeletingId(null)
      }
    },
    [historyService, showToast]
  )

  const updateItem = useCallback(
    async (id: number, payload: InvestmentPayload): Promise<boolean> => {
      try {
        const original = editingItem?.input
        const updated = await historyService.update(id, payload, original)
        setAllItems((prev) => prev.map((i) => (i.id === id ? updated : i)))
        setSelectedItem(updated)
        setEditingItem(null)
        showToast('success', `Investimento #${id} atualizado com sucesso!`)
        return true
      } catch (err) {
        showToast('error', err instanceof Error ? err.message : 'Erro ao atualizar')
        return false
      }
    },
    [historyService, showToast]
  )

  const selectItem = useCallback((item: InvestmentResult | null) => {
    setSelectedItem(item)
  }, [])

  const editItem = useCallback((item: InvestmentResult) => {
    setEditingItem(item)
  }, [])

  const cancelEdit = useCallback(() => {
    setEditingItem(null)
  }, [])

  const sortBy = useCallback((field: SortField) => {
    setSortConfig((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
    setCurrentPage(1)
  }, [])

  return (
    <HistoryContext.Provider
      value={{ items, isLoading, deletingId, selectedItem, editingItem, currentPage: effectiveCurrentPage, lastPage, total, sortField: sortConfig.field, sortDirection: sortConfig.direction, fetchHistory, goToPage, removeItem, selectItem, editItem, updateItem, cancelEdit, sortBy }}
    >
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistory(): HistoryContextValue {
  const ctx = useContext(HistoryContext)
  if (!ctx) throw new Error('useHistory deve ser usado dentro de <HistoryProvider>')
  return ctx
}
