import { notFound } from "next/navigation"
import { getBreadcrumbItems } from "fumadocs-core/breadcrumb"

import { source } from "@/lib/source"
import { mdxComponents } from "@/mdx-components"
import { DocsContent } from "@/components/docs-content"
import { KnowledgeBreadcrumb } from "@/components/knowledge-breadcrumb"
import { DocsSidebar } from "@/components/docs-sidebar"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return source
    .getPages()
    .filter((page) => page.slugs.length >= 2)
    .map((page) => ({
      category: page.slugs[0],
      slug: page.slugs.slice(1),
    }))
}

export async function generateMetadata(props: {
  params: Promise<{ category: string; slug: string[] }>
}) {
  const { category, slug } = await props.params
  const page = source.getPage([category, ...slug])

  if (!page) {
    notFound()
  }

  return {
    title: page.data.title,
    description: page.data.description,
  }
}

export default async function ArticlePage(props: {
  params: Promise<{ category: string; slug: string[] }>
}) {
  const { category, slug } = await props.params
  const page = source.getPage([category, ...slug])
  if (!page) {
    notFound()
  }

  const doc = page.data
  const MDX = doc.body
  const breadcrumbs = getBreadcrumbItems(page.url, source.pageTree, {
    includePage: true,
  })

  return (
    <>
      <DocsSidebar tree={source.pageTree} />
      <DocsContent toc={doc.toc}>
        <KnowledgeBreadcrumb
          items={breadcrumbs.map((item) => ({
            name: item.name,
            url: item.url,
          }))}
        />

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
