"use client"

import * as React from "react"
import { useServerInsertedHTML } from "next/navigation"
import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"

/**
 * Emotion renders its `<style>` tags inline during SSR but injects them into
 * <head> on the client, which makes the server HTML and the client tree
 * disagree and forces React to re-render the whole page after hydration.
 *
 * Putting the cache in "compat" mode stops the inline tags; the collected
 * styles are flushed into <head> through Next's `useServerInsertedHTML`.
 */
export function EmotionRegistry({ children }: { children: React.ReactNode }) {
  const [{ cache, flush }] = React.useState(() => {
    const cache = createCache({ key: "css" })
    cache.compat = true

    const prevInsert = cache.insert
    let inserted: string[] = []

    cache.insert = (...args) => {
      const serialized = args[1]
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name)
      }
      return prevInsert(...args)
    }

    const flush = () => {
      const prev = inserted
      inserted = []
      return prev
    }

    return { cache, flush }
  })

  useServerInsertedHTML(() => {
    const names = flush()
    if (names.length === 0) return null

    let styles = ""
    for (const name of names) {
      styles += cache.inserted[name]
    }

    return (
      <style
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    )
  })

  return <CacheProvider value={cache}>{children}</CacheProvider>
}
