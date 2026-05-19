import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { mdxComponents } from "@/mdx-components"
import { showcaseSource } from "@/lib/showcase-source"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return showcaseSource
    .getPages()
    .filter((page) => !page.data.url)
    .map((page) => ({ slug: page.slugs.join("/") }))
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const page = showcaseSource.getPage([params.slug])
  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
  }
}

export default async function ShowcaseCaseStudy(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const page = showcaseSource.getPage([params.slug])
  if (!page || page.data.url) notFound()

  const doc = page.data
  const MDX = doc.body
  const year = doc.date.getUTCFullYear()

  return (
    <main className="max-w-screen-lg mx-auto px-8 pt-8">
      <article className="py-20 mx-auto max-w-[720px]">
        <Link
          href="/showcase"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Showcase
        </Link>

        <header className="mt-8 flex flex-col gap-2">
          <p className="text-sm font-mono text-muted-foreground">{year}</p>
          <h1 className="text-4xl font-normal text-foreground">{doc.title}</h1>
          {doc.description && (
            <p className="text-xl text-muted-foreground max-w-prose">
              {doc.description}
            </p>
          )}
        </header>

        <hr className="my-8 border-border" />

        <div className="prose-doc">
          <MDX components={mdxComponents} />
        </div>
      </article>
    </main>
  )
}
