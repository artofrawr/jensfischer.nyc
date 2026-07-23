import { notFound } from "next/navigation"
import { Box, Flex, Text } from "@chakra-ui/react"

import { source } from "@/lib/source"
import { mdxComponents } from "@/mdx-components"
import { DocsContent } from "@/components/docs-content"
import { DocsSidebar } from "@/components/docs-sidebar"
import { KnowledgeBreadcrumb } from "@/components/knowledge-breadcrumb"
import { H1, Hr, Link, Span } from "@/components/ui/styled"

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

        <Flex direction="column" gap={2}>
          <H1 fontSize="28px" fontWeight="bold" color="foreground">
            {title}
          </H1>
          {description && (
            <Text textStyle="md" lineHeight="tall" color="muted.foreground">
              {description}
            </Text>
          )}
        </Flex>

        {Intro && (
          <Box className="prose-doc" mt={6}>
            <Intro components={mdxComponents} />
          </Box>
        )}

        <Hr my={6} borderColor="border" />

        <Flex
          as="ul"
          direction="column"
          listStyleType="none"
          css={{
            "& > li + li": { borderTopWidth: "1px", borderColor: "border" },
          }}
        >
          {articles.map((article) => (
            <li key={article.url}>
              <Link
                href={article.url}
                className="group"
                display="flex"
                flexDirection="column"
                gap={1}
                py={4}
              >
                <Span
                  fontWeight="medium"
                  color="foreground"
                  transition="color 0.15s ease"
                  _groupHover={{ color: "primary" }}
                >
                  {article.data.title}
                </Span>
                {article.data.description && (
                  <Span textStyle="sm" color="muted.foreground">
                    {article.data.description}
                  </Span>
                )}
              </Link>
            </li>
          ))}
        </Flex>
      </DocsContent>
    </>
  )
}
