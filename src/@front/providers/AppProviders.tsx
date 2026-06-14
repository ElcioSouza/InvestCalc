import {
  ToastProvider,
  ServicesProvider,
  InvestmentFormProvider,
  SimulatorProvider,
  HistoryProvider,
} from '@front/providers'

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ToastProvider>
      <ServicesProvider>
        <InvestmentFormProvider>
          <SimulatorProvider>
            <HistoryProvider>
              {children}
            </HistoryProvider>
          </SimulatorProvider>
        </InvestmentFormProvider>
      </ServicesProvider>
    </ToastProvider>
  )
}
