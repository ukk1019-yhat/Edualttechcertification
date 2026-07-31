import type { ServerResponse } from 'node:http'
import type { IncomingMessage } from 'node:http'
import { verifyCredentials, createToken } from './lib/auth'

interface JsonError extends Error {
  statusCode?: number
}

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  let body = ''
  req.on('data', (chunk) => {
    body += chunk
    if (body.length > 10_000) req.destroy()
  })
  req.on('end', () => {
    try {
      const { email, password } = JSON.parse(body || '{}')
      if (typeof email !== 'string' || typeof password !== 'string') {
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Email and password are required' }))
        return
      }
      if (!verifyCredentials(email, password)) {
        res.statusCode = 401
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Invalid credentials' }))
        return
      }
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ token: createToken(email), email }))
    } catch (err) {
      const e = err as JsonError
      res.statusCode = e.statusCode || 400
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: e.message || 'Invalid request' }))
    }
  })
}
