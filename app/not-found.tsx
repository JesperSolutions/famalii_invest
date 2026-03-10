import type { Metadata } from 'next'

export const metadata: Metadata = { title: '404 — Famalii Invest' }

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center gap-6">
      <div className="text-6xl font-black text-f-border select-none">404</div>

      <div>
        <h2 className="text-xl font-bold text-f-text mb-2">Page not found</h2>
        <p className="text-f-muted text-sm max-w-sm">
          This page doesn&apos;t exist in Famalii Invest yet.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <a
          href="/dashboard"
          className="px-4 py-2 rounded-lg bg-invest text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Go to Dashboard
        </a>
        <a
          href={process.env.NEXT_PUBLIC_FAMALII_CORE_URL ?? '/'}
          className="px-4 py-2 rounded-lg border border-f-border text-f-muted text-sm hover:text-f-text transition-colors"
        >
          Back to Famalii Core
        </a>
      </div>
    </div>
  )
}
