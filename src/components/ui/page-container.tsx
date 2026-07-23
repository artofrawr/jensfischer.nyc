import { Box, type BoxProps } from "@chakra-ui/react"

/**
 * Mirrors Tailwind's `container mx-auto`: full width, capped at each
 * breakpoint's own min-width.
 */
export const containerMaxW = {
  base: "100%",
  sm: "40rem",
  md: "48rem",
  lg: "64rem",
  xl: "80rem",
  "2xl": "96rem",
} as const

export function PageContainer(props: BoxProps) {
  return <Box w="full" mx="auto" maxW={containerMaxW} {...props} />
}
