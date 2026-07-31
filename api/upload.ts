import type { ServerResponse } from 'node:http'
import type { IncomingMessage } from 'node:http'
import { createClient } from '@supabase/supabase-js'
import { isAuthorized } from './lib/auth.js'

const BUCKET = 'certificates'

function send(res: ServerResponse, statusCode: number, data: unknown) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(data))
}

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    send(res, 405, { error: 'Method not allowed' })
    return
  }
  if (!isAuthorized(req)) {
    send(res, 401, { error: 'Unauthorized' })
    return
  }

  let body = ''
  req.on('data', (chunk) => {
    body += chunk
    if (body.length > 8_000_000) req.destroy()
  })
  req.on('end', async () => {
    try {
      const { fileName, dataUrl } = JSON.parse(body || '{}')
      if (typeof fileName !== 'string' || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
        send(res, 400, { error: 'fileName and dataUrl (base64) are required' })
        return
      }

      const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
      if (!match) {
        send(res, 400, { error: 'Invalid image data' })
        return
      }
      const contentType = match[1]
      const buffer = Buffer.from(match[2], 'base64')

      const supabaseUrl = process.env.SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
      if (!supabaseUrl || !supabaseKey) {
        send(res, 500, { error: 'Storage is not configured' })
        return
      }
      const supabase = createClient(supabaseUrl, supabaseKey)

      const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
      const path = `${Date.now()}-${safeName}`
      const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
        contentType,
        upsert: true,
      })
      if (error) {
        send(res, 500, { error: error.message })
        return
      }
      const url = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`
      send(res, 200, { url })
    } catch (err) {
      send(res, 400, { error: (err as Error).message || 'Invalid request' })
    }
  })
}
