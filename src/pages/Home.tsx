import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, FileCheck, Users, GraduationCap, ArrowRight, Loader2 } from 'lucide-react'
import { certificates, certificateTypes, type Certificate } from '../data/certificates'

export default function Home() {
  const navigate = useNavigate()
  const [searchId, setSearchId] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filteredCerts, setFilteredCerts] = useState<Certificate[]>(certificates)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    let result = certificates
    if (filterType !== 'all') {
      result = result.filter((c) => c.type === filterType)
    }
    setFilteredCerts(result)
  }, [filterType])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchId.trim().toUpperCase()
    if (!trimmed) return
    setSearching(true)
    const found = certificates.find((c) => c.id.toUpperCase() === trimmed)
    if (found) {
      navigate(`/certificate/${found.id}`)
    } else {
      setSearching(false)
      alert('Certificate not found. Please check the ID and try again.')
    }
  }

  const stats = [
    { icon: FileCheck, value: certificates.length, label: 'Certificates Issued' },
    { icon: Users, value: certificates.filter((c) => c.type === 'employee').length, label: 'Employees' },
    { icon: GraduationCap, value: certificates.filter((c) => c.type === 'internship').length, label: 'Interns' },
  ]

  return (
    <div>
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <img src="/logo.png" alt="Edu Alt Tech" className="w-16 h-16 object-contain mx-auto mb-6" />
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Certificate Verification
          </h1>
          <p className="text-lg text-slate-600 mb-4 max-w-xl mx-auto">
            Verify the authenticity of Edu Alt Tech employee and internship certificates instantly.
          </p>

          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-12">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g., EAT-EMP-001)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
              />
            </div>
            <button
              type="submit"
              disabled={!searchId.trim() || searching}
              className="mt-3 w-full py-4 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
            >
              {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              Verify Certificate
            </button>
          </form>

          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                <stat.icon className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-slate-900">All Certificates</h2>
            <div className="flex gap-2">
              {certificateTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setFilterType(t.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    filterType === t.value
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.map((cert) => (
              <Link
                key={cert.id}
                to={`/certificate/${cert.id}`}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-200"
              >
                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                  <img
                    src={cert.image}
                    alt={cert.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(cert.name)}&size=200&background=6366f1&color=fff`
                    }}
                  />
                </div>
                <div className="p-5">
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2 ${
                    cert.type === 'employee'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {cert.type === 'employee' ? 'Employee' : 'Internship'}
                  </span>
                  <h3 className="font-semibold text-slate-900 mb-1">{cert.name}</h3>
                  <p className="text-sm text-slate-500 mb-3">ID: {cert.id}</p>
                  <div className="flex items-center text-sm font-medium text-indigo-600 group-hover:gap-2 transition-all">
                    View Details <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredCerts.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <FileCheck className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No certificates found for this category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
