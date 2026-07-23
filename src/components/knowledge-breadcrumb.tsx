import { Fragment } from "react"
import NextLink from "next/link"
import { Breadcrumb } from "@chakra-ui/react"
import { ChevronRightIcon } from "lucide-react"

export type KnowledgeBreadcrumbItem = {
  name: React.ReactNode
  url?: string
}

const linkStyles = {
  color: "muted.foreground",
  textStyle: "sm",
  transition: "color 0.15s ease",
  _hover: { color: "foreground", textDecoration: "none" },
} as const

export function KnowledgeBreadcrumb({
  items,
}: {
  items: KnowledgeBreadcrumbItem[]
}) {
  return (
    <Breadcrumb.Root mb={4} aria-label="breadcrumb">
      <Breadcrumb.List
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        gap={{ base: 1.5, sm: 2.5 }}
        textStyle="sm"
        wordBreak="break-word"
        color="muted.foreground"
      >
        <Breadcrumb.Item>
          <Breadcrumb.Link asChild {...linkStyles}>
            <NextLink href="/knowledge">Knowledge</NextLink>
          </Breadcrumb.Link>
        </Breadcrumb.Item>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <Fragment key={index}>
              <Breadcrumb.Separator ms={0} me={0}>
                <ChevronRightIcon size={14} />
              </Breadcrumb.Separator>
              <Breadcrumb.Item>
                {isLast || !item.url ? (
                  <Breadcrumb.CurrentLink
                    fontWeight="normal"
                    textStyle="sm"
                    color="foreground"
                  >
                    {item.name}
                  </Breadcrumb.CurrentLink>
                ) : (
                  <Breadcrumb.Link asChild {...linkStyles}>
                    <NextLink href={item.url}>{item.name}</NextLink>
                  </Breadcrumb.Link>
                )}
              </Breadcrumb.Item>
            </Fragment>
          )
        })}
      </Breadcrumb.List>
    </Breadcrumb.Root>
  )
}
