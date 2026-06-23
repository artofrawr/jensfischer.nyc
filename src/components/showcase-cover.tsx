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
  description,
  externalUrl,
  cover,
}: ShowcaseItem) {
  const isExternal = Boolean(externalUrl)
  const Icon = isExternal ? ExternalLinkIcon : ArrowRightIcon

  const inner = (
    <>
      <Image
        src={cover}
        alt={title}
        sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
        placeholder="blur"
        className="block size-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-medium text-white">{title}</h2>
          <Icon className="mt-1 size-4 shrink-0 text-white" />
        </div>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-white/80">
            {description}
          </p>
        )}
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
