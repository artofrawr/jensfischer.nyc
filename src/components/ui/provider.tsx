"use client"

import { ChakraProvider } from "@chakra-ui/react"
import { ThemeProvider } from "next-themes"

import { EmotionRegistry } from "@/components/ui/emotion-registry"
import { system } from "@/theme"

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <EmotionRegistry>
      <ChakraProvider value={system}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </ChakraProvider>
    </EmotionRegistry>
  )
}
