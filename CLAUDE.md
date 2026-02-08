# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project

Personal website for jensfischer.nyc, built with Nextra 4 (Next.js App Router content framework) using the docs theme and Tailwind CSS.

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm start` — Serve production build

## Structure

```
app/
  layout.tsx              — Root layout (html/body shell, imports globals.css)
  globals.css             — Tailwind CSS + nextra-theme-docs styles
  _components/
    site-navbar.tsx       — Shared Navbar with logo SVG and ThemeSwitch
  (home)/
    layout.tsx            — Nextra Layout without footer
    page.tsx              — Homepage (plain React, not MDX)
  (docs)/
    layout.tsx            — Nextra Layout with footer
    [...mdxPath]/
      page.tsx            — Catch-all route for MDX content
content/
  _meta.js                — Top-level navigation config
  garden/
    _meta.js              — Digital Garden sidebar config
    *.mdx                 — Content pages
mdx-components.tsx        — MDX component overrides (uses nextra-theme-docs components)
next.config.mjs           — Nextra plugin wrapping Next.js config
postcss.config.mjs        — PostCSS config for Tailwind
```

## Key Patterns

- The site uses route groups: `(home)` for the homepage (no footer) and `(docs)` for MDX content pages (with footer). Both share the root layout and `SiteNavbar`.
- The homepage at `/` is a standalone React page, not MDX — fully customizable.
- Content lives in `content/` as `.mdx` files. Navigation is configured via `_meta.js` files.
- MDX components come from `nextra-theme-docs` (includes wrapper, headings, code blocks, etc.).
- The `Wrapper` component from `getMDXComponents().wrapper` handles TOC and metadata rendering — requires a type assertion: `as React.FC<{toc: any, metadata: any, children: React.ReactNode}>`.
- `getPageMap()` from `nextra/page-map` provides the page tree to Layout.
- `generateStaticParamsFor` and `importPage` from `nextra/pages` handle SSG.
