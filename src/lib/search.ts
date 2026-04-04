import { source } from "@/lib/source"
import type { SearchableItem } from "@/components/command-menu"

/**
 * Extract all searchable pages from the fumadocs page tree.
 */
export function getSearchableItems(): SearchableItem[] {
  const pages = source.getPages()

  return pages.map((page) => {
    const segments = page.url.split("/").filter(Boolean)
    const group =
      segments.length > 2
        ? segments[1].charAt(0).toUpperCase() + segments[1].slice(1)
        : "Documentation"

    return {
      title: page.data.title,
      url: page.url,
      description: page.data.description,
      group,
    }
  })
}
