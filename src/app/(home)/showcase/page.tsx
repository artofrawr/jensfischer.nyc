import { ShowcaseGrid } from "@/components/showcase-grid"
import type { ShowcaseItem } from "@/components/showcase-cover"
import { getShowcaseCover, showcaseSource } from "@/lib/showcase-source"

export default function Showcase() {
  const items: ShowcaseItem[] = [...showcaseSource.getPages()]
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .flatMap((page) => {
      const cover = getShowcaseCover(page)
      if (!cover) return []
      return [
        {
          url: page.url,
          title: page.data.title,
          description: page.data.description,
          externalUrl: page.data.url,
          cover,
        },
      ]
    })

  return (
    <main className="container mx-auto px-6 pt-8">
      <div className="py-20">
        <h1 className="text-4xl font-normal pb-2">Showcase</h1>
        <p className="text-xl text-muted-foreground max-w-prose pb-12">
          A collection of projects &amp; products I&apos;ve shipped.
        </p>
        <ShowcaseGrid items={items} />
      </div>
    </main>
  )
}
