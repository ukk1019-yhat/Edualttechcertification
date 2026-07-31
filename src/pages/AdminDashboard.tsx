import { useEffect, useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Loader2,
  X,
  ShieldCheck,
  Users,
  GraduationCap,
  FileCheck,
  ExternalLink,
  RefreshCw,
} from 'lucide-react'
import {
  fetchCertificates,
  createCertificate,
  updateCertificateApi,
  deleteCertificateApi,
  clearToken,
  isLoggedIn,
} from '../lib/api'
import type { Certificate } from '../data/certificates'

const EMPTY_CERT: Certificate = {
  id: '',
  name: '',
  type: 'internship',
  issueDate: new Date().toISOString().slice(0, 10),
  description: '',
  image: '',
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [certs, setCerts] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Certificate | null>(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = async () => {
    try {
      setError('')
      setLoading(true)
      const list = await fetchCertificates()
      setCerts(list)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (!isLoggedIn()) {
    return <Navigate to="/admin" replace />
  }

  const handleLogout = () => {
    clearToken()
    navigate('/admin')
  }

  const handleSave = async (cert: Certificate) => {
    setSaving(true)
    try {
      if (editing) {
        await updateCertificateApi(editing.id, cert)
      } else {
        await createCertificate(cert)
      }
      setShowForm(false)
      setEditing(null)
      await load()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this certificate? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await deleteCertificateApi(id)
      await load()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setDeletingId(null)
    }
  }

  const employeeCount = certs.filter((c) => c.type === 'employee').length
  const internshipCount = certs.filter((c) => c.type === 'internship').length

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage employee and internship certificates</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
          <button
            onClick={() => {
              setEditing(null)
              setShowForm(true)
            }}
            className="px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Certificate
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <FileCheck className="w-6 h-6 text-indigo-600 mb-2" />
          <div className="text-2xl font-bold text-slate-900">{certs.length}</div>
          <div className="text-sm text-slate-500">Total Certificates</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <Users className="w-6 h-6 text-purple-600 mb-2" />
          <div className="text-2xl font-bold text-slate-900">{employeeCount}</div>
          <div className="text-sm text-slate-500">Employee Certificates</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <GraduationCap className="w-6 h-6 text-emerald-600 mb-2" />
          <div className="text-2xl font-bold text-slate-900">{internshipCount}</div>
          <div className="text-sm text-slate-500">Internship Certificates</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Certificates</h2>
          <button onClick={load} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex items-center justify-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : certs.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No certificates yet. Click "Add Certificate" to create one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">ID</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Issue Date</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {certs.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                          {cert.image ? (
                            <img
                              src={cert.image}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          ) : null}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{cert.name}</div>
                          <div className="text-xs text-slate-400 truncate max-w-[200px]">{cert.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-600">{cert.id}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                        cert.type === 'employee'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {cert.type === 'employee' ? 'Employee' : 'Internship'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {new Date(cert.issueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/certificate/${cert.id}`}
                          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="View"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setEditing(cert)
                            setShowForm(true)
                          }}
                          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cert.id)}
                          disabled={deletingId === cert.id}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          {deletingId === cert.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <CertificateForm
          initial={editing}
          saving={saving}
          onCancel={() => {
            setShowForm(false)
            setEditing(null)
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}

interface CertificateFormProps {
  initial: Certificate | null
  saving: boolean
  onCancel: () => void
  onSave: (cert: Certificate) => void
}

function CertificateForm({ initial, saving, onCancel, onSave }: CertificateFormProps) {
  const [cert, setCert] = useState<Certificate>(initial ? { ...initial } : { ...EMPTY_CERT })

  const update = (patch: Partial<Certificate>) => setCert((c) => ({ ...c, ...patch }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cert.id.trim() || !cert.name.trim() || !cert.image.trim()) return
    onSave({ ...cert, id: cert.id.trim().toUpperCase(), name: cert.name.trim() })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <h3 className="font-semibold text-slate-900 text-lg">
            {initial ? 'Edit Certificate' : 'Add Certificate'}
          </h3>
          <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name *</label>
            <input
              type="text"
              required
              value={cert.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="e.g. John Doe"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Certificate ID *</label>
            <input
              type="text"
              required
              value={cert.id}
              onChange={(e) => update({ id: e.target.value })}
              placeholder="e.g. EAT-EMP-003"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Type *</label>
            <select
              value={cert.type}
              onChange={(e) => update({ type: e.target.value as Certificate['type'] })}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="employee">Employee</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Issue Date</label>
            <input
              type="date"
              value={cert.issueDate}
              onChange={(e) => update({ issueDate: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              value={cert.description}
              onChange={(e) => update({ description: e.target.value })}
              rows={2}
              placeholder="Short description of the certificate"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Image URL / Path *</label>
            <input
              type="text"
              required
              value={cert.image}
              onChange={(e) => update({ image: e.target.value })}
              placeholder="/certificates/kavya.png"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
            />
            <p className="text-xs text-slate-400 mt-1">
              Path like /certificates/name.png or a full https:// URL to the certificate image.
            </p>
          </div>

          {cert.image && (
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <img
                src={cert.image}
                alt="Preview"
                className="max-h-48 mx-auto object-contain p-2"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {initial ? 'Save Changes' : 'Add Certificate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
