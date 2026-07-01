import Link from "next/link"
import { source } from "@/lib/source"
import { showcaseSource } from "@/lib/showcase-source"

type FooterLink = {
  label: string
  href: string
  external?: boolean
}

function firstPageIn(slug: string): string {
  const page = source
    .getPages()
    .find((p) => p.url.startsWith(`/knowledge/${slug}/`))
  return page?.url ?? "/knowledge"
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: FooterLink[]
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs uppercase tracking-widest text-background/40">
        {title}
      </h3>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.href + link.label}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-background/70 transition-colors hover:text-background"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-background/70 transition-colors hover:text-background"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function SiteFooter() {
  const showcaseLinks: FooterLink[] = [...showcaseSource.getPages()]
    .filter((page) => page.data.featured)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map((page) => ({ label: page.data.title, href: page.url }))

  const knowledgeLinks: FooterLink[] = [
    { label: "Tech", href: firstPageIn("tech") },
    { label: "Product", href: firstPageIn("product") },
    { label: "Misc", href: firstPageIn("misc") },
  ]

  const connectLinks: FooterLink[] = [
    { label: "About", href: "/about" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/jensfischer-nyc/",
      external: true,
    },
    { label: "GitHub", href: "https://github.com/artofrawr", external: true },
  ]

  return (
    <footer className="site-footer bg-foreground text-background dark:border-t dark:border-white/10">
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-3 lg:grid-cols-[2fr_1fr_1fr_1fr]">
          <div className="col-span-2 max-w-xs md:col-span-3 lg:col-span-1">
            <div className="font-headline text-lg font-semibold tracking-tight">
              Jens Fischer
            </div>
            <p className="mt-4 text-sm text-background/60">
              Full stack product engineer and entrepreneur based in NYC. Over
              two decades building digital experiences and products at the
              intersection of design and engineering.
            </p>
          </div>

          <FooterColumn title="Showcase" links={showcaseLinks} />
          <FooterColumn title="Knowledge" links={knowledgeLinks} />
          <FooterColumn title="Connect" links={connectLinks} />
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-background/15 pt-8 font-mono text-sm text-background/50 sm:flex-row sm:justify-between">
          <span>© 2026 Jens Fischer</span>
          <span>Built with attention to detail.</span>
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
