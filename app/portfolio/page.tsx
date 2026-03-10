import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Portfolio — Famalii Invest' }

export default async function PortfolioPage() {
  const { userId } = await auth()
  if (!userId) redirect(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? '/')

  return (
    <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col items-center text-center gap-6">
      <div className="w-16 h-16 rounded-2xl bg-invest/10 border border-invest/20 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-invest">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
        </svg>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-f-text mb-2">Full Portfolio View</h1>
        <p className="text-f-muted max-w-md">
          Detailed holdings breakdown, transaction history, and performance attribution are coming soon.
        </p>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-f-faint border border-f-border rounded-full px-4 py-2">
        <span className="w-1.5 h-1.5 rounded-full bg-invest animate-pulse" />
        In development
      </div>

      <a
        href="/dashboard"
        className="mt-4 text-sm text-f-muted hover:text-f-text transition-colors underline underline-offset-4"
      >
        ← Back to Dashboard
      </a>
    </div>
  )
}
