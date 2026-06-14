import type { UseFormReturn } from 'react-hook-form'
import type { InvestmentFormData } from '@front/schemas'
import type { InvestmentType, RateType, TabType } from '@front/types'
import type { useSimulator } from '@front/providers'

export interface SimulatorViewProps {
  tab: Extract<TabType, 'simular' | 'salvar'>
  form: UseFormReturn<InvestmentFormData>
  investmentType: InvestmentType
  rateType: RateType
  simulator: ReturnType<typeof useSimulator>
  onSubmitSimulate: () => void
  onSubmitSave: () => void
}
