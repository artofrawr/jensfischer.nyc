import Link from "next/link"
import { ArrowRightIcon, ExternalLinkIcon } from "lucide-react"

import { showcaseSource } from "@/lib/showcase-source"

const cardClassName =
  "group flex flex-col rounded-lg border border-border p-5 transition-colors hover:border-foreground/25 hover:bg-muted/50"

export default function Showcase() {
  const products = [...showcaseSource.getPages()].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  )

  return (
    <main className="max-w-screen-lg mx-auto px-8 pt-8">
      <div className="py-20 max-w-screen-lg mx-auto">
        <h1 className="text-4xl font-normal pb-2">Showcase</h1>
        <p className="text-xl text-muted-foreground max-w-prose pb-12">
          A collection of projects &amp; products I&apos;ve shipped.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((page) => {
            const { title, description, tags, url } = page.data
            const isExternal = Boolean(url)

            const inner = (
              <>
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-medium text-foreground">
                    {title}
                  </h2>
                  {isExternal ? (
                    <ExternalLinkIcon className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 mt-1" />
                  ) : (
                    <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 mt-1" />
                  )}
                </div>
                {description && (
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                )}
                {tags && tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )

            if (isExternal && url) {
              return (
                <a
                  key={page.url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClassName}
                >
                  {inner}
                </a>
              )
            }

            return (
              <Link key={page.url} href={page.url} className={cardClassName}>
                {inner}
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
