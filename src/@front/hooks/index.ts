export { useSelicRate } from './useSelicRate'
import type { UseFormSetValue } from 'react-hook-form'
import type { InvestmentFormData } from '@front/schemas'
import type { RateType } from '@front/types'
export interface UseSelicRateOptions {
  rateType: RateType
  setValue: UseFormSetValue<InvestmentFormData>
}