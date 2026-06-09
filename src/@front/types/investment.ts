export type RateType = 'pre' | 'pos'

export type TabType = 'simular' | 'salvar' | 'historico'
export type ToastType = 'success' | 'error' | 'warning' | 'info'
export interface Toast {
  id: string
  type: ToastType
  message: string
}