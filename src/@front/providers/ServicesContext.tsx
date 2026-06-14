'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'

import { InvestmentRepository } from '@front/integrations/res'
import { HistoryService, SimulatorService } from '@front/services'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServicesContextValue {
  simulatorService: SimulatorService
  historyService: HistoryService
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ServicesContext = createContext<ServicesContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ServicesProvider({ children }: { children: ReactNode }) {
  const value = useMemo(() => {
    const repo = new InvestmentRepository()

    return {
      simulatorService: new SimulatorService(repo),
      historyService: new HistoryService(repo),
    }
  }, [])

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useServices(): ServicesContextValue {
  const ctx = useContext(ServicesContext)

  if (!ctx) throw new Error('useServices deve ser usado dentro de <ServicesProvider>')

  return ctx
}