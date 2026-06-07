import { AppProviders } from '@front/providers'

export default function FrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      {children}
    </AppProviders>
  )
}
