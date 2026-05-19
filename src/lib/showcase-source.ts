import { showcase } from "@/.source/server"
import { loader } from "fumadocs-core/source"
import type { StaticImageData } from "next/image"

export const showcaseSource = loader({
  baseUrl: "/showcase",
  source: showcase.toFumadocsSource(),
})

export type ShowcasePage = NonNullable<ReturnType<typeof showcaseSource.getPage>>

export function getShowcaseCover(page: ShowcasePage): StaticImageData | null {
  const img = (page.data._exports as Record<string, unknown> | undefined)
    ?._coverImage
  return img && typeof img === "object" && "src" in img
    ? (img as StaticImageData)
    : null
}
