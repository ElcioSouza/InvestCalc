import { NextRequest, NextResponse } from 'next/server'
import { fetchFromApi } from '@server/integrations/investmentApi'
export class CalculateController {
  public static async execute(req: NextRequest) {
    return await fetchFromApi(req)
  }
}