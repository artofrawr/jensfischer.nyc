import * as React from "react"
import Image, { type StaticImageData } from "next/image"
import { AspectRatio, Box, Flex } from "@chakra-ui/react"

import { CodeBlock } from "@/components/code-block"
import { PageContainer } from "@/components/ui/page-container"
import {
  A,
  Blockquote,
  Code,
  H2,
  H3,
  H4,
  Hr,
  Img,
  Li,
  Link,
  Ol,
  P,
  Strong,
  Table,
  Td,
  Th,
  Tr,
  Ul,
} from "@/components/ui/styled"

const headingStyles = {
  scrollMarginTop: 28,
  fontWeight: "medium",
  letterSpacing: "tight",
} as const

export const mdxComponents = {
  h2: (props: React.ComponentProps<"h2">) => (
    <H2
      mt={10}
      textStyle="xl"
      {...headingStyles}
      css={{ "&:first-child": { mt: 0 } }}
      {...props}
    />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <H3 mt={8} textStyle="lg" {...headingStyles} {...props} />
  ),
  h4: (props: React.ComponentProps<"h4">) => (
    <H4 mt={8} textStyle="md" {...headingStyles} {...props} />
  ),
  a: (props: React.ComponentProps<"a">) => (
    <A
      fontWeight="medium"
      textDecoration="underline"
      textUnderlineOffset="4px"
      {...props}
    />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <P
      lineHeight="tall"
      css={{ "&:not(:first-child)": { mt: 6 } }}
      {...props}
    />
  ),
  strong: (props: React.ComponentProps<"strong">) => (
    <Strong fontWeight="medium" {...props} />
  ),
  ul: (props: React.ComponentProps<"ul">) => (
    <Ul my={6} ml={6} listStyleType="disc" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <Ol my={6} ml={6} listStyleType="decimal" {...props} />
  ),
  li: (props: React.ComponentProps<"li">) => <Li mt={2} {...props} />,
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <Blockquote
      mt={6}
      borderLeftWidth="2px"
      pl={6}
      fontStyle="italic"
      {...props}
    />
  ),
  hr: (props: React.ComponentProps<"hr">) => (
    <Hr my={{ base: 4, md: 8 }} {...props} />
  ),
  table: (props: React.ComponentProps<"table">) => (
    <Box
      my={6}
      w="full"
      overflowY="auto"
      borderRadius="xl"
      borderWidth="1px"
      borderColor="border"
    >
      <Table
        position="relative"
        w="full"
        overflow="hidden"
        border="none"
        textStyle="sm"
        {...props}
      />
    </Box>
  ),
  tr: (props: React.ComponentProps<"tr">) => (
    <Tr m={0} borderBottomWidth="1px" {...props} />
  ),
  th: (props: React.ComponentProps<"th">) => (
    <Th
      px={4}
      py={2}
      textAlign="left"
      fontWeight="bold"
      css={{
        "&[align=center]": { textAlign: "center" },
        "&[align=right]": { textAlign: "right" },
      }}
      {...props}
    />
  ),
  td: (props: React.ComponentProps<"td">) => (
    <Td
      px={4}
      py={2}
      textAlign="left"
      css={{
        "&[align=center]": { textAlign: "center" },
        "&[align=right]": { textAlign: "right" },
      }}
      {...props}
    />
  ),
  code: (props: React.ComponentProps<"code">) => {
    if (typeof props.children === "string" && !("data-language" in props)) {
      return (
        <Code
          position="relative"
          borderRadius="md"
          bg="muted"
          px="0.3rem"
          py="0.2rem"
          fontFamily="mono"
          fontSize="0.8rem"
          wordBreak="break-word"
          {...props}
        />
      )
    }
    return <code {...props} />
  },
  pre: (props: React.ComponentProps<"pre">) => <CodeBlock {...props} />,
  img: ({
    src,
    alt,
    ...props
  }: Omit<React.ComponentProps<"img">, "src"> & {
    src?: string | StaticImageData
  }) => {
    const styles = {
      my: 8,
      h: "auto",
      w: "full",
      borderRadius: "lg",
    } as const

    if (src && typeof src === "object") {
      // next/image's `fill` prop collides with the CSS `fill` style prop, so
      // the optimized image is wrapped rather than styled directly.
      return (
        <Box {...styles} asChild>
          <Image
            src={src}
            alt={alt ?? ""}
            {...(props as Omit<
              React.ComponentProps<typeof Image>,
              "src" | "alt"
            >)}
          />
        </Box>
      )
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <Img src={src} alt={alt ?? ""} {...styles} {...props} />
    )
  },
  Link: (props: React.ComponentProps<typeof Link>) => (
    <Link
      fontWeight="medium"
      textDecoration="underline"
      textUnderlineOffset="4px"
      {...props}
    />
  ),
  // Layout primitives available to MDX content.
  Box,
  Flex,
  AspectRatio,
  PageContainer,
}
