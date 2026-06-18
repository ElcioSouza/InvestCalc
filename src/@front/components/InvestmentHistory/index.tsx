import { InvestmentResult } from '../InvestmentResult'
import { EmptyDetail } from '../EmptyDetail'
import { HistoryTable } from '../HistoryTable'
import type { InvestmentHistoryProps } from './type'

export function InvestmentHistory({ history, onEdit }: InvestmentHistoryProps) {
  const { items, isLoading, deletingId, selectedItem, fetchHistory, removeItem, selectItem } = history

  async function handleDelete(id: number) {
    const deleted = await removeItem(id)
    if (deleted && selectedItem?.id === id) selectItem(null)
  }

  return (
    <div className="dashboard-grid grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
      <HistoryTable
        items={items}
        isLoading={isLoading}
        deletingId={deletingId}
        selectedId={selectedItem?.id}
        onSelect={selectItem}
        onEdit={onEdit}
        onDelete={handleDelete}
        onRefresh={fetchHistory}
      />

      {selectedItem ? (
        <div className="animate-reveal">
          <InvestmentResult
            data={selectedItem}
            onClose={() => selectItem(null)}
            compact
          />
        </div>
      ) : (
        <EmptyDetail />
      )}
    </div>
  )
}

