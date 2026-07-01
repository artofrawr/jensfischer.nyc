import { ArrowRightIcon } from "lucide-react"
import Image from "next/image"
import type { StaticImageData } from "next/image"
import Link from "next/link"

export type ShowcaseItem = {
  url: string
  title: string
  description?: string
  externalUrl?: string
  cover: StaticImageData
  featured?: boolean
}

const cardClassName = "group relative block aspect-square overflow-hidden"

export function ShowCaseCover({
  url,
  title,
  externalUrl,
  cover,
}: ShowcaseItem) {
  const isExternal = Boolean(externalUrl)

  const inner = (
    <>
      <Image
        src={cover}
        alt={title}
        sizes="(min-width: 1024px) 100vw, (min-width: 640px) 100vw"
        placeholder="blur"
        className="block size-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-start p-10">
        <h2 className="flex items-center gap-2 font-headline font-semibold text-white text-2xl">
          <span className="transition-all duration-300 ease-out group-hover:translate-x-2">
            {title}
          </span>
          <ArrowRightIcon className="size-5 opacity-0 -translate-x-1 transition-all duration-300 ease-out group-hover:translate-x-2 group-hover:opacity-100" />
        </h2>
      </div>
    </>
  )

  if (isExternal && externalUrl) {
    return (
      <a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClassName}
      >
        {inner}
      </a>
    )
  }

  return (
    <Link href={url} className={cardClassName}>
      {inner}
    </Link>
  )
}
