"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { MoonIcon, SunIcon } from "lucide-react"

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
    <button
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={toggle}
      className="relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer items-center rounded-full border border-border bg-muted transition-colors"
    >
      <span
        className="pointer-events-none absolute left-0.5 flex size-4 items-center justify-center rounded-full bg-background text-foreground shadow-sm transition-transform duration-150 ease-in-out data-[state=checked]:translate-x-[18px]"
        data-state={checked ? "checked" : "unchecked"}
      >
        <SunIcon className="size-2.5 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
        <MoonIcon className="absolute size-2.5 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
      </span>
    </button>
  )
}
