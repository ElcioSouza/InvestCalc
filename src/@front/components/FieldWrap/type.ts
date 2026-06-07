import type { ReactNode } from 'react'

export interface FieldWrapProps {
  label: string
  icon?: ReactNode
  error?: string
  children: ReactNode
}
