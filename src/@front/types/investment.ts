import type { LucideIcon } from 'lucide-react'

export type RateType = 'pre' | 'pos'
export type InvestmentType = 'cdb' | 'lci' | 'lca'
export type TabType = 'simular' | 'historico'
export type ToastType = 'success' | 'error' | 'warning' | 'info'
export interface InvestmentPayload {
  investment_type: InvestmentType
  rate_type: RateType
  capital: number
  application_date: string
  months: number
  cdi?: number
  pre_rate?: number
  selic_meta?: number
}

export interface InvestmentInput {
  investment_type: InvestmentType
  rate_type: RateType
  initial_capital: number
  cdi_percentage: number | null
  selic_meta: number | null
  pre_fixed_rate: number | null
  cdi_over: number | null
  application_date: string
  redemption_date: string
  months: number
  is_isento: boolean
}

export interface InvestmentOutput {
  amount_bruto: number
  amount_liquid: number
  profit_bruto: number
  profit_liquid: number
  iof_value: number
  ir_tax_amount: number
  monthly_profit_liquid: number
  daily_profit_display: number
  days: number
  business_days: number
  is_isento: boolean
}

export interface InvestmentResult {
  id?: number
  input: InvestmentInput
  result: InvestmentOutput
}

export interface Toast {
  id: string
  type: ToastType
  message: string
}

export interface InvestmentTypeConfig {
  label: string
  desc: string
  icon: LucideIcon
  color: string
  taxed: boolean
}
