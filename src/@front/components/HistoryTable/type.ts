import type { InvestmentResult } from '@front/types'
import type { SortField, SortDirection } from '@front/providers/HistoryContext'

export interface HistoryTableProps {
  items: InvestmentResult[]
  isLoading: boolean
  deletingId: number | null
  selectedId?: number
  currentPage: number
  lastPage: number
  total: number
  sortField: SortField | null
  sortDirection: SortDirection
  onSelect: (item: InvestmentResult) => void
  onEdit: (item: InvestmentResult) => void
  onDelete: (id: number) => void
  onRefresh: () => void
  onPageChange: (page: number) => void
  onSort: (field: SortField) => void
}
