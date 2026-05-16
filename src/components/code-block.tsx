"use client"

import { Check, Copy } from "lucide-react"
import { useRef, useState } from "react"

import { cn } from "@/lib/utils"

interface CodeBlockProps extends React.ComponentProps<"pre"> {
  title?: string
}

export function CodeBlock({
  className,
  children,
  title,
  ...props
}: CodeBlockProps) {
  const ref = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  const onCopy = () => {
    const text = ref.current?.textContent ?? ""
    void navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <figure className="not-prose group relative my-6 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-[#0a0a0a]">
      {title && (
        <figcaption className="border-b border-zinc-200 bg-zinc-100/60 px-4 py-2 font-mono text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
          {title}
        </figcaption>
      )}
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? "Copied" : "Copy code"}
        className={cn(
          "absolute right-3 z-10 inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-200/60 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-50",
          title ? "top-[calc(2.25rem+0.5rem)]" : "top-3",
        )}
      >
        {copied ? (
          <Check className="h-3.5 w-3.5" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>
      <pre
        ref={ref}
        className={cn(
          "overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    </figure>
  )
}
