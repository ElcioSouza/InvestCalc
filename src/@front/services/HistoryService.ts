import type { InvestmentRepository } from '@front/integrations/res'
import type { InvestmentPayload, InvestmentResult, InvestmentInput, PaginatedResponse, PaginationParams } from '@front/types'

export class HistoryService {
  constructor(private readonly repo: InvestmentRepository) {}

  list(params?: PaginationParams): Promise<PaginatedResponse<InvestmentResult>> {
    return this.repo.list(params)
  }

  update(id: number, payload: InvestmentPayload, original?: InvestmentInput): Promise<InvestmentResult> {
    return this.repo.update(id, payload, original)
  }

  remove(id: number): Promise<void> {
    return this.repo.remove(id)
  }
}
