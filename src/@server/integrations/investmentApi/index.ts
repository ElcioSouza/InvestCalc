import { BASE_API, USER_AGENT_DEFAULT } from './constants'
import { buildHeaders, forwardResponse, isJson, safeFetch } from './request'
import { resolveHttpChallenge } from './challengeHandler'

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
    return resolveHttpChallenge(challengePage, upstreamUrl, method, ua, body)
  }

  return Response.json({ error: 'Erro ao se comunicar com o servidor. Tente novamente mais tarde.' }, { status: 502 })
}
