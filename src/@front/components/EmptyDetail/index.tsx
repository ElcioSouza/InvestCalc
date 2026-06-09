function EmptyDetail() {
  return (
    <div
      className="dashboard-empty bg-card-surface rounded-2xl flex flex-col items-center justify-center py-16 border-dashed border-[rgba(212,168,67,0.1)]"
    >
      <span className="text-2xl mb-2" role="img" aria-label="olho">👁</span>
      <p className="text-[#555] text-xs">Clique em um investimento para ver os detalhes</p>
    </div>
  )
}
