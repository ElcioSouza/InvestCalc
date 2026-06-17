import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { InvestmentType, RateType } from '@front/types'
import type { InvestmentFormData } from '@front/schemas'

export interface InvestmentFormProps {
  investmentType: InvestmentType
  rateType: RateType
  errors: FieldErrors<InvestmentFormData>
  isLoading: boolean
  register: UseFormRegister<InvestmentFormData>
  onSubmit: () => void
}
