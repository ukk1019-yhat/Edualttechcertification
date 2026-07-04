export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Edu Alt Tech. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <span>Certificate Verification System</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
