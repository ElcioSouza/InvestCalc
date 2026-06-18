'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { InvestmentPayload, InvestmentResult } from '@front/types'
import { useServices } from './ServicesContext'
import { useToast } from './ToastContext'

interface HistoryContextValue {
  items: InvestmentResult[]
  isLoading: boolean
  deletingId: number | null
  selectedItem: InvestmentResult | null
  editingItem: InvestmentResult | null
  fetchHistory: () => void
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

  const [items, setItems]             = useState<InvestmentResult[]>([])
  const [isLoading, setLoading]       = useState(false)
  const [deletingId, setDeletingId]   = useState<number | null>(null)
  const [selectedItem, setSelectedItem] = useState<InvestmentResult | null>(null)
  const [editingItem, setEditingItem] = useState<InvestmentResult | null>(null)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    try {
      const data = await historyService.list()
      setItems(Array.isArray(data) ? data : [])
    } catch {
      setItems([])
      showToast('error', 'Erro ao carregar hist\u00F3rico')
    } finally {
      setLoading(false)
    }
  }, [historyService, showToast])

  const removeItem = useCallback(
    async (id: number): Promise<boolean> => {
      setDeletingId(id)
      try {
        await historyService.remove(id)
        setItems((prev) => prev.filter((i) => i.id !== id))
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
        setItems((prev) => prev.map((i) => (i.id === id ? updated : i)))
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
      value={{ items, isLoading, deletingId, selectedItem, editingItem, fetchHistory, removeItem, selectItem, editItem, updateItem, cancelEdit }}
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
