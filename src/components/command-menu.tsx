"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { FileTextIcon, SearchIcon } from "lucide-react"
import { Box, Dialog, Flex, Portal, Text, chakra } from "@chakra-ui/react"

import { MobileNavContext } from "@/components/site-header"

const CommandRoot = chakra(Command)
const CommandInput = chakra(Command.Input)
const CommandList = chakra(Command.List)
const CommandEmpty = chakra(Command.Empty)
const CommandGroup = chakra(Command.Group)
const CommandItem = chakra(Command.Item)

export interface SearchableItem {
  title: string
  url: string
  description?: string
  group: string
}

interface CommandMenuProps {
  items: SearchableItem[]
}

export function CommandMenu({ items }: CommandMenuProps) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { close: closeMobileNav } = React.useContext(MobileNavContext)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback(
    (command: () => void) => {
      setOpen(false)
      closeMobileNav()
      command()
    },
    [closeMobileNav],
  )

  const groups = React.useMemo(() => {
    const map = new Map<string, SearchableItem[]>()
    for (const item of items) {
      const existing = map.get(item.group)
      if (existing) {
        existing.push(item)
      } else {
        map.set(item.group, [item])
      }
    }
    return map
  }, [items])

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      unmountOnExit
    >
      <Dialog.Trigger asChild>
        <chakra.button
          position="relative"
          display="inline-flex"
          h={8}
          w={{ base: "full", sm: "14rem", lg: "16rem" }}
          alignItems="center"
          justifyContent="flex-start"
          gap={2}
          borderRadius="md"
          borderWidth="1px"
          borderColor="input"
          bg="muted/50"
          px={3}
          textStyle="sm"
          color="muted.foreground"
          boxShadow="0 1px 2px 0 rgb(0 0 0 / 0.05)"
          cursor="pointer"
          transition="background-color 0.15s ease, color 0.15s ease"
          _hover={{ bg: "accent", color: "accent.foreground" }}
        >
          <SearchIcon size={14} style={{ flexShrink: 0 }} />
          <span>Search...</span>
          <chakra.kbd
            pointerEvents="none"
            ml="auto"
            display={{ base: "none", sm: "flex" }}
            h={5}
            userSelect="none"
            alignItems="center"
            gap={0.5}
            borderRadius="0.25rem"
            borderWidth="1px"
            borderColor="border"
            bg="muted"
            px={1.5}
            fontFamily="mono"
            fontSize="10px"
            fontWeight="medium"
          >
            <chakra.span textStyle="xs">&#8984;</chakra.span>K
          </chakra.kbd>
        </chakra.button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop
          zIndex={50}
          bg="black/10"
          backdropFilter="blur(4px)"
          animationDuration="100ms"
        />
        <Dialog.Positioner zIndex={50} alignItems="flex-start" p={0} pt="20vh">
          <Dialog.Content
            maxW="lg"
            w="full"
            my={0}
            borderRadius="xl"
            bg="popover"
            color="popover.foreground"
            boxShadow="0 0 0 1px color-mix(in srgb, var(--jf-colors-foreground) 10%, transparent), 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
            outline="none"
            animationDuration="100ms"
          >
            <Dialog.Title srOnly>Search docs</Dialog.Title>
            <CommandRoot
              display="flex"
              h="full"
              w="full"
              flexDirection="column"
              overflow="hidden"
            >
              <Flex align="center" borderBottomWidth="1px" px={3}>
                <SearchIcon
                  size={16}
                  style={{ marginRight: "0.5rem", flexShrink: 0, opacity: 0.5 }}
                />
                <CommandInput
                  placeholder="Type a command or search..."
                  display="flex"
                  h={11}
                  w="full"
                  borderRadius="md"
                  bg="transparent"
                  py={3}
                  textStyle="sm"
                  outline="none"
                  _placeholder={{ color: "muted.foreground" }}
                  _disabled={{ cursor: "not-allowed", opacity: 0.5 }}
                />
              </Flex>
              <CommandList
                maxH="300px"
                overflowY="auto"
                overflowX="hidden"
                p={1}
              >
                <CommandEmpty
                  py={6}
                  textAlign="center"
                  textStyle="sm"
                  color="muted.foreground"
                >
                  No results found.
                </CommandEmpty>
                {Array.from(groups).map(([group, groupItems]) => (
                  <CommandGroup
                    key={group}
                    heading={group}
                    css={{
                      "& [cmdk-group-heading]": {
                        px: 2,
                        py: 1.5,
                        textStyle: "xs",
                        fontWeight: "medium",
                        color: "muted.foreground",
                      },
                    }}
                  >
                    {groupItems.map((item) => (
                      <CommandItem
                        key={item.url}
                        value={`${item.title} ${item.description ?? ""}`}
                        onSelect={() => runCommand(() => router.push(item.url))}
                        position="relative"
                        display="flex"
                        cursor="default"
                        alignItems="center"
                        gap={2}
                        borderRadius="md"
                        px={2}
                        py={2.5}
                        textStyle="sm"
                        outline="none"
                        userSelect="none"
                        _selected={{ bg: "accent", color: "accent.foreground" }}
                      >
                        <FileTextIcon
                          size={16}
                          style={{ flexShrink: 0, opacity: 0.6 }}
                        />
                        <Box display="flex" flexDirection="column">
                          <span>{item.title}</span>
                          {item.description && (
                            <Text
                              as="span"
                              textStyle="xs"
                              color="muted.foreground"
                              lineClamp={1}
                            >
                              {item.description}
                            </Text>
                          )}
                        </Box>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </CommandRoot>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
