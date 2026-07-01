import type { Metadata } from "next"
import { Inter, Poppins, Inconsolata } from "next/font/google"
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
import { CommandMenu } from "@/components/command-menu"
import { getSearchableItems } from "@/lib/search"
import { ThemeProvider } from "next-themes"
import { SiteFooter } from "@/components/site-footer"

const poppins = Poppins({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["600"],
})

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

const inconsolata = Inconsolata({
  variable: "--font-mono",
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
        className={`${inter.variable} ${inconsolata.variable} ${poppins.variable} antialiased font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader>
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
              <SiteHeaderNavLink href="/showcase" exact>
                Showcase
              </SiteHeaderNavLink>
              <SiteHeaderNavLink href="/docs">Knowledge</SiteHeaderNavLink>
              <SiteHeaderNavLink href="/about" exact>
                About
              </SiteHeaderNavLink>
            </SiteHeaderNav>

            <SiteHeaderActions className="hidden md:flex">
              <CommandMenu items={getSearchableItems()} />
              <div className="mx-1 h-4 w-px bg-border" />
              <ThemeToggle />
              <div>
                <a
                  href="https://github.com/artofrawr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md p-1.5 text-foreground transition-colors hover:bg-muted"
                  aria-label="GitHub"
                >
                  <svg
                    fill="currentColor"
                    viewBox="3 3 18 18"
                    className="size-5"
                    aria-label="GitHub"
                  >
                    <path d="M12 3C7.0275 3 3 7.12937 3 12.2276C3 16.3109 5.57625 19.7597 9.15374 20.9824C9.60374 21.0631 9.77249 20.7863 9.77249 20.5441C9.77249 20.3249 9.76125 19.5982 9.76125 18.8254C7.5 19.2522 6.915 18.2602 6.735 17.7412C6.63375 17.4759 6.19499 16.6569 5.8125 16.4378C5.4975 16.2647 5.0475 15.838 5.80124 15.8264C6.51 15.8149 7.01625 16.4954 7.18499 16.7723C7.99499 18.1679 9.28875 17.7758 9.80625 17.5335C9.885 16.9337 10.1212 16.53 10.38 16.2993C8.3775 16.0687 6.285 15.2728 6.285 11.7432C6.285 10.7397 6.63375 9.9092 7.20749 9.26326C7.1175 9.03257 6.8025 8.08674 7.2975 6.81794C7.2975 6.81794 8.05125 6.57571 9.77249 7.76377C10.4925 7.55615 11.2575 7.45234 12.0225 7.45234C12.7875 7.45234 13.5525 7.55615 14.2725 7.76377C15.9937 6.56418 16.7475 6.81794 16.7475 6.81794C17.2424 8.08674 16.9275 9.03257 16.8375 9.26326C17.4113 9.9092 17.76 10.7281 17.76 11.7432C17.76 15.2843 15.6563 16.0687 13.6537 16.2993C13.98 16.5877 14.2613 17.1414 14.2613 18.0065C14.2613 19.2407 14.25 20.2326 14.25 20.5441C14.25 20.7863 14.4188 21.0746 14.8688 20.9824C16.6554 20.364 18.2079 19.1866 19.3078 17.6162C20.4077 16.0457 20.9995 14.1611 21 12.2276C21 7.12937 16.9725 3 12 3Z" />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/jensfischer-nyc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md p-1.5 text-foreground transition-colors hover:bg-muted"
                  aria-label="LinkedIn"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="size-5"
                    aria-label="LinkedIn"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </SiteHeaderActions>

            <SiteHeaderMobileNav className="ml-auto">
              <SiteHeaderMobileNavLink href="/" exact>
                Home
              </SiteHeaderMobileNavLink>
              <SiteHeaderMobileNavLink href="/showcase" exact>
                Showcase
              </SiteHeaderMobileNavLink>
              <SiteHeaderMobileNavLink href="/docs">
                Knowledge
              </SiteHeaderMobileNavLink>
              <SiteHeaderMobileNavLink href="/about" exact>
                About
              </SiteHeaderMobileNavLink>
              <div className="mt-6 border-t pt-6 flex items-center gap-2">
                <CommandMenu items={getSearchableItems()} />
                <ThemeToggle />
              </div>
            </SiteHeaderMobileNav>
          </SiteHeader>
          {children}
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
