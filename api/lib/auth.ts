import { createHmac, timingSafeEqual } from 'node:crypto'
import type { IncomingMessage } from 'node:http'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || ''
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'edu-alt-tech-secret'

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000 // 24h

function sign(payload: string): string {
  return createHmac('sha256', ADMIN_SECRET).update(payload).digest('hex')
}

export function createToken(email: string): string {
  const payload = `${email}:${Date.now()}`
  return `${payload}:${sign(payload)}`
}

export function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false
  const parts = token.split(':')
  if (parts.length !== 3) return false
  const [email, timestamp, sig] = parts
  const age = Date.now() - Number(timestamp)
  if (Number.isNaN(age) || age > TOKEN_TTL_MS || age < 0) return false
  const expected = sign(`${email}:${timestamp}`)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b) && email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
}

export function verifyCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    password === ADMIN_PASSWORD
  )
}

export function getAuthToken(req: IncomingMessage): string | undefined {
  const auth = req.headers.authorization
  if (auth && auth.startsWith('Bearer ')) return auth.slice(7)
  return undefined
}

export function isAuthorized(req: IncomingMessage): boolean {
  return verifyToken(getAuthToken(req))
}
