import { ShowcaseGrid } from "@/components/showcase-grid"
import type { ShowcaseItem } from "@/components/showcase-cover"
import { getShowcaseCover, showcaseSource } from "@/lib/showcase-source"
import { source } from "@/lib/source"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ArrowRightIcon } from "lucide-react"

export default function Home() {
  const fontLarge =
    "font-semibold font-headline tracking-tight text-6xl leading-[1.2]"

  const recentDocs = [...source.getPages()]
    .filter((page) => page.path !== "index.mdx" && page.data.lastModified)
    .sort(
      (a, b) =>
        (b.data.lastModified?.getTime() ?? 0) -
        (a.data.lastModified?.getTime() ?? 0),
    )
    .slice(0, 8)

  const items: ShowcaseItem[] = [...showcaseSource.getPages()]
    .filter((page) => page.data.featured)
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
          coverLinkHide: page.data.coverLinkHide,
          featured: page.data.featured,
        },
      ]
    })

  return (
    <main className="container mx-auto px-6">
      <div className={cn("py-40 mx-auto", fontLarge)}>
        <p>
          Hey! I&apos;m Jens Fischer, a full stack product engineer and
          entrepeneur based in NYC.
        </p>
        <p className="text-ring">
          I take pride in user experiences that are built with attention to
          detail.
        </p>
      </div>

      <div className="pb-30">
        <div className="flex justify-between mb-6">
          <h2 className={cn(fontLarge, "text-xl")}>Recent Writing</h2>
          <a
            href="/knowledge"
            className="group -mr-3 flex items-center rounded-md px-3 py-1.5 transition-colors hover:bg-muted"
          >
            <span className="text-md">View all</span>
            <ArrowRightIcon className="pl-2 size-6 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l">
          {recentDocs.map((page) => (
            <Link
              key={page.url}
              href={page.url}
              className="group flex flex-col gap-2 border-r border-b p-8 transition-colors hover:bg-muted"
            >
              <h3 className="font-headline font-semibold tracking-tight">
                {page.data.title}
              </h3>
              {page.data.description && (
                <p className="text-sm text-ring line-clamp-3">
                  {page.data.description}
                </p>
              )}
              {page.data.lastModified && (
                <p className="mt-auto pt-2 text-sm text-ring">
                  {page.data.lastModified.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className="pb-30">
        <div className="flex justify-between mb-6">
          <h2 className={cn(fontLarge, "text-xl")}>Selected Work</h2>
          <a
            href="/knowledge"
            className="group -mr-3 flex items-center rounded-md px-3 py-1.5 transition-colors hover:bg-muted"
          >
            <span className="text-md">View all</span>
            <ArrowRightIcon className="pl-2 size-6 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
        <ShowcaseGrid items={items} />
      </div>

      <section className="py-20 mx-auto">
        <p className={cn("pb-20", fontLarge, "text-ring")}>
          Over the years I've had the privilege of working with and learning
          from startups, big tech and all points in between.
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
