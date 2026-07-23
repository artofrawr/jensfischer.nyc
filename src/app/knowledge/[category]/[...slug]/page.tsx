import { notFound } from "next/navigation"
import { getBreadcrumbItems } from "fumadocs-core/breadcrumb"
import { Box, Flex, Text } from "@chakra-ui/react"

import { source } from "@/lib/source"
import { mdxComponents } from "@/mdx-components"
import { DocsContent } from "@/components/docs-content"
import { KnowledgeBreadcrumb } from "@/components/knowledge-breadcrumb"
import { DocsSidebar } from "@/components/docs-sidebar"
import { H1, Hr } from "@/components/ui/styled"

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

        <Flex direction="column" gap={2}>
          <H1 fontSize="28px" fontWeight="bold" color="foreground">
            {doc.title}
          </H1>
          {doc.description && (
            <Text textStyle="md" lineHeight="tall" color="muted.foreground">
              {doc.description}
            </Text>
          )}
        </Flex>

        <Hr my={6} borderColor="border" />

        <Box className="prose-doc">
          <MDX components={mdxComponents} />
        </Box>
      </DocsContent>
    </>
  )
}
