import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import {
  SiteHeader,
  SiteHeaderLogo,
  SiteHeaderNav,
  SiteHeaderNavLink,
  SiteHeaderActions,
  SiteHeaderMobileNav,
  SiteHeaderMobileNavLink,
} from "@/components/site-header"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeProvider } from "next-themes"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Jens Fischer",
  description: "Full Stack Product Engineer and Entrepreneur based out of NYC.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader>
            <SiteHeaderMobileNav>
              <div className="flex flex-col gap-1 pt-6">
                <SiteHeaderMobileNavLink href="/" exact>
                  Home
                </SiteHeaderMobileNavLink>
                <SiteHeaderMobileNavLink href="/docs">
                  Knowledge
                </SiteHeaderMobileNavLink>
                <SiteHeaderMobileNavLink href="/about" exact>
                  About
                </SiteHeaderMobileNavLink>
              </div>
            </SiteHeaderMobileNav>

            <SiteHeaderLogo href="/">
              <svg
                width="24"
                height="24"
                viewBox="0 0 50 50"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle fill="currentColor" cx="25" cy="25" r="25" />
                <path
                  d="M20,18 C21.6571429,18 23,16.6571429 23,15 C23,13.3428571 21.6571429,12 20,12 C18.3428571,12 17,13.3428571 17,15 C17,16.6571429 18.3428571,18 20,18 Z M17.892638,42 C21.7852761,42 23,39.2017766 23,36.7766497 L23,21 L18.1134969,21 L18.1134969,35.8705584 C18.1134969,37.1497462 17.5889571,37.7360406 16.7607362,37.7360406 C16.1533742,37.7360406 15.5184049,37.3362944 15.5184049,37.3362944 L14,41.1472081 C14.690184,41.4403553 15.5736196,42 17.892638,42 Z M31.5907781,35 L31.5907781,25.6938776 L36,25.6938776 L36,20.9291429 L31.5907781,20.9291429 L31.5907781,18.0765714 C31.5907781,16.1291429 31.8501441,15.3062857 33.0172911,15.3062857 C33.7694524,15.3062857 34.3919308,15.6902857 34.3919308,15.6902857 L36,12.2617143 C36,12.2617143 34.5475504,11 32.2132565,11 C28.8933718,11 27.0259366,13.8251429 27,17.9394286 L27,20.9291429 L27,24.632 L27,35 L31.5907781,35 Z"
                  fill="var(--background)"
                  fillRule="nonzero"
                />
              </svg>
              Jens Fischer
            </SiteHeaderLogo>

            <SiteHeaderNav>
              <SiteHeaderNavLink href="/docs">Knowledge</SiteHeaderNavLink>
              <SiteHeaderNavLink href="/about" exact>
                About
              </SiteHeaderNavLink>
            </SiteHeaderNav>

            <SiteHeaderActions>
              <ThemeToggle />
            </SiteHeaderActions>
          </SiteHeader>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
