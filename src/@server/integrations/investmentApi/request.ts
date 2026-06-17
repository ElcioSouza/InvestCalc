import { HOP_BY_HOP_HEADERS } from './constants'

export function isJson(response: Response): boolean {
  return response.headers.get('content-type')?.includes('json') ?? false
}

export function forwardResponse(upstream: Response): Response {
  const headers = new Headers(upstream.headers)
  HOP_BY_HOP_HEADERS.forEach((h) => headers.delete(h))
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  })
}

export function buildHeaders(ua: string, extra: Record<string, string> = {}): Record<string, string> {
  return {
    'User-Agent': ua,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...extra,
  }
}

export async function safeFetch(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[api] Network error:', message)
    return Response.json({ error: 'Erro ao se comunicar com o servidor. Tente novamente mais tarde.' }, { status: 502 })
  }
}
