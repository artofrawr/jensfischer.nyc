import { notFound } from "next/navigation"
import { mdxComponents } from "@/mdx-components"

import { source } from "@/lib/source"
import { DocsContent } from "@/components/docs-content"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)

  if (!page) {
    notFound()
  }

  return {
    title: page.data.title,
    description: page.data.description,
  }
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) {
    notFound()
  }

  const doc = page.data
  const MDX = doc.body

  return (
    <DocsContent toc={doc.toc}>
      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-bold leading-tight tracking-tight text-foreground">
          {doc.title}
        </h1>
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
  )
}
