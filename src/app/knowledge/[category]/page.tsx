import Link from "next/link"
import { notFound } from "next/navigation"

import { source } from "@/lib/source"
import { mdxComponents } from "@/mdx-components"
import { DocsContent } from "@/components/docs-content"
import { DocsSidebar } from "@/components/docs-sidebar"
import { KnowledgeBreadcrumb } from "@/components/knowledge-breadcrumb"

type PageTree = typeof source.pageTree
type PageTreeNode = PageTree["children"][number]

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

// Collect the URLs under a category in page-tree order, which mirrors the
// order declared in meta.json (recursing into subfolders).
function orderedUrlsForCategory(category: string): string[] {
  const prefix = `/knowledge/${category}/`
  const urls: string[] = []
  const seen = new Set<string>()

  const push = (url: string) => {
    if (url.startsWith(prefix) && !seen.has(url)) {
      seen.add(url)
      urls.push(url)
    }
  }

  const walk = (nodes: PageTreeNode[]) => {
    for (const node of nodes) {
      if (node.type === "page") {
        push(node.url)
      } else if (node.type === "folder") {
        if (node.index) push(node.index.url)
        walk(node.children)
      }
    }
  }

  walk(source.pageTree.children)
  return urls
}

export function generateStaticParams() {
  const categories = new Set<string>()
  for (const page of source.getPages()) {
    if (page.slugs.length >= 1) categories.add(page.slugs[0])
  }
  return [...categories].map((category) => ({ category }))
}

export async function generateMetadata(props: {
  params: Promise<{ category: string }>
}) {
  const { category } = await props.params
  const intro = source.getPage([category])
  return {
    title: intro?.data.title ?? titleCase(category),
    description: intro?.data.description,
  }
}

function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export default async function CategoryPage(props: {
  params: Promise<{ category: string }>
}) {
  const { category } = await props.params

  const byUrl = new Map(source.getPages().map((page) => [page.url, page]))
  const articles = orderedUrlsForCategory(category)
    .map((url) => byUrl.get(url))
    .filter((page) => page !== undefined)

  if (articles.length === 0) {
    notFound()
  }

  const intro = source.getPage([category])
  const title = intro?.data.title ?? titleCase(category)
  const description = intro?.data.description
  const Intro = intro?.data.body

  return (
    <>
      <DocsSidebar tree={source.pageTree} />
      <DocsContent toc={[]} hideToc>
        <KnowledgeBreadcrumb items={[{ name: title }]} />

        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-bold text-foreground">{title}</h1>
          {description && (
            <p className="text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        {Intro && (
          <div className="prose-doc mt-6">
            <Intro components={mdxComponents} />
          </div>
        )}

        <hr className="my-6 border-border" />

        <ul className="flex flex-col divide-y divide-border">
          {articles.map((article) => (
            <li key={article.url}>
              <Link
                href={article.url}
                className="group flex flex-col gap-1 py-4 transition-colors"
              >
                <span className="font-medium text-foreground group-hover:text-primary">
                  {article.data.title}
                </span>
                {article.data.description && (
                  <span className="text-sm text-muted-foreground">
                    {article.data.description}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </DocsContent>
    </>
  )
}
