import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  ArrowLeft,
  Share2,
  CheckCircle,
  Calendar,
  User,
  Hash,
  Download,
} from 'lucide-react'
import { certificates } from '../data/certificates'
import ShareModal from '../components/ShareModal'

export default function CertificateDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showShare, setShowShare] = useState(false)
  const [imgError, setImgError] = useState(false)

  const cert = certificates.find((c) => c.id === id)

  if (!cert) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Certificate Not Found</h1>
          <p className="text-slate-600 mb-6">
            No certificate matches the ID "{id}". Please check the ID and try again.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Verification
          </Link>
        </div>
      </div>
    )
  }

  const verifiedCerts = certificates.filter((c) => c.name === cert.name)
  const isEmployee = cert.type === 'employee'

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </button>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 sm:p-8 text-white">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-emerald-300" />
                  <span className="text-sm font-medium text-indigo-200">Verified & Authentic</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold">{cert.name}</h1>
                <p className="text-indigo-200 mt-1">
                  {isEmployee ? 'Employee Certificate' : 'Internship Certificate'}
                </p>
              </div>
              <span className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold ${
                isEmployee
                  ? 'bg-purple-500 text-white'
                  : 'bg-emerald-500 text-white'
              }`}>
                {isEmployee ? 'EMPLOYEE' : 'INTERNSHIP'}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="aspect-[4/3] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center p-4">
                  {imgError ? (
                    <div className="text-center text-slate-400">
                      <ShieldCheck className="w-16 h-16 mx-auto mb-2" />
                      <p className="text-sm">Certificate image not available</p>
                    </div>
                  ) : (
                    <img
                      src={cert.image}
                      alt={`${cert.name} Certificate`}
                      className="w-full h-full object-contain"
                      onError={() => setImgError(true)}
                    />
                  )}
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => setShowShare(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
                  >
                    <Share2 className="w-4 h-4" /> Share Certificate
                  </button>
                  <a
                    href={cert.image}
                    download
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="space-y-5">
                <h2 className="text-xl font-bold text-slate-900">Certificate Details</h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Holder Name</p>
                      <p className="text-slate-900 font-semibold">{cert.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Hash className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Certificate ID</p>
                      <p className="text-slate-900 font-mono font-semibold">{cert.id}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Issue Date</p>
                      <p className="text-slate-900 font-semibold">
                        {new Date(cert.issueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Issued By</p>
                      <p className="text-slate-900 font-semibold">Edu Alt Tech</p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold text-emerald-800 text-sm">Verified Certificate</span>
                  </div>
                  <p className="text-sm text-emerald-700">
                    This certificate is digitally verified and authentic. Issued by Edu Alt Tech.
                  </p>
                </div>

                {verifiedCerts.length > 1 && (
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">Also Issued To</p>
                    <div className="flex flex-wrap gap-2">
                      {verifiedCerts.map((vc) => (
                        <Link
                          key={vc.id}
                          to={`/certificate/${vc.id}`}
                          className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                            vc.id === cert.id
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {vc.type === 'employee' ? 'Employee' : 'Internship'}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showShare && (
        <ShareModal
          certificateId={cert.id}
          certificateName={cert.name}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  )
}
