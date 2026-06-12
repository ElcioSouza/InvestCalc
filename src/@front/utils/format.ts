

import { IR_BRACKETS } from '@front/constants'

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatPercent(value: number, decimals = 2): string {
  return (
    new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value) + '%'
  )
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  if (dateStr.includes('/')) return dateStr
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export function todayBR(): string {
  const d = new Date()
  return [
    String(d.getDate()).padStart(2, '0'),
    String(d.getMonth() + 1).padStart(2, '0'),
    d.getFullYear(),
  ].join('/')
}

export function toISO(br: string): string {
  const [d, m, y] = br.split('/')
  return `${y}-${m}-${d}`
}

export function calcProfitPercent(capital: number, profit: number): number {
  if (!capital) return 0
  return (profit / capital) * 100
}
export function getIRAliquota(days: number): string {
  return IR_BRACKETS.find((b) => days <= b.maxDays)?.rate ?? '15,0%'
}

export function toUpperLabel(str: string): string {
  return str?.toUpperCase() ?? '-'
}

export function getRateTypeLabel(type: string): string {
  return type === 'pre' ? 'Pr\u00E9-fixado' : 'P\u00F3s-fixado'
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

export function clampPercent(value: number, max = 100): number {
  return Math.min(max, Math.max(0, value))
}
