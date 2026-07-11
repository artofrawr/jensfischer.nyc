import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { mdxComponents } from "@/mdx-components"
import { showcaseSource } from "@/lib/showcase-source"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

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
    title: `${page.data.title} | Showcase | Jens Fischer`,
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
    <article>
      <header className="mt-8 flex flex-col gap-2 container mx-auto px-6 pb-20">
        {doc.tags?.length && (
          <p className="text-sm font-mono text-muted-foreground">
            {doc.tags.join(" · ")}
          </p>
        )}
        <h1 className="text-8xl font-semibold font-headline tracking-tight text-6xl text-foreground">
          {doc.title}
        </h1>
        {doc.description && (
          <p className="text-xl text-muted-foreground max-w-prose">
            {doc.description}
          </p>
        )}
      </header>

      <MDX components={mdxComponents} />
    </article>
  )
}
