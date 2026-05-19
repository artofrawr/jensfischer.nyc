import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
} from "fumadocs-mdx/config"
import { z } from "zod"

import remarkCoverImage from "./src/lib/remark-cover-image"

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkCoverImage],
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "github-dark-default",
      },
      defaultLanguage: "plaintext",
      defaultColor: false,
      icon: false,
    },
  },
})

export const docs = defineDocs({
  dir: "content/docs",
})

export const showcase = defineDocs({
  dir: "content/showcase",
  docs: {
    schema: frontmatterSchema.extend({
      tags: z.array(z.string()).optional(),
      date: z.date(),
      url: z.string().optional(),
      cover: z.string(),
    }),
  },
})
