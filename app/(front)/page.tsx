'use client'
import { useState, useEffect } from 'react'
import { Header, ToastContainer, DecorativeGlowBackdrop, SimulatorView, InvestmentHistory, TabBar } from '@front/components'
import { useInvestmentForm, useSimulator, useHistory } from '@front/providers'
import { useSelicRate } from '@front/hooks'
import type { TabType } from '@front/types'

export default function DashboardPage() {
  const [tab, setTab] = useState<TabType>('simular')

  const { form, investmentType, rateType, buildPayload } = useInvestmentForm()
  const simulator = useSimulator()
  const history = useHistory()
  const { fetchHistory } = history

  useSelicRate({ rateType, setValue: form.setValue })

  function handleTabChange(next: TabType) {
    setTab(next)
    simulator.clearResult()
    history.selectItem(null)
  }

  useEffect(() => {
    if (tab === 'historico') fetchHistory()
  }, [tab, fetchHistory])

  const onSubmitSimulate = form.handleSubmit((data) => simulator.simulate(buildPayload(data)))
  const onSubmitSave = form.handleSubmit((data) => simulator.save(buildPayload(data)))
  return (
    <>
      <ToastContainer />

      <main className="dashboard-shell min-h-screen w-full bg-grid relative overflow-x-hidden overflow-y-visible">
        <DecorativeGlowBackdrop />

        <div className="dashboard-content mx-auto max-w-7xl px-4 py-8 lg:py-6 relative">
          <Header />
          <TabBar active={tab} onChange={handleTabChange} />

          {(tab === 'simular' || tab === 'salvar') && (
            <div className="dashboard-panels">
              <SimulatorView
                tab={tab}
                form={form}
                investmentType={investmentType}
                rateType={rateType}
                simulator={simulator}
                onSubmitSimulate={onSubmitSimulate}
                onSubmitSave={onSubmitSave}
              />
            </div>
          )}

          {tab === 'historico' && (
            <div className="dashboard-panels">
              <InvestmentHistory history={history} />
            </div>
          )}

        </div>
      </main>
    </>
  )
}
