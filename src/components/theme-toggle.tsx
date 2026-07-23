"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "lucide-react"
import { chakra } from "@chakra-ui/react"

const Sun = chakra(SunIcon)
const Moon = chakra(MoonIcon)

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [checked, setChecked] = React.useState(isDark)

  React.useEffect(() => {
    setChecked(isDark)
  }, [isDark])

  function toggle() {
    setChecked(!checked)
    setTimeout(() => setTheme(checked ? "light" : "dark"), 150)
  }

  return (
    <chakra.button
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={toggle}
      position="relative"
      display="inline-flex"
      h="1.375rem"
      w={10}
      flexShrink={0}
      cursor="pointer"
      alignItems="center"
      borderRadius="full"
      borderWidth="1px"
      borderColor="border"
      bg="muted"
      transition="background-color 0.15s ease"
    >
      <chakra.span
        pointerEvents="none"
        position="absolute"
        left={0.5}
        display="flex"
        boxSize={4}
        alignItems="center"
        justifyContent="center"
        borderRadius="full"
        bg="background"
        color="foreground"
        boxShadow="0 1px 2px 0 rgb(0 0 0 / 0.05)"
        transition="transform 0.15s ease-in-out"
        transform={checked ? "translateX(18px)" : "translateX(0)"}
      >
        <Sun
          boxSize={2.5}
          transition="transform 0.15s ease"
          transform="scale(1) rotate(0deg)"
          _dark={{ transform: "scale(0) rotate(-90deg)" }}
        />
        <Moon
          position="absolute"
          boxSize={2.5}
          transition="transform 0.15s ease"
          transform="scale(0) rotate(90deg)"
          _dark={{ transform: "scale(1) rotate(0deg)" }}
        />
      </chakra.span>
    </chakra.button>
  )
}
