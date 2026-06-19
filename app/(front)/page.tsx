'use client'
import { useState, useEffect, useCallback } from 'react'
import { Header, ToastContainer, DecorativeGlowBackdrop, SimulatorView, InvestmentHistory, TabBar } from '@front/components'
import { useInvestmentForm, useSimulator, useHistory } from '@front/providers'
import { useSelicRate } from '@front/hooks'
import { formatDate } from '@front/utils'
import type { InvestmentResult, TabType } from '@front/types'

export default function DashboardPage() {
  const [tab, setTab] = useState<TabType>('simular')

  const { form, investmentType, rateType, buildPayload } = useInvestmentForm()
  const simulator = useSimulator()
  const history = useHistory()
  const { fetchHistory, editingItem, editItem, updateItem, cancelEdit } = history

  useSelicRate({ rateType, setValue: form.setValue })

  const handleEdit = useCallback((item: InvestmentResult) => {
    editItem(item)
    setTab('simular')
    const { input } = item
    form.setValue('investment_type', input.investment_type, { shouldValidate: false })
    form.setValue('rate_type', input.rate_type, { shouldValidate: false })
    form.setValue('capital', input.initial_capital, { shouldValidate: false })
    const dateStr = formatDate(input.application_date)
    form.setValue('application_date', dateStr === '-' ? '' : dateStr, { shouldValidate: false })
    form.setValue('months', input.months, { shouldValidate: false })
    if (input.rate_type === 'pos') {
      form.setValue('cdi', input.cdi_percentage ?? undefined, { shouldValidate: false })
      form.setValue('selic_meta', input.selic_meta ?? undefined, { shouldValidate: false })
      form.setValue('selic_meta_default', undefined, { shouldValidate: false })
      form.setValue('pre_rate', undefined, { shouldValidate: false })
    } else {
      form.setValue('pre_rate', input.pre_fixed_rate ?? undefined, { shouldValidate: false })
      form.setValue('cdi', undefined, { shouldValidate: false })
      form.setValue('selic_meta', undefined, { shouldValidate: false })
      form.setValue('selic_meta_default', undefined, { shouldValidate: false })
    }
  }, [editItem, form])

  function handleTabChange(next: TabType) {
    setTab(next)
    simulator.clearResult()
    history.selectItem(null)
    if (editingItem) cancelEdit()
  }

  useEffect(() => {
    if (tab === 'historico') fetchHistory()
  }, [tab, fetchHistory])

  const onSubmitSimulate = form.handleSubmit(async (data) => {
    const payload = buildPayload(data)
    if (editingItem?.id) {
      const ok = await updateItem(editingItem.id, payload)
      if (ok) {
        cancelEdit()
        setTab('historico')
      }
    } else {
      await simulator.simulate(payload)
    }
  })

  return (
    <>
      <ToastContainer />

      <main className="dashboard-shell min-h-screen w-full bg-grid relative overflow-x-hidden overflow-y-visible">
        <DecorativeGlowBackdrop />

        <div className="dashboard-content mx-auto max-w-7xl px-4 py-8 lg:py-6 relative">
          <Header />
          <TabBar active={tab} onChange={handleTabChange} />

          {tab === 'simular' && (
            <div className="dashboard-panels">
              <SimulatorView
                form={form}
                investmentType={investmentType}
                rateType={rateType}
                simulator={simulator}
                onSubmitSimulate={onSubmitSimulate}
                isEditing={!!editingItem}
                onCancelEdit={cancelEdit}
              />
            </div>
          )}

          {tab === 'historico' && (
            <div className="dashboard-panels">
              <InvestmentHistory history={history} onEdit={handleEdit} />
            </div>
          )}

        </div>
      </main>
    </>
  )
}
