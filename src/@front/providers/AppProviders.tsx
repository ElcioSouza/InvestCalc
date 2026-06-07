import {
  ToastProvider
} from '@front/providers'

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
