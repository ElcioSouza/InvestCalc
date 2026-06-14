'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { investmentFormSchema, InvestmentFormData } from '@front/schemas'
import { DEFAULT_FORM_VALUES } from '@front/constants'
import { todayBR, toISO } from '@front/utils'
import type { InvestmentPayload, InvestmentType, RateType } from '@front/types'

interface InvestmentFormContextValue {
  form: ReturnType<typeof useForm<InvestmentFormData>>
  investmentType: InvestmentType
  rateType: RateType
  buildPayload: (data: InvestmentFormData) => InvestmentPayload
}

const InvestmentFormContext = createContext<InvestmentFormContextValue | null>(null)

export function InvestmentFormProvider({ children }: { children: ReactNode }) {
  const form = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentFormSchema),
    defaultValues: {
      ...DEFAULT_FORM_VALUES,
      application_date: todayBR(),
    },
  })

  const investmentType = form.watch('investment_type')
  const rateType       = form.watch('rate_type')

  function buildPayload(data: InvestmentFormData): InvestmentPayload {
    const base: InvestmentPayload = {
      investment_type:  data.investment_type,
      rate_type:        data.rate_type,
      capital:          data.capital,
      application_date: toISO(data.application_date),
      months:           data.months,
    }
    return data.rate_type === 'pos'
      ? { ...base, cdi: data.cdi, selic_meta: data.selic_meta }
      : { ...base, pre_rate: data.pre_rate }
  }

  return (
    <InvestmentFormContext.Provider value={{ form, investmentType, rateType, buildPayload }}>
      {children}
    </InvestmentFormContext.Provider>
  )
}

export function useInvestmentForm(): InvestmentFormContextValue {
  const ctx = useContext(InvestmentFormContext)
  if (!ctx) throw new Error('useInvestmentForm deve ser usado dentro de <InvestmentFormProvider>')
  return ctx
}
