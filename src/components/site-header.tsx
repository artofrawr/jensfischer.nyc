"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function SiteHeader({ className, children }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="site-header"
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/70",
        className,
      )}
    >
      <div className="container mx-auto px-6">
        <div className="flex h-(--header-height) items-center gap-4">
          {children}
        </div>
      </div>
    </header>
  )
}

function SiteHeaderLogo({
  href = "/",
  className,
  children,
}: React.PropsWithChildren<{ href?: string; className?: string }>) {
  return (
    <Link
      href={href}
      className={cn(
        "flex shrink-0 items-center gap-2 font-semibold tracking-tight text-foreground hover:opacity-80 transition-opacity",
        className,
      )}
    >
      {children}
    </Link>
  )
}

function SiteHeaderNav({ className, children }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="site-header-nav"
      className={cn("ml-auto hidden items-center gap-1 md:flex", className)}
    >
      {children}
    </nav>
  )
}

function SiteHeaderNavLink({
  href,
  exact = false,
  className,
  children,
}: {
  href: string
  exact?: boolean
  className?: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-all hover:bg-muted",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {children}
    </Link>
  )
}

function SiteHeaderActions({
  className,
  children,
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="site-header-actions"
      className={cn("flex items-center gap-1", className)}
    >
      {children}
    </div>
  )
}

const MobileNavContext = React.createContext<{ close: () => void }>({
  close: () => {},
})

function SiteHeaderMobileNav({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden",
          className,
        )}
        aria-label="Open menu"
      >
        <MenuIcon className="size-5" />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-background shadow-lg">
            <div className="flex h-(--header-height) items-center justify-between px-6">
              <span className="text-sm font-semibold">Navigation</span>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close menu"
              >
                <XIcon className="size-5" />
              </button>
            </div>
            <MobileNavContext.Provider value={{ close: () => setOpen(false) }}>
              {children}
            </MobileNavContext.Provider>
          </div>
        </>
      )}
    </>
  )
}

function SiteHeaderMobileNavLink({
  href,
  exact = false,
  className,
  children,
}: {
  href: string
  exact?: boolean
  className?: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { close } = React.use(MobileNavContext)
  const isActive = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      onClick={close}
      className={cn(
        "flex items-center px-6 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
        className,
      )}
    >
      {children}
    </Link>
  )
}

export {
  SiteHeader,
  SiteHeaderLogo,
  SiteHeaderNav,
  SiteHeaderNavLink,
  SiteHeaderActions,
  SiteHeaderMobileNav,
  SiteHeaderMobileNavLink,
}
