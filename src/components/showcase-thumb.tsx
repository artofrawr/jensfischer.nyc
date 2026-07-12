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
  coverLinkHide?: boolean
}

const cardClassName = "group relative block"

export function ShowCaseThumb({
  url,
  title,
  externalUrl,
  cover,
  description,
}: ShowcaseItem) {
  const isExternal = Boolean(externalUrl)

  const inner = (
    <>
      <div className="block relative aspect-square overflow-hidden">
        <Image
          src={cover}
          alt={title}
          sizes="(min-width: 1024px) 100vw, (min-width: 640px) 100vw"
          placeholder="blur"
          className="block size-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>
      <div className="pointer-events-none relative inset-0 flex flex-col justify-start pt-4 pb-10">
        <h2 className="flex items-center gap-2 font-headline font-semibold text-foreground text-2xl">
          <span>{title}</span>
          <ArrowRightIcon className="size-5 opacity-0 -translate-x-1 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100" />
        </h2>
        <p>{description}</p>
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
