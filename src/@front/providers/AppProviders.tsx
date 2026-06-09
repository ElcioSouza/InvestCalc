import { ToastProvider } from './ToastContext'

interface AppProvidersProps {
  children: React.ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  )
}
