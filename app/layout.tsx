import type { Metadata } from 'next'
import {
  ClerkProvider,
  Show,
  SignInButton,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Famalii Invest — Portfolio management',
  description: 'Track investments, analyse returns, and manage your portfolio.',
}

const clerkAppearance = {
  variables: {
    colorBackground:      '#131318',
    colorInputBackground: '#1a1a22',
    colorInputText:       '#eeeef2',
    colorText:            '#eeeef2',
    colorTextSecondary:   '#8888a2',
    colorPrimary:         '#f97316',
    colorDanger:          '#ef4444',
    borderRadius:         '0.75rem',
    fontFamily:           'var(--font-geist-sans), system-ui, sans-serif',
  },
  elements: {
    card:                     'shadow-2xl',
    footerActionLink:         'text-[#f97316] hover:text-[#fb923c]',
    formButtonPrimary:        'bg-[#f97316] hover:bg-[#ea580c] transition-colors',
    formFieldInput:           'border-[#363645] focus:border-[#f97316] transition-colors',
    socialButtonsBlockButton: 'border-[#363645] bg-[#1a1a22] text-[#eeeef2]',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={clerkAppearance}
      signInUrl={process.env.NEXT_PUBLIC_FAMALII_CORE_URL + '/sign-in'}
      signUpUrl={process.env.NEXT_PUBLIC_FAMALII_CORE_URL + '/sign-up'}
    >
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="antialiased min-h-screen bg-f-bg text-f-text">

          {/* ── Navigation ───────────────────────────── */}
          <header className="sticky top-0 z-50 border-b border-f-border bg-f-bg/80 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

              {/* Logo */}
              <div className="flex items-center gap-3">
                <a
                  href={process.env.NEXT_PUBLIC_FAMALII_CORE_URL ?? '/'}
                  className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
                  title="Back to Famalii Core"
                >
                  <div className="w-6 h-6 rounded-md bg-f-orange flex items-center justify-center">
                    <span className="text-white font-black text-[10px]">F</span>
                  </div>
                  <span className="text-xs text-f-muted font-semibold tracking-tight">Famalii</span>
                </a>
                <span className="text-f-border">/</span>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-invest flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-xs">I</span>
                  </div>
                  <span className="text-sm font-bold text-f-text">Invest</span>
                </div>
              </div>

              {/* Nav + auth */}
              <nav className="flex items-center gap-1">
                <Show when="signed-in">
                  <a href="/dashboard" className="text-sm text-f-muted hover:text-f-text transition-colors px-3 py-2 rounded-lg hover:bg-f-raised">
                    Dashboard
                  </a>
                  <a href="/portfolio" className="text-sm text-f-muted hover:text-f-text transition-colors px-3 py-2 rounded-lg hover:bg-f-raised">
                    Portfolio
                  </a>
                  <a href="/watchlist" className="text-sm text-f-muted hover:text-f-text transition-colors px-3 py-2 rounded-lg hover:bg-f-raised">
                    Watchlist
                  </a>
                  <div className="ml-2">
                    <UserButton appearance={{ variables: { colorPrimary: '#f97316' } }} />
                  </div>
                </Show>
                <Show when="signed-out">
                  <SignInButton>
                    <button className="text-sm text-white bg-f-orange hover:bg-f-orange-dark transition-colors px-4 py-2 rounded-lg font-semibold">
                      Sign in
                    </button>
                  </SignInButton>
                </Show>
              </nav>
            </div>
          </header>

          <main>{children}</main>

          <footer className="border-t border-f-border mt-24 py-8 px-6">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-f-faint">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-invest flex items-center justify-center">
                  <span className="text-white font-black text-[10px]">I</span>
                </div>
                <span>Famalii Invest © {new Date().getFullYear()}</span>
              </div>
              <a
                href={process.env.NEXT_PUBLIC_FAMALII_CORE_URL ?? '/'}
                className="hover:text-f-muted transition-colors"
              >
                Part of the Famalii suite →
              </a>
            </div>
          </footer>

        </body>
      </html>
    </ClerkProvider>
  )
}
