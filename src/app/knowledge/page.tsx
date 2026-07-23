import { notFound } from "next/navigation"
import { Box, Flex, Text } from "@chakra-ui/react"

import { source } from "@/lib/source"
import { mdxComponents } from "@/mdx-components"
import { DocsContent } from "@/components/docs-content"
import { DocsSidebar } from "@/components/docs-sidebar"
import { H1, Hr } from "@/components/ui/styled"

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
