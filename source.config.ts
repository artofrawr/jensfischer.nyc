import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
} from "fumadocs-mdx/config"
import lastModified from "fumadocs-mdx/plugins/last-modified"
import { z } from "zod"

import remarkCoverImage from "./src/lib/remark-cover-image"

export default defineConfig({
  plugins: [lastModified({ versionControl: "git" })],
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
  dir: "content/knowledge",
})

export const showcase = defineDocs({
  dir: "content/showcase",
  docs: {
    schema: frontmatterSchema.extend({
      tags: z.array(z.string()).optional(),
      date: z.date(),
      url: z.string().optional(),
      cover: z.string(),
      coverLinkHide: z.boolean().optional(),
      featured: z.boolean().default(false),
    }),
  },
})
