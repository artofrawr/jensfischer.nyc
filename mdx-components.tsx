import { useMDXComponents as getDocsThemeComponents } from 'nextra-theme-docs'
import type { MDXComponents } from 'mdx/types'

const docsThemeComponents = getDocsThemeComponents()

export function useMDXComponents(components?: MDXComponents) {
  return {
    ...docsThemeComponents,
    ...components
  }
}
