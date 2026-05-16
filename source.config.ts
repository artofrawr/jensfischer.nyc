import { defineConfig, defineDocs } from "fumadocs-mdx/config"

export default defineConfig({
  mdxOptions: {
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
