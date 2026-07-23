import { Box, Text } from "@chakra-ui/react"

import { ShowcaseGrid } from "@/components/showcase-grid"
import type { ShowcaseItem } from "@/components/showcase-cover"
import { PageContainer } from "@/components/ui/page-container"
import { getShowcaseCover, showcaseSource } from "@/lib/showcase-source"
import { H1 } from "@/components/ui/styled"

export default function Showcase() {
  const items: ShowcaseItem[] = [...showcaseSource.getPages()]
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .flatMap((page) => {
      const cover = getShowcaseCover(page)
      if (!cover) return []
      return [
        {
          url: page.url,
          title: page.data.title,
          description: page.data.description,
          externalUrl: page.data.url,
          cover,
        },
      ]
    })

  return (
    <PageContainer as="main" px={6} pt={8}>
      <Box py={20}>
        <H1
          textStyle="4xl"
          letterSpacing="tighter"
          fontFamily="headline"
          fontWeight="semibold"
          pb={2}
        >
          Showcase
        </H1>
        <Text textStyle="xl" color="muted.foreground" maxW="prose" pb={12}>
          A collection of case studies and tech demos for projects and products
          I&apos;ve shipped.
        </Text>
        <ShowcaseGrid items={items} />
      </Box>
    </PageContainer>
  )
}
