import type { InvestmentRepository } from '@front/integrations/res'
import type { InvestmentResult } from '@front/types'

export class HistoryService {
  constructor(private readonly repo: InvestmentRepository) {}

  list(): Promise<InvestmentResult[]> {
    return this.repo.list()
  }

  remove(id: number): Promise<void> {
    return this.repo.remove(id)
  }
}
