import { notFound } from "next/navigation"
import { Text } from "@chakra-ui/react"

import { mdxComponents } from "@/mdx-components"
import { PageContainer } from "@/components/ui/page-container"
import { showcaseSource } from "@/lib/showcase-source"
import { H1 } from "@/components/ui/styled"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return showcaseSource
    .getPages()
    .filter((page) => !page.data.url)
    .map((page) => ({ slug: page.slugs.join("/") }))
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const page = showcaseSource.getPage([params.slug])
  if (!page) notFound()

  return {
    title: `${page.data.title} | Showcase | Jens Fischer`,
    description: page.data.description,
  }
}

export default async function ShowcaseCaseStudy(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const page = showcaseSource.getPage([params.slug])
  if (!page || page.data.url) notFound()

  const doc = page.data
  const MDX = doc.body

  return (
    <article>
      <PageContainer
        as="header"
        mt={8}
        display="flex"
        flexDirection="column"
        gap={2}
        px={6}
        pb={20}
      >
        {doc.tags?.length && (
          <Text textStyle="sm" fontFamily="mono" color="muted.foreground">
            {doc.tags.join(" · ")}
          </Text>
        )}
        <H1
          fontSize="8xl"
          lineHeight={1}
          fontWeight="semibold"
          fontFamily="headline"
          letterSpacing="tight"
          color="foreground"
        >
          {doc.title}
        </H1>
        {doc.description && (
          <Text textStyle="xl" color="muted.foreground" maxW="prose">
            {doc.description}
          </Text>
        )}
      </PageContainer>

      <MDX components={mdxComponents} />
    </article>
  )
}
