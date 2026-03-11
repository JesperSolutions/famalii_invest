import { SignInButton, SignUpButton, Show } from '@clerk/nextjs'
import { fetchQuotes } from '@/lib/prices'

const TICKERS = ['AAPL', 'MSFT', 'BTC', 'VOO', 'NVDA', 'TSLA']

const FEATURES = [
  {
    icon: '📈',
    title: 'Portfolio tracking',
    body: 'Monitor all your holdings in one place. Stocks, ETFs, crypto, and custom assets.',
  },
  {
    icon: '📊',
    title: 'Performance analytics',
    body: 'Detailed P&L breakdowns, allocation charts, and return comparisons over time.',
  },
  {
    icon: '🔔',
    title: 'Smart alerts',
    body: 'Price targets, dividend announcements, and rebalancing nudges delivered instantly.',
  },
  {
    icon: '🌍',
    title: 'Multi-currency',
    body: 'Hold and track assets in any currency with live FX conversion.',
  },
  {
    icon: '📋',
    title: 'Transaction log',
    body: 'Full history of every buy, sell, and dividend — exportable for tax reporting.',
  },
  {
    icon: '🔒',
    title: 'Famalii SSO',
    body: 'One secure Famalii account — no separate password for Invest.',
  },
]

export default async function HomePage() {
  // Fetch live ticker prices for the strip — no auth required, best-effort
  const quotes = await fetchQuotes(TICKERS)

  return (
    <>
      {/* ── LIVE TICKER STRIP ────────────────────────────── */}
      <div className="border-b border-f-border bg-f-surface/60 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center gap-6 px-6 py-2.5 overflow-x-auto no-scrollbar">
          {TICKERS.map((t) => {
            const q = quotes.get(t)
            const change = q?.changePercent ?? 0
            return (
              <div key={t} className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-bold text-f-text">{t}</span>
                <span className="text-xs text-f-muted">
                  {q ? `$${q.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
                </span>
                {q && (
                  <span className={`text-xs font-semibold ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                  </span>
                )}
              </div>
            )
          })}
          <span className="text-[10px] text-f-faint flex-shrink-0 ml-4">
            {quotes.size > 0 ? '● Live' : '⚠ Delayed'}
          </span>
        </div>
      </div>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden dot-grid">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(16,185,129,0.12) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-28 text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-f-border bg-f-surface px-4 py-1.5 text-xs text-f-muted mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-invest animate-pulse" />
            Portfolio management — powered by Famalii
          </div>

          <h1 className="animate-fade-up-delay-1 text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            Invest smarter.
            <br className="hidden sm:block" />
            <span
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #34d399 60%, #6ee7b7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Track everything.
            </span>
          </h1>

          <p className="animate-fade-up-delay-2 text-lg sm:text-xl text-f-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Famalii Invest gives you a unified view of your entire portfolio — from brokerage accounts
            to crypto wallets — in one clean dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <SignUpButton>
              <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-invest hover:bg-invest-dark text-white font-bold px-8 py-3.5 rounded-xl text-base transition-all shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5">
                Get started free
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </SignUpButton>
            <SignInButton>
              <button className="w-full sm:w-auto inline-flex items-center justify-center border border-f-border hover:border-f-border-bright bg-transparent hover:bg-f-raised text-f-text font-medium px-8 py-3.5 rounded-xl text-base transition-all">
                Sign in
              </button>
            </SignInButton>
          </div>
          <Show when="signed-in">
            <div className="mt-4">
              <a href="/dashboard" className="text-sm text-invest hover:text-invest-light transition-colors underline underline-offset-4">
                Go to your dashboard →
              </a>
            </div>
          </Show>
        </div>
      </section>

      {/* ── DIVIDER ──────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-f-border to-transparent" />
      </div>

      {/* ── FEATURES ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-f-text mb-3">
            Everything you need to manage wealth
          </h2>
          <p className="text-f-muted max-w-lg mx-auto">
            Professional-grade tools without the complexity.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card-hover rounded-2xl border border-f-border bg-f-surface p-6">
              <div className="text-2xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-f-text mb-2 text-sm">{f.title}</h3>
              <p className="text-xs text-f-muted leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-f-text mb-3">
            Up and running in minutes
          </h2>
          <p className="text-f-muted max-w-lg mx-auto">No broker integration required — start with manual entries and add automation later.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 relative">
          {/* Connecting line on desktop */}
          <div className="hidden sm:block absolute top-8 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-f-border to-transparent" aria-hidden />

          {[
            { step: '01', icon: '📥', title: 'Add your holdings', body: 'Enter tickers, quantities, and purchase prices. Import via CSV or connect a broker feed.' },
            { step: '02', icon: '📊', title: 'See the full picture', body: 'Live prices, P&L, allocation charts — your entire portfolio in one clean dashboard.' },
            { step: '03', icon: '🔔', title: 'Stay ahead', body: 'Price targets, earnings alerts, and rebalancing nudges delivered to your inbox.' },
          ].map((s) => (
            <div key={s.step} className="flex flex-col items-center text-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-f-raised border border-f-border flex items-center justify-center text-3xl">
                  {s.icon}
                </div>
                <span className="absolute -top-2 -right-2 text-[10px] font-black text-invest bg-f-bg border border-invest/30 rounded-full w-5 h-5 flex items-center justify-center">
                  {s.step}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-f-text mb-1">{s.title}</h3>
                <p className="text-xs text-f-muted leading-relaxed max-w-xs mx-auto">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}      <section className="border-t border-f-border bg-f-surface">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-f-text mb-4">
            Ready to take control?
          </h2>
          <p className="text-f-muted mb-8 max-w-md mx-auto">
            Sign up with your Famalii account and start tracking your investments today.
          </p>
          <SignUpButton>
            <button className="inline-flex items-center gap-2 bg-invest hover:bg-invest-dark text-white font-bold px-10 py-4 rounded-xl text-base transition-all shadow-xl hover:shadow-emerald-500/25 hover:-translate-y-0.5">
              Create your account
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </SignUpButton>
        </div>
      </section>
    </>
  )
}
