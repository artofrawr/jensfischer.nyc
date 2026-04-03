"use client"

import * as React from "react"
import { useActiveAnchor, type TOCItemType } from "fumadocs-core/toc"

import { cn } from "@/lib/utils"

interface DocsTocProps {
  toc: TOCItemType[]
}

export function DocsToc({ toc }: DocsTocProps) {
  const activeAnchor = useActiveAnchor()

  if (toc.length === 0) return null

  return (
    <aside className="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--header-height)-1px)] w-(--toc-width) shrink-0 xl:block">
      <nav className="h-full overflow-y-auto overscroll-contain py-8 pe-4 ps-4">
        <p className="mb-2 text-[13px] font-semibold text-foreground">
          On this page
        </p>
        <ul className="relative flex flex-col">
          {toc.map((item) => {
            const id = item.url.slice(1)
            const isActive = activeAnchor === id
            const depth = item.depth - 2

            return (
              <li key={item.url}>
                <a
                  href={item.url}
                  className={cn(
                    "block border-l-1 py-1 text-[12.5px] leading-relaxed transition-colors",
                    depth === 0 ? "ps-3" : "ps-6",
                    isActive
                      ? "border-primary font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.title}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
