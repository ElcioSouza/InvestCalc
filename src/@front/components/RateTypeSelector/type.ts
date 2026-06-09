import type { UseFormRegister } from 'react-hook-form'
import type { RateType } from '@front/types'
import type { InvestmentFormData } from '@front/schemas'

export interface RateTypeSelectorProps {
  selected: RateType
  register: UseFormRegister<InvestmentFormData>
}
