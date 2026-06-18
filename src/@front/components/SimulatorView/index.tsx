import { BarChart3, Pencil, X } from 'lucide-react'
import { InvestmentForm } from '../InvestmentForm'
import { InvestmentResult } from '../InvestmentResult'
import type { SimulatorViewProps } from './type'

export function SimulatorView({
  form,
  investmentType,
  rateType,
  simulator,
  onSubmitSimulate,
  isEditing,
  onCancelEdit,
}: SimulatorViewProps) {
  const { result, isLoading, clearResult } = simulator

  return (
    <div className="dashboard-grid grid grid-cols-1 xl:grid-cols-[460px_1fr] gap-6">
      <div>
        {isEditing && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl bg-[rgba(66,153,225,0.08)] border border-[rgba(66,153,225,0.15)]">
            <Pencil size={13} className="text-[#4299E1]" />
            <span className="text-xs font-semibold text-[#4299E1]">Editando investimento</span>
            <button
              onClick={onCancelEdit}
              className="ml-auto p-1 rounded-lg hover:bg-[rgba(66,153,225,0.1)] text-[#4299E1] transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        )}
        <InvestmentForm
          investmentType={investmentType}
          rateType={rateType}
          errors={form.formState.errors}
          isLoading={isLoading}
          register={form.register}
          onSubmit={onSubmitSimulate}
        />
      </div>

      <div>
        {!result && !isLoading && <SimulatorPlaceholder />}
        {isLoading && <SimulatorLoading />}
        {result && !isLoading && (
          <InvestmentResult data={result} onClose={clearResult} />
        )}
      </div>
    </div>
  )
}

function SimulatorPlaceholder() {
  return (
    <div
      className="dashboard-empty card-surface rounded-2xl flex flex-col items-center justify-center py-24 border-dashed border-[rgba(212,168,67,0.12)]"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 bg-[rgba(212,168,67,0.05)] border border-[rgba(212,168,67,0.1)]"
      >
        <BarChart3 size={28} className="text-[#D4A843]" strokeWidth={1.5} />
      </div>
      <p className="text-[#555] text-sm">Preencha os parâmetros e clique em calcular</p>
      <p className="text-[#3A3F4A] text-xs mt-1">Os resultados aparecerão aqui</p>
    </div>
  )
}

function SimulatorLoading() {
  return (
    <div
      className="dashboard-empty card-surface card-border-surface rounded-2xl flex flex-col items-center justify-center py-24 border"
    >
      <div className="shimmer w-24 h-24 rounded-2xl mb-5" />
      <p className="text-[#D4A843] text-sm font-medium animate-pulse">
        Consultando Banco Central do Brasil...
      </p>
      <p className="text-[#555] text-xs mt-1">Buscando taxa CDI em tempo real</p>
    </div>
  )
}
