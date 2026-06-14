'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { InvestmentPayload, InvestmentResult } from '@front/types'
import { useServices } from './ServicesContext'
import { useToast } from './ToastContext'

interface SimulatorContextValue {
  result: InvestmentResult | null
  isLoading: boolean
  simulate: (payload: InvestmentPayload) => Promise<void>
  save: (payload: InvestmentPayload) => Promise<void>
  clearResult: () => void
}

const SimulatorContext = createContext<SimulatorContextValue | null>(null)

export function SimulatorProvider({ children }: { children: ReactNode }) {
  const { simulatorService } = useServices()
  const { showToast }        = useToast()
  const [result, setResult]     = useState<InvestmentResult | null>(null)
  const [isLoading, setLoading] = useState(false)

  const withLoading = useCallback(
    async (fn: () => Promise<InvestmentResult>, successMsg: (r: InvestmentResult) => string) => {
      setLoading(true)
      setResult(null)
      try {
        const res = await fn()
        setResult(res)
        showToast('success', successMsg(res))
      } catch (err) {
        showToast('error', err instanceof Error ? err.message : 'Erro inesperado')
      } finally {
        setLoading(false)
      }
    },
    [showToast]
  )

  const simulate = useCallback(
    (payload: InvestmentPayload) =>
      withLoading(
        () => simulatorService.simulate(payload),
        () => 'Simula\u00E7\u00E3o calculada com sucesso!'
      ),
    [simulatorService, withLoading]
  )

  const save = useCallback(
    (payload: InvestmentPayload) =>
      withLoading(
        () => simulatorService.save(payload),
        (r) => `Investimento #${r.id} salvo com sucesso!`
      ),
    [simulatorService, withLoading]
  )

  const clearResult = useCallback(() => setResult(null), [])

  return (
    <SimulatorContext.Provider value={{ result, isLoading, simulate, save, clearResult }}>
      {children}
    </SimulatorContext.Provider>
  )
}

export function useSimulator(): SimulatorContextValue {
  const ctx = useContext(SimulatorContext)
  if (!ctx) throw new Error('useSimulator deve ser usado dentro de <SimulatorProvider>')
  return ctx
}
