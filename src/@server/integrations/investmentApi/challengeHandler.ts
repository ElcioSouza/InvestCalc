import { MAX_CHALLENGE_LOG } from './constants'
import { solveAesChallenge } from './crypto'
import { buildHeaders, forwardResponse, isJson, safeFetch } from './request'

export async function resolveHttpChallenge(
  challengeHtml: string,
  upstreamUrl: string,
  method: string,
  ua: string,
  body: string | undefined,
): Promise<Response> {
  const solved = solveAesChallenge(challengeHtml)
  if (!solved) {
    return Response.json({ error: 'Erro ao se comunicar com o servidor. Tente novamente mais tarde.' }, { status: 502 })
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
  console.error('[api] Resposta inválida:', unexpected.slice(0, MAX_CHALLENGE_LOG))
  return Response.json(
    { error: 'Erro ao se comunicar com o servidor. Tente novamente mais tarde.' },
    { status: 502 },
  )
}
