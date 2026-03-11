import { auth } from '@clerk/nextjs/server'
import { fetchQuotes } from '@/lib/prices'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Portfolio — Famalii Invest' }

type Position = { ticker: string; name: string; qty: number; type: 'Stock' | 'ETF' | 'Crypto' }

const POSITIONS: Position[] = [
  { ticker: 'AAPL', name: 'Apple Inc.',           qty: 10,   type: 'Stock'  },
  { ticker: 'MSFT', name: 'Microsoft Corp.',       qty: 5,    type: 'Stock'  },
  { ticker: 'BTC',  name: 'Bitcoin',               qty: 0.25, type: 'Crypto' },
  { ticker: 'VOO',  name: 'Vanguard S&P 500 ETF',  qty: 8,    type: 'ETF'   },
]

const TYPE_COLOUR: Record<string, string> = {
  Stock:  'bg-sky-500/10  text-sky-400  border-sky-500/20',
  ETF:    'bg-violet-500/10 text-violet-400 border-violet-500/20',
  Crypto: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

export default async function PortfolioPage() {
  const { userId } = await auth()
  // Middleware handles the redirect — this is secondary protection
  if (!userId) return null

  const quotes  = await fetchQuotes(POSITIONS.map(p => p.ticker))
  const holdings = POSITIONS.map(p => ({
    ...p,
    price:         quotes.get(p.ticker)?.price         ?? 0,
    changePercent: quotes.get(p.ticker)?.changePercent ?? 0,
    stale:         quotes.get(p.ticker)?.stale         ?? true,
  }))

  const totalValue = holdings.reduce((s, h) => s + h.qty * h.price, 0)
  const anyStale   = holdings.some(h => h.stale)

  // Allocation by type
  const byType = ['Stock', 'ETF', 'Crypto'].map(type => {
    const val = holdings.filter(h => h.type === type).reduce((s, h) => s + h.qty * h.price, 0)
    return { type, val, pct: totalValue > 0 ? (val / totalValue) * 100 : 0 }
  }).filter(t => t.val > 0)

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-invest font-semibold mb-1">Portfolio</p>
          <h1 className="text-3xl font-black text-f-text">Full breakdown</h1>
          <p className="text-sm text-f-muted mt-1">
            {anyStale ? '⚠ Prices may be delayed' : '● Live prices'}
          </p>
        </div>
        <a href="/dashboard" className="text-xs text-f-muted hover:text-f-text transition-colors border border-f-border rounded-lg px-3 py-2">
          ← Dashboard
        </a>
      </div>

      {/* Total value */}
      <div className="rounded-2xl border border-invest/30 bg-invest/5 p-6">
        <p className="text-xs text-f-muted mb-1">Total portfolio value</p>
        <p className="text-4xl font-black text-invest">
          ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      </div>

      {/* Allocation */}
      <section>
        <h2 className="text-sm font-bold text-f-text mb-4">Allocation by type</h2>
        <div className="rounded-2xl border border-f-border bg-f-raised overflow-hidden">
          {/* Bar */}
          <div className="flex h-3 overflow-hidden">
            {byType.map((t, i) => (
              <div
                key={t.type}
                style={{ width: `${t.pct}%` }}
                className={`h-full ${
                  i === 0 ? 'bg-sky-500' : i === 1 ? 'bg-violet-500' : 'bg-amber-500'
                }`}
              />
            ))}
          </div>
          <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-f-border">
            {byType.map((t) => (
              <div key={t.type} className="px-6 py-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${TYPE_COLOUR[t.type]}`}>{t.type}</span>
                </div>
                <p className="text-xl font-black text-f-text">${t.val.toLocaleString('en-US', { minimumFractionDigits: 0 })}</p>
                <p className="text-xs text-f-muted">{t.pct.toFixed(1)}% of portfolio</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Holdings */}
      <section>
        <h2 className="text-sm font-bold text-f-text mb-4">Holdings detail</h2>
        <div className="rounded-2xl border border-f-border bg-f-raised overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-f-border">
                <th className="text-left px-5 py-3 text-xs text-f-faint font-semibold uppercase tracking-wider">Asset</th>
                <th className="text-right px-5 py-3 text-xs text-f-faint font-semibold uppercase tracking-wider hidden sm:table-cell">Type</th>
                <th className="text-right px-5 py-3 text-xs text-f-faint font-semibold uppercase tracking-wider">Qty</th>
                <th className="text-right px-5 py-3 text-xs text-f-faint font-semibold uppercase tracking-wider">Price</th>
                <th className="text-right px-5 py-3 text-xs text-f-faint font-semibold uppercase tracking-wider">Value</th>
                <th className="text-right px-5 py-3 text-xs text-f-faint font-semibold uppercase tracking-wider">24h</th>
                <th className="text-right px-5 py-3 text-xs text-f-faint font-semibold uppercase tracking-wider hidden sm:table-cell">Weight</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => {
                const value  = h.qty * h.price
                const weight = totalValue > 0 ? (value / totalValue) * 100 : 0
                return (
                  <tr key={h.ticker} className="border-b border-f-border last:border-0 hover:bg-invest/5 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-f-bg border border-f-border flex items-center justify-center text-xs font-black text-invest">
                          {h.ticker.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-f-text">{h.ticker}</p>
                          <p className="text-xs text-f-faint">{h.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right hidden sm:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${TYPE_COLOUR[h.type]}`}>{h.type}</span>
                    </td>
                    <td className="px-5 py-4 text-right text-f-muted">{h.qty}</td>
                    <td className="px-5 py-4 text-right text-f-text font-medium">${h.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-5 py-4 text-right text-f-text font-semibold">${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-5 py-4 text-right">
                      <span className={h.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {h.changePercent >= 0 ? '+' : ''}{h.changePercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right hidden sm:table-cell">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-f-border overflow-hidden">
                          <div className="h-full bg-invest rounded-full" style={{ width: `${weight}%` }} />
                        </div>
                        <span className="text-xs text-f-muted w-10 text-right">{weight.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  )
}
