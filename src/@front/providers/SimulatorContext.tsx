'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { InvestmentPayload, InvestmentResult } from '@front/types'
import { useServices } from './ServicesContext'
import { useToast } from './ToastContext'

interface SimulatorContextValue {
  result: InvestmentResult | null
  isLoading: boolean
  simulate: (payload: InvestmentPayload) => Promise<void>
  clearResult: () => void
}

const SimulatorContext = createContext<SimulatorContextValue | null>(null)

export function SimulatorProvider({ children }: { children: ReactNode }) {
  const { simulatorService } = useServices()
  const { showToast }        = useToast()
  const [result, setResult]     = useState<InvestmentResult | null>(null)
  const [isLoading, setLoading] = useState(false)

  const simulate = useCallback(
    (payload: InvestmentPayload): Promise<void> => {
      setLoading(true)
      setResult(null)
      return simulatorService
        .simulate(payload)
        .then((res) => {
          setResult(res)
          if (res.id) {
            showToast('success', `Investimento #${res.id} salvo com sucesso!`)
          } else {
            showToast('success', 'Simula\u00E7\u00E3o calculada com sucesso!')
          }
        })
        .catch((err) => {
          showToast('error', err instanceof Error ? err.message : 'Erro inesperado')
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [simulatorService, showToast]
  )

  const clearResult = useCallback(() => setResult(null), [])

  return (
    <SimulatorContext.Provider value={{ result, isLoading, simulate, clearResult }}>
      {children}
    </SimulatorContext.Provider>
  )
}

export function useSimulator(): SimulatorContextValue {
  const ctx = useContext(SimulatorContext)
  if (!ctx) throw new Error('useSimulator deve ser usado dentro de <SimulatorProvider>')
  return ctx
}
