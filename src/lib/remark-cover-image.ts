import type { Program } from "estree"
import type { Root } from "mdast"
import type { Plugin } from "unified"

const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|avif|gif|svg)$/i

/**
 * For each MDX file whose YAML frontmatter has a `cover: <path>` field pointing at
 * an image, inject a static `import` of that image at the top of the compiled
 * module and re-export it as `_coverImage`. The Next.js bundler resolves the
 * import and returns a `StaticImageData` ({ src, width, height, blurDataURL }).
 *
 * Access at runtime via `page.data._exports._coverImage`. The original
 * frontmatter string remains at `page.data.cover` and is still validated by the
 * Zod schema (so authors are forced to declare the cover).
 */
const remarkCoverImage: Plugin<[], Root> = () => (tree, file) => {
  const frontmatter = file.data.frontmatter as
    | Record<string, unknown>
    | undefined
  const cover = frontmatter?.cover
  if (typeof cover !== "string" || !IMAGE_EXTENSIONS.test(cover)) return

  const importPath = /^(\.\/|\.\.\/|\/)/.test(cover) ? cover : `./${cover}`

  const program: Program = {
    type: "Program",
    sourceType: "module",
    body: [
      {
        type: "ImportDeclaration",
        specifiers: [
          {
            type: "ImportDefaultSpecifier",
            local: { type: "Identifier", name: "__cover" },
          },
        ],
        source: {
          type: "Literal",
          value: importPath,
          raw: JSON.stringify(importPath),
        },
        attributes: [],
      },
      {
        type: "ExportNamedDeclaration",
        specifiers: [],
        source: null,
        attributes: [],
        declaration: {
          type: "VariableDeclaration",
          kind: "const",
          declarations: [
            {
              type: "VariableDeclarator",
              id: { type: "Identifier", name: "_coverImage" },
              init: { type: "Identifier", name: "__cover" },
            },
          ],
        },
      },
    ],
  }

  tree.children.unshift({
    type: "mdxjsEsm",
    value: "",
    data: { estree: program },
  } as Root["children"][number])
}

export default remarkCoverImage
