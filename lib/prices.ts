// Fallback prices used when live fetch fails (last known values)
const FALLBACK: Record<string, { price: number; changePercent: number }> = {
  AAPL: { price: 189.45, changePercent:  1.23 },
  MSFT: { price: 415.20, changePercent:  0.87 },
  BTC:  { price: 68240,  changePercent: -2.15 },
  VOO:  { price: 510.30, changePercent:  0.54 },
}

// Yahoo Finance ticker symbols (crypto needs -USD suffix)
const YF_SYMBOL: Record<string, string> = {
  AAPL: 'AAPL',
  MSFT: 'MSFT',
  BTC:  'BTC-USD',
  VOO:  'VOO',
}

export type LiveQuote = {
  ticker: string
  price: number
  changePercent: number
  stale: boolean // true when live data unavailable — showing fallback
}

/**
 * Fetches live quotes for the given tickers in a single Yahoo Finance API call.
 * Falls back to the last-known static prices on any network/parse error.
 * Results are cached for 60 seconds via Next.js fetch caching.
 */
export async function fetchQuotes(tickers: string[]): Promise<Map<string, LiveQuote>> {
  const symbols = tickers.map(t => YF_SYMBOL[t] ?? t).join(',')

  try {
    const res = await fetch(
      `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}&fields=regularMarketPrice,regularMarketChangePercent`,
      {
        next: { revalidate: 60 },
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' },
      },
    )
    if (!res.ok) throw new Error(`Yahoo Finance HTTP ${res.status}`)

    const json = await res.json()
    const results = json?.quoteResponse?.result as Array<{
      symbol: string
      regularMarketPrice: number
      regularMarketChangePercent: number
    }> | undefined

    if (!results?.length) throw new Error('Empty result set')

    const map = new Map<string, LiveQuote>()
    for (const ticker of tickers) {
      const symbol = YF_SYMBOL[ticker] ?? ticker
      const r = results.find(x => x.symbol === symbol)
      if (r?.regularMarketPrice) {
        map.set(ticker, {
          ticker,
          price: r.regularMarketPrice,
          changePercent: r.regularMarketChangePercent ?? 0,
          stale: false,
        })
      } else {
        const fb = FALLBACK[ticker] ?? { price: 0, changePercent: 0 }
        map.set(ticker, { ticker, ...fb, stale: true })
      }
    }
    return map
  } catch {
    // Full fallback — don't crash the page, just show stale data
    return new Map(
      tickers.map(t => [t, { ticker: t, ...(FALLBACK[t] ?? { price: 0, changePercent: 0 }), stale: true }])
    )
  }
}
