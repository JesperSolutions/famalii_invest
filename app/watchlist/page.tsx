import { auth } from '@clerk/nextjs/server'
import { fetchQuotes } from '@/lib/prices'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Watchlist — Famalii Invest' }

const WATCHED = [
  { ticker: 'NVDA',  name: 'NVIDIA Corp.',        note: 'AI infrastructure play'   },
  { ticker: 'TSLA',  name: 'Tesla Inc.',           note: 'EV + energy storage'      },
  { ticker: 'META',  name: 'Meta Platforms',       note: 'Social + AI ads'          },
  { ticker: 'AMZN',  name: 'Amazon.com Inc.',      note: 'AWS + e-commerce'         },
  { ticker: 'GOOGL', name: 'Alphabet Inc.',        note: 'Search + cloud'           },
  { ticker: 'ETH',   name: 'Ethereum',             note: 'Smart contract platform'  },
]

export default async function WatchlistPage() {
  const { userId } = await auth()
  if (!userId) return null // middleware handles the redirect

  const quotes = await fetchQuotes(WATCHED.map(w => w.ticker))

  const items = WATCHED.map(w => ({
    ...w,
    price:         quotes.get(w.ticker)?.price         ?? 0,
    changePercent: quotes.get(w.ticker)?.changePercent ?? 0,
    stale:         quotes.get(w.ticker)?.stale         ?? true,
  }))

  const anyStale = items.some(i => i.stale)

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-invest font-semibold mb-1">Watchlist</p>
          <h1 className="text-3xl font-black text-f-text">Watching</h1>
          <p className="text-sm text-f-muted mt-1">
            {anyStale ? '⚠ Prices may be delayed' : '● Live prices'}
          </p>
        </div>
        <a href="/dashboard" className="text-xs text-f-muted hover:text-f-text transition-colors border border-f-border rounded-lg px-3 py-2">
          ← Dashboard
        </a>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.ticker}
            className="rounded-2xl border border-f-border bg-f-raised p-5 hover:border-invest/40 hover:bg-invest/5 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-f-bg border border-f-border flex items-center justify-center text-sm font-black text-invest">
                  {item.ticker.slice(0, 2)}
                </div>
                <div>
                  <p className="font-bold text-f-text text-sm">{item.ticker}</p>
                  <p className="text-xs text-f-faint">{item.name}</p>
                </div>
              </div>
              <span className={`text-sm font-bold ${
                item.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {item.changePercent >= 0 ? '▲' : '▼'} {Math.abs(item.changePercent).toFixed(2)}%
              </span>
            </div>

            <p className="text-2xl font-black text-f-text mb-2">
              ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-f-muted">{item.note}</p>

            <div className="mt-4 flex items-center gap-2">
              <button className="flex-1 text-xs border border-f-border hover:border-invest hover:text-invest text-f-faint rounded-lg py-1.5 transition-colors">
                + Add to portfolio
              </button>
              <button className="text-xs border border-f-border hover:border-red-500/40 hover:text-red-400 text-f-faint rounded-lg px-3 py-1.5 transition-colors">
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add ticker CTA */}
      <div className="rounded-2xl border border-dashed border-f-border p-8 text-center">
        <p className="text-sm text-f-muted mb-3">Track more assets</p>
        <div className="flex items-center justify-center gap-2 max-w-xs mx-auto">
          <input
            type="text"
            placeholder="Enter ticker (e.g. AAPL)"
            disabled
            className="flex-1 text-sm bg-f-raised border border-f-border rounded-lg px-3 py-2 text-f-faint placeholder:text-f-faint/60 cursor-not-allowed"
          />
          <button disabled className="text-sm bg-invest/30 text-invest/50 font-semibold px-4 py-2 rounded-lg cursor-not-allowed">
            Add
          </button>
        </div>
        <p className="text-xs text-f-faint mt-2">Custom tickers coming soon</p>
      </div>

    </div>
  )
}
