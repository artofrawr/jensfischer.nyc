"use client"

import * as React from "react"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRightIcon } from "lucide-react"
import { Box, Flex, chakra, type BoxProps } from "@chakra-ui/react"

import type { source } from "@/lib/source"

const Link = chakra(NextLink)
const Chevron = chakra(ChevronRightIcon)

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

export function DocsSidebar({ tree, ...props }: BoxProps & { tree: PageTree }) {
  return (
    <chakra.aside
      position="sticky"
      top="calc({sizes.header} + 1px)"
      zIndex={30}
      display={{ base: "none", lg: "block" }}
      h="calc(100svh - {sizes.header} - 1px)"
      w="sidebar"
      flexShrink={0}
      borderRightWidth="1px"
      borderColor="border"
      {...props}
    >
      <chakra.nav
        h="full"
        overflowY="auto"
        overscrollBehavior="contain"
        py={6}
        pe={6}
        ps={6}
        textStyle="sm"
      >
        <Flex direction="column" gap={0.5}>
          {tree.children
            .filter(
              (node) =>
                !(
                  node.type === "page" &&
                  (node as PageNode).url === "/knowledge"
                ),
            )
            .map((node) => (
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
        </Flex>
      </chakra.nav>
    </chakra.aside>
  )
}

function TreeNode({ node }: { node: PageTreeNode }) {
  if (node.type === "separator") {
    return (
      <Box
        mt={6}
        mb={1}
        fontSize="13px"
        fontWeight="semibold"
        color="foreground"
        css={{ "&:first-child": { mt: 0 } }}
      >
        {node.name}
      </Box>
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

function PageLink({ page }: { page: PageNode }) {
  const pathname = usePathname()
  const isActive = page.url === pathname

  return (
    <Link
      href={page.url}
      display="block"
      borderRadius="md"
      px={2}
      py={1.5}
      fontSize="13px"
      lineHeight={1.5}
      transition="background-color 0.15s ease, color 0.15s ease"
      {...(isActive
        ? { bg: "primary/10", fontWeight: "medium", color: "primary" }
        : {
            color: "muted.foreground",
            _hover: { bg: "accent", color: "foreground" },
          })}
    >
      {page.name as string}
    </Link>
  )
}

function Folder({ folder, nested }: { folder: FolderNode; nested?: boolean }) {
  const pathname = usePathname()
  const containsActive = folderContainsPath(folder, pathname)
  const [open, setOpen] = React.useState(containsActive)

  React.useEffect(() => {
    if (containsActive && !open) {
      setOpen(true)
    }
  }, [containsActive]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Flex direction="column">
      <chakra.button
        onClick={() => setOpen((prev) => !prev)}
        display="flex"
        w="full"
        alignItems="center"
        justifyContent="space-between"
        borderRadius="md"
        px={2}
        py={1.5}
        fontSize="13px"
        lineHeight={1.5}
        textAlign="start"
        cursor="pointer"
        transition="background-color 0.15s ease, color 0.15s ease"
        color="muted.foreground"
        _hover={{ bg: "accent", color: "foreground" }}
        {...(!nested ? { mt: 5, css: { "&:first-child": { mt: 0 } } } : {})}
      >
        {folder.name as string}
        <Chevron
          boxSize={3.5}
          flexShrink={0}
          color="muted.foreground/60"
          transition="transform 0.2s"
          transform={open ? "rotate(90deg)" : undefined}
        />
      </chakra.button>

      <Box
        display="grid"
        transition="grid-template-rows 0.2s ease-in-out"
        gridTemplateRows={open ? "1fr" : "0fr"}
      >
        <Box overflow="hidden">
          <Flex
            mt={1}
            ms={2}
            direction="column"
            borderLeftWidth="1px"
            borderColor="border"
            ps={2}
          >
            {folder.children.map((child) => {
              if (child.type === "page") {
                return <PageLink key={child.url} page={child as PageNode} />
              }
              if (child.type === "folder") {
                return (
                  <Folder
                    key={(child as FolderNode).$id}
                    folder={child as FolderNode}
                    nested
                  />
                )
              }
              return null
            })}
          </Flex>
        </Box>
      </Box>
    </Flex>
  )
}
