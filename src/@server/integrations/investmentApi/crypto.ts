import crypto from 'crypto'
import { AES_ALGORITHM, AES_BLOCK_SIZE, AES_CHALLENGE_RE } from './constants'

export function solveAesChallenge(html: string): string | null {
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
