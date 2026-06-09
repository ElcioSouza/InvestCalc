import { NextRequest, NextResponse } from 'next/server'

export class CalculateController {
  public static async execute(req: NextRequest) {
    return NextResponse.json({
      "messager": ''
    })
  }
}