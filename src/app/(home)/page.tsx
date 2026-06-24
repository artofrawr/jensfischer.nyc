import { ShowcaseGrid } from "@/components/showcase-grid"
import type { ShowcaseItem } from "@/components/showcase-cover"
import { getShowcaseCover, showcaseSource } from "@/lib/showcase-source"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function Home() {
  const fontLarge =
    "font-semibold font-headline tracking-tight text-6xl leading-[1.2]"
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
    <main className="container mx-auto px-6">
      <div className={cn("py-20 mx-auto", fontLarge)}>
        <p>
          I&apos;m Jens Fischer, a product engineer and entrepeneur based out of
          NYC.
        </p>
        <p className="text-ring">
          I take pride in user experiences that are built with attention to
          detail.
        </p>
      </div>

      <div className="pb-20">
        <ShowcaseGrid items={items} />
      </div>

      <section className="py-20 mx-auto">
        <p className={cn("pb-20", fontLarge)}>
          Over the years I've had the privilege of working with - and learning
          from - startups, Fortune 500's and all points in between.
        </p>
        <div className="grid grid-flow-row-dense grid-cols-2 lg:grid-cols-4 client-logos">
          <div>
            <img className="w-1/3" src="/about/apple.svg" />
          </div>
          <div>
            <img className="w-1/2" src="/about/google.svg" />
          </div>
          <div>
            <img className="w-4/6" src="/about/microsoft.svg" />
          </div>
          <div>
            <img className="w-1/2" src="/about/spotify.svg" />
          </div>
          <div>
            <img className="w-2/5" src="/about/oscar.svg" />
          </div>
          <div>
            <img className="w-1/2" src="/about/shopify.svg" />
          </div>
          <div>
            <img className="w-1/3" src="/about/easports.svg" />
          </div>
          <div>
            <img className="w-1/2" src="/about/cocacola.svg" />
          </div>
          <div>
            <img className="w-2/5" src="/about/puma.svg" />
          </div>
          <div>
            <img className="w-1/2" src="/about/nationwide.svg" />
          </div>
          <div>
            <img className="w-3/5" src="/about/hotels.svg" />
          </div>
          <div>
            <img className="w-1/3" src="/about/fox.svg" />
          </div>
          <div>
            <img className="w-1/3" src="/about/htc.svg" />
          </div>
          <div>
            <img className="w-1/3" src="/about/ibm.svg" />
          </div>
          <div>
            <img className="w-2/3" src="/about/nationalgrid.svg" />
          </div>
          <div>
            <img className="w-1/2" src="/about/hp.svg" />
          </div>
        </div>
      </section>
    </main>
  )
}
