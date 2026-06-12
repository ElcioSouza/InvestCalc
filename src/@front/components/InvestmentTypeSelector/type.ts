import type { UseFormRegister } from 'react-hook-form'
import type { InvestmentType } from '@front/types'
import type { InvestmentFormData } from '@front/schemas'

export interface InvestmentTypeSelectorProps {
  selected: InvestmentType
  register: UseFormRegister<InvestmentFormData>
}
