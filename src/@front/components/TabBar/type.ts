import type { TabType } from '@front/types'

export interface TabBarProps {
  active: TabType
  onChange: (tab: TabType) => void
}
