import { Redis } from '@upstash/redis'
import type { Certificate } from '../../src/data/certificates.js'
import { certificates as seedCertificates } from '../../src/data/certificates.js'

const KEY = 'certificates:v1'

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN

const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null

export async function getCertificates(): Promise<Certificate[]> {
  if (!redis) return seedCertificates
  const stored = await redis.get<Certificate[]>(KEY)
  return stored ?? seedCertificates
}

export async function saveCertificates(list: Certificate[]): Promise<void> {
  if (!redis) return
  await redis.set(KEY, list)
}

export async function getCertificate(id: string): Promise<Certificate | undefined> {
  const list = await getCertificates()
  return list.find((c) => c.id === id)
}

export async function addCertificate(cert: Certificate): Promise<void> {
  const list = await getCertificates()
  if (list.some((c) => c.id === cert.id)) {
    throw new Error('Certificate with this ID already exists')
  }
  await saveCertificates([...list, cert])
}

export async function updateCertificate(id: string, cert: Certificate): Promise<boolean> {
  const list = await getCertificates()
  const idx = list.findIndex((c) => c.id === id)
  if (idx === -1) return false
  const next = [...list]
  next[idx] = cert
  await saveCertificates(next)
  return true
}

export async function deleteCertificate(id: string): Promise<boolean> {
  const list = await getCertificates()
  const next = list.filter((c) => c.id !== id)
  if (next.length === list.length) return false
  await saveCertificates(next)
  return true
}
