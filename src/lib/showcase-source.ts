import { showcase } from "@/.source/server"
import { loader } from "fumadocs-core/source"

export const showcaseSource = loader({
  baseUrl: "/showcase",
  source: showcase.toFumadocsSource(),
})
