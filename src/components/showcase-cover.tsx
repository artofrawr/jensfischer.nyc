import { ArrowRightIcon, ExternalLinkIcon } from "lucide-react"
import Link from "next/link"

import type { ShowcasePage } from "@/lib/showcase-source"

const cardClassName =
  "group flex flex-col rounded-lg border border-border p-5 transition-colors hover:border-foreground/25 hover:bg-muted/50"

export function ShowCaseCover(page: ShowcasePage) {
  const { title, description, tags, url } = page.data
  const isExternal = Boolean(url)

  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-medium text-foreground">{title}</h2>
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
}
