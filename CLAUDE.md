# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project

Personal website for jensfischer.nyc, built with Nextra 4 (Next.js App Router content framework) using the docs theme.

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm start` — Serve production build

## Structure

```
app/
  layout.tsx          — Root layout (Navbar, Footer, Layout from nextra-theme-docs)
  [[...mdxPath]]/
    page.tsx          — Catch-all route for MDX content
content/
  _meta.js            — Navigation/sidebar config
  index.mdx           — Home page
  *.mdx               — Content pages
mdx-components.tsx    — MDX component overrides (uses nextra-theme-docs components)
next.config.mjs       — Nextra plugin wrapping Next.js config
```

## Key Patterns

- Content lives in `content/` as `.mdx` files. Navigation is configured via `_meta.js` files.
- MDX components come from `nextra-theme-docs` (includes wrapper, headings, code blocks, etc.).
- The `Wrapper` component from `getMDXComponents().wrapper` handles TOC and metadata rendering.
- `getPageMap()` from `nextra/page-map` provides the page tree to Layout.
- `generateStaticParamsFor` and `importPage` from `nextra/pages` handle SSG.
