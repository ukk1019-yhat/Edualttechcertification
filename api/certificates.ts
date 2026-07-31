import type { ServerResponse } from 'node:http'
import type { IncomingMessage } from 'node:http'
import { isAuthorized } from './lib/auth.js'
import { getCertificates, addCertificate } from './lib/db.js'
import type { Certificate } from '../src/data/certificates.js'

function send(res: ServerResponse, statusCode: number, data: unknown) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    if (req.method === 'GET') {
      const list = await getCertificates()
      send(res, 200, list)
      return
    }

    if (req.method === 'POST') {
      if (!isAuthorized(req)) {
        send(res, 401, { error: 'Unauthorized' })
        return
      }
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
          if (cert.type !== 'employee' && cert.type !== 'internship') {
            send(res, 400, { error: 'type must be employee or internship' })
            return
          }
          await addCertificate(cert)
          send(res, 201, cert)
        } catch (err) {
          send(res, 400, { error: (err as Error).message || 'Invalid request' })
        }
      })
      return
    }

    send(res, 405, { error: 'Method not allowed' })
  } catch (err) {
    send(res, 500, { error: (err as Error).message || 'Internal error' })
  }
}
