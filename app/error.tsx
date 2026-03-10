'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to an error monitoring service when one is added
    console.error('[famalii-invest]', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center gap-6">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>

      <div>
        <h2 className="text-xl font-bold text-f-text mb-2">Something went wrong</h2>
        <p className="text-f-muted text-sm max-w-sm">
          {error.message ?? 'An unexpected error occurred. Please try again.'}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-invest text-white text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
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
