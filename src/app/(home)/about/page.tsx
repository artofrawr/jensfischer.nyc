import { Box, Flex, Grid, SimpleGrid, Text } from "@chakra-ui/react"
import { H2, H3, Link, Main, Section } from "@/components/ui/styled"

const timeline = [
  {
    period: "2009 – Present",
    role: "Founder",
    org: "Profound",
    summary:
      "Profound is a web design & development studio based in New York City, with a focus on innovative user experiences for a modern web.",
  },
  {
    period: "2021 – 2026",
    role: "Technical Director",
    org: "Heat Waves",
    summary: "",
  },
  {
    period: "2020 – 2021",
    role: "Co-Founder & CTO",
    org: "HelloHerd",
    summary:
      "Herd is a market network for support groups, that makes it easy for therapists to create and run group sessions and for others to find and book them online.",
  },
  {
    period: "2016 – 2019",
    role: "Technical Director",
    org: "Something New",
    summary:
      "Responsible for shaping the technical strategy and vision for the company, supporting business development and overseeing successful engagement delivery. Hands-on tasks included prototyping, architectural and sprint planning, code contribution and review, documentation, and developing systems and tooling for improved workflows towards best practices.",
  },
  {
    period: "2011 – 2015",
    role: "Tech Lead",
    org: "B-Reel",
    summary:
      "Contractor on a tech lead level. Directly involved with pitches, client meetings, prototyping and full-stack development of campaigns, applications, microsites, and games for international brands.",
  },
  {
    period: "2009 – 2010",
    role: "Senior Interactive Developer",
    org: "Fantasy Interactive",
    summary: "TBD",
  },
  {
    period: "2006 – 2008",
    role: "Developer",
    org: "Firstborn",
    summary: "TBD",
  },
]

const principles = [
  {
    title: "Ship to learn",
    body: "Real users beat speculation. An MVP in production teaches more in a week than a polished platform in staging teaches in a quarter.",
  },
  {
    title: "Design is the moat",
    body: "Model access is commoditizing. The differentiator is judgment about what to build, what to cut and what good feels like.",
  },
  {
    title: "Generalists win in the AI era",
    body: "Tools have collapsed specialty boundaries. The most valuable engineer is one who can move from schema to API to UI to eval without changing seats.",
  },
  {
    title: "Lead by writing it down",
    body: "If a decision isn't written, it didn't happen. Documentation scales; meetings don't.",
  },
]

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <H2 textStyle="2xl" fontWeight="medium" pb={2}>
      {children}
    </H2>
  )
}

export default function About() {
  return (
    <Main maxW="64rem" mx="auto" px={8} pt={8}>
      <Box py={20} maxW="64rem" mx="auto">
        <Text textStyle="4xl" fontWeight="normal" lineHeight="tall">
          I&apos;ve spent over two decades building digital experiences and
          products at the intersection of design, engineering and - most
          recently - AI. I&apos;ve led teams, shipped to millions of users, and
          now spend most of my time building AI-native products.
        </Text>
      </Box>

      <Section py={12} maxW="64rem" mx="auto">
        <SectionHeading>How I work</SectionHeading>
        <Text textStyle="xl" color="muted.foreground" maxW="prose" pb={10}>
          Some guiding principles.
        </Text>
        <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
          {principles.map((p) => (
            <Box
              key={p.title}
              borderRadius="lg"
              borderWidth="1px"
              borderColor="border"
              p={5}
            >
              <H3 textStyle="lg" fontWeight="medium" color="foreground" pb={2}>
                {p.title}
              </H3>
              <Text textStyle="sm" color="muted.foreground" lineHeight="tall">
                {p.body}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Section>

      <Section py={12} maxW="64rem" mx="auto">
        <SectionHeading>Timeline</SectionHeading>
        <Text textStyle="xl" color="muted.foreground" maxW="prose" pb={10}>
          The shape of my career so far.
        </Text>
        <Flex direction="column" gap={6}>
          {timeline.map((entry) => (
            <Grid
              key={`${entry.period}-${entry.org}`}
              templateColumns={{ base: "1fr", sm: "200px 1fr" }}
              gap={{ base: 2, sm: 8 }}
              borderBottomWidth="1px"
              borderColor="border"
              pb={6}
              css={{ "&:last-child": { borderBottomWidth: 0 } }}
            >
              <Box
                textStyle="sm"
                fontFamily="mono"
                color="muted.foreground"
                pt={1}
              >
                {entry.period}
              </Box>
              <Box>
                <Box textStyle="lg" fontWeight="medium" color="foreground">
                  {entry.role}
                </Box>
                <Box textStyle="sm" color="muted.foreground" pb={2}>
                  {entry.org}
                </Box>
                <Text
                  textStyle="sm"
                  color="muted.foreground"
                  lineHeight="tall"
                  maxW="prose"
                >
                  {entry.summary}
                </Text>
              </Box>
            </Grid>
          ))}
        </Flex>
      </Section>

      <Section py={12} maxW="64rem" mx="auto">
        <SectionHeading>Contact</SectionHeading>
        <Text
          textStyle="xl"
          color="muted.foreground"
          maxW="prose"
          pb={6}
          lineHeight="tall"
        >
          Reach out to connect or collaborate. You can reach me via{" "}
          <Link
            href="https://www.linkedin.com/in/jensfischer-nyc/"
            textDecoration="underline"
            textUnderlineOffset="4px"
            _hover={{ color: "foreground" }}
          >
            LinkedIn
          </Link>{" "}
          or Email.
        </Text>
      </Section>
    </Main>
  )
}
