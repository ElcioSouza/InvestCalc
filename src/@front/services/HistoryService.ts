import type { InvestmentRepository } from '@front/integrations/res'
import type { InvestmentPayload, InvestmentResult, InvestmentInput } from '@front/types'

export class HistoryService {
  constructor(private readonly repo: InvestmentRepository) {}

  list(): Promise<InvestmentResult[]> {
    return this.repo.list()
  }

  update(id: number, payload: InvestmentPayload, original?: InvestmentInput): Promise<InvestmentResult> {
    return this.repo.update(id, payload, original)
  }

  remove(id: number): Promise<void> {
    return this.repo.remove(id)
  }
}
