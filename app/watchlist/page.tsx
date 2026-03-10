import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Watchlist — Famalii Invest' }

export default async function WatchlistPage() {
  const { userId } = await auth()
  if (!userId) redirect(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? '/')

  return (
    <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col items-center text-center gap-6">
      <div className="w-16 h-16 rounded-2xl bg-invest/10 border border-invest/20 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-invest">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-f-text mb-2">Watchlist</h1>
        <p className="text-f-muted max-w-md">
          Track assets you&apos;re watching — real-time prices, alerts, and custom screeners are coming soon.
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
