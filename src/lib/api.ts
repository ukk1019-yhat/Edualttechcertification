import type { Certificate } from '../data/certificates'

const TOKEN_KEY = 'eat_admin_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function isLoggedIn(): boolean {
  return Boolean(getToken())
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const res = await fetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  return res.json() as Promise<T>
}

export async function login(email: string, password: string): Promise<{ token: string }> {
  return request('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function fetchCertificates(): Promise<Certificate[]> {
  return request<Certificate[]>('/api/certificates')
}

export async function createCertificate(cert: Certificate): Promise<Certificate> {
  return request<Certificate>('/api/certificates', {
    method: 'POST',
    body: JSON.stringify(cert),
  })
}

export async function updateCertificateApi(id: string, cert: Certificate): Promise<Certificate> {
  return request<Certificate>(`/api/certificates/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(cert),
  })
}

export async function deleteCertificateApi(id: string): Promise<void> {
  await request(`/api/certificates/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export async function uploadImage(file: File): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string
        const result = await request<{ url: string }>('/api/upload', {
          method: 'POST',
          body: JSON.stringify({ fileName: file.name, dataUrl }),
        })
        resolve(result)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsDataURL(file)
  })
}
