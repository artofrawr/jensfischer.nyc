import { Box, Flex, Grid, SimpleGrid, Text } from "@chakra-ui/react"

import { ShowCaseCover, type ShowcaseItem } from "@/components/showcase-cover"
import { PageContainer } from "@/components/ui/page-container"
import { getShowcaseCover, showcaseSource } from "@/lib/showcase-source"
import { source } from "@/lib/source"
import {
  A,
  ArrowRight,
  H2,
  H3,
  Img,
  Link,
  P,
  Section,
} from "@/components/ui/styled"

const headline = {
  fontWeight: "semibold",
  fontFamily: "headline",
  letterSpacing: "tighter",
  fontSize: "6xl",
  lineHeight: 1.2,
} as const

const clients = [
  { src: "/about/apple.svg", w: "1/3" },
  { src: "/about/google.svg", w: "1/2" },
  { src: "/about/microsoft.svg", w: "4/6" },
  { src: "/about/spotify.svg", w: "1/2" },
  { src: "/about/oscar.svg", w: "2/5" },
  { src: "/about/shopify.svg", w: "1/2" },
  { src: "/about/easports.svg", w: "1/3" },
  { src: "/about/cocacola.svg", w: "1/2" },
  { src: "/about/puma.svg", w: "2/5" },
  { src: "/about/nationwide.svg", w: "1/2" },
  { src: "/about/hotels.svg", w: "3/5" },
  { src: "/about/fox.svg", w: "1/3" },
  { src: "/about/htc.svg", w: "1/3" },
  { src: "/about/ibm.svg", w: "1/3" },
  { src: "/about/nationalgrid.svg", w: "2/3" },
  { src: "/about/hp.svg", w: "1/2" },
]

function ViewAllLink({ href }: { href: string }) {
  return (
    <A
      href={href}
      className="group"
      mr={-3}
      display="flex"
      alignItems="center"
      borderRadius="md"
      px={3}
      py={1.5}
      transition="background-color 0.15s ease"
      _hover={{ bg: "muted" }}
    >
      <span>View all</span>
      <ArrowRight
        pl={2}
        boxSize={6}
        transition="transform 0.15s ease"
        _groupHover={{ transform: "translateX(0.125rem)" }}
      />
    </A>
  )
}

export default function Home() {
  const recentDocs = [...source.getPages()]
    .filter((page) => page.path !== "index.mdx" && page.data.lastModified)
    .sort(
      (a, b) =>
        (b.data.lastModified?.getTime() ?? 0) -
        (a.data.lastModified?.getTime() ?? 0),
    )
    .slice(0, 8)

  const items: ShowcaseItem[] = [...showcaseSource.getPages()]
    .filter((page) => page.data.featured)
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
          coverLinkHide: page.data.coverLinkHide,
          featured: page.data.featured,
        },
      ]
    })

  return (
    <PageContainer as="main" px={6}>
      <Box py={40} mx="auto" {...headline}>
        <p>Hey! I&apos;m Jens, a product engineer from NYC.</p>
        <P color="ring">
          I take pride in user experiences that are built with attention to
          detail.
        </P>
      </Box>

      <Box pb="7.5rem">
        <Flex justify="space-between" mb={6}>
          <H2 {...headline} fontSize="xl" lineHeight={1.4}>
            Latest Updates
          </H2>
          <ViewAllLink href="/knowledge" />
        </Flex>

        <SimpleGrid
          columns={{ base: 1, sm: 2, lg: 4 }}
          borderTopWidth="1px"
          borderLeftWidth="1px"
        >
          {recentDocs.map((page) => (
            <Link
              key={page.url}
              href={page.url}
              display="flex"
              flexDirection="column"
              gap={2}
              borderRightWidth="1px"
              borderBottomWidth="1px"
              p={8}
              transition="background-color 0.15s ease"
              _hover={{ bg: "muted" }}
            >
              <H3
                fontFamily="headline"
                fontWeight="semibold"
                letterSpacing="tight"
              >
                {page.data.title}
              </H3>
              {page.data.description && (
                <Text textStyle="sm" color="ring" lineClamp={3}>
                  {page.data.description}
                </Text>
              )}
              {page.data.lastModified && (
                <Text mt="auto" pt={2} textStyle="sm" color="ring">
                  {page.data.lastModified.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              )}
            </Link>
          ))}
        </SimpleGrid>
      </Box>

      <Box pb="7.5rem">
        <Flex justify="space-between" mb={6}>
          <H2 {...headline} fontSize="xl" lineHeight={1.4}>
            Selected Work
          </H2>
          <ViewAllLink href="/showcase" />
        </Flex>
        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={5}>
          {items.map((item) => (
            <ShowCaseCover key={item.url} {...item} />
          ))}
        </SimpleGrid>
      </Box>

      <Section py={20} mx="auto">
        <P pb={20} color="ring" {...headline}>
          Over the years I&apos;ve had the privilege of working with and
          learning from startups, big tech and all points in between.
        </P>
        <Grid
          className="client-logos"
          gridAutoFlow="row dense"
          templateColumns={{
            base: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          }}
        >
          {clients.map((client) => (
            <div key={client.src}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Img w={client.w} src={client.src} alt="" />
            </div>
          ))}
        </Grid>
      </Section>
    </PageContainer>
  )
}
