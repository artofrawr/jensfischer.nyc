import { ShowcaseGrid } from "@/components/showcase-grid"
import type { ShowcaseItem } from "@/components/showcase-cover"
import { getShowcaseCover, showcaseSource } from "@/lib/showcase-source"

export default function Home() {
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
    <main className="max-w-screen-lg mx-auto px-8 pt-8">
      <div className="text-4xl py-20 leading-relaxed max-w-screen-lg mx-auto">
        <div className="font-bold">Hey!</div>
        <p className="font-normal">
          I&apos;m Jens Fischer - a Tech Lead and product engineer based out of
          NYC. I take pride in user experiences that are built with attention to
          detail.
        </p>
      </div>
      <div className="pb-20">
        <ShowcaseGrid items={items} />
      </div>
    </main>
  )
}
