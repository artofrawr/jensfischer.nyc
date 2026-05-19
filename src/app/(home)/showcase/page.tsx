import { showcaseSource } from "@/lib/showcase-source"
import { ShowCaseCover } from "@/components/showcase-cover"

export default function Showcase() {
  const caseStudies = [...showcaseSource.getPages()].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  )

  return (
    <main className="max-w-screen-lg mx-auto px-8 pt-8">
      <div className="py-20 max-w-screen-lg mx-auto">
        <h1 className="text-4xl font-normal pb-2">Showcase</h1>
        <p className="text-xl text-muted-foreground max-w-prose pb-12">
          A collection of projects &amp; products I&apos;ve shipped.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((cs) => (
            <ShowCaseCover key={`showcase-cover-${cs.url}`} {...cs} />
          ))}
        </div>
      </div>
    </main>
  )
}
