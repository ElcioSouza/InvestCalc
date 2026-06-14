import crypto from 'crypto'

const BASE_API = process.env.INTERNAL_API_BASE_URL ?? 'https://apiapp.infinityfreeapp.com'
const AES_ALGORITHM = 'aes-128-cbc'
const AES_BLOCK_SIZE = 16
const USER_AGENT_DEFAULT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
const MAX_CHALLENGE_LOG = 200

const HOP_BY_HOP_HEADERS = [
  'content-encoding',
  'content-length',
  'transfer-encoding',
  'set-cookie',
] as const

const AES_CHALLENGE_RE =
  /toNumbers\("([a-f0-9]+)"\)[\s\S]*?toNumbers\("([a-f0-9]+)"\)[\s\S]*?toNumbers\("([a-f0-9]+)"\)/

function solveAesChallenge(html: string): string | null {
  const match = html.match(AES_CHALLENGE_RE)
  if (!match) return null

  const [, keyHex, ivHex, dataHex] = match
  const key = Buffer.from(keyHex, 'hex')
  const iv = Buffer.from(ivHex, 'hex')
  const data = Buffer.from(dataHex, 'hex')

  if (key.length !== AES_BLOCK_SIZE || iv.length !== AES_BLOCK_SIZE || data.length === 0) {
    return null
  }

  try {
    const decipher = crypto.createDecipheriv(AES_ALGORITHM, key, iv)
    decipher.setAutoPadding(false)
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()])
    const pad = decrypted[decrypted.length - 1]
    const unpadded = pad > 0 && pad <= AES_BLOCK_SIZE ? decrypted.subarray(0, -pad) : decrypted
    return unpadded.toString('hex')
  } catch {
    return null
  }
}

function isJson(response: Response): boolean {
  return response.headers.get('content-type')?.includes('json') ?? false
}

function forwardResponse(upstream: Response): Response {
  const headers = new Headers(upstream.headers)
  HOP_BY_HOP_HEADERS.forEach((h) => headers.delete(h))
  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  })
}

function buildHeaders(ua: string, extra: Record<string, string> = {}): Record<string, string> {
  return {
    'User-Agent': ua,
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...extra,
  }
}

async function safeFetch(url: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(url, init)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[api] Network error:', message)
    return Response.json({ error: `Erro de rede: ${message}` }, { status: 502 })
  }
}

async function handleAntibotChallenge(
  challengeHtml: string,
  upstreamUrl: string,
  method: string,
  ua: string,
  body: string | undefined,
): Promise<Response> {
  const solved = solveAesChallenge(challengeHtml)
  if (!solved) {
    return Response.json({ error: 'Falha ao decriptar desafio AES.' }, { status: 502 })
  }

  const retryResponse = await safeFetch(upstreamUrl, {
    method,
    headers: buildHeaders(ua, { Cookie: `__test=${solved}` }),
    ...(body ? { body } : {}),
  })

  if (isJson(retryResponse)) {
    return forwardResponse(retryResponse)
  }

  const unexpected = await retryResponse.text()
  console.error('[api] HTML inesperado após antibot:', unexpected.slice(0, MAX_CHALLENGE_LOG))
  return Response.json(
    { error: 'API retornou HTML mesmo após resolver antibot.' },
    { status: 502 },
  )
}

export async function fetchFromApi(req: Request): Promise<Response> {
  const { pathname, search } = new URL(req.url)
  const upstreamUrl = `${BASE_API}${pathname}${search}`
  const method = req.method
  const ua = req.headers.get('user-agent') ?? USER_AGENT_DEFAULT
  const body = method !== 'GET' && method !== 'HEAD' ? await req.clone().text() : undefined

  const firstResponse = await safeFetch(upstreamUrl, {
    method,
    headers: buildHeaders(ua),
    ...(body ? { body } : {}),
  })

  if (isJson(firstResponse)) {
    return forwardResponse(firstResponse)
  }

  const challengePage = await firstResponse.text()

  if (challengePage.includes('slowAES.decrypt')) {
    return handleAntibotChallenge(challengePage, upstreamUrl, method, ua, body)
  }

  return Response.json({ error: 'API externa retornou HTML inesperado.' }, { status: 502 })
}