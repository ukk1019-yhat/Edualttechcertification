import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Edu Alt Tech" className="w-9 h-9 rounded-lg object-contain" />
            <div>
              <span className="font-bold text-lg text-slate-900">Edu Alt Tech</span>
              <span className="hidden sm:inline text-sm text-slate-500 ml-2">Certificate Verification</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Verify
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
