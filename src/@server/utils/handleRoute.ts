import { NextRequest, NextResponse } from 'next/server'
import { SystemError } from './errors/SystemError'

export function handleRoute(
  handler: (request: NextRequest) => Promise<Response> | Response
) {
  return async (request: NextRequest) => {
    try {
      return await handler(request)
    } catch (err: unknown) {
      if (err instanceof SystemError) {
        return NextResponse.json(
          { error: err.message },
          { status: err.status }
        )
      }
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  }
}
