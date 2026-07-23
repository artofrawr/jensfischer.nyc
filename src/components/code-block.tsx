"use client"

import { Check, Copy } from "lucide-react"
import { useRef, useState } from "react"
import { chakra } from "@chakra-ui/react"

interface CodeBlockProps extends React.ComponentProps<"pre"> {
  title?: string
}

export function CodeBlock({ children, title, ...props }: CodeBlockProps) {
  const ref = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  const onCopy = () => {
    const text = ref.current?.textContent ?? ""
    void navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <chakra.figure
      className="group"
      position="relative"
      my={6}
      overflow="hidden"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="zinc.200"
      bg="zinc.50"
      _dark={{ borderColor: "zinc.800", bg: "#0a0a0a" }}
    >
      {title && (
        <chakra.figcaption
          borderBottomWidth="1px"
          borderColor="zinc.200"
          bg="zinc.100/60"
          px={4}
          py={2}
          fontFamily="mono"
          textStyle="xs"
          color="zinc.600"
          _dark={{
            borderColor: "zinc.800",
            bg: "zinc.900/40",
            color: "zinc.400",
          }}
        >
          {title}
        </chakra.figcaption>
      )}
      <chakra.button
        type="button"
        onClick={onCopy}
        aria-label={copied ? "Copied" : "Copy code"}
        position="absolute"
        right={3}
        top={title ? "calc(2.25rem + 0.5rem)" : 3}
        zIndex={10}
        display="inline-flex"
        boxSize={7}
        alignItems="center"
        justifyContent="center"
        borderRadius="md"
        color="zinc.500"
        cursor="pointer"
        transition="background-color 0.15s ease, color 0.15s ease"
        _hover={{ bg: "zinc.200/60", color: "zinc.900" }}
        _focusVisible={{
          outline: "none",
          boxShadow: "0 0 0 2px var(--jf-colors-zinc-400)",
        }}
        _dark={{
          color: "zinc.400",
          _hover: { bg: "zinc.800/60", color: "zinc.50" },
        }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </chakra.button>
      <chakra.pre
        ref={ref}
        overflowX="auto"
        px={4}
        py={4}
        fontFamily="mono"
        fontSize="15px"
        lineHeight="tall"
        css={{ "& code": { fontFamily: "mono" } }}
        {...props}
      >
        {children}
      </chakra.pre>
    </chakra.figure>
  )
}
