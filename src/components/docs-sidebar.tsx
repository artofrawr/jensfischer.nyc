"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import type { source } from "@/lib/source"

type PageTree = typeof source.pageTree
type PageTreeNode = PageTree["children"][number]
type FolderNode = Extract<PageTreeNode, { type: "folder" }>
type PageNode = Extract<PageTreeNode, { type: "page" }>

function folderContainsPath(folder: FolderNode, pathname: string): boolean {
  for (const child of folder.children) {
    if (child.type === "page" && child.url === pathname) return true
    if (
      child.type === "folder" &&
      folderContainsPath(child as FolderNode, pathname)
    )
      return true
  }
  return false
}

export function DocsSidebar({
  tree,
  className,
  ...props
}: React.ComponentProps<"aside"> & { tree: PageTree }) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh-var(--header-height)-1px)] w-(--sidebar-width) shrink-0 border-r border-border lg:block",
        className,
      )}
      {...props}
    >
      <nav className="h-full overflow-y-auto overscroll-contain py-6 pe-6 ps-6 text-sm">
        <div className="flex flex-col gap-0.5">
          {tree.children.map((node) => (
            <TreeNode
              key={
                node.type === "page"
                  ? (node as PageNode).url
                  : node.type === "separator"
                    ? `sep-${node.name}`
                    : (node as FolderNode).$id
              }
              node={node}
            />
          ))}
        </div>
      </nav>
    </aside>
  )
}

function TreeNode({ node }: { node: PageTreeNode }) {
  if (node.type === "separator") {
    return (
      <div className="mt-6 mb-1 text-[13px] font-semibold text-foreground first:mt-0">
        {node.name}
      </div>
    )
  }

  if (node.type === "page") {
    return <PageLink page={node as PageNode} />
  }

  if (node.type === "folder") {
    return <Folder folder={node as FolderNode} />
  }

  return null
}

function PageLink({ page, nested }: { page: PageNode; nested?: boolean }) {
  const pathname = usePathname()
  const isActive = page.url === pathname

  return (
    <Link
      href={page.url}
      className={cn(
        "block rounded-md px-2 py-1.5 text-[13px] leading-normal transition-colors",
        isActive
          ? "bg-primary/10 font-medium text-primary"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
        nested && "ms-2",
      )}
    >
      {page.name as string}
    </Link>
  )
}

function Folder({ folder }: { folder: FolderNode }) {
  const pathname = usePathname()
  const containsActive = folderContainsPath(folder, pathname)
  const [open, setOpen] = React.useState(containsActive)

  React.useEffect(() => {
    if (containsActive && !open) {
      setOpen(true)
    }
  }, [containsActive]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "mt-5 flex w-full items-center justify-between py-1 text-[13px] font-semibold transition-colors first:mt-0",
          containsActive
            ? "text-foreground"
            : "text-foreground/80 hover:text-foreground",
        )}
      >
        {folder.name as string}
        <ChevronRightIcon
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground/60 transition-transform duration-200",
            open && "rotate-90",
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-in-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="mt-1 ms-0 flex flex-col">
            {folder.children.map((child) => {
              if (child.type === "page") {
                return (
                  <PageLink key={child.url} page={child as PageNode} nested />
                )
              }
              if (child.type === "folder") {
                return (
                  <Folder
                    key={(child as FolderNode).$id}
                    folder={child as FolderNode}
                  />
                )
              }
              return null
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
