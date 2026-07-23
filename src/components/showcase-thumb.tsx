import type { StaticImageData } from "next/image"
import { Box, Flex } from "@chakra-ui/react"
import { A, ArrowRight, H2, Link, NextImg } from "@/components/ui/styled"

export type ShowcaseItem = {
  url: string
  title: string
  description?: string
  externalUrl?: string
  cover: StaticImageData
  featured?: boolean
  coverLinkHide?: boolean
}

const cardStyles = {
  className: "group",
  position: "relative",
  display: "block",
} as const

export function ShowCaseThumb({
  url,
  title,
  externalUrl,
  cover,
  description,
}: ShowcaseItem) {
  const isExternal = Boolean(externalUrl)

  const inner = (
    <>
      {/* Property order matches ShowCaseCover's card styles so both resolve to
          the same generated class. */}
      <Box
        position="relative"
        display="block"
        aspectRatio="square"
        overflow="hidden"
      >
        <NextImg
          src={cover}
          alt={title}
          sizes="(min-width: 1024px) 100vw, (min-width: 640px) 100vw"
          placeholder="blur"
          display="block"
          boxSize="full"
          objectFit="cover"
          transition="transform 0.5s ease-out"
          _groupHover={{ transform: "scale(1.1)" }}
        />
      </Box>
      <Flex
        pointerEvents="none"
        position="relative"
        inset={0}
        direction="column"
        justify="flex-start"
        pt={4}
        pb={10}
      >
        <H2
          display="flex"
          alignItems="center"
          gap={2}
          fontFamily="headline"
          fontWeight="semibold"
          color="foreground"
          textStyle="2xl"
        >
          <span>{title}</span>
          <ArrowRight
            boxSize={5}
            opacity={0}
            transform="translateX(-0.25rem)"
            transition="all 0.3s ease-out"
            _groupHover={{ transform: "translateX(0)", opacity: 1 }}
          />
        </H2>
        <p>{description}</p>
      </Flex>
    </>
  )

  if (isExternal && externalUrl) {
    return (
      <A
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        {...cardStyles}
      >
        {inner}
      </A>
    )
  }

  return (
    <Link href={url} {...cardStyles}>
      {inner}
    </Link>
  )
}
