import { Box } from "@chakra-ui/react"

import { PageContainer } from "@/components/ui/page-container"

export default function KnowledgeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Box borderStyle="dashed" borderBottomWidth="1px" borderColor="border">
      <PageContainer
        borderStyle="dashed"
        borderInlineWidth="1px"
        borderColor="border"
        bg="background"
        display="flex"
        flex="1"
      >
        {children}
      </PageContainer>
    </Box>
  )
}
