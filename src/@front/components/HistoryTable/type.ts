import type { InvestmentResult } from '@front/types'

export interface HistoryTableProps {
  items: InvestmentResult[]
  isLoading: boolean
  deletingId: number | null
  selectedId?: number
  onSelect: (item: InvestmentResult) => void
  onEdit: (item: InvestmentResult) => void
  onDelete: (id: number) => void
  onRefresh: () => void
}
