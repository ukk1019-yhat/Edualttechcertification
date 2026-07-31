import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Certificate } from '../../src/data/certificates.js'
import { certificates as seedCertificates } from '../../src/data/certificates.js'

const TABLE = 'certificates'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnon = process.env.SUPABASE_ANON_KEY
const supabaseService = process.env.SUPABASE_SERVICE_ROLE_KEY

const readClient: SupabaseClient | null =
  supabaseUrl && supabaseAnon ? createClient(supabaseUrl, supabaseAnon) : null
const writeClient: SupabaseClient | null =
  supabaseUrl && supabaseService
    ? createClient(supabaseUrl, supabaseService)
    : readClient

interface CertRow {
  id: string
  name: string
  type: 'employee' | 'internship'
  issue_date: string
  description: string
  image: string
}

function toCertificate(row: CertRow): Certificate {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    issueDate: row.issue_date,
    description: row.description,
    image: row.image,
  }
}

function toRow(cert: Certificate): CertRow {
  return {
    id: cert.id,
    name: cert.name,
    type: cert.type,
    issue_date: cert.issueDate,
    description: cert.description,
    image: cert.image,
  }
}

export async function getCertificates(): Promise<Certificate[]> {
  if (!readClient) return seedCertificates
  const { data, error } = await readClient
    .from(TABLE)
    .select('id, name, type, issue_date, description, image')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(toCertificate)
}

export async function getCertificate(id: string): Promise<Certificate | undefined> {
  const list = await getCertificates()
  return list.find((c) => c.id === id)
}

export async function addCertificate(cert: Certificate): Promise<void> {
  if (!writeClient) return
  const { error } = await writeClient.from(TABLE).insert(toRow(cert))
  if (error) {
    if (error.code === '23505') {
      throw new Error('Certificate with this ID already exists')
    }
    throw error
  }
}

export async function updateCertificate(id: string, cert: Certificate): Promise<boolean> {
  if (!writeClient) return true
  const { error, data } = await writeClient
    .from(TABLE)
    .update(toRow(cert))
    .eq('id', id)
    .select('id')
  if (error) throw error
  return (data?.length ?? 0) > 0
}

export async function deleteCertificate(id: string): Promise<boolean> {
  if (!writeClient) return true
  const { error, data } = await writeClient
    .from(TABLE)
    .delete()
    .eq('id', id)
    .select('id')
  if (error) throw error
  return (data?.length ?? 0) > 0
}
