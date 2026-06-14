import type { InvestmentPayload, InvestmentResult, InvestmentInput, InvestmentOutput } from '@front/types'
import { API_ENDPOINTS } from '@front/constants'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!res.ok) {
    let msg = `Erro ${res.status}`
    try {
      const body = await res.json()
      msg = body?.error ?? body?.message ?? body?.detail ?? JSON.stringify(body).slice(0, 200)
    } catch {
      msg = `Erro ${res.status}: Sem resposta do servidor. Verifique sua conex\u00E3o.`
    }
    throw new Error(msg)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

type RawRow = Record<string, unknown>

function mapToInput(row: RawRow): InvestmentInput {
  return {
    investment_type: (row.investment_type as InvestmentInput['investment_type']) ?? 'cdb',
    rate_type:       (row.rate_type       as InvestmentInput['rate_type'])       ?? 'pos',
    initial_capital: Number(row.initial_capital ?? row.capital ?? 0),
    cdi_percentage:  row.cdi_percentage  != null ? Number(row.cdi_percentage)  : null,
    selic_meta:      row.selic_meta      != null ? Number(row.selic_meta)       : null,
    pre_fixed_rate:  row.pre_fixed_rate  != null ? Number(row.pre_fixed_rate)   : null,
    cdi_over:        row.cdi_over        != null ? Number(row.cdi_over)         : null,
    application_date: String(row.application_date ?? ''),
    redemption_date:  String(row.redemption_date  ?? ''),
    months:   Number(row.months   ?? 0),
    is_isento: Boolean(row.is_isento ?? false),
  }
}

function mapToOutput(row: RawRow): InvestmentOutput {
  return {
    amount_bruto:           Number(row.amount_bruto           ?? 0),
    amount_liquid:          Number(row.amount_liquid          ?? 0),
    profit_bruto:           Number(row.profit_bruto           ?? 0),
    profit_liquid:          Number(row.profit_liquid          ?? 0),
    iof_value:              Number(row.iof_value              ?? 0),
    ir_tax_amount:          Number(row.ir_tax_amount          ?? 0),
    monthly_profit_liquid:  Number(row.monthly_profit_liquid  ?? 0),
    daily_profit_display:   Number(row.daily_profit_display   ?? 0),
    days:                   Number(row.days                   ?? 0),
    business_days:          Number(row.business_days          ?? 0),
    is_isento:             Boolean(row.is_isento              ?? false),
  }
}

function mapToResult(row: RawRow): InvestmentResult {
  if (row.input && row.result) {
    return row as unknown as InvestmentResult
  }
  return {
    id:     row.id != null ? Number(row.id) : undefined,
    input:  mapToInput(row),
    result: mapToOutput(row),
  }
}

function extractList(data: unknown): RawRow[] {
  if (Array.isArray(data)) return data as RawRow[]
  const wrapped = (data as Record<string, unknown>)?.data
  if (Array.isArray(wrapped)) return wrapped as RawRow[]
  return []
}

export class InvestmentRepository {
  async list(): Promise<InvestmentResult[]> {
    const data = await request<unknown>(API_ENDPOINTS.calculate)
    return extractList(data).map(mapToResult)
  }

  async simulate(payload: InvestmentPayload): Promise<InvestmentResult> {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(payload)) {
      if (value != null) params.append(key, String(value))
    }
    const url = `${API_ENDPOINTS.calculate}?${params.toString()}`
    const data = await request<unknown>(url)
    return mapToResult(data as RawRow)
  }

  async getById(id: number): Promise<InvestmentResult> {
    const data = await request<unknown>(API_ENDPOINTS.calculateById(id))
    return mapToResult(data as RawRow)
  }

  async create(payload: InvestmentPayload): Promise<InvestmentResult> {
    const data = await request<unknown>(API_ENDPOINTS.calculate, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return mapToResult(data as RawRow)
  }

  async update(id: number, payload: InvestmentPayload): Promise<InvestmentResult> {
    const data = await request<unknown>(API_ENDPOINTS.calculateById(id), {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
    return mapToResult(data as RawRow)
  }

  async remove(id: number): Promise<void> {
    await request(API_ENDPOINTS.calculateById(id), { method: 'DELETE' })
  }
}
