import { Landmark, Home, Wheat } from 'lucide-react'
import type { InvestmentType, InvestmentTypeConfig, TabType } from '@front/types'

export const INVESTMENT_TYPE_CONFIG: Record<InvestmentType, InvestmentTypeConfig> = {
  cdb: {
    label: 'CDB',
    desc: 'Certificado de Depósito Bancário',
    icon: Landmark,
    color: '#D4A843',
    taxed: true,
  },
  lci: {
    label: 'LCI',
    desc: 'Letra de Crédito Imobiliário',
    icon: Home,
    color: '#0D9E6E',
    taxed: false,
  },
  lca: {
    label: 'LCA',
    desc: 'Letra de Crédito do Agronegócio',
    icon: Wheat,
    color: '#6366F1',
    taxed: false,
  },
}

export const IR_BRACKETS = [
  { maxDays: 180,      rate: '22,5%' },
  { maxDays: 360,      rate: '20,0%' },
  { maxDays: 720,      rate: '17,5%' },
  { maxDays: Infinity, rate: '15,0%' },
] as const

export const TABS: TabType[] = ['simular', 'historico']

export const TAB_LABELS: Record<TabType, string> = {
  simular:   'Simular',
  historico: 'Histórico',
}

export const DEFAULT_FORM_VALUES = {
  investment_type: 'cdb' as const,
  rate_type:       'pos' as const,
  capital:         undefined,
  months:          undefined,
  cdi:             undefined,
  pre_rate:        undefined,
  selic_meta:      14.25,
}

export const API_ENDPOINTS = {
  calculate:     '/api/calculate',
  calculateById: (id: number) => `/api/calculate/${id}`,
} as const
export const TOAST_DURATION_MS = 4000
