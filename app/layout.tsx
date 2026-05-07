import type { Metadata } from 'next'
import {
  ClerkProvider,
  Show,
  SignInButton,
  UserButton,
} from '@clerk/nextjs'
import { ui } from '@clerk/ui'
import { DM_Sans, Geist_Mono } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
})
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Famalii Invest — Portfolio management',
  description: 'Track investments, analyse returns, and manage your portfolio.',
}

const clerkAppearance = {
  variables: {
    colorBackground:      '#11141f',
    colorInputBackground: '#181b29',
    colorInputText:       '#eeeef2',
    colorText:            '#eeeef2',
    colorTextSecondary:   '#8a93ab',
    colorPrimary:         '#9EEAAF',
    colorDanger:          '#ef4444',
    borderRadius:         '0.75rem',
    fontFamily:           'var(--font-dm-sans), "DM Sans", system-ui, sans-serif',
  },
  elements: {
    card:                     'shadow-2xl',
    footerActionLink:         'text-[#9EEAAF] hover:text-[#c5f3d0]',
    formButtonPrimary:        'bg-[#9EEAAF] hover:bg-[#7cd896] text-[#192E5B] font-semibold transition-colors',
    formFieldInput:           'border-[#363c52] focus:border-[#9EEAAF] transition-colors',
    socialButtonsBlockButton: 'border-[#363c52] bg-[#181b29] text-[#eeeef2]',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={clerkAppearance}
      ui={ui}
      // Satellite domain config: tells Clerk this app is a child of famalii-core.
      // Clerk will do a __clerk_handshake token exchange when the user first arrives
      // from the primary domain so they don't have to sign in again.
      isSatellite
      domain={process.env.NEXT_PUBLIC_CLERK_DOMAIN}
      signInUrl={process.env.NEXT_PUBLIC_FAMALII_CORE_URL + '/sign-in'}
      signUpUrl={process.env.NEXT_PUBLIC_FAMALII_CORE_URL + '/sign-up'}
    >
      <html lang="en" className={`${dmSans.variable} ${geistMono.variable}`}>
        <body className="antialiased min-h-screen bg-f-bg text-f-text flex flex-col">

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
                  <div className="w-6 h-6 rounded-md bg-f-blue flex items-center justify-center ring-1 ring-f-border">
                    <span className="flex gap-[1.5px] items-end">
                      <span className="w-[2px] h-[10px] rounded-full bg-white" />
                      <span className="w-[2px] h-[8px] rounded-full bg-white relative"><span className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full bg-f-orange" /></span>
                      <span className="w-[2px] h-[6px] rounded-full bg-white relative"><span className="absolute -top-[3px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full bg-f-orange" /></span>
                    </span>
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
                    <UserButton appearance={{ variables: { colorPrimary: '#9EEAAF' } }} />
                  </div>
                </Show>
                <Show when="signed-out">
                  <SignInButton>
                    <button className="text-sm text-f-blue bg-f-orange hover:bg-f-orange-dark transition-colors px-4 py-2 rounded-lg font-bold">
                      Sign in
                    </button>
                  </SignInButton>
                </Show>
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

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
