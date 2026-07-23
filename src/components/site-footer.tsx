import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react"

import { PageContainer } from "@/components/ui/page-container"
import { showcaseSource } from "@/lib/showcase-source"
import { A, Footer, H3, Link } from "@/components/ui/styled"

type FooterLink = {
  label: string
  href: string
  external?: boolean
}

const linkStyles = {
  color: "paper/70",
  transition: "color 0.15s ease",
  _hover: { color: "paper" },
} as const

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: FooterLink[]
}) {
  return (
    <Flex direction="column" gap={4}>
      <H3
        textStyle="xs"
        textTransform="uppercase"
        letterSpacing="widest"
        color="paper/40"
      >
        {title}
      </H3>
      <Flex as="ul" direction="column" gap={3} listStyleType="none">
        {links.map((link) => (
          <li key={link.href + link.label}>
            {link.external ? (
              <A
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                {...linkStyles}
              >
                {link.label}
              </A>
            ) : (
              <Link href={link.href} {...linkStyles}>
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </Flex>
    </Flex>
  )
}

function SiteFooter() {
  const showcaseLinks: FooterLink[] = [...showcaseSource.getPages()]
    .filter((page) => page.data.featured)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map((page) => ({ label: page.data.title, href: page.url }))

  const knowledgeLinks: FooterLink[] = [
    { label: "Tech", href: "/knowledge/tech" },
    { label: "Product", href: "/knowledge/product" },
    { label: "Misc", href: "/knowledge/misc" },
  ]

  const connectLinks: FooterLink[] = [
    { label: "About", href: "/about" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/jensfischer-nyc/",
      external: true,
    },
    { label: "GitHub", href: "https://github.com/artofrawr", external: true },
  ]

  return (
    // The footer keeps a dark surface in both color modes, so it uses the fixed
    // ink/paper tokens rather than the inverting background/foreground pair.
    <Footer
      bg="ink"
      color="paper"
      _dark={{ borderTopWidth: "1px", borderColor: "paper/10" }}
    >
      <PageContainer px={6} py={20}>
        <Grid
          templateColumns={{
            base: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
            lg: "2fr 1fr 1fr 1fr",
          }}
          gap={12}
        >
          <GridItem colSpan={{ base: 2, md: 3, lg: 1 }} maxW="xs">
            <Box
              fontFamily="headline"
              textStyle="lg"
              fontWeight="semibold"
              letterSpacing="tight"
            >
              Jens Fischer
            </Box>
            <Text mt={4} textStyle="sm" color="paper/60">
              Full stack product engineer and entrepreneur based in NYC. Over
              two decades building digital experiences and products at the
              intersection of design and engineering.
            </Text>
          </GridItem>

          <FooterColumn title="Showcase" links={showcaseLinks} />
          <FooterColumn title="Knowledge" links={knowledgeLinks} />
          <FooterColumn title="Connect" links={connectLinks} />
        </Grid>

        <Flex
          mt={16}
          direction={{ base: "column", sm: "row" }}
          justify={{ sm: "space-between" }}
          gap={2}
          borderTopWidth="1px"
          borderColor="paper/15"
          pt={8}
          fontFamily="mono"
          textStyle="sm"
          color="paper/50"
        >
          <span>© 2026 Jens Fischer</span>
          <span>Built with attention to detail.</span>
        </Flex>
      </PageContainer>
    </Footer>
  )
}

export { SiteFooter }
