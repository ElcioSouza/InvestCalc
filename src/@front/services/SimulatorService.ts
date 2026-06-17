import type { InvestmentRepository } from '@front/integrations/res'
import type { InvestmentPayload, InvestmentResult } from '@front/types'

export class SimulatorService {
  constructor(private readonly repo: InvestmentRepository) {}

  async simulate(payload: InvestmentPayload): Promise<InvestmentResult> {
    const result = await this.repo.simulate(payload)
    try {
      const saved = await this.repo.create(payload)
      result.id = saved.id
    } catch {
    }
    return result
  }
}
