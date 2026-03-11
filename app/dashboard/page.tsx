import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchQuotes } from '@/lib/prices'

// User's positions — qty is user-specific, prices fetched live
type Position = { ticker: string; name: string; qty: number }

const POSITIONS: Position[] = [
  { ticker: 'AAPL', name: 'Apple Inc.',          qty: 10   },
  { ticker: 'MSFT', name: 'Microsoft Corp.',      qty: 5    },
  { ticker: 'BTC',  name: 'Bitcoin',              qty: 0.25 },
  { ticker: 'VOO',  name: 'Vanguard S&P 500 ETF', qty: 8    },
]

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? '/')

  // Fetch live prices; falls back to static values on any error
  const quotes = await fetchQuotes(POSITIONS.map(p => p.ticker))
  const holdings = POSITIONS.map(p => ({
    ...p,
    price:         quotes.get(p.ticker)?.price         ?? 0,
    changePercent: quotes.get(p.ticker)?.changePercent ?? 0,
    stale:         quotes.get(p.ticker)?.stale         ?? true,
  }))

  const anyStale   = holdings.some(h => h.stale)
  const totalValue = holdings.reduce((sum, h) => sum + h.qty * h.price, 0)
  const dayChange  = holdings.reduce((sum, h) => sum + (h.qty * h.price * h.changePercent / 100), 0)

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">

      {/* Page header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <a
            href={process.env.NEXT_PUBLIC_FAMALII_CORE_URL ?? 'https://famalii-core.vercel.app'}
            className="inline-flex items-center gap-1.5 text-xs text-f-faint hover:text-f-muted transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Famalii Core
          </a>
          <span className="text-f-border text-xs">/</span>
          <span className="text-xs text-f-muted">Invest</span>
        </div>
        <p className="text-xs uppercase tracking-widest text-invest font-semibold mb-2">
          Portfolio overview
        </p>
        <h1 className="text-3xl sm:text-4xl font-black text-f-text mb-2 tracking-tight">
          Dashboard
        </h1>
        <p className="text-f-muted">Your real-time portfolio snapshot.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Total value',   value: `$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,  accent: true },
          { label: "Today's P&L",   value: `${dayChange >= 0 ? '+' : ''}$${Math.abs(dayChange).toFixed(2)}`, positive: dayChange >= 0 },
          { label: 'Positions',     value: holdings.length },
          { label: 'Account',       value: 'Active', isText: true },
        ].map(({ label, value, accent, positive, isText }) => (
          <div
            key={label}
            className={`rounded-xl border p-5 ${
              accent ? 'border-invest/30 bg-invest/5' : 'border-f-border bg-f-surface'
            }`}
          >
            <p className="text-xs text-f-muted mb-1">{label}</p>
            <p className={`text-2xl font-black ${
              accent ? 'text-invest' :
              isText ? 'text-emerald-400' :
              positive === undefined ? 'text-f-text' :
              positive ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Holdings table */}
      <h2 className="text-lg font-bold text-f-text mb-4">Holdings</h2>
      <div className="rounded-2xl border border-f-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-f-border bg-f-surface">
              <th className="text-left px-5 py-3 text-xs text-f-faint font-semibold uppercase tracking-wider">Asset</th>
              <th className="text-right px-5 py-3 text-xs text-f-faint font-semibold uppercase tracking-wider">Qty</th>
              <th className="text-right px-5 py-3 text-xs text-f-faint font-semibold uppercase tracking-wider">Price</th>
              <th className="text-right px-5 py-3 text-xs text-f-faint font-semibold uppercase tracking-wider">Value</th>
              <th className="text-right px-5 py-3 text-xs text-f-faint font-semibold uppercase tracking-wider">24h</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((h, i) => (
              <tr
                key={h.ticker}
                className={`border-b border-f-border last:border-0 hover:bg-f-raised transition-colors ${i % 2 === 0 ? 'bg-f-bg' : 'bg-f-surface'}`}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-f-raised border border-f-border flex items-center justify-center text-xs font-black text-invest">
                      {h.ticker.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-f-text">{h.ticker}</p>
                      <p className="text-xs text-f-faint">{h.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-right text-f-muted">{h.qty}</td>
                <td className="px-5 py-4 text-right text-f-text font-medium">
                  ${h.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-5 py-4 text-right text-f-text font-semibold">
                  ${(h.qty * h.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
                <td className={`px-5 py-4 text-right font-semibold ${h.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {h.changePercent >= 0 ? '+' : ''}{h.changePercent.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-center">
        {anyStale
          ? <span className="text-f-faint">⚠ Prices unavailable — showing estimates</span>
          : <span className="text-emerald-500/70">● Live prices · refreshes every 60 s</span>
        }
      </p>
    </div>
  )
}
