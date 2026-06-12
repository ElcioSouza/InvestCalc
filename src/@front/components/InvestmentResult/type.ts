import type { InvestmentResult } from '@front/types'

export interface InvestmentResultProps {
  data: InvestmentResult
  onClose: () => void
  compact?: boolean
}
