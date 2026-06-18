import type { InvestmentResult } from '@front/types'
import type { useHistory } from '@front/providers'

export interface InvestmentHistoryProps {
  history: ReturnType<typeof useHistory>
  onEdit: (item: InvestmentResult) => void
}
