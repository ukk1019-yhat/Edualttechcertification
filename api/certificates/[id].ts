import type { ServerResponse } from 'node:http'
import type { IncomingMessage } from 'node:http'
import { isAuthorized } from '../lib/auth.js'
import { updateCertificate, deleteCertificate } from '../lib/db.js'
import type { Certificate } from '../../src/data/certificates.js'

function send(res: ServerResponse, statusCode: number, data: unknown) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    if (!isAuthorized(req)) {
      send(res, 401, { error: 'Unauthorized' })
      return
    }

    const url = req.url || ''
    const id = decodeURIComponent(url.split('/').pop() || '')

    if (req.method === 'PUT') {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk
        if (body.length > 50_000) req.destroy()
      })
      req.on('end', async () => {
        try {
          const cert = JSON.parse(body || '{}') as Certificate
          if (!cert.id || !cert.name || !cert.type || !cert.image) {
            send(res, 400, { error: 'id, name, type and image are required' })
            return
          }
          const ok = await updateCertificate(id, cert)
          if (!ok) {
            send(res, 404, { error: 'Certificate not found' })
            return
          }
          send(res, 200, cert)
        } catch (err) {
          send(res, 400, { error: (err as Error).message || 'Invalid request' })
        }
      })
      return
    }

    if (req.method === 'DELETE') {
      const ok = await deleteCertificate(id)
      if (!ok) {
        send(res, 404, { error: 'Certificate not found' })
        return
      }
      send(res, 200, { success: true })
      return
    }

    send(res, 405, { error: 'Method not allowed' })
  } catch (err) {
    send(res, 500, { error: (err as Error).message || 'Internal error' })
  }
}
