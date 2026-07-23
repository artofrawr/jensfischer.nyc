import { chakra } from "@chakra-ui/react"
import { A, Svg } from "@/components/ui/styled"

/**
 * Small icon link used in the header actions. Takes the raw SVG path so the
 * brand marks stay inline (no icon dependency for two logos).
 */
export function SocialLink({
  href,
  label,
  viewBox,
  path,
}: {
  href: string
  label: string
  viewBox: string
  path: string
}) {
  return (
    <A
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      borderRadius="md"
      p={1.5}
      color="foreground"
      transition="background-color 0.15s ease"
      _hover={{ bg: "muted" }}
      aria-label={label}
    >
      <Svg fill="currentColor" viewBox={viewBox} boxSize={5} aria-label={label}>
        <path d={path} />
      </Svg>
    </A>
  )
}
