import { notFound } from "next/navigation"

import { source } from "@/lib/source"
import { mdxComponents } from "@/mdx-components"
import { DocsContent } from "@/components/docs-content"
import { DocsSidebar } from "@/components/docs-sidebar"

export const revalidate = false
export const dynamic = "force-static"

export function generateMetadata() {
  const page = source.getPage([])
  return {
    title: page?.data.title,
    description: page?.data.description,
  }
}

export default function KnowledgeIndexPage() {
  const page = source.getPage([])
  if (!page) {
    notFound()
  }

  const doc = page.data
  const MDX = doc.body

  return (
    <>
      <DocsSidebar tree={source.pageTree} />
      <DocsContent toc={doc.toc} hideToc>
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-bold text-foreground">{doc.title}</h1>
          {doc.description && (
            <p className="text-base leading-relaxed text-muted-foreground">
              {doc.description}
            </p>
          )}
        </div>

        <hr className="my-6 border-border" />

        <div className="prose-doc">
          <MDX components={mdxComponents} />
        </div>
      </DocsContent>
    </>
  )
}
