import type { UseFormReturn } from 'react-hook-form'
import type { InvestmentFormData } from '@front/schemas'
import type { InvestmentType, RateType } from '@front/types'
import type { useSimulator } from '@front/providers'

export interface SimulatorViewProps {
  form: UseFormReturn<InvestmentFormData>
  investmentType: InvestmentType
  rateType: RateType
  simulator: ReturnType<typeof useSimulator>
  onSubmitSimulate: () => void
  isEditing?: boolean
  onCancelEdit?: () => void
}
