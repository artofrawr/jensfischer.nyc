import { ArrowRightIcon, ExternalLinkIcon } from "lucide-react"
import Image from "next/image"
import type { StaticImageData } from "next/image"
import Link from "next/link"

export type ShowcaseItem = {
  url: string
  title: string
  description?: string
  externalUrl?: string
  cover: StaticImageData
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
        sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
        placeholder="blur"
        className="block size-full object-cover transition-transform duration-500 ease-out group-hover:scale-120 group-hover:duration-[2000ms]"
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-start bg-gradient-to-b from-black/80 via-black/30 to-transparent p-5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-medium text-white">{title}</h2>
        </div>
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
