"use client"

import { AnchorProvider, type TOCItemType } from "fumadocs-core/toc"
import { Box, Flex } from "@chakra-ui/react"

import { DocsToc } from "@/components/docs-toc"

interface DocsContentProps {
  toc: TOCItemType[]
  hideToc?: boolean
  children: React.ReactNode
}

export function DocsContent({ toc, hideToc, children }: DocsContentProps) {
  return (
    <AnchorProvider toc={toc}>
      <Flex minW={0} flex="1" align="stretch">
        <Box
          minW={0}
          flex="1"
          py={8}
          ps={{ base: 6, lg: 10 }}
          pe={hideToc ? 6 : { base: 6, lg: 10 }}
        >
          <Box maxW={hideToc ? undefined : "688px"}>{children}</Box>
        </Box>
        {!hideToc && <DocsToc toc={toc} />}
      </Flex>
    </AnchorProvider>
  )
}
