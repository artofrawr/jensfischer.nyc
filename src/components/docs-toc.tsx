"use client"

import { useActiveAnchor, type TOCItemType } from "fumadocs-core/toc"
import { Box, Flex, Text, chakra } from "@chakra-ui/react"

interface DocsTocProps {
  toc: TOCItemType[]
}

export function DocsToc({ toc }: DocsTocProps) {
  const activeAnchor = useActiveAnchor()

  if (toc.length === 0) return null

  return (
    <chakra.aside
      position="sticky"
      top="calc({sizes.header} + 1px)"
      zIndex={30}
      display={{ base: "none", xl: "block" }}
      h="calc(100svh - {sizes.header} - 1px)"
      w="toc"
      flexShrink={0}
    >
      <chakra.nav
        h="full"
        overflowY="auto"
        overscrollBehavior="contain"
        py={8}
        pe={4}
        ps={4}
      >
        <Text mb={2} fontSize="13px" fontWeight="semibold" color="foreground">
          On This Page
        </Text>
        <Flex
          as="ul"
          position="relative"
          direction="column"
          listStyleType="none"
        >
          {toc.map((item) => {
            const id = item.url.slice(1)
            const isActive = activeAnchor === id
            const depth = item.depth - 2

            return (
              <li key={item.url}>
                <chakra.a
                  href={item.url}
                  display="block"
                  borderLeftWidth="1px"
                  py={1}
                  fontSize="12.5px"
                  lineHeight="tall"
                  transition="color 0.15s ease, border-color 0.15s ease"
                  ps={depth === 0 ? 3 : 6}
                  {...(isActive
                    ? {
                        borderColor: "primary",
                        fontWeight: "medium",
                        color: "foreground",
                      }
                    : {
                        color: "muted.foreground",
                        _hover: { color: "foreground" },
                      })}
                >
                  {item.title}
                </chakra.a>
              </li>
            )
          })}
        </Flex>
        <Box pt={4}>
          <Text mb={2} fontSize="13px" fontWeight="semibold" color="foreground">
            Share
          </Text>
        </Box>
      </chakra.nav>
    </chakra.aside>
  )
}
