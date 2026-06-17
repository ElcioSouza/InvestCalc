import type { InvestmentPayload, InvestmentResult, InvestmentInput, InvestmentOutput } from '@front/types'
import { API_ENDPOINTS } from '@front/constants'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

function request<T>(url: string, options?: RequestInit): Promise<T> {
  return fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  }).then((res) => {
    if (!res.ok) {
      return res.json().then(
        (body) => {
          const msg = body?.error ?? body?.message ?? body?.detail ?? JSON.stringify(body).slice(0, 200)
          throw new Error(msg)
        },
        () => { throw new Error(`Erro ${res.status}: Sem resposta do servidor. Verifique sua conex\u00E3o.`) }
      )
    }
    if (res.status === 204) return undefined as T
    return res.json() as Promise<T>
  })
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
  list(): Promise<InvestmentResult[]> {
    return request<unknown>(API_ENDPOINTS.calculate)
      .then((data) => extractList(data).map(mapToResult))
  }

  simulate(payload: InvestmentPayload): Promise<InvestmentResult> {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(payload)) {
      if (value != null) params.append(key, String(value))
    }
    const url = `${API_ENDPOINTS.calculate}?${params.toString()}`
    return request<unknown>(url)
      .then((data) => mapToResult(data as RawRow))
  }

  getById(id: number): Promise<InvestmentResult> {
    return request<unknown>(API_ENDPOINTS.calculateById(id))
      .then((data) => mapToResult(data as RawRow))
  }

  create(payload: InvestmentPayload): Promise<InvestmentResult> {
    return request<unknown>(API_ENDPOINTS.calculate, {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then((data) => mapToResult(data as RawRow))
  }

  update(id: number, payload: InvestmentPayload): Promise<InvestmentResult> {
    return request<unknown>(API_ENDPOINTS.calculateById(id), {
      method: 'PUT',
      body: JSON.stringify(payload),
    }).then((data) => mapToResult(data as RawRow))
  }

  remove(id: number): Promise<void> {
    return request(API_ENDPOINTS.calculateById(id), { method: 'DELETE' })
  }
}
