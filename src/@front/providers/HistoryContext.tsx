'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { InvestmentPayload, InvestmentResult } from '@front/types'
import { useServices } from './ServicesContext'
import { useToast } from './ToastContext'

const PAGE_SIZE = 10

interface HistoryContextValue {
  items: InvestmentResult[]
  isLoading: boolean
  deletingId: number | null
  selectedItem: InvestmentResult | null
  editingItem: InvestmentResult | null
  currentPage: number
  lastPage: number
  total: number
  fetchHistory: () => void
  goToPage: (page: number) => void
  removeItem: (id: number) => Promise<boolean>
  selectItem: (item: InvestmentResult | null) => void
  editItem: (item: InvestmentResult) => void
  updateItem: (id: number, payload: InvestmentPayload) => Promise<boolean>
  cancelEdit: () => void
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

  const lastPage = useMemo(() => Math.max(1, Math.ceil(allItems.length / PAGE_SIZE)), [allItems])

  useEffect(() => {
    setCurrentPage((cp) => Math.min(cp, lastPage))
  }, [lastPage])

  const total = allItems.length
  const items = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return allItems.slice(start, start + PAGE_SIZE)
  }, [allItems, currentPage])

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

  return (
    <HistoryContext.Provider
      value={{ items, isLoading, deletingId, selectedItem, editingItem, currentPage, lastPage, total, fetchHistory, goToPage, removeItem, selectItem, editItem, updateItem, cancelEdit }}
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
