"use client"

import { AnchorProvider, type TOCItemType } from "fumadocs-core/toc"
import { cn } from "@/lib/utils"
import { DocsToc } from "@/components/docs-toc"

interface DocsContentProps {
  toc: TOCItemType[]
  hideToc?: boolean
  children: React.ReactNode
}

export function DocsContent({ toc, hideToc, children }: DocsContentProps) {
  return (
    <AnchorProvider toc={toc}>
      <div className="flex min-w-0 flex-1 items-stretch">
        <div
          className={cn(
            "min-w-0 flex-1 py-8 ps-6 lg:ps-10",
            hideToc ? "pe-6" : "pe-6 lg:pe-10",
          )}
        >
          <div className={cn(!hideToc && "max-w-[688px]")}>{children}</div>
        </div>
        {!hideToc && <DocsToc toc={toc} />}
      </div>
    </AnchorProvider>
  )
}
