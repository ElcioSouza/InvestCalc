export const BASE_API = process.env.INTERNAL_API_BASE_URL ?? 'https://apiapp.infinityfreeapp.com'
export const AES_ALGORITHM = 'aes-128-cbc'
export const AES_BLOCK_SIZE = 16
export const USER_AGENT_DEFAULT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
export const MAX_CHALLENGE_LOG = 200

export const HOP_BY_HOP_HEADERS = [
  'content-encoding',
  'content-length',
  'transfer-encoding',
  'set-cookie',
] as const

export const AES_CHALLENGE_RE =
  /toNumbers\("([a-f0-9]+)"\)[\s\S]*?toNumbers\("([a-f0-9]+)"\)[\s\S]*?toNumbers\("([a-f0-9]+)"\)/
