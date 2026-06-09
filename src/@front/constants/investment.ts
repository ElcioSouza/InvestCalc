import type { TabType } from '@front/types'
export const TABS: TabType[] = ['simular', 'salvar', 'historico']

export const TAB_LABELS: Record<TabType, string> = {
  simular:   '\u26A1 Simular',
  salvar:    '\u{1F4BE} Salvar',
  historico: '\u{1F4CB} Hist\u00F3rico',
}

export const TOAST_DURATION_MS = 4000
