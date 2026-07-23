import type { StaticImageData } from "next/image"
import { Flex } from "@chakra-ui/react"
import { A, ArrowRight, H2, Link, NextImg, Span } from "@/components/ui/styled"

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
  aspectRatio: "square",
  overflow: "hidden",
} as const

export function ShowCaseCover({
  url,
  title,
  externalUrl,
  cover,
  coverLinkHide,
}: ShowcaseItem) {
  const isExternal = Boolean(externalUrl)

  const inner = (
    <>
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
      {!coverLinkHide && (
        <Flex
          pointerEvents="none"
          position="absolute"
          inset={0}
          direction="column"
          justify="flex-start"
          p={10}
        >
          <H2
            display="flex"
            alignItems="center"
            gap={2}
            fontFamily="headline"
            fontWeight="semibold"
            color="white"
            textStyle="2xl"
          >
            <Span
              transition="all 0.3s ease-out"
              _groupHover={{ transform: "translateX(0.5rem)" }}
            >
              {title}
            </Span>
            <ArrowRight
              boxSize={5}
              opacity={0}
              transform="translateX(-0.25rem)"
              transition="all 0.3s ease-out"
              _groupHover={{ transform: "translateX(0.5rem)", opacity: 1 }}
            />
          </H2>
        </Flex>
      )}
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
