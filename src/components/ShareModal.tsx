import { useState } from 'react'
import { X, Link, Mail, MessageCircle, Check, Share2 } from 'lucide-react'

interface ShareModalProps {
  certificateId: string
  certificateName: string
  onClose: () => void
}

export default function ShareModal({ certificateId, certificateName, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${window.location.origin}/certificate/${certificateId}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = shareUrl
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`Verify ${certificateName}'s certificate: ${shareUrl}`)}`,
      '_blank'
    )
  }

  const shareEmail = () => {
    window.open(
      `mailto:?subject=${encodeURIComponent(`Certificate Verification - ${certificateName}`)}&body=${encodeURIComponent(`You can verify ${certificateName}'s certificate here: ${shareUrl}`)}`,
      '_blank'
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <Share2 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Share Certificate</h3>
            <p className="text-sm text-slate-500">{certificateName}</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 mb-6 flex items-center justify-between gap-2">
          <span className="text-sm text-slate-600 truncate flex-1">{shareUrl}</span>
          <button
            onClick={copyLink}
            className="flex-shrink-0 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={shareWhatsApp}
            className="flex items-center justify-center gap-2 p-3 bg-green-50 text-green-700 font-medium rounded-xl hover:bg-green-100 transition-colors border border-green-200"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp
          </button>
          <button
            onClick={shareEmail}
            className="flex items-center justify-center gap-2 p-3 bg-blue-50 text-blue-700 font-medium rounded-xl hover:bg-blue-100 transition-colors border border-blue-200"
          >
            <Mail className="w-5 h-5" />
            Email
          </button>
        </div>
      </div>
    </div>
  )
}
