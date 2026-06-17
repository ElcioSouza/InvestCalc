import type { InvestmentRepository } from '@front/integrations/res'
import type { InvestmentPayload, InvestmentResult } from '@front/types'

export class SimulatorService {
  constructor(private readonly repo: InvestmentRepository) {}

  simulate(payload: InvestmentPayload): Promise<InvestmentResult> {
    return this.repo.simulate(payload).then((result) =>
      this.repo.create(payload).then(
        (saved) => { result.id = saved.id; return result },
        () => result
      )
    )
  }
}
